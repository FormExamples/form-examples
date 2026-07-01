-- Parent structured medication review (SMR) header. Records the reviewing
-- context and clinician, patient identification and frailty context, the
-- patient's presenting problems and priorities, the monitoring due, and the
-- shared decisions and agreed follow-up plan. Every reviewed medicine is held
-- in the child table structured_medication_review_medicine, which cascades
-- from this parent. Derived scoring lives in structured_medication_review_grade.

CREATE TABLE structured_medication_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    clinician_name TEXT NOT NULL DEFAULT '',
    clinician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_role IN ('clinical-pharmacist', 'gp', 'pharmacy-technician', 'other', '')),
    reviewed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('gp-practice', 'pcn', 'care-home', 'community-pharmacy', 'patient-home', '')),
    consultation_mode VARCHAR(15) NOT NULL DEFAULT '' CHECK (consultation_mode IN ('face-to-face', 'telephone', 'video', 'home-visit', '')),

    patient_identifier TEXT NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-64', '65-74', '75-84', '85-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    frailty_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (frailty_status IN ('fit', 'mild', 'moderate', 'severe', '')),
    lives_in_care_home VARCHAR(5) NOT NULL DEFAULT '' CHECK (lives_in_care_home IN ('yes', 'no', '')),
    long_term_conditions TEXT NOT NULL DEFAULT '',

    presenting_problems TEXT NOT NULL DEFAULT '',
    patient_reported_issues TEXT NOT NULL DEFAULT '',
    what_matters_to_patient TEXT NOT NULL DEFAULT '',
    shared_decisions TEXT NOT NULL DEFAULT '',
    monitoring_due TEXT NOT NULL DEFAULT '',
    overdue_monitoring_count INTEGER,
    follow_up_plan TEXT NOT NULL DEFAULT '',
    follow_up_date DATE,
    review_completed VARCHAR(5) NOT NULL DEFAULT '' CHECK (review_completed IN ('yes', 'no', ''))
);

CREATE INDEX structured_medication_review_patient_id_idx
    ON structured_medication_review (patient_id);
CREATE INDEX structured_medication_review_clinician_id_idx
    ON structured_medication_review (clinician_id);

CREATE TRIGGER trigger_structured_medication_review_updated_at
    BEFORE UPDATE ON structured_medication_review
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE structured_medication_review IS
    'Parent structured medication review header: reviewing context, patient identification and frailty context, presenting problems and priorities, monitoring due, and shared decisions and follow-up plan.';
COMMENT ON COLUMN structured_medication_review.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN structured_medication_review.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN structured_medication_review.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN structured_medication_review.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN structured_medication_review.patient_id IS
    'Foreign key to the patient this review is for (restricted delete).';
COMMENT ON COLUMN structured_medication_review.clinician_id IS
    'Foreign key to the reviewing clinician (restricted delete); optional.';
COMMENT ON COLUMN structured_medication_review.clinician_name IS
    'Name of the reviewing clinician as entered on the review.';
COMMENT ON COLUMN structured_medication_review.clinician_role IS
    'Role of the reviewing clinician: clinical-pharmacist, gp, pharmacy-technician, or other.';
COMMENT ON COLUMN structured_medication_review.reviewed_at IS
    'Date and time the review was carried out.';
COMMENT ON COLUMN structured_medication_review.care_setting IS
    'Care setting: gp-practice, pcn, care-home, community-pharmacy, or patient-home.';
COMMENT ON COLUMN structured_medication_review.consultation_mode IS
    'Consultation mode: face-to-face, telephone, video, or home-visit.';
COMMENT ON COLUMN structured_medication_review.patient_identifier IS
    'Local patient identifier as entered on the review.';
COMMENT ON COLUMN structured_medication_review.age_band IS
    'Patient adult age band: 18-39, 40-64, 65-74, 75-84, or 85-plus.';
COMMENT ON COLUMN structured_medication_review.sex IS
    'Patient sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN structured_medication_review.frailty_status IS
    'Patient frailty status: fit, mild, moderate, or severe.';
COMMENT ON COLUMN structured_medication_review.lives_in_care_home IS
    'Whether the patient lives in a care home: yes or no.';
COMMENT ON COLUMN structured_medication_review.long_term_conditions IS
    'Comma-separated list of the patient long-term conditions.';
COMMENT ON COLUMN structured_medication_review.presenting_problems IS
    'Reasons for the review / presenting medication problems.';
COMMENT ON COLUMN structured_medication_review.patient_reported_issues IS
    'Side effects and difficulties reported by the patient.';
COMMENT ON COLUMN structured_medication_review.what_matters_to_patient IS
    'The patient priorities and what matters most to them.';
COMMENT ON COLUMN structured_medication_review.shared_decisions IS
    'Decisions agreed together with the patient.';
COMMENT ON COLUMN structured_medication_review.monitoring_due IS
    'Tests / bloods due or outstanding for the patient medicines.';
COMMENT ON COLUMN structured_medication_review.overdue_monitoring_count IS
    'Count of monitoring items that are overdue; null when unanswered.';
COMMENT ON COLUMN structured_medication_review.follow_up_plan IS
    'Agreed follow-up plan and actions.';
COMMENT ON COLUMN structured_medication_review.follow_up_date IS
    'Date the next review is due.';
COMMENT ON COLUMN structured_medication_review.review_completed IS
    'Whether the clinician marked the review as completed: yes or no.';
