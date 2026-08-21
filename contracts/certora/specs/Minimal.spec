// Minimal CVL 2 spec to test compilation

methods {
    function balanceOf(address) external returns (uint256) envfree;
    function totalSupply() external returns (uint256) envfree;
}

rule totalSupplyNonNegative {
    assert totalSupply() >= 0;
}
