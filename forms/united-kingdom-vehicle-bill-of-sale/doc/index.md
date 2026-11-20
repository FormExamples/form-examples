# United Kingdom Vehicle Bill of Sale — Reference documentation

Statutory and guidance reference material for the private vehicle bill of sale
form. This form is documentation support, not legal advice.

See the form root [`../index.md`](../index.md) for the full design description
and [`../spec/index.md`](../spec/index.md) for the contract.

## Sources and what the form takes from each

- [GOV.UK — Buy a vehicle](https://www.gov.uk/buy-a-vehicle) — before buying,
  check the V5C log book, the registration number, make and model, the MOT
  history and safety recalls, and that the vehicle is not recorded as stolen.
  After buying, register the vehicle, insure it, and tax it before driving.
  Without a V5C, a replacement costs £25. Drives the `v5cPresent`,
  `v5cDetailsMatch`, and `motStatus` checks.
- [GOV.UK — Sell, scrap or transfer a vehicle](https://www.gov.uk/sold-bought-vehicle)
  — the seller tells DVLA when they no longer own the vehicle; the online
  service changes the registered keeper and sends the V5C to the new keeper;
  vehicle tax is cancelled when DVLA is told and any full months remaining can
  be refunded; the buyer must tax the vehicle (tax does not transfer) or declare
  SORN. Without a V5C, the seller writes to DVLA (Swansea SA99 1BA) with the
  registration number, make and model, sale date, and the new keeper's name and
  address. Drives `dvlaNotification` and the DVLA flags.
- The V5C/2 "new keeper" supplement: the seller gives the buyer the green V5C/2
  section when the seller tells DVLA by post; the buyer keeps it as proof of
  purchase until the new V5C arrives. Drives `newKeeperSlipGiven`.
- [Citizens Advice — buying and selling privately](https://www.citizensadvice.org.uk/consumer/buying-or-selling-goods-and-services/)
  — in a private sale the Consumer Rights Act 2015 generally does not apply
  (it covers sales by traders), and "sold as seen" means the buyer takes the
  vehicle in its current condition. The seller must still describe it
  honestly. A trader posing as a private seller is unlawful. Keep the advert
  and messages as evidence. Drives `saleTerms`, `descriptionMatchesAdvert`,
  and the `trader-sale` flag.
- [Sale of Goods Act 1979](https://www.legislation.gov.uk/ukpga/1979/54) —
  s.12 (the seller must have the right to sell), s.13 (goods must correspond
  with their description, which applies to private sales too), s.14 (satisfactory
  quality applies only to sales in the course of a business). Drives the
  seller-not-keeper, description-mismatch, and finance flags.
- [Consumer Rights Act 2015](https://www.legislation.gov.uk/ukpga/2015/15) —
  applies where the seller is a trader; statutory rights cannot be excluded by
  "sold as seen".
- [GOV.UK — Check the MOT history of a vehicle](https://www.gov.uk/check-mot-history)
  — a vehicle generally needs an MOT once it is three years old; MOT history is
  free to check. Drives `motStatus`.
- Outstanding finance: if a vehicle is on hire purchase, PCP, or a logbook loan,
  the lender may still own it and may repossess it from the buyer; a vehicle
  history check reveals recorded finance. Drives `financeStatus` and the finance
  flags. (Guidance from GOV.UK, Citizens Advice, and trading standards bodies.)

## Design notes

- The engine classifies completeness and risk; it never decides ownership.
- Payment risk is advisory: cash of £1,000 or more is flagged because it leaves
  no audit trail, and a cheque is flagged until it has cleared.
- DVLA, MOT, and finance lookups are out of scope; the user records what they
  found.
- Cross-references: the three DVLA forms
  (`united-kingdom-driver-and-vehicle-licensing-agency-v1-form`, `-m1-form`,
  `-b1-form`) and `united-kingdom-vehicle-registration-application` cover the
  registration side.
