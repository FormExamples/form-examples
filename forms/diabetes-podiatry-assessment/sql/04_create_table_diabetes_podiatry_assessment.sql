-- Main diabetes-podiatry-assessment record: one diabetic foot risk-screening
-- episode aligned with NICE NG19 (Diabetic foot problems: prevention and
-- management). Captures assessment context, patient-wide risk factors, and a
-- right-foot and left-foot examination block (neuropathy status, pedal pulses,
-- deformity, callus, skin breakdown, active ulceration and its severity,
-- ulceration/amputation history, and a suspected-Charcot-foot marker). The
-- computed per-foot and overall risk classification, the audit trail of fired
-- rules, and the flagged issues live in dedicated child tables.

CREATE TABLE diabetes_podiatry_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Assessment context
    assessed_at DATE,
    assessment_setting VARCHAR(25) NOT NULL DEFAULT '' CHECK (assessment_setting IN ('annual-review', 'foot-protection-clinic', 'hospital-admission', 'pre-discharge', 'other', '')),

    -- Patient-wide risk factors (NICE NG19: apply regardless of current foot exam)
    diabetes_type VARCHAR(10) NOT NULL DEFAULT '' CHECK (diabetes_type IN ('type-1', 'type-2', 'other', 'unknown', '')),
    years_since_diagnosis NUMERIC(4,1),
    on_renal_replacement_therapy VARCHAR(5) NOT NULL DEFAULT '' CHECK (on_renal_replacement_therapy IN ('yes', 'no', '')),
    visual_acuity_impairment VARCHAR(5) NOT NULL DEFAULT '' CHECK (visual_acuity_impairment IN ('yes', 'no', '')),
    self_care_ability VARCHAR(15) NOT NULL DEFAULT '' CHECK (self_care_ability IN ('independent', 'partial', 'unable', '')),
    footwear_appropriate VARCHAR(5) NOT NULL DEFAULT '' CHECK (footwear_appropriate IN ('yes', 'no', '')),

    -- Right-foot examination
    right_neuropathy_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (right_neuropathy_status IN ('sensate', 'insensate', 'not-tested', '')),
    right_pulses_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (right_pulses_status IN ('normal', 'diminished', 'absent', 'not-tested', '')),
    right_deformity VARCHAR(5) NOT NULL DEFAULT '' CHECK (right_deformity IN ('yes', 'no', '')),
    right_callus VARCHAR(5) NOT NULL DEFAULT '' CHECK (right_callus IN ('yes', 'no', '')),
    right_skin_breakdown VARCHAR(5) NOT NULL DEFAULT '' CHECK (right_skin_breakdown IN ('yes', 'no', '')),
    right_active_ulcer VARCHAR(5) NOT NULL DEFAULT '' CHECK (right_active_ulcer IN ('yes', 'no', '')),
    right_ulcer_severity VARCHAR(20) NOT NULL DEFAULT '' CHECK (right_ulcer_severity IN ('superficial', 'deep', 'infected', 'critical-ischaemia', '')),
    right_previous_ulcer VARCHAR(5) NOT NULL DEFAULT '' CHECK (right_previous_ulcer IN ('yes', 'no', '')),
    right_previous_amputation VARCHAR(10) NOT NULL DEFAULT '' CHECK (right_previous_amputation IN ('none', 'minor', 'major', '')),
    right_suspected_charcot VARCHAR(5) NOT NULL DEFAULT '' CHECK (right_suspected_charcot IN ('yes', 'no', '')),

    -- Left-foot examination
    left_neuropathy_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (left_neuropathy_status IN ('sensate', 'insensate', 'not-tested', '')),
    left_pulses_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (left_pulses_status IN ('normal', 'diminished', 'absent', 'not-tested', '')),
    left_deformity VARCHAR(5) NOT NULL DEFAULT '' CHECK (left_deformity IN ('yes', 'no', '')),
    left_callus VARCHAR(5) NOT NULL DEFAULT '' CHECK (left_callus IN ('yes', 'no', '')),
    left_skin_breakdown VARCHAR(5) NOT NULL DEFAULT '' CHECK (left_skin_breakdown IN ('yes', 'no', '')),
    left_active_ulcer VARCHAR(5) NOT NULL DEFAULT '' CHECK (left_active_ulcer IN ('yes', 'no', '')),
    left_ulcer_severity VARCHAR(20) NOT NULL DEFAULT '' CHECK (left_ulcer_severity IN ('superficial', 'deep', 'infected', 'critical-ischaemia', '')),
    left_previous_ulcer VARCHAR(5) NOT NULL DEFAULT '' CHECK (left_previous_ulcer IN ('yes', 'no', '')),
    left_previous_amputation VARCHAR(10) NOT NULL DEFAULT '' CHECK (left_previous_amputation IN ('none', 'minor', 'major', '')),
    left_suspected_charcot VARCHAR(5) NOT NULL DEFAULT '' CHECK (left_suspected_charcot IN ('yes', 'no', '')),

    -- Free-text clinical context
    clinical_context TEXT NOT NULL DEFAULT ''
);

CREATE INDEX diabetes_podiatry_assessment_patient_id_idx
    ON diabetes_podiatry_assessment (patient_id);
CREATE INDEX diabetes_podiatry_assessment_clinician_id_idx
    ON diabetes_podiatry_assessment (clinician_id);

CREATE TRIGGER trigger_diabetes_podiatry_assessment_updated_at
    BEFORE UPDATE ON diabetes_podiatry_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE diabetes_podiatry_assessment IS
    'Main diabetes-podiatry-assessment record for one diabetic foot risk-screening episode: assessment context, patient-wide risk factors, and the right-foot and left-foot examination blocks. The per-foot and overall risk classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN diabetes_podiatry_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN diabetes_podiatry_assessment.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN diabetes_podiatry_assessment.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN diabetes_podiatry_assessment.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN diabetes_podiatry_assessment.patient_id IS
    'Foreign key to the patient this assessment documents (restrict delete).';
