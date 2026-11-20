-- Main United States Social Security card application (Form SS-5): one
-- application for an original, replacement, or corrected Social Security
-- card. It captures the request, the applicant identity items, the evidence
-- documents presented (identity, age, citizenship or lawful alien status,
-- name change), the filer and signature, and the death-related Tell-SSA
-- items. The completeness and evidence classification, the audit trail of
-- fired rules, and the flagged issues live in dedicated child tables. The
-- Social Security number itself is deliberately never stored. This record
-- documents an application; the Social Security Administration decides it.

CREATE TABLE united_states_social_security_card_application.ss5_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES united_states_social_security_card_application.patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES united_states_social_security_card_application.clinician(id) ON DELETE RESTRICT,

    -- Request (SS-5 items 12-15 and replacement history)
    application_date DATE,
    request_type VARCHAR(11) NOT NULL DEFAULT '' CHECK (request_type IN ('original', 'replacement', 'correction', '')),
    channel VARCHAR(9) NOT NULL DEFAULT '' CHECK (channel IN ('in-person', 'mail', '')),
    previously_applied VARCHAR(9) NOT NULL DEFAULT '' CHECK (previously_applied IN ('yes', 'no', 'dont-know', '')),
    name_change VARCHAR(5) NOT NULL DEFAULT '' CHECK (name_change IN ('yes', 'no', '')),
    name_change_reason VARCHAR(11) NOT NULL DEFAULT '' CHECK (name_change_reason IN ('marriage', 'divorce', 'court-order', 'other', '')),
    date_of_birth_correction VARCHAR(5) NOT NULL DEFAULT '' CHECK (date_of_birth_correction IN ('yes', 'no', '')),
    replacements_this_year INTEGER CHECK (replacements_this_year IS NULL OR replacements_this_year >= 0),
    replacements_lifetime INTEGER CHECK (replacements_lifetime IS NULL OR replacements_lifetime >= 0),
    limit_exception_reason VARCHAR(13) NOT NULL DEFAULT '' CHECK (limit_exception_reason IN ('name-change', 'legend-change', 'non-receipt', 'ssa-error', 'hardship', '')),
    limit_exception_evidence VARCHAR(5) NOT NULL DEFAULT '' CHECK (limit_exception_evidence IN ('yes', 'no', '')),

    -- Applicant (SS-5 items 1-11, 13-14, 16-17)
    name_on_card TEXT NOT NULL DEFAULT '',
    name_at_birth TEXT NOT NULL DEFAULT '',
    other_names_used TEXT NOT NULL DEFAULT '',
    name_on_most_recent_card TEXT NOT NULL DEFAULT '',
    date_of_birth DATE,
    place_of_birth_city TEXT NOT NULL DEFAULT '',
    place_of_birth_region TEXT NOT NULL DEFAULT '',
    sex VARCHAR(6) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', '')),
    citizenship VARCHAR(31) NOT NULL DEFAULT '' CHECK (citizenship IN ('us-citizen', 'legal-alien-allowed-to-work', 'legal-alien-not-allowed-to-work', 'other', '')),
    non_work_reason_valid VARCHAR(5) NOT NULL DEFAULT '' CHECK (non_work_reason_valid IN ('yes', 'no', '')),
    mother_name_at_birth TEXT NOT NULL DEFAULT '',
    father_name TEXT NOT NULL DEFAULT '',
    state_of_residence VARCHAR(2) NOT NULL DEFAULT '' CHECK (char_length(state_of_residence) IN (0, 2)),
    mailing_address TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',

    -- Evidence documents
    identity_document VARCHAR(21) NOT NULL DEFAULT '' CHECK (identity_document IN ('us-driver-license', 'state-id-card', 'us-passport', 'military-id', 'employee-id', 'school-id', 'health-insurance-card', 'other', 'none', '')),
    identity_document_expired VARCHAR(5) NOT NULL DEFAULT '' CHECK (identity_document_expired IN ('yes', 'no', '')),
    age_document VARCHAR(20) NOT NULL DEFAULT '' CHECK (age_document IN ('us-birth-certificate', 'us-passport', 'hospital-record', 'religious-record', 'immigration-record', 'other', 'none', '')),
    citizenship_document VARCHAR(33) NOT NULL DEFAULT '' CHECK (citizenship_document IN ('us-birth-certificate', 'us-passport', 'certificate-of-naturalization', 'certificate-of-citizenship', 'consular-report-of-birth-abroad', 'permanent-resident-card', 'i-94-with-work-authorization', 'employment-authorization-document', 'other', 'none', '')),
    citizenship_on_file VARCHAR(9) NOT NULL DEFAULT '' CHECK (citizenship_on_file IN ('yes', 'no', 'dont-know', '')),
    name_change_document VARCHAR(29) NOT NULL DEFAULT '' CHECK (name_change_document IN ('marriage-certificate', 'divorce-decree', 'court-order', 'certificate-of-naturalization', 'other', 'none', '')),
    documents_original_or_certified VARCHAR(5) NOT NULL DEFAULT '' CHECK (documents_original_or_certified IN ('yes', 'no', '')),

    -- Filer, signature, and death-related items
    signer_relationship VARCHAR(14) NOT NULL DEFAULT '' CHECK (signer_relationship IN ('self', 'parent', 'legal-guardian', 'custodian', 'other', '')),
    signer_name TEXT NOT NULL DEFAULT '',
    signer_identity_document VARCHAR(5) NOT NULL DEFAULT '' CHECK (signer_identity_document IN ('yes', 'no', '')),
    signature_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (signature_present IN ('yes', 'no', '')),
    applicant_deceased VARCHAR(5) NOT NULL DEFAULT '' CHECK (applicant_deceased IN ('yes', 'no', '')),
    death_reported_to_ssa VARCHAR(5) NOT NULL DEFAULT '' CHECK (death_reported_to_ssa IN ('yes', 'no', '')),
    preparer_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX ss5_application_patient_id_idx
    ON united_states_social_security_card_application.ss5_application (patient_id);
