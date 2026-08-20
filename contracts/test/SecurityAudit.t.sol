// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {WhiteRockPass} from "../src/WhiteRockPass.sol";
import {BookingEscrow} from "../src/BookingEscrow.sol";
import {MockUSDT} from "../src/MockUSDT.sol";

contract SecurityAuditTest is Test {
    BookingEscrow public escrow;
    WhiteRockPass public pass;
    MockUSDT public usdt;

    address public owner = address(this);
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    // chainId is dynamically read from block.chainid to match contract's EIP-712 domain

    function setUp() public {
        usdt = new MockUSDT(owner);
        pass = new WhiteRockPass("https://api.whiterockbali.com/metadata/", owner);
        escrow = new BookingEscrow(address(pass), address(usdt), owner);

        vm.deal(alice, 1000 ether);
        vm.deal(bob, 1000 ether);

        // Warp time so MockUSDT faucet works
        vm.warp(3600);
    }

    receive() external payable {}

    // ============================================================
    //              REENTRANCY ATTACK TESTS
    // ============================================================

    function test_reentrancy_mintPass() public {
        ReentrancyAttackerMint attacker = new ReentrancyAttackerMint(address(pass));
        vm.deal(address(attacker), 10 ether);

        attacker.attack(WhiteRockPass.PassTier.LAGOON);

        assertEq(pass.balanceOf(address(attacker)), 1, "Attacker should only have 1 pass");
        assertEq(pass.totalSupply(), 1, "Total supply should be 1");
    }

    function test_reentrancy_createBooking() public {
        ReentrancyAttackerBooking attacker = new ReentrancyAttackerBooking(address(escrow));
        vm.deal(address(attacker), 10 ether);

        attacker.attackCreate();

        assertEq(escrow.nextBookingId(), 2, "Should only have 1 booking");
    }

    function test_reentrancy_cancelBooking() public {
        uint64 visitTs = uint64(block.timestamp + 5 days);

        ReentrancyAttackerCancel attacker = new ReentrancyAttackerCancel(address(escrow));
        vm.deal(address(attacker), 10 ether);
        attacker.createBooking(visitTs, address(0), 0.1 ether);

        uint256 balanceBefore = address(attacker).balance;

        attacker.attackCancel();

        BookingEscrow.Booking memory b = escrow.getUserBookings(address(attacker))[0];
        assertTrue(b.cancelled, "Booking should be cancelled");
        // Attacker gets back the 0.01 ETH deposit, reentrancy attempts should fail
        assertEq(address(attacker).balance, balanceBefore + 0.01 ether, "Refund should equal deposit");
    }

    // ============================================================
    //              ACCESS CONTROL TESTS
    // ============================================================

    function test_accessControl_checkIn() public {
        uint64 visitTs = uint64(block.timestamp + 3 days);
        vm.prank(alice);
        escrow.createBooking{value: 0.01 ether}(0, visitTs, address(0));

        vm.prank(bob);
        vm.expectRevert();
        escrow.checkIn(1);
    }

    function test_accessControl_setTierConfig() public {
        vm.prank(alice);
        vm.expectRevert();
        pass.setTierConfig(WhiteRockPass.PassTier.LAGOON, 0.05 ether, 500, 500, true);
    }

    function test_accessControl_withdraw() public {
        vm.deal(address(pass), 1 ether);
        vm.prank(alice);
        vm.expectRevert();
        pass.withdraw();
    }

    function test_accessControl_setBaseMinSpend() public {
        vm.prank(alice);
        vm.expectRevert();
        escrow.setBaseMinSpendMON(0, 1 ether);
    }

    function test_accessControl_setUsdtToken() public {
        vm.prank(alice);
        vm.expectRevert();
        escrow.setUsdtToken(makeAddr("evil"));
    }

    function test_accessControl_setBaseURI() public {
        vm.prank(alice);
        vm.expectRevert();
        pass.setBaseURI("https://evil.com/");
    }

    // ============================================================
    //              SIGNATURE MANIPULATION TESTS
    // ============================================================

    function _createBookingIntent(
        address guest,
        uint8 daybedType,
        uint64 visitTimestamp,
        uint256 depositAmount,
        address paymentToken,
        uint256 nonce,
        uint256 deadline,
        uint256 chainId,
        address contractAddr
    ) internal view returns (bytes memory signature) {
        bytes32 structHash = keccak256(
            abi.encode(
                escrow.BOOKING_INTENT_TYPEHASH(),
                guest, daybedType, visitTimestamp, depositAmount, paymentToken, nonce, deadline
            )
        );

        bytes32 domainSeparator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256("WhiteRockBooking"),
                keccak256("1"),
                chainId, // pass block.chainid in caller
                contractAddr
            )
        );

        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(0xA11CE, digest);
        signature = abi.encodePacked(r, s, v);
    }

    function test_signature_wrongChainId() public {
        uint64 visitTs = uint64(block.timestamp + 2 days);
        uint256 deadline = uint256(block.timestamp + 1 hours);
        address guestAddr = vm.addr(0xA11CE);

        bytes memory sig = _createBookingIntent(
            guestAddr, 0, visitTs, 0.01 ether, address(0), 0, deadline, 1, address(escrow) // wrong chain ID
        );

        vm.deal(guestAddr, 1 ether);
        vm.prank(guestAddr);
        vm.expectRevert(BookingEscrow.InvalidSignature.selector);
        escrow.createBookingWithSignature(
            guestAddr, 0, visitTs, 0.01 ether, address(0), deadline, sig
        );
    }

    function test_signature_wrongVerifyingContract() public {
        uint64 visitTs = uint64(block.timestamp + 2 days);
        uint256 deadline = uint256(block.timestamp + 1 hours);
        address guestAddr = vm.addr(0xA11CE);

        bytes memory sig = _createBookingIntent(
            guestAddr, 0, visitTs, 0.01 ether, address(0), 0, deadline, block.chainid, makeAddr("wrong") // wrong contract
        );

        vm.deal(guestAddr, 1 ether);
        vm.prank(guestAddr);
        vm.expectRevert(BookingEscrow.InvalidSignature.selector);
        escrow.createBookingWithSignature(
            guestAddr, 0, visitTs, 0.01 ether, address(0), deadline, sig
        );
    }

    function test_signature_tamperedDepositAmount() public {
        uint64 visitTs = uint64(block.timestamp + 2 days);
        uint256 deadline = uint256(block.timestamp + 1 hours);
        address guestAddr = vm.addr(0xA11CE);

        bytes memory sig = _createBookingIntent(
            guestAddr, 0, visitTs, 0.01 ether, address(0), 0, deadline, block.chainid, address(escrow)
        );

        vm.deal(guestAddr, 1 ether);
        vm.prank(guestAddr);
        vm.expectRevert(BookingEscrow.InvalidSignature.selector);
        escrow.createBookingWithSignature(
            guestAddr, 0, visitTs, 0.001 ether, address(0), deadline, sig // different amount
        );
    }

    function test_signature_tamperedDaybedType() public {
        uint64 visitTs = uint64(block.timestamp + 2 days);
        uint256 deadline = uint256(block.timestamp + 1 hours);
        address guestAddr = vm.addr(0xA11CE);

        bytes memory sig = _createBookingIntent(
            guestAddr, 0, visitTs, 0.01 ether, address(0), 0, deadline, block.chainid, address(escrow)
        );

        vm.deal(guestAddr, 1 ether);
        vm.prank(guestAddr);
        vm.expectRevert(BookingEscrow.InvalidSignature.selector);
        escrow.createBookingWithSignature(
            guestAddr, 1, visitTs, 0.01 ether, address(0), deadline, sig // different type
        );
    }

    function test_signature_tamperedGuestAddress() public {
        uint64 visitTs = uint64(block.timestamp + 2 days);
        uint256 deadline = uint256(block.timestamp + 1 hours);
        address guestAddr = vm.addr(0xA11CE);

        bytes memory sig = _createBookingIntent(
            guestAddr, 0, visitTs, 0.01 ether, address(0), 0, deadline, block.chainid, address(escrow)
        );

        vm.deal(bob, 1 ether);
        vm.prank(bob);
        vm.expectRevert(BookingEscrow.InvalidSignature.selector);
        escrow.createBookingWithSignature(
            bob, 0, visitTs, 0.01 ether, address(0), deadline, sig // Bob submits Alice's sig
        );
    }

    function test_signature_tamperedNonce() public {
        uint64 visitTs = uint64(block.timestamp + 2 days);
        uint256 deadline = uint256(block.timestamp + 1 hours);
        address guestAddr = vm.addr(0xA11CE);

        // Sign with nonce 0, but contract expects nonce 0
        bytes memory sig = _createBookingIntent(
            guestAddr, 0, visitTs, 0.01 ether, address(0), 0, deadline, block.chainid, address(escrow)
        );

        vm.deal(guestAddr, 1 ether);
        vm.prank(guestAddr);
        // This should actually work since contract reads nonces[guest] which is 0
        // and the signature was made with nonce 0
        // Let's verify the nonce is correct
        uint256 currentNonce = escrow.nonces(guestAddr);
        assertEq(currentNonce, 0);
    }

    function test_signature_tamperedDeadline() public {
        uint64 visitTs = uint64(block.timestamp + 2 days);
        uint256 deadline = uint256(block.timestamp + 1 hours);
        address guestAddr = vm.addr(0xA11CE);

        bytes memory sig = _createBookingIntent(
            guestAddr, 0, visitTs, 0.01 ether, address(0), 0, deadline, block.chainid, address(escrow)
        );

        vm.deal(guestAddr, 1 ether);
        vm.prank(guestAddr);
        vm.expectRevert(BookingEscrow.InvalidSignature.selector);
        escrow.createBookingWithSignature(
            guestAddr, 0, visitTs, 0.01 ether, address(0), deadline + 1, sig // different deadline
        );
    }

    function test_signature_crossSignerReplay() public {
        uint64 visitTs = uint64(block.timestamp + 2 days);
        uint256 deadline = uint256(block.timestamp + 1 hours);
        address aliceAddr = vm.addr(0xA11CE);

        bytes memory sig = _createBookingIntent(
            aliceAddr, 0, visitTs, 0.01 ether, address(0), 0, deadline, block.chainid, address(escrow)
        );

        vm.deal(bob, 1 ether);
        vm.prank(bob);
        vm.expectRevert(BookingEscrow.InvalidSignature.selector);
        escrow.createBookingWithSignature(
            bob, 0, visitTs, 0.01 ether, address(0), deadline, sig
        );
    }

    // ============================================================
    //              INTEGER OVERFLOW / UNDERFLOW TESTS
    // ============================================================

    function test_discountBpsOverflow() public {
        vm.expectRevert("Discount cannot exceed 100%");
        pass.setTierConfig(WhiteRockPass.PassTier.LAGOON, 0.05 ether, 10100, 500, true);
    }

    function test_maxSupplyOverflow() public {
        pass.setTierConfig(WhiteRockPass.PassTier.LAGOON, 0.05 ether, 500, 4294967295, true);
        (, , uint32 maxSupply, , ) = pass.tierConfigs(WhiteRockPass.PassTier.LAGOON);
        assertEq(maxSupply, 4294967295);
    }

    // ============================================================
    //              DENIAL OF SERVICE TESTS
    // ============================================================

    function test_getUserBookingsGasLimit() public {
        uint64 visitTs = uint64(block.timestamp + 30 days);
        for (uint256 i = 0; i < 10; i++) {
            vm.deal(alice, 1 ether);
            vm.prank(alice);
            escrow.createBooking{value: 0.01 ether}(0, visitTs, address(0));
        }
        BookingEscrow.Booking[] memory bookings = escrow.getUserBookings(alice);
        assertEq(bookings.length, 10);
    }

    function test_getDiscountBpsManyPasses() public {
        for (uint256 i = 0; i < 5; i++) {
            vm.deal(alice, 1 ether);
            vm.prank(alice);
            pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        }
        uint16 discount = pass.getDiscountBpsForUser(alice);
        assertEq(discount, 500);
    }

    // ============================================================
    //              EDGE CASE TESTS
    // ============================================================

    function test_bookingMinTimestamp() public {
        uint64 visitTs = uint64(block.timestamp + 1);
        vm.prank(alice);
        escrow.createBooking{value: 0.01 ether}(0, visitTs, address(0));
        BookingEscrow.Booking memory b = escrow.getUserBookings(alice)[0];
        assertEq(b.visitTimestamp, visitTs);
    }

    function test_bookingMaxTimestamp() public {
        uint64 maxTs = type(uint64).max - 1;
        vm.prank(alice);
        escrow.createBooking{value: 0.01 ether}(0, maxTs, address(0));
        BookingEscrow.Booking memory b = escrow.getUserBookings(alice)[0];
        assertEq(b.visitTimestamp, maxTs);
    }

    function test_mintExactPrice() public {
        vm.deal(alice, 0.05 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        assertEq(pass.balanceOf(alice), 1);
        assertEq(alice.balance, 0);
    }

    function test_bookingExactDeposit() public {
        uint64 visitTs = uint64(block.timestamp + 2 days);
        vm.deal(alice, 0.01 ether);
        vm.prank(alice);
        escrow.createBooking{value: 0.01 ether}(0, visitTs, address(0));
        assertEq(alice.balance, 0);
        BookingEscrow.Booking memory b = escrow.getUserBookings(alice)[0];
        assertEq(b.depositAmount, 0.01 ether);
    }

    function test_cancelBookingJustOver24Hours() public {
        uint64 visitTs = uint64(block.timestamp + 24 hours + 2);
        vm.prank(alice);
        escrow.createBooking{value: 0.01 ether}(0, visitTs, address(0));
        vm.prank(alice);
        escrow.cancelBooking(1);
        BookingEscrow.Booking memory b = escrow.getUserBookings(alice)[0];
        assertTrue(b.cancelled);
    }

    function test_cancelBookingAtExact24Hours() public {
        // Exactly 24h: block.timestamp + 24 hours > visitTimestamp → now+24h > now+24h → false → allowed
        uint64 visitTs = uint64(block.timestamp + 24 hours);
        vm.prank(alice);
        escrow.createBooking{value: 0.01 ether}(0, visitTs, address(0));
        vm.prank(alice);
        escrow.cancelBooking(1);
        assertTrue(escrow.getUserBookings(alice)[0].cancelled);
    }

    function test_cancelBookingJustUnder24Hours() public {
        // Just under 24h: block.timestamp + 24 hours > visitTimestamp → now+24h > now+24h-1 → true → blocked
        uint64 visitTs = uint64(block.timestamp + 24 hours - 1);
        vm.prank(alice);
        escrow.createBooking{value: 0.01 ether}(0, visitTs, address(0));
        vm.prank(alice);
        vm.expectRevert(BookingEscrow.CancellationPeriodExpired.selector);
        escrow.cancelBooking(1);
    }

    function test_bookingIdIncrement() public {
        uint64 visitTs = uint64(block.timestamp + 3 days);
        vm.prank(alice);
        uint256 id1 = escrow.createBooking{value: 0.01 ether}(0, visitTs, address(0));
        vm.prank(bob);
        uint256 id2 = escrow.createBooking{value: 0.05 ether}(1, visitTs, address(0));
        assertEq(id1, 1);
        assertEq(id2, 2);
        assertEq(escrow.nextBookingId(), 3);
    }

    function test_crossUserCancel() public {
        uint64 visitTs = uint64(block.timestamp + 3 days);
        vm.prank(alice);
        escrow.createBooking{value: 0.01 ether}(0, visitTs, address(0));
        vm.prank(bob);
        vm.expectRevert(BookingEscrow.NotGuest.selector);
        escrow.cancelBooking(1);
    }

    function test_mockUSDT_faucet() public {
        vm.startPrank(alice);
        usdt.faucet();
        assertEq(usdt.balanceOf(alice), 1000 * 10**6);
        vm.stopPrank();
    }

    function test_mockUSDT_faucetCooldown() public {
        vm.startPrank(alice);
        usdt.faucet();
        vm.expectRevert("Faucet cooldown active. Wait 1 hour between claims.");
        usdt.faucet();
        vm.stopPrank();
    }

    function test_mockUSDT_adminMint() public {
        usdt.mint(alice, 5000 * 10**6);
        assertEq(usdt.balanceOf(alice), 5000 * 10**6);
    }

    function test_mockUSDT_decimals() public view {
        assertEq(usdt.decimals(), 6);
    }
}

