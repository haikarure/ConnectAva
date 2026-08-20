// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {WhiteRockPass} from "../src/WhiteRockPass.sol";

contract WhiteRockPassTest is Test {
    WhiteRockPass public pass;
    address public owner = address(this);
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public carol = makeAddr("carol");

    event PassMinted(address indexed minter, uint256 indexed tokenId, WhiteRockPass.PassTier tier);

    function setUp() public {
        pass = new WhiteRockPass("https://api.whiterockbali.com/metadata/", owner);
    }

    // Required to receive ETH from withdraw()
    receive() external payable {}

    // ============================================================
    //                      CONSTRUCTOR TESTS
    // ============================================================

    function test_constructor_setsNameAndSymbol() public view {
        assertEq(pass.name(), "White Rock VIP Pass");
        assertEq(pass.symbol(), "WRPASS");
    }

    function test_constructor_setsOwner() public view {
        assertEq(pass.owner(), owner);
    }

    function test_constructor_setsTierConfigs() public view {
        // Lagoon: (price, discountBps, maxSupply, currentSupply, active)
        (uint256 lPrice, uint16 lDiscount, uint32 lMaxSupply, uint32 lCurrentSupply, bool lActive) = pass.tierConfigs(WhiteRockPass.PassTier.LAGOON);
        assertEq(lPrice, 0.05 ether);
        assertEq(lDiscount, 500);
        assertEq(lMaxSupply, 500);
        assertEq(lCurrentSupply, 0);
        assertTrue(lActive);

        // VIP Cabana
        (uint256 vPrice, uint16 vDiscount, uint32 vMaxSupply, uint32 vCurrentSupply, bool vActive) = pass.tierConfigs(WhiteRockPass.PassTier.VIP_CABANA);
        assertEq(vPrice, 0.2 ether);
        assertEq(vDiscount, 1000);
        assertEq(vMaxSupply, 150);
        assertEq(vCurrentSupply, 0);
        assertTrue(vActive);

        // Party Suite
        (uint256 pPrice, uint16 pDiscount, uint32 pMaxSupply, uint32 pCurrentSupply, bool pActive) = pass.tierConfigs(WhiteRockPass.PassTier.PARTY_SUITE);
        assertEq(pPrice, 0.5 ether);
        assertEq(pDiscount, 2000);
        assertEq(pMaxSupply, 50);
        assertEq(pCurrentSupply, 0);
        assertTrue(pActive);
    }

    function test_constructor_setsBaseURI() public {
        // Mint first so token 1 exists
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        assertEq(pass.tokenURI(1), "https://api.whiterockbali.com/metadata/1.json");
    }

    // ============================================================
    //                      MINT TESTS
    // ============================================================

    function test_mintLagoonPass() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);

        assertEq(pass.balanceOf(alice), 1);
        assertEq(uint8(pass.tokenTiers(1)), uint8(WhiteRockPass.PassTier.LAGOON));
        (, , , uint32 lCurrentSupply, ) = pass.tierConfigs(WhiteRockPass.PassTier.LAGOON);
        assertEq(lCurrentSupply, 1);
    }

    function test_mintVIPCabanaPass() public {
        vm.deal(bob, 1 ether);
        vm.prank(bob);
        pass.mintPass{value: 0.2 ether}(WhiteRockPass.PassTier.VIP_CABANA);

        assertEq(pass.balanceOf(bob), 1);
        assertEq(uint8(pass.tokenTiers(1)), uint8(WhiteRockPass.PassTier.VIP_CABANA));
        (, , , uint32 vCurrentSupply, ) = pass.tierConfigs(WhiteRockPass.PassTier.VIP_CABANA);
        assertEq(vCurrentSupply, 1);
    }

    function test_mintPartySuitePass() public {
        vm.deal(carol, 10 ether);
        vm.prank(carol);
        pass.mintPass{value: 0.5 ether}(WhiteRockPass.PassTier.PARTY_SUITE);

        assertEq(pass.balanceOf(carol), 1);
        assertEq(uint8(pass.tokenTiers(1)), uint8(WhiteRockPass.PassTier.PARTY_SUITE));
        (, , , uint32 partyCurrentSupply, ) = pass.tierConfigs(WhiteRockPass.PassTier.PARTY_SUITE);
        assertEq(partyCurrentSupply, 1);
    }

    function test_mintRefundsExcessMON() public {
        vm.deal(alice, 1 ether);
        uint256 balanceBefore = alice.balance;

        vm.prank(alice);
        pass.mintPass{value: 0.1 ether}(WhiteRockPass.PassTier.LAGOON);

        assertEq(alice.balance, balanceBefore - 0.05 ether);
    }

    function test_mintEmitsPassMintedEvent() public {
        vm.deal(alice, 1 ether);

        vm.expectEmit(true, true, true, true);
        emit PassMinted(alice, 1, WhiteRockPass.PassTier.LAGOON);

        vm.prank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
    }

    function test_mintMultiplePasses() public {
        vm.deal(alice, 1 ether);

        vm.startPrank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        pass.mintPass{value: 0.2 ether}(WhiteRockPass.PassTier.VIP_CABANA);
        vm.stopPrank();

        assertEq(pass.balanceOf(alice), 2);
        assertEq(uint8(pass.tokenTiers(1)), uint8(WhiteRockPass.PassTier.LAGOON));
        assertEq(uint8(pass.tokenTiers(2)), uint8(WhiteRockPass.PassTier.VIP_CABANA));
    }

    // ============================================================
    //                    MINT FAILURE TESTS
    // ============================================================

    function test_mintFailsWhenTierInactive() public {
        vm.prank(owner);
        pass.setTierConfig(WhiteRockPass.PassTier.LAGOON, 0.05 ether, 500, 500, false);

        vm.deal(alice, 1 ether);
        vm.prank(alice);
        vm.expectRevert("Tier is not active");
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
    }

    function test_mintFailsWhenSoldOut() public {
        for (uint256 i = 0; i < 50; i++) {
            address minter = address(uint160(i + 1000));
            vm.deal(minter, 1 ether);
            vm.prank(minter);
            pass.mintPass{value: 0.5 ether}(WhiteRockPass.PassTier.PARTY_SUITE);
        }
        (, , , uint32 pCurrentSupply, ) = pass.tierConfigs(WhiteRockPass.PassTier.PARTY_SUITE);
        assertEq(pCurrentSupply, 50);

        vm.deal(carol, 1 ether);
        vm.prank(carol);
        vm.expectRevert("Tier sold out");
        pass.mintPass{value: 0.5 ether}(WhiteRockPass.PassTier.PARTY_SUITE);
    }

    function test_mintFailsWithInsufficientMON() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        vm.expectRevert("Insufficient MON sent");
        pass.mintPass{value: 0.01 ether}(WhiteRockPass.PassTier.LAGOON);
    }

    function test_mintFailsWithZeroValue() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        vm.expectRevert("Insufficient MON sent");
        pass.mintPass{value: 0}(WhiteRockPass.PassTier.LAGOON);
    }

    // ============================================================
    //                    DISCOUNT TESTS
    // ============================================================

    function test_getDiscountBpsReturnsZeroForNonHolder() public view {
        assertEq(pass.getDiscountBpsForUser(alice), 0);
    }

    function test_getDiscountBpsLagoon5Percent() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        assertEq(pass.getDiscountBpsForUser(alice), 500);
    }

    function test_getDiscountBpsVIPCabana10Percent() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.2 ether}(WhiteRockPass.PassTier.VIP_CABANA);
        assertEq(pass.getDiscountBpsForUser(alice), 1000);
    }

    function test_getDiscountBpsPartySuite20Percent() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.5 ether}(WhiteRockPass.PassTier.PARTY_SUITE);
        assertEq(pass.getDiscountBpsForUser(alice), 2000);
    }

    function test_getDiscountBpsReturnsHighestTierDiscount() public {
        vm.deal(alice, 1 ether);
        vm.startPrank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        pass.mintPass{value: 0.5 ether}(WhiteRockPass.PassTier.PARTY_SUITE);
        vm.stopPrank();
        assertEq(pass.getDiscountBpsForUser(alice), 2000);
    }

    function test_getDiscountBpsAfterOwnerUpdatesConfig() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        assertEq(pass.getDiscountBpsForUser(alice), 500);

        vm.prank(owner);
        pass.setTierConfig(WhiteRockPass.PassTier.LAGOON, 0.05 ether, 1500, 500, true);
        assertEq(pass.getDiscountBpsForUser(alice), 1500);
    }

    // ============================================================
    //                    TOKEN URI TESTS
    // ============================================================

    function test_tokenURIWorksForAllTiers() public {
        vm.deal(alice, 1 ether);
        vm.startPrank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        pass.mintPass{value: 0.2 ether}(WhiteRockPass.PassTier.VIP_CABANA);
        pass.mintPass{value: 0.5 ether}(WhiteRockPass.PassTier.PARTY_SUITE);
        vm.stopPrank();

        assertEq(pass.tokenURI(1), "https://api.whiterockbali.com/metadata/1.json");
        assertEq(pass.tokenURI(2), "https://api.whiterockbali.com/metadata/2.json");
        assertEq(pass.tokenURI(3), "https://api.whiterockbali.com/metadata/3.json");
    }

    function test_tokenURIRevertsForNonExistentToken() public {
        vm.expectRevert();
        pass.tokenURI(999);
    }

    function test_setBaseURIUpdatesTokenURI() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);

        assertEq(pass.tokenURI(1), "https://api.whiterockbali.com/metadata/1.json");

        vm.prank(owner);
        pass.setBaseURI("https://new-uri.com/nft/");
        assertEq(pass.tokenURI(1), "https://new-uri.com/nft/1.json");
    }

    // ============================================================
    //                   ACCESS CONTROL TESTS
    // ============================================================

    function test_setTierConfigOnlyOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        pass.setTierConfig(WhiteRockPass.PassTier.LAGOON, 0.1 ether, 500, 500, true);
    }

    function test_setBaseURIOnlyOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        pass.setBaseURI("https://evil.com/");
    }

    function test_withdrawOnlyOwner() public {
        vm.deal(address(pass), 1 ether);
        vm.prank(alice);
        vm.expectRevert();
        pass.withdraw();
    }

    function test_setTierConfigValidationPriceMustBePositive() public {
        vm.expectRevert("Price must be > 0");
        pass.setTierConfig(WhiteRockPass.PassTier.LAGOON, 0, 500, 500, true);
    }

    function test_setTierConfigValidationDiscountCannotExceed100Percent() public {
        vm.expectRevert("Discount cannot exceed 100%");
        pass.setTierConfig(WhiteRockPass.PassTier.LAGOON, 0.05 ether, 10001, 500, true);
    }

    function test_setTierConfigValidationMaxSupplyMustBePositive() public {
        vm.expectRevert("Max supply must be > 0");
        pass.setTierConfig(WhiteRockPass.PassTier.LAGOON, 0.05 ether, 500, 0, true);
    }

    // ============================================================
    //                    WITHDRAW TESTS
    // ============================================================

    function test_withdrawSendsBalanceToOwner() public {
        vm.deal(address(pass), 1 ether);
        uint256 balanceBefore = owner.balance;
        pass.withdraw();
        assertEq(owner.balance, balanceBefore + 1 ether);
        assertEq(address(pass).balance, 0);
    }

    function test_withdrawFailsWhenNoBalance() public {
        vm.expectRevert("No balance to withdraw");
        pass.withdraw();
    }

    function test_withdrawCollectsMintProceeds() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        assertEq(address(pass).balance, 0.05 ether);

        uint256 ownerBalanceBefore = owner.balance;
        pass.withdraw();
        assertEq(owner.balance, ownerBalanceBefore + 0.05 ether);
    }

    // ============================================================
    //                    ENUMERABLE TESTS
    // ============================================================

    function test_enumerableTokensByOwner() public {
        vm.deal(alice, 1 ether);
        vm.startPrank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        pass.mintPass{value: 0.2 ether}(WhiteRockPass.PassTier.VIP_CABANA);
        vm.stopPrank();

        assertEq(pass.tokenOfOwnerByIndex(alice, 0), 1);
        assertEq(pass.tokenOfOwnerByIndex(alice, 1), 2);
        assertEq(pass.balanceOf(alice), 2);
    }

    function test_totalSupplyIncrements() public {
        assertEq(pass.totalSupply(), 0);

        vm.deal(alice, 1 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        assertEq(pass.totalSupply(), 1);

        vm.deal(bob, 1 ether);
        vm.prank(bob);
        pass.mintPass{value: 0.2 ether}(WhiteRockPass.PassTier.VIP_CABANA);
        assertEq(pass.totalSupply(), 2);
    }

    function test_tokenTiersMapping() public {
        vm.deal(alice, 1 ether);
        vm.startPrank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);
        pass.mintPass{value: 0.2 ether}(WhiteRockPass.PassTier.VIP_CABANA);
        pass.mintPass{value: 0.5 ether}(WhiteRockPass.PassTier.PARTY_SUITE);
        vm.stopPrank();

        assertEq(uint8(pass.tokenTiers(1)), uint8(WhiteRockPass.PassTier.LAGOON));
        assertEq(uint8(pass.tokenTiers(2)), uint8(WhiteRockPass.PassTier.VIP_CABANA));
        assertEq(uint8(pass.tokenTiers(3)), uint8(WhiteRockPass.PassTier.PARTY_SUITE));
    }

    // ============================================================
    //                    SECURITY TESTS
    // ============================================================

    /// @notice Verify that excess refund uses call (not transfer) — smart contract wallets can receive refunds
    function test_excessRefundToContractWallet() public {
        MockReceiverWallet wallet = new MockReceiverWallet();
        vm.deal(address(wallet), 10 ether);

        wallet.mintPass(pass, WhiteRockPass.PassTier.LAGOON, 0.1 ether);

        assertEq(pass.balanceOf(address(wallet)), 1);
        assertEq(address(wallet).balance, 9.95 ether);
    }

    /// @notice Verify that withdraw sends to owner using call (not transfer)
    function test_withdrawToContractOwner() public {
        vm.deal(address(pass), 1 ether);
        uint256 balanceBefore = owner.balance;
        pass.withdraw();
        assertEq(owner.balance, balanceBefore + 1 ether);
    }

    /// @notice Verify no reentrancy vulnerability in mintPass
    function test_mintPassReentrancyProtection() public {
        ReentrantAttacker attacker = new ReentrantAttacker(address(pass));
        vm.deal(address(attacker), 10 ether);

        attacker.attack(WhiteRockPass.PassTier.LAGOON);

        assertEq(pass.balanceOf(address(attacker)), 1);
        (, , , uint32 lCurrentSupply, ) = pass.tierConfigs(WhiteRockPass.PassTier.LAGOON);
        assertEq(lCurrentSupply, 1);
    }

    /// @notice Verify ERC721 standard compliance
    function test_erc721TransferAndApproval() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        pass.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON);

        vm.prank(alice);
        pass.approve(bob, 1);
        assertEq(pass.getApproved(1), bob);

        vm.prank(bob);
        pass.transferFrom(alice, carol, 1);
        assertEq(pass.ownerOf(1), carol);
        assertEq(pass.balanceOf(carol), 1);
        assertEq(pass.balanceOf(alice), 0);
    }
}

// ============================================================
//                    HELPER CONTRACTS
// ============================================================

/// @notice Mock contract wallet that can receive ETH and call WhiteRockPass
contract MockReceiverWallet {
    function mintPass(WhiteRockPass _pass, WhiteRockPass.PassTier tier, uint256 value) external {
        _pass.mintPass{value: value}(tier);
    }

    // Required to receive ETH refund from mintPass
    receive() external payable {}

    // Required to accept ERC-721 tokens
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

/// @notice Attacker contract that tries to re-enter WhiteRockPass.mintPass
contract ReentrantAttacker {
    WhiteRockPass public target;
    uint256 public attackCount;

    constructor(address _target) {
        target = WhiteRockPass(_target);
    }

    function attack(WhiteRockPass.PassTier tier) external {
        attackCount = 0;
        target.mintPass{value: 0.05 ether}(tier);
    }

    // Required to receive ETH refund
    receive() external payable {
        if (attackCount < 1) {
            attackCount++;
            try target.mintPass{value: 0.05 ether}(WhiteRockPass.PassTier.LAGOON) {} catch {}
        }
    }

    // Required to accept ERC-721 tokens
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
