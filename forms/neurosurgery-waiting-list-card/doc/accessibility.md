# Accessibility and patient communication

The card carries information **for the patient**. The standards that
apply to patient-facing presentation are:

## Accessible Information Standard (AIS)

- NHS England. *Accessible Information Standard (DCB1605).*
  <https://www.england.nhs.uk/about/equality/equality-hub/patient-equalities-programme/equality-frameworks-and-information-standards/accessibleinfo/>

AIS requires NHS-funded providers to:

1. Ask patients about communication needs at first contact.
2. Record those needs in a consistent way (DCB1605 specifies the
   data items and SNOMED CT codes).
3. Flag the record so the needs are visible to all staff.
4. Meet the needs (e.g. large print, easy read, BSL interpreter).
5. Share the needs information when the patient is referred.

The card's *Patient communication* step (step 6) captures the AIS
data items: preferred contact channel, language and interpreter
needs, accessibility format (BSL, large print, easy read), and
consent to reminders.

## Welsh language

For patients resident in Wales or registered with a Welsh-language
preference, the *Welsh Language Standards* apply — see
`forms/medical-language-speaking-assessment-for-cymraeg/doc/`.

- Welsh Language Commissioner. *Welsh Language Standards.*
  <https://www.welshlanguagecommissioner.wales/welsh-language-standards>

## WCAG 2.2

The patient-facing card view in this form's HTML and Svelte
renderings targets **WCAG 2.2 Level AA**.

- W3C. *Web Content Accessibility Guidelines 2.2.*
  <https://www.w3.org/TR/WCAG22/>
- UK Government. *Public Sector Bodies (Websites and Mobile
  Applications) (No. 2) Accessibility Regulations 2018.*
  <https://www.legislation.gov.uk/uksi/2018/952/contents/made>

## NHS digital service manual

- NHS digital service manual. *Content design.*
  <https://service-manual.nhs.uk/content>
- NHS digital service manual. *Design system.*
  <https://service-manual.nhs.uk/design-system>

Plain-English reading-age target for patient-facing materials is
9–11 years (approximately CEFR B1).

## Interpreter booking

The *Interpreter required* additional flag fires when interpreter
need is recorded but not yet booked. The reference standard is the
*NHS England Patient and Public Involvement* guidance on interpreter
services.

- NHS England. *Guidance for Commissioners: Interpreting and
  Translation Services in Primary Care.*
  <https://www.england.nhs.uk/wp-content/uploads/2018/09/guidance-for-commissioners-interpreting-and-translation-services-in-primary-care.pdf>