COMMENT ON COLUMN diabetes_podiatry_assessment.clinician_id IS
    'Foreign key to the assessing clinician (restrict delete); optional.';
COMMENT ON COLUMN diabetes_podiatry_assessment.assessed_at IS
    'Date the assessment was performed; drives the review-overdue comparison.';
COMMENT ON COLUMN diabetes_podiatry_assessment.assessment_setting IS
    'Setting: annual-review, foot-protection-clinic, hospital-admission, pre-discharge, or other.';
COMMENT ON COLUMN diabetes_podiatry_assessment.diabetes_type IS
    'Diabetes type: type-1, type-2, other, or unknown.';
COMMENT ON COLUMN diabetes_podiatry_assessment.years_since_diagnosis IS
    'Years since diabetes diagnosis.';
COMMENT ON COLUMN diabetes_podiatry_assessment.on_renal_replacement_therapy IS
    'Whether the patient is on renal replacement therapy (dialysis): yes or no; yes is an automatic high-risk factor per NICE NG19.';
COMMENT ON COLUMN diabetes_podiatry_assessment.visual_acuity_impairment IS
    'Whether the patient has a visual acuity impairment that limits foot self-inspection: yes or no.';
COMMENT ON COLUMN diabetes_podiatry_assessment.self_care_ability IS
    'Patient''s ability to self-inspect and self-care for their feet: independent, partial, or unable.';
COMMENT ON COLUMN diabetes_podiatry_assessment.footwear_appropriate IS
    'Whether current footwear is appropriate for the patient''s risk level: yes or no.';
COMMENT ON COLUMN diabetes_podiatry_assessment.right_neuropathy_status IS
    'Right-foot sensory neuropathy test result (e.g. 10g monofilament): sensate, insensate, or not-tested.';
COMMENT ON COLUMN diabetes_podiatry_assessment.right_pulses_status IS
    'Right-foot pedal pulses (dorsalis pedis / posterior tibial): normal, diminished, absent, or not-tested.';
COMMENT ON COLUMN diabetes_podiatry_assessment.right_deformity IS
    'Right-foot structural deformity present (e.g. claw toes, bunion, prominent metatarsal heads): yes or no.';
COMMENT ON COLUMN diabetes_podiatry_assessment.right_callus IS
    'Right-foot callus present: yes or no.';
COMMENT ON COLUMN diabetes_podiatry_assessment.right_skin_breakdown IS
    'Right-foot skin breakdown / fissure present (short of an active ulcer): yes or no.';
COMMENT ON COLUMN diabetes_podiatry_assessment.right_active_ulcer IS
    'Right-foot active ulceration present: yes or no.';
COMMENT ON COLUMN diabetes_podiatry_assessment.right_ulcer_severity IS
    'Right-foot active ulcer severity when present: superficial, deep, infected, or critical-ischaemia.';
COMMENT ON COLUMN diabetes_podiatry_assessment.right_previous_ulcer IS
    'History of previous right-foot ulceration: yes or no; yes is an automatic high-risk factor.';
COMMENT ON COLUMN diabetes_podiatry_assessment.right_previous_amputation IS
    'History of previous right-foot amputation: none, minor (toe / partial foot), or major (below / above knee).';
COMMENT ON COLUMN diabetes_podiatry_assessment.right_suspected_charcot IS
    'Suspected acute Charcot foot on the right (unexplained hot, red, swollen foot, with or without deformity or pain): yes or no; yes requires urgent same-day / next-working-day referral.';
COMMENT ON COLUMN diabetes_podiatry_assessment.left_neuropathy_status IS
    'Left-foot sensory neuropathy test result (e.g. 10g monofilament): sensate, insensate, or not-tested.';
COMMENT ON COLUMN diabetes_podiatry_assessment.left_pulses_status IS
    'Left-foot pedal pulses (dorsalis pedis / posterior tibial): normal, diminished, absent, or not-tested.';
COMMENT ON COLUMN diabetes_podiatry_assessment.left_deformity IS
    'Left-foot structural deformity present (e.g. claw toes, bunion, prominent metatarsal heads): yes or no.';
COMMENT ON COLUMN diabetes_podiatry_assessment.left_callus IS
    'Left-foot callus present: yes or no.';
COMMENT ON COLUMN diabetes_podiatry_assessment.left_skin_breakdown IS
    'Left-foot skin breakdown / fissure present (short of an active ulcer): yes or no.';
COMMENT ON COLUMN diabetes_podiatry_assessment.left_active_ulcer IS
    'Left-foot active ulceration present: yes or no.';
COMMENT ON COLUMN diabetes_podiatry_assessment.left_ulcer_severity IS
    'Left-foot active ulcer severity when present: superficial, deep, infected, or critical-ischaemia.';
COMMENT ON COLUMN diabetes_podiatry_assessment.left_previous_ulcer IS
    'History of previous left-foot ulceration: yes or no; yes is an automatic high-risk factor.';
COMMENT ON COLUMN diabetes_podiatry_assessment.left_previous_amputation IS
    'History of previous left-foot amputation: none, minor (toe / partial foot), or major (below / above knee).';
COMMENT ON COLUMN diabetes_podiatry_assessment.left_suspected_charcot IS
    'Suspected acute Charcot foot on the left (unexplained hot, red, swollen foot, with or without deformity or pain): yes or no; yes requires urgent same-day / next-working-day referral.';
COMMENT ON COLUMN diabetes_podiatry_assessment.clinical_context IS
    'Optional free-text clinical context shown in the summary.';
