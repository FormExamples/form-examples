-- Main United Kingdom Birth Registration record: one application to register a
-- birth in England and Wales (GOV.UK 'Register a birth') and to order the birth
-- certificate (GRO). It captures the child, the mother, the parentage basis for
-- a second parent, the informant and identity evidence, and the certificate
-- order. The completeness and validity classification (ready-to-submit,
-- incomplete, needs-additional-evidence or out-of-scope), the audit trail of
-- fired rules, and the flagged issues live in dedicated child tables. The
-- statutory register entry made by the registrar remains the legal record.

CREATE TABLE united_kingdom_birth_registration.united_kingdom_birth_registration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES united_kingdom_birth_registration.patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES united_kingdom_birth_registration.clinician(id) ON DELETE RESTRICT,


    -- Child
    child_forenames TEXT NOT NULL DEFAULT '',
    child_surname TEXT NOT NULL DEFAULT '',
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'indeterminate', '')),
    date_of_birth DATE,
    time_of_birth TIME,
    place_of_birth_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (place_of_birth_type IN ('hospital', 'home', 'birth-centre', 'other', '')),
    place_of_birth TEXT NOT NULL DEFAULT '',
    birth_country VARCHAR(20) NOT NULL DEFAULT '' CHECK (birth_country IN ('england', 'wales', 'scotland', 'northern-ireland', 'abroad', '')),
    multiple_birth VARCHAR(20) NOT NULL DEFAULT '' CHECK (multiple_birth IN ('single', 'twins', 'triplets-or-more', '')),
    stillbirth VARCHAR(5) NOT NULL DEFAULT '' CHECK (stillbirth IN ('yes', 'no', '')),

    -- Mother
    mother_name TEXT NOT NULL DEFAULT '',
    mother_maiden_surname TEXT NOT NULL DEFAULT '',
    mother_date_of_birth DATE,
    mother_place_of_birth TEXT NOT NULL DEFAULT '',
    mother_occupation TEXT NOT NULL DEFAULT '',
    mother_address TEXT NOT NULL DEFAULT '',

    -- Parentage
    parents_relationship VARCHAR(30) NOT NULL DEFAULT '' CHECK (parents_relationship IN ('married-or-civil-partners', 'unmarried', 'female-couple-married', 'female-couple-unmarried', 'male-couple', 'mother-only', '')),
    marriage_date DATE,
    second_parent_included VARCHAR(5) NOT NULL DEFAULT '' CHECK (second_parent_included IN ('yes', 'no', '')),
    second_parent_name TEXT NOT NULL DEFAULT '',
    second_parent_date_of_birth DATE,
    second_parent_place_of_birth TEXT NOT NULL DEFAULT '',
    second_parent_occupation TEXT NOT NULL DEFAULT '',
    paternity_basis VARCHAR(40) NOT NULL DEFAULT '' CHECK (paternity_basis IN ('married-or-civil-partners', 'joint-registration', 'statutory-declaration', 'court-order-parental-responsibility', 'parental-order', 'none', '')),
    paternity_evidence_held VARCHAR(5) NOT NULL DEFAULT '' CHECK (paternity_evidence_held IN ('yes', 'no', '')),
    licensed_clinic_treatment VARCHAR(5) NOT NULL DEFAULT '' CHECK (licensed_clinic_treatment IN ('yes', 'no', '')),

    -- Informant
    informant_relationship VARCHAR(40) NOT NULL DEFAULT '' CHECK (informant_relationship IN ('mother', 'father', 'second-parent', 'both-parents', 'person-present-at-birth', 'person-responsible-for-child', 'hospital-administrator', 'other', '')),
    informant_name TEXT NOT NULL DEFAULT '',
    parents_unable_to_register VARCHAR(5) NOT NULL DEFAULT '' CHECK (parents_unable_to_register IN ('yes', 'no', '')),
    registration_route VARCHAR(30) NOT NULL DEFAULT '' CHECK (registration_route IN ('local-register-office', 'hospital', 'other-register-office', '')),
    registration_date DATE,
    identity_primary_document VARCHAR(40) NOT NULL DEFAULT '' CHECK (identity_primary_document IN ('passport', 'uk-photocard-driving-licence', 'eu-photocard-driving-licence', 'uk-birth-or-adoption-certificate', 'biometric-immigration-document', 'uk-travel-document', 'refugee-or-stateless-travel-document', 'eu-identity-card', 'proof-of-age-card', 'none', '')),
    identity_secondary_count INTEGER,
    identity_originals VARCHAR(5) NOT NULL DEFAULT '' CHECK (identity_originals IN ('yes', 'no', '')),
    red_book_presented VARCHAR(5) NOT NULL DEFAULT '' CHECK (red_book_presented IN ('yes', 'no', '')),

    -- Certificate
    certificates_requested INTEGER,
    service_level VARCHAR(20) NOT NULL DEFAULT '' CHECK (service_level IN ('standard', 'priority', '')),
    delivery_address TEXT NOT NULL DEFAULT '',
    payment_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (payment_confirmed IN ('yes', 'no', '')),
    applicant_note TEXT NOT NULL DEFAULT ''

);

