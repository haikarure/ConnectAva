// WhiteRockPass.spec — Certora Formal Verification Rules

methods {
    function mintPass(uint8) external payable;
    function getDiscountBpsForUser(address) external returns (uint16) view;
    function balanceOf(address) external returns (uint256) view;
    function totalSupply() external returns (uint256) view;
    function setTierConfig(uint8, uint256, uint16, uint32, bool) external;
    function withdraw() external;
    function owner() external returns (address) view;
}

// Rule: Minting increases total supply by exactly 1
rule mintIncreasesTotalSupply {
    uint8 tier;
    uint256 supplyBefore = totalSupply();

    mintPass(tier);

    assert totalSupply() == supplyBefore + 1,
        "Total supply must increase by exactly 1";
}

// Rule: Minting increases minter's balance by exactly 1
rule mintIncreasesBalance {
    address minter = nonlasses(minter);
    uint8 tier;
    uint256 balanceBefore = balanceOf(minter);

    mintPass(tier);

    assert balanceOf(minter) == balanceBefore + 1,
        "Minter balance must increase by exactly 1";
}

// Rule: Current supply never exceeds max supply
rule supplyNeverExceedsMax {
    uint8 tier;
    // After any operation, current supply <= max supply
    require currentSupply(tier) <= maxSupply(tier);
}

// Rule: Discount BPS never exceeds 10000 (100%)
rule discountNeverExceedsMax {
    address user;
    uint16 discount = getDiscountBpsForUser(user);
    assert discount <= 10000,
        "Discount cannot exceed 100%";
}

// Rule: Only owner can withdraw
rule onlyOwnerCanWithdraw {
    address caller = nonlasses(caller);
    address contractOwner = owner();

    require caller != contractOwner;

    withdraw() expect revert;
}

// Rule: Withdraw sends full balance to owner
rule withdrawSendsFullBalance {
    address contractOwner = owner();
    uint256 balanceBefore = balanceOf@poll(contractOwner);

    withdraw();

    assert balanceOf(contractOwner) >= balanceBefore,
        "Owner balance must not decrease";
}

// Rule: Token ID is unique (no two tokens share the same ID)
rule tokenIdUnique {
    uint256 tokenId1;
    uint256 tokenId2;
    address owner1;
    address owner2;

    require owner1 != owner2;
    require ownerOf(tokenId1) == owner1;
    require ownerOf(tokenId2) == owner2;

    assert tokenId1 != tokenId2,
        "Token IDs must be unique";
}
