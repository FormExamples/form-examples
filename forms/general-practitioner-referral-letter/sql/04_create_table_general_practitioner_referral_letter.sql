-- Main general-practitioner referral letter record: one primary-care
-- referral to a specialist or service. Records the referral destination,
-- urgency, reason and history, examination and investigation findings,
-- medications and allergies, and the patient's expectations, consent, and
-- safety-netting, plus patient and referrer identification. The
-- documentation-completeness grade, the audit trail of fired grading
-- rules, and the flags live in dedicated child tables. All clinical
-- content is free text; presence of a field is detected by a non-empty
-- value, not by semantic analysis.

CREATE TABLE general_practitioner_referral_letter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Identification and referral context
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    referrer_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (referrer_role IN ('gp', 'gp-registrar', 'nurse-practitioner', 'pharmacist', 'paramedic', 'other', '')),
    referring_practice TEXT NOT NULL DEFAULT '',
    referral_date DATE,
    access_needs TEXT NOT NULL DEFAULT '',

    -- Referral destination and urgency
    referral_specialty TEXT NOT NULL DEFAULT '',
    named_clinician TEXT NOT NULL DEFAULT '',
    receiving_organisation TEXT NOT NULL DEFAULT '',
    urgency VARCHAR(20) NOT NULL DEFAULT '' CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', 'emergency', '')),
    urgency_reason TEXT NOT NULL DEFAULT '',
    suspected_cancer_criterion TEXT NOT NULL DEFAULT '',
    suspected_cancer_pathway TEXT NOT NULL DEFAULT '',

    -- Clinical content
    reason_for_referral TEXT NOT NULL DEFAULT '',
    relevant_history TEXT NOT NULL DEFAULT '',
    presenting_problem TEXT NOT NULL DEFAULT '',
    symptom_duration TEXT NOT NULL DEFAULT '',
    red_flag_symptoms TEXT NOT NULL DEFAULT '',
    examination_findings TEXT NOT NULL DEFAULT '',
    investigation_results TEXT NOT NULL DEFAULT '',
    current_medications TEXT NOT NULL DEFAULT '',
    allergies TEXT NOT NULL DEFAULT '',
    patient_expectations TEXT NOT NULL DEFAULT '',
    consent_to_share VARCHAR(5) NOT NULL DEFAULT '' CHECK (consent_to_share IN ('yes', 'no', '')),
    safety_netting TEXT NOT NULL DEFAULT '',

    -- Free-text narrative
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX general_practitioner_referral_letter_patient_id_idx
    ON general_practitioner_referral_letter (patient_id);
CREATE INDEX general_practitioner_referral_letter_clinician_id_idx
    ON general_practitioner_referral_letter (clinician_id);

CREATE TRIGGER trigger_general_practitioner_referral_letter_updated_at
    BEFORE UPDATE ON general_practitioner_referral_letter
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE general_practitioner_referral_letter IS
    'Main general-practitioner referral letter record: referral destination, urgency, reason and history, examination and investigation findings, medications and allergies, and the patient''s expectations, consent, and safety-netting, plus patient and referrer identification. Completeness grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN general_practitioner_referral_letter.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN general_practitioner_referral_letter.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN general_practitioner_referral_letter.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN general_practitioner_referral_letter.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN general_practitioner_referral_letter.patient_id IS
    'Foreign key to the patient being referred (restrict delete).';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician_id IS
    'Foreign key to the referring clinician (restrict delete); optional.';
COMMENT ON COLUMN general_practitioner_referral_letter.patient_identifier IS
    'NHS number or local patient identifier as recorded on the letter.';
COMMENT ON COLUMN general_practitioner_referral_letter.referrer_role IS
    'Referrer role: gp, gp-registrar, nurse-practitioner, pharmacist, paramedic, or other.';
COMMENT ON COLUMN general_practitioner_referral_letter.referring_practice IS
    'Referring practice name.';
COMMENT ON COLUMN general_practitioner_referral_letter.referral_date IS
    'Date of referral.';
COMMENT ON COLUMN general_practitioner_referral_letter.access_needs IS
    'Interpreter or accessibility needs recorded for the patient.';
COMMENT ON COLUMN general_practitioner_referral_letter.referral_specialty IS
    'Specialty or service being referred to (always mandatory).';
COMMENT ON COLUMN general_practitioner_referral_letter.named_clinician IS
    'Named consultant or team being referred to (optional).';
COMMENT ON COLUMN general_practitioner_referral_letter.receiving_organisation IS
    'Receiving hospital, trust, or community provider.';
COMMENT ON COLUMN general_practitioner_referral_letter.urgency IS
    'Urgency classification: routine, urgent, two-week-wait, or emergency (always mandatory).';
COMMENT ON COLUMN general_practitioner_referral_letter.urgency_reason IS
    'Why the referral is urgent; mandatory for urgent and two-week-wait.';
COMMENT ON COLUMN general_practitioner_referral_letter.suspected_cancer_criterion IS
    'Named NICE NG12 criterion; mandatory for two-week-wait.';
COMMENT ON COLUMN general_practitioner_referral_letter.suspected_cancer_pathway IS
    'Tumour-site suspected-cancer pathway; mandatory for two-week-wait.';
COMMENT ON COLUMN general_practitioner_referral_letter.reason_for_referral IS
    'Primary reason for the referral (always mandatory).';
COMMENT ON COLUMN general_practitioner_referral_letter.relevant_history IS
    'Relevant clinical history (always mandatory).';
COMMENT ON COLUMN general_practitioner_referral_letter.presenting_problem IS
    'Presenting problem.';
COMMENT ON COLUMN general_practitioner_referral_letter.symptom_duration IS
    'Duration of symptoms.';
COMMENT ON COLUMN general_practitioner_referral_letter.red_flag_symptoms IS
    'Documented red-flag symptoms; presence drives the emergency-features flag.';
COMMENT ON COLUMN general_practitioner_referral_letter.examination_findings IS
    'Examination findings.';
COMMENT ON COLUMN general_practitioner_referral_letter.investigation_results IS
    'Bloods, imaging, or other investigations already done.';
COMMENT ON COLUMN general_practitioner_referral_letter.current_medications IS
    'Current medications.';
COMMENT ON COLUMN general_practitioner_referral_letter.allergies IS
    'Allergies and reactions.';
COMMENT ON COLUMN general_practitioner_referral_letter.patient_expectations IS
    'Patient''s expectations or question to the specialist.';
COMMENT ON COLUMN general_practitioner_referral_letter.consent_to_share IS
    'Whether consent to share information is documented (yes/no); anything other than yes raises the consent-not-documented flag.';
COMMENT ON COLUMN general_practitioner_referral_letter.safety_netting IS
    'Safety-netting advice given to the patient while waiting; absence raises the no-safety-netting flag.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinical_note IS
    'Optional free-text note shown in the summary.';
