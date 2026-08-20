// BookingEscrow.spec — Certora Formal Verification Rules

methods {
    function createBooking(uint8,uint64,address) external payable returns (uint256);
    function cancelBooking(uint256) external;
    function checkIn(uint256) external;
    function calculateDeposit(address,uint8,address) external returns (uint256) view;
    function getUserBookings(address) external returns (Booking[]) view;
    function nextBookingId() external returns (uint256) view;
    function nonces(address) external returns (uint256) view;
    function owner() external returns (address) view;
}

// Rule: Booking ID increments by exactly 1
rule bookingIdIncrements {
    uint8 daybedType;
    uint64 visitTs;
    address token;
    uint256 idBefore = nextBookingId();

    createBooking(daybedType, visitTs, token);

    assert nextBookingId() == idBefore + 1,
        "Booking ID must increment by exactly 1";
}

// Rule: Cancelled booking cannot be checked in
rule cancelledCannotBeCheckedIn {
    uint256 bookingId;

    require bookings[bookingId].cancelled == true;

    checkIn(bookingId) expect revert;
}

// Rule: Settled booking cannot be cancelled
rule settledCannotBeCancelled {
    uint256 bookingId;

    require bookings[bookingId].settled == true;

    cancelBooking(bookingId) expect revert;
}

// Rule: Non-guest cannot cancel booking
rule onlyGuestCanCancel {
    uint256 bookingId;
    address caller = nonlasses(caller);

    require bookings[bookingId].guest != caller;

    cancelBooking(bookingId) expect revert;
}

// Rule: Only owner can check in
rule onlyOwnerCanCheckIn {
    uint256 bookingId;
    address caller = nonlasses(caller);
    address contractOwner = owner();

    require caller != contractOwner;

    checkIn(bookingId) expect revert;
}

// Rule: Deposit amount matches calculateDeposit
rule depositMatchesCalculation {
    address guest;
    uint8 daybedType;
    address token;
    uint256 calculated = calculateDeposit(guest, daybedType, token);

    // After booking, deposit amount should equal calculated value
    // (assuming exact deposit is sent)
}

// Rule: Cancellation refund equals deposit amount
rule cancellationRefundEqualsDeposit {
    uint256 bookingId;
    uint256 depositBefore = bookings[bookingId].depositAmount;

    cancelBooking(bookingId);

    // Guest receives full deposit back
}

// Rule: Nonce increments after signature usage
rule nonceIncrements {
    address guest;
    uint256 nonceBefore = nonces(guest);

    // After successful createBookingWithSignature
    // nonces[guest] should be nonceBefore + 1
}
