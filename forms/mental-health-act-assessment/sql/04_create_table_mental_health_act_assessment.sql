-- Main Mental Health Act assessment record: one AMHP-coordinated assessment
-- under the UK Mental Health Act 1983 (as amended 2007). It records the
-- context and identification, the assessing professionals, the statutory
-- criteria, the nearest-relative consultation, and the recommendation and
-- outcome. The legal-completeness status, recommended-section and urgency
-- classification, the audit trail of fired classification rules, and the
-- flagged issues live in dedicated child tables. This is a documentation and
-- legal-completeness instrument, not a numeric score and not an automated
-- decision to detain.

CREATE TABLE mental_health_act_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    assessed_at TIMESTAMPTZ,
    location VARCHAR(30) NOT NULL DEFAULT '' CHECK (location IN ('hospital-ward', 'emergency-department', 'place-of-safety', 'care-home', 'community', 'other', '')),
    referral_source TEXT NOT NULL DEFAULT '',
    reason_for_assessment TEXT NOT NULL DEFAULT '',
    person_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(20) NOT NULL DEFAULT '' CHECK (age_band IN ('child', 'adolescent', 'adult', 'older-adult', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    first_language TEXT NOT NULL DEFAULT '',

    -- Assessing professionals
    amhp_name TEXT NOT NULL DEFAULT '',
    amhp_approved VARCHAR(5) NOT NULL DEFAULT '' CHECK (amhp_approved IN ('yes', 'no', '')),
    doctor1_name TEXT NOT NULL DEFAULT '',
    doctor1_gmc_number TEXT NOT NULL DEFAULT '',
    doctor1_section12_approved VARCHAR(5) NOT NULL DEFAULT '' CHECK (doctor1_section12_approved IN ('yes', 'no', '')),
    doctor1_examined_at TIMESTAMPTZ,
    doctor2_name TEXT NOT NULL DEFAULT '',
    doctor2_gmc_number TEXT NOT NULL DEFAULT '',
    doctor2_section12_approved VARCHAR(5) NOT NULL DEFAULT '' CHECK (doctor2_section12_approved IN ('yes', 'no', '')),
    doctor2_examined_at TIMESTAMPTZ,
    prior_acquaintance VARCHAR(5) NOT NULL DEFAULT '' CHECK (prior_acquaintance IN ('yes', 'no', '')),

    -- Statutory criteria (each met / not-met / not-applicable, with evidence)
    mental_disorder_present VARCHAR(15) NOT NULL DEFAULT '' CHECK (mental_disorder_present IN ('met', 'not-met', 'not-applicable', '')),
    mental_disorder_evidence TEXT NOT NULL DEFAULT '',
    risk_to_own_health VARCHAR(15) NOT NULL DEFAULT '' CHECK (risk_to_own_health IN ('met', 'not-met', 'not-applicable', '')),
    risk_to_own_safety VARCHAR(15) NOT NULL DEFAULT '' CHECK (risk_to_own_safety IN ('met', 'not-met', 'not-applicable', '')),
    risk_to_others VARCHAR(15) NOT NULL DEFAULT '' CHECK (risk_to_others IN ('met', 'not-met', 'not-applicable', '')),
    risk_evidence TEXT NOT NULL DEFAULT '',
    risk_imminence VARCHAR(15) NOT NULL DEFAULT '' CHECK (risk_imminence IN ('none', 'low', 'moderate', 'imminent', '')),
    least_restrictive_met VARCHAR(15) NOT NULL DEFAULT '' CHECK (least_restrictive_met IN ('met', 'not-met', 'not-applicable', '')),
    alternatives_considered TEXT NOT NULL DEFAULT '',
    appropriate_treatment_available VARCHAR(15) NOT NULL DEFAULT '' CHECK (appropriate_treatment_available IN ('met', 'not-met', 'not-applicable', '')),
    treatment_plan_summary TEXT NOT NULL DEFAULT '',

    -- Nearest relative / consultees
    nearest_relative_identified VARCHAR(5) NOT NULL DEFAULT '' CHECK (nearest_relative_identified IN ('yes', 'no', '')),
    nearest_relative_consulted VARCHAR(20) NOT NULL DEFAULT '' CHECK (nearest_relative_consulted IN ('yes', 'no', 'not-practicable', '')),
    nearest_relative_objection VARCHAR(10) NOT NULL DEFAULT '' CHECK (nearest_relative_objection IN ('yes', 'no', 'unknown', '')),
    consultation_record TEXT NOT NULL DEFAULT '',

    -- Recommendation and outcome
    recommended_section VARCHAR(10) NOT NULL DEFAULT '' CHECK (recommended_section IN ('2', '3', '4', '5-2', '5-4', '136', 'none', '')),
    outcome VARCHAR(25) NOT NULL DEFAULT '' CHECK (outcome IN ('detain-under-section', 'informal-admission', 'community', 'no-action', '')),
    bed_identified VARCHAR(5) NOT NULL DEFAULT '' CHECK (bed_identified IN ('yes', 'no', '')),
    conveyance VARCHAR(15) NOT NULL DEFAULT '' CHECK (conveyance IN ('ambulance', 'police', 'self', 'other', '')),
    clinical_legal_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX mental_health_act_assessment_patient_id_idx
    ON mental_health_act_assessment (patient_id);
CREATE INDEX mental_health_act_assessment_clinician_id_idx
    ON mental_health_act_assessment (clinician_id);

CREATE TRIGGER trigger_mental_health_act_assessment_updated_at
    BEFORE UPDATE ON mental_health_act_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mental_health_act_assessment IS
    'Main Mental Health Act assessment record: context and identification, assessing professionals, statutory criteria, nearest-relative consultation, and recommendation and outcome. Legal-completeness status, classification, fired rules, and flags live in child tables. Not a numeric score and not an automated detention decision.';
COMMENT ON COLUMN mental_health_act_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mental_health_act_assessment.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN mental_health_act_assessment.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN mental_health_act_assessment.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN mental_health_act_assessment.patient_id IS
    'Foreign key to the patient assessed (restrict delete).';
COMMENT ON COLUMN mental_health_act_assessment.clinician_id IS
    'Foreign key to the coordinating clinician / AMHP (restrict delete); optional.';
COMMENT ON COLUMN mental_health_act_assessment.assessed_at IS
    'Date and time of the assessment.';
COMMENT ON COLUMN mental_health_act_assessment.location IS
    'Assessment location: hospital-ward, emergency-department, place-of-safety, care-home, community, or other.';
COMMENT ON COLUMN mental_health_act_assessment.referral_source IS
    'Who requested the assessment.';
COMMENT ON COLUMN mental_health_act_assessment.reason_for_assessment IS
    'Presenting concern that prompted the assessment.';
COMMENT ON COLUMN mental_health_act_assessment.person_identifier IS
    'Local identifier for the person assessed.';
COMMENT ON COLUMN mental_health_act_assessment.age_band IS
    'Age band: child, adolescent, adult, or older-adult.';
COMMENT ON COLUMN mental_health_act_assessment.sex IS
    'Sex recorded for the person: female, male, intersex, or unknown.';
COMMENT ON COLUMN mental_health_act_assessment.first_language IS
    'First language; records interpreter need when not English.';
COMMENT ON COLUMN mental_health_act_assessment.amhp_name IS
    'Name of the Approved Mental Health Professional (AMHP).';
COMMENT ON COLUMN mental_health_act_assessment.amhp_approved IS
    'Whether AMHP approval is confirmed (yes/no).';
COMMENT ON COLUMN mental_health_act_assessment.doctor1_name IS
    'Name of the first medical practitioner.';
COMMENT ON COLUMN mental_health_act_assessment.doctor1_gmc_number IS
    'GMC registration number of the first medical practitioner.';
COMMENT ON COLUMN mental_health_act_assessment.doctor1_section12_approved IS
    'Whether the first doctor is Section 12(2) approved (yes/no).';
COMMENT ON COLUMN mental_health_act_assessment.doctor1_examined_at IS
    'Date and time the first doctor examined the patient.';
COMMENT ON COLUMN mental_health_act_assessment.doctor2_name IS
    'Name of the second medical practitioner (may be absent for s4/s5/s136).';
COMMENT ON COLUMN mental_health_act_assessment.doctor2_gmc_number IS
    'GMC registration number of the second medical practitioner.';
COMMENT ON COLUMN mental_health_act_assessment.doctor2_section12_approved IS
    'Whether the second doctor is Section 12(2) approved (yes/no).';
COMMENT ON COLUMN mental_health_act_assessment.doctor2_examined_at IS
    'Date and time the second doctor examined the patient.';
COMMENT ON COLUMN mental_health_act_assessment.prior_acquaintance IS
    'Whether at least one doctor was previously acquainted with the patient (yes/no).';
COMMENT ON COLUMN mental_health_act_assessment.mental_disorder_present IS
    'Criterion 1 — mental disorder of a nature or degree: met, not-met, or not-applicable.';
COMMENT ON COLUMN mental_health_act_assessment.mental_disorder_evidence IS
    'Supporting evidence for the mental-disorder criterion.';
COMMENT ON COLUMN mental_health_act_assessment.risk_to_own_health IS
    'Criterion 2 — risk to the patient''s own health: met, not-met, or not-applicable.';
COMMENT ON COLUMN mental_health_act_assessment.risk_to_own_safety IS
    'Criterion 2 — risk to the patient''s own safety: met, not-met, or not-applicable.';
COMMENT ON COLUMN mental_health_act_assessment.risk_to_others IS
    'Criterion 2 — risk to the protection of others: met, not-met, or not-applicable.';
COMMENT ON COLUMN mental_health_act_assessment.risk_evidence IS
    'Supporting evidence for the risk criteria.';
COMMENT ON COLUMN mental_health_act_assessment.risk_imminence IS
    'Imminence of risk: none, low, moderate, or imminent (drives urgency).';
COMMENT ON COLUMN mental_health_act_assessment.least_restrictive_met IS
    'Criterion 3 — no less restrictive alternative available: met, not-met, or not-applicable.';
COMMENT ON COLUMN mental_health_act_assessment.alternatives_considered IS
    'Informal, community, or Mental Capacity Act options considered.';
COMMENT ON COLUMN mental_health_act_assessment.appropriate_treatment_available IS
    'Criterion 4 — appropriate medical treatment available (required for s3): met, not-met, or not-applicable.';
COMMENT ON COLUMN mental_health_act_assessment.treatment_plan_summary IS
    'Proposed treatment and where it would be provided.';
COMMENT ON COLUMN mental_health_act_assessment.nearest_relative_identified IS
    'Whether the nearest relative has been identified (yes/no).';
COMMENT ON COLUMN mental_health_act_assessment.nearest_relative_consulted IS
    'Whether the nearest relative was consulted: yes, no, or not-practicable.';
COMMENT ON COLUMN mental_health_act_assessment.nearest_relative_objection IS
    'Whether the nearest relative objects to a s3 application: yes, no, or unknown.';
COMMENT ON COLUMN mental_health_act_assessment.consultation_record IS
    'AMHP consultation notes.';
COMMENT ON COLUMN mental_health_act_assessment.recommended_section IS
    'Recommended section: 2, 3, 4, 5-2, 5-4, 136, or none.';
COMMENT ON COLUMN mental_health_act_assessment.outcome IS
    'Assessment outcome: detain-under-section, informal-admission, community, or no-action.';
COMMENT ON COLUMN mental_health_act_assessment.bed_identified IS
    'Whether a receiving bed is confirmed (yes/no).';
COMMENT ON COLUMN mental_health_act_assessment.conveyance IS
    'Means of conveyance: ambulance, police, self, or other.';
COMMENT ON COLUMN mental_health_act_assessment.clinical_legal_note IS
    'Free-text clinical and legal note.';