CREATE INDEX united_kingdom_birth_registration_patient_id_idx
    ON united_kingdom_birth_registration.united_kingdom_birth_registration (patient_id);
CREATE INDEX united_kingdom_birth_registration_clinician_id_idx
    ON united_kingdom_birth_registration.united_kingdom_birth_registration (clinician_id);

CREATE TRIGGER trigger_united_kingdom_birth_registration_updated_at
    BEFORE UPDATE ON united_kingdom_birth_registration.united_kingdom_birth_registration
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_birth_registration.set_updated_at();

COMMENT ON TABLE united_kingdom_birth_registration.united_kingdom_birth_registration IS
    'Main United Kingdom Birth Registration record: the child, mother, parentage basis for a second parent, informant and identity evidence, and the birth-certificate order for registering a birth in England and Wales. Readiness classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.patient_id IS
    'Foreign key to the child whose birth is being registered (restrict delete).';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.clinician_id IS
    'Foreign key to the registrar or staff member handling the application (restrict delete); optional.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.child_forenames IS
    'Forename(s) the parents wish to register for the child.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.child_surname IS
    'Surname to be registered for the child.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.sex IS
    'Sex of the child as it will be registered: female, male or indeterminate (rare; registrar guidance applies).';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.date_of_birth IS
    'Date of birth of the child.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.time_of_birth IS
    'Time of birth; recorded for multiple births.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.place_of_birth_type IS
    'Type of place of birth: hospital, home, birth-centre or other.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.place_of_birth IS
    'Name and address of the place of birth (determines the registration district).';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.birth_country IS
    'Country where the child was born; only england and wales are registered under this service.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.multiple_birth IS
    'Whether the child was a single or multiple birth; each child of a multiple birth is registered separately.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.stillbirth IS
    'Whether the child was born dead after the 24th week of pregnancy (a stillbirth, registered separately).';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.mother_name IS
    'Full name of the mother (the person who gave birth) at the time of registration.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.mother_maiden_surname IS
    'Mothers surname at birth (maiden surname), if different from her current surname.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.mother_date_of_birth IS
    'Date of birth of the mother.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.mother_place_of_birth IS
    'Town and country of birth of the mother.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.mother_occupation IS
    'Occupation of the mother.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.mother_address IS
    'Usual address of the mother.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.parents_relationship IS
    'Legal relationship of the parents: married or civil partners, unmarried, female couple (married or unmarried), male couple, or mother only.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.marriage_date IS
    'Date of the parents marriage or civil partnership, if any.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.second_parent_included IS
    'Whether a second parent (father or female parent) is to be recorded on the entry.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.second_parent_name IS
    'Full name of the second parent.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.second_parent_date_of_birth IS
    'Date of birth of the second parent.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.second_parent_place_of_birth IS
    'Town and country of birth of the second parent.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.second_parent_occupation IS
    'Occupation of the second parent.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.paternity_basis IS
    'Basis on which the second parent may be recorded: marriage/civil partnership, joint registration, statutory declaration, court order, parental order, or none.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.paternity_evidence_held IS
    'Whether the signed declaration or court document required by the basis is in hand.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.licensed_clinic_treatment IS
    'For a female couple not married or civil partners: whether both were treated together by a UK licensed clinic under a parenthood agreement.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.informant_relationship IS
    'Relationship of the informant to the child; only the qualified informants may register.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.informant_name IS
    'Full name of the informant who will attend or sign.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.parents_unable_to_register IS
    'Whether the parents are unable to register (for example for medical reasons); required for a non-parent informant.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.registration_route IS
    'Where the birth is to be registered: the local register office for the birth area, the hospital, or any other register office.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.registration_date IS
    'Date the birth is, or is intended to be, registered; the 42-day period runs from the date of birth.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.identity_primary_document IS
    'Accepted single identity document the informant will bring, or none.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.identity_secondary_count IS
    'Number of acceptable secondary documents (utility bill, bank statement, council tax and so on) the informant will bring if no single document is held.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.identity_originals IS
    'Whether the identity documents are originals (photocopies are not accepted).';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.red_book_presented IS
    'Whether the personal child health record (red book) will be brought; a registrar may ask to see it.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.certificates_requested IS
    'Number of birth certificates ordered with the registration.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.service_level IS
    'Certificate service level: standard or priority (next working day if ordered by 4pm).';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.delivery_address IS
    'Postal address to which the ordered certificates are sent.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.payment_confirmed IS
    'Whether payment of the certificate fee by debit or credit card is confirmed.';
COMMENT ON COLUMN united_kingdom_birth_registration.united_kingdom_birth_registration.applicant_note IS
    'Free-text note from the applicant to the registrar.';