CREATE INDEX ss5_application_clinician_id_idx
    ON united_states_social_security_card_application.ss5_application (clinician_id);

CREATE TRIGGER trigger_ss5_application_updated_at
    BEFORE UPDATE ON united_states_social_security_card_application.ss5_application
    FOR EACH ROW
    EXECUTE FUNCTION united_states_social_security_card_application.set_updated_at();

COMMENT ON TABLE united_states_social_security_card_application.ss5_application IS
    'Main Form SS-5 application record: request type, applicant items, evidence documents presented, filer and signature, and death-related Tell-SSA items. Classification, fired rules, and flags live in child tables. The Social Security number is never stored.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.patient_id IS
    'Foreign key to the applicant (the person named in item 1; restrict delete).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.clinician_id IS
    'Foreign key to the preparer or assisting staff member (restrict delete); optional.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.application_date IS
    'Date the application is signed and submitted (SS-5 item 15); the reference date for age rules.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.request_type IS
    'What the applicant asks SSA for: an original card, a replacement card, or a corrected card.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.channel IS
    'How the application is submitted; applicants aged 12 or older for an original card must apply in person.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.previously_applied IS
    'Whether the person has ever applied for or received an SSN or card (SS-5 item 12).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.name_change IS
    'Whether the name on the card differs because of a legal name change.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.name_change_reason IS
    'Reason for the legal name change.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.date_of_birth_correction IS
    'Whether the request corrects the date of birth recorded by SSA.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.replacements_this_year IS
    'Replacement cards already issued in the current calendar year (limit 3).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.replacements_lifetime IS
    'Replacement cards already issued in the lifetime of the number holder (limit 10).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.limit_exception_reason IS
    'Exception reason claimed when a replacement limit is reached.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.limit_exception_evidence IS
    'Whether documentation supporting the claimed exception reason is available.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.name_on_card IS
    'Full name to be shown on the card (item 1).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.name_at_birth IS
    'Full name at birth (item 2).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.other_names_used IS
    'Other names used (item 3).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.name_on_most_recent_card IS
    'Name on the most recent Social Security card (item 13).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.date_of_birth IS
    'Date of birth (item 7).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.place_of_birth_city IS
    'City or town of birth (item 6).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.place_of_birth_region IS
    'State, province, or country of birth (item 6).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.sex IS
    'Sex as recorded on the SS-5 (item 11): female or male.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.citizenship IS
    'Citizenship or alien status (item 8).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.non_work_reason_valid IS
    'For a lawfully admitted noncitizen not allowed to work: whether a valid non-work reason (federal or state benefit or law) is documented.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.mother_name_at_birth IS
    'Mother name at her birth (item 4); write unknown if not known.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.father_name IS
    'Father name (item 5); write unknown if not known.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.state_of_residence IS
    'Two-letter USPS code of the state or territory of residence.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.mailing_address IS
    'Mailing address where the card is sent (item 17).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.phone IS
    'Daytime telephone number (item 16).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.identity_document IS
    'Primary proof of identity presented; must be current, unexpired, and show name, identifying information, and preferably a photograph.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.identity_document_expired IS
    'Whether the identity document is expired.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.age_document IS
    'Proof of age presented; a birth certificate is preferred.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.citizenship_document IS
    'Proof of US citizenship or lawful alien status presented.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.citizenship_on_file IS
    'Whether SSA already holds citizenship or status evidence for this number (relevant to replacement cards).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.name_change_document IS
    'Document proving the legal name change.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.documents_original_or_certified IS
    'Whether every document is an original or a copy certified by the issuing agency; photocopies and notarized copies are not accepted.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.signer_relationship IS
    'Relationship of the person signing to the person in item 1 (item 18).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.signer_name IS
    'Name of the person signing when not the applicant.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.signer_identity_document IS
    'Whether the signer, when not the applicant, presented their own proof of identity.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.signature_present IS
    'Whether the application is signed (item 19).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.applicant_deceased IS
    'Tell SSA: whether the person in item 1 has died; a card cannot be issued and the death must be reported instead.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.death_reported_to_ssa IS
    'Whether the death has already been reported to SSA (funeral home, family, or 1-800-772-1213).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application.preparer_note IS
    'Free-text note from the person preparing the application.';
