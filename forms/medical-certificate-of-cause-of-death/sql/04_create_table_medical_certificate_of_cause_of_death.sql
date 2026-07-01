-- Main Medical Certificate of Cause of Death (MCCD) record: one statutory
-- certificate documenting the cause of death of a deceased person for death
-- registration. It captures the certification context, the deceased's death
-- details, the Part I direct causal sequence (I(a) -> I(b) -> I(c)) with
-- onset-to-death intervals, the Part II contributory conditions, and the
-- coroner / medical-examiner referral status. The completeness and
-- validity-classification result, the audit trail of fired rules, and the
-- flagged issues live in dedicated child tables. This record documents the
-- certifying doctor's statutory judgement; it does not itself diagnose.

CREATE TABLE medical_certificate_of_cause_of_death (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Certification context
    certifying_doctor_name TEXT NOT NULL DEFAULT '',
    certifying_doctor_grade VARCHAR(20) NOT NULL DEFAULT '' CHECK (certifying_doctor_grade IN ('consultant', 'sas', 'registrar', 'foundation', 'gp', 'other', '')),
    gmc_reference VARCHAR(50) NOT NULL DEFAULT '',
    place_of_certification TEXT NOT NULL DEFAULT '',
    certification_date DATE,
    attended_deceased VARCHAR(5) NOT NULL DEFAULT '' CHECK (attended_deceased IN ('yes', 'no', '')),
    last_seen_alive_date DATE,

    -- Deceased identification (context beyond the patient FK)
    deceased_name TEXT NOT NULL DEFAULT '',
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'other', 'unknown', '')),
    date_of_birth DATE,
    age_years INTEGER,
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',

    -- Death details
    date_of_death DATE,
    time_of_death TIME,
    place_of_death TEXT NOT NULL DEFAULT '',
    seen_after_death_by VARCHAR(25) NOT NULL DEFAULT '' CHECK (seen_after_death_by IN ('certifier', 'another-practitioner', 'not-seen', '')),

    -- Part I: direct causal sequence
    cause_ia_condition TEXT NOT NULL DEFAULT '',
    cause_ia_interval TEXT NOT NULL DEFAULT '',
    cause_ib_condition TEXT NOT NULL DEFAULT '',
    cause_ib_interval TEXT NOT NULL DEFAULT '',
    cause_ic_condition TEXT NOT NULL DEFAULT '',
    cause_ic_interval TEXT NOT NULL DEFAULT '',

    -- Part II: contributory conditions
    part_ii_conditions TEXT NOT NULL DEFAULT '',
    part_ii_interval TEXT NOT NULL DEFAULT '',

    -- Referral and scrutiny
    referred_to_coroner VARCHAR(5) NOT NULL DEFAULT '' CHECK (referred_to_coroner IN ('yes', 'no', '')),
    coroner_reason VARCHAR(30) NOT NULL DEFAULT '' CHECK (coroner_reason IN ('unnatural', 'violent', 'suspicious', 'unknown-cause', 'industrial-disease', 'medical-procedure', 'custody', 'no-attending-practitioner', 'other', 'none', '')),
    medical_examiner_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (medical_examiner_status IN ('scrutinised', 'discussed', 'pending', 'not-required', '')),
    certifier_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX medical_certificate_of_cause_of_death_patient_id_idx
    ON medical_certificate_of_cause_of_death (patient_id);
CREATE INDEX medical_certificate_of_cause_of_death_clinician_id_idx
    ON medical_certificate_of_cause_of_death (clinician_id);

CREATE TRIGGER trigger_medical_certificate_of_cause_of_death_updated_at
    BEFORE UPDATE ON medical_certificate_of_cause_of_death
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_certificate_of_cause_of_death IS
    'Main Medical Certificate of Cause of Death (MCCD) record: certification context, deceased death details, the Part I direct causal sequence (I(a) -> I(b) -> I(c)) with onset-to-death intervals, the Part II contributory conditions, and the coroner / medical-examiner referral status. Validity classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.patient_id IS
    'Foreign key to the deceased this certificate documents (restrict delete).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.clinician_id IS
    'Foreign key to the certifying doctor (restrict delete); optional.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.certifying_doctor_name IS
    'Name of the attending practitioner certifying the cause of death.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.certifying_doctor_grade IS
    'Grade of the certifying doctor: consultant, sas, registrar, foundation, gp, or other.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.gmc_reference IS
    'GMC registration number of the certifying doctor.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.place_of_certification IS
    'Place where the certificate is completed: hospital, practice, or other.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.certification_date IS
    'Date the certificate was completed.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.attended_deceased IS
    'Whether the certifier attended the deceased during the last illness (yes/no).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.last_seen_alive_date IS
    'Date the certifier last saw the deceased alive.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.deceased_name IS
    'Full name of the deceased as recorded on the certificate.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.sex IS
    'Sex of the deceased: female, male, other, or unknown.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.date_of_birth IS
    'Date of birth of the deceased.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.age_years IS
    'Age of the deceased at death, in whole years.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.patient_identifier IS
    'NHS number or local identifier of the deceased as recorded on the certificate.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.date_of_death IS
    'Date of death.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.time_of_death IS
    'Time of death.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.place_of_death IS
    'Place of death: ward, home, hospice, or other.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.seen_after_death_by IS
    'Who saw the body after death: certifier, another-practitioner, or not-seen.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.cause_ia_condition IS
    'Part I(a): the disease or condition directly leading to death (required).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.cause_ia_interval IS
    'Part I(a): approximate interval between onset and death.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.cause_ib_condition IS
    'Part I(b): the antecedent condition giving rise to I(a).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.cause_ib_interval IS
    'Part I(b): approximate interval between onset and death.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.cause_ic_condition IS
    'Part I(c): the underlying condition giving rise to I(b).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.cause_ic_interval IS
    'Part I(c): approximate interval between onset and death.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.part_ii_conditions IS
    'Part II: other significant conditions contributing to death but not part of the Part I sequence.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.part_ii_interval IS
    'Part II: approximate interval between onset and death (optional).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.referred_to_coroner IS
    'Whether the death has been referred to the coroner (yes/no).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.coroner_reason IS
    'Coroner-referral criterion, if any: unnatural, violent, suspicious, unknown-cause, industrial-disease, medical-procedure, custody, no-attending-practitioner, other, or none.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.medical_examiner_status IS
    'Medical-examiner scrutiny status: scrutinised, discussed, pending, or not-required.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death.certifier_note IS
    'Free-text note from the certifying doctor.';
