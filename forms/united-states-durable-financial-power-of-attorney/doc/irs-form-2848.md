# IRS Form 2848 versus a durable power of attorney

A state durable POA gives the agent authority under state law. It does not by
itself appoint a *representative* to deal with the IRS. IRS Form 2848, *Power of
Attorney and Declaration of Representative*, authorizes an attorney, CPA, or
enrolled agent to represent the taxpayer for named tax matters and periods.

Findings from IRS guidance (Publication 947; IRS Office of Professional
Responsibility alert 2026-15, *Not All Powers Are the Same: Using a Durable
Power of Attorney Rather Than a Form 2848*; 26 CFR 601.503(b)(2)):

- The IRS accepts a non-IRS (state) power of attorney only if it contains the
  information Form 2848 requires: taxpayer name, mailing address, and TIN; the
  representative; the tax matters, form numbers, and periods; and a signed
  Declaration of Representative (Part II of Form 2848) attached.
- A durable POA that authorizes the agent to handle federal tax matters lets the
  agent sign and file Form 2848 for the principal, attached to a copy of the
  durable POA.
- A general grant that lacks tax detail is the common failure.

Engine rule: if `grantTaxMatters` is `yes` and `form2848Status` is not `filed` or
`not-needed`, raise `F-IRS-FORM-2848-001` (medium). If tax representation is
wanted but tax authority is not granted, raise `F-TAX-AUTHORITY-NOT-GRANTED-001`.

Confidence: secondary summaries of the IRS text; the PDF body was not machine
readable in this session. Verify against the current Form 2848 instructions.
