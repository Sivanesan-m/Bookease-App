# Security Specification: BookEase Firestore Security

## 1. Data Invariants
- A booking is verified and must contain all required fields (`customerName`, `customerEmail`, `customerPhone` etc.).
- Critical status markers like `status` can only cycle between known states (`pending`, `confirmed`, `completed`, `cancelled`).
- Immutability of key fields: `createdAt`, `customerEmail` cannot be altered after booking registration has occurred.
- Timestamps like `createdAt` must strictly match `request.time` exactly on creation.

## 2. The "Dirty Dozen" Malicious Payloads

1.  **Identity Spoofing**: Attempting to set `customerEmail` to another user's email during an edit.
2.  **State Shortcutting**: Skipping confirmation and moving directly to a finished/completed state maliciously without fulfilling criteria.
3.  **Value Poisoning on Status**: Injecting `status: "mega_admin"` or random integer value.
4.  **Ghost Field Injection**: Adding custom shadow roles or unexpected parameters during creation.
5.  **PII Blanket Harvesting**: Reading other customer details without ownership verification.
6.  **Immortal Field Bypass**: Trying to change the initial `createdAt` timestamp.
7.  **Resource Poisoning**: Writing massive size ID path descriptors (e.g. over 128 characters) or long payload values.
8.  **Empty Validation Creation**: Creating a booking while omitting mandatory elements such as `customerName` or price values.
9.  **Verification Pretending**: Injecting fake custom claims when unauthenticated or unverified.
10. **Query Scraping Abuse**: Executing a blind fetch on all bookings without proper filters.
11. **Client Timestamp Manipulation**: Setting custom past/future static timing for `createdAt` instead of `request.time`.
12. **Double Negative Updates**: Subtracting or corrupting aggregated lifetime metrics inside Customer data.

## 3. Test Cases Draft (`firestore.rules.test.ts` / Proofs)
All invalid, malicious, or spoofed drafts must be denied by Firestore security rules. Access must validate correct parameters, structure, and identity invariants before saving.