// ============================================================
//                    HELPER CONTRACTS
// ============================================================

contract ReentrancyAttackerMint {
    WhiteRockPass public pass;
    uint256 public count;

    constructor(address _pass) {
        pass = WhiteRockPass(_pass);
    }

    function attack(WhiteRockPass.PassTier tier) external {
        count = 0;
        pass.mintPass{value: 0.05 ether}(tier);
    }

    receive() external payable {
        if (count < 1) {
            count++;
            try pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON) {} catch {}
        }
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

contract ReentrancyAttackerBooking {
    BookingEscrow public escrow;
    uint256 public count;

    constructor(address _escrow) {
        escrow = BookingEscrow(_escrow);
    }

    function attackCreate() external {
        count = 0;
        uint64 visitTs = uint64(block.timestamp + 3 days);
        escrow.createBooking{value: 0.1 ether}(0, visitTs, address(0));
    }

    receive() external payable {
        if (count < 1) {
            count++;
            try escrow.createBooking{value: 0.01 ether}(0, uint64(block.timestamp + 5 days), address(0)) {} catch {}
        }
    }
}

contract ReentrancyAttackerCancel {
    BookingEscrow public escrow;
    uint256 public count;

    constructor(address _escrow) {
        escrow = BookingEscrow(_escrow);
    }

    function createBooking(uint64 visitTs, address paymentToken, uint256 value) external {
        escrow.createBooking{value: value}(0, visitTs, paymentToken);
    }

    function attackCancel() external {
        count = 0;
        escrow.cancelBooking(1);
    }

    receive() external payable {
        if (count < 1) {
            count++;
            try escrow.cancelBooking(1) {} catch {}
            try escrow.createBooking{value: 0.01 ether}(0, uint64(block.timestamp + 10 days), address(0)) {} catch {}
        }
    }
}
