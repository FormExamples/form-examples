-- Main ward-round-note record: one daily inpatient review documented at
-- the bedside during a ward round. Captures the review header and patient
-- identification plus the ten review components (overnight events, current
-- problem list and progress, examination and latest observations (NEWS2),
-- investigations reviewed, VTE assessment, medication changes, plan and
-- jobs, escalation / ceiling-of-care status, and estimated discharge). The
-- completeness grade, the audit trail of fired grading rules, and the
-- safety flags live in dedicated child tables. Presence of a component is
-- detected by a non-empty field or an explicit negative flag, not by
-- semantic analysis.

CREATE TABLE ward_round_note (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Review header and identification
    clinician_name TEXT NOT NULL DEFAULT '',
    clinician_grade VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_grade IN ('fy1', 'fy2', 'core-trainee', 'specialty-registrar', 'acp', 'physician-associate', 'consultant', '')),
    reviewed_at TIMESTAMPTZ,
    ward TEXT NOT NULL DEFAULT '',
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    admission_date DATE,
    primary_diagnosis TEXT NOT NULL DEFAULT '',

    -- Component 2 — overnight events
    overnight_events TEXT NOT NULL DEFAULT '',
    no_overnight_events VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_overnight_events IN ('yes', 'no', '')),

    -- Component 3 — current issues + progress
    problem_list TEXT NOT NULL DEFAULT '',

    -- Component 4 — examination + latest observations (NEWS2)
    examination_summary TEXT NOT NULL DEFAULT '',
    news2_total INTEGER,
    news2_single_param_three VARCHAR(5) NOT NULL DEFAULT '' CHECK (news2_single_param_three IN ('yes', 'no', '')),
    observation_trend VARCHAR(20) NOT NULL DEFAULT '' CHECK (observation_trend IN ('improving', 'stable', 'deteriorating', '')),

    -- Component 5 — investigations reviewed
    investigations_reviewed TEXT NOT NULL DEFAULT '',
    no_investigations_outstanding VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_investigations_outstanding IN ('yes', 'no', '')),
    abnormal_result_flagged VARCHAR(5) NOT NULL DEFAULT '' CHECK (abnormal_result_flagged IN ('yes', 'no', '')),
    abnormal_result_actioned VARCHAR(5) NOT NULL DEFAULT '' CHECK (abnormal_result_actioned IN ('yes', 'no', '')),

    -- Component 6 — VTE assessment
    vte_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (vte_status IN ('assessed', 'not-required', 'not-done', '')),
    vte_prophylaxis_in_place VARCHAR(5) NOT NULL DEFAULT '' CHECK (vte_prophylaxis_in_place IN ('yes', 'no', '')),

    -- Component 7 — medication changes
    medication_changes TEXT NOT NULL DEFAULT '',
    no_medication_changes VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_medication_changes IN ('yes', 'no', '')),

    -- Component 8 — plan / jobs for the day
    plan_and_jobs TEXT NOT NULL DEFAULT '',

    -- Component 9 — escalation / ceiling-of-care status
    escalation_status VARCHAR(30) NOT NULL DEFAULT '' CHECK (escalation_status IN ('for-full-escalation', 'ward-level-ceiling', 'dnacpr', 'not-recorded', '')),
    senior_review_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (senior_review_present IN ('yes', 'no', '')),

    -- Component 10 — estimated discharge date
    estimated_discharge_date DATE,
    discharge_not_estimable VARCHAR(5) NOT NULL DEFAULT '' CHECK (discharge_not_estimable IN ('yes', 'no', '')),

    -- Free-text narrative
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX ward_round_note_patient_id_idx
    ON ward_round_note (patient_id);
CREATE INDEX ward_round_note_clinician_id_idx
    ON ward_round_note (clinician_id);

CREATE TRIGGER trigger_ward_round_note_updated_at
    BEFORE UPDATE ON ward_round_note
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ward_round_note IS
    'Main ward-round-note record for one daily inpatient review: review header, patient and clinician identification, and the ten review components (overnight events, problem list, examination and NEWS2, investigations, VTE, medication, plan, escalation, estimated discharge) as free text and enum flags. Completeness grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN ward_round_note.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ward_round_note.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ward_round_note.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ward_round_note.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ward_round_note.patient_id IS
    'Foreign key to the patient this review documents (restrict delete).';
COMMENT ON COLUMN ward_round_note.clinician_id IS
    'Foreign key to the reviewing clinician (restrict delete); optional.';
COMMENT ON COLUMN ward_round_note.clinician_name IS
    'Name of the reviewing clinician (required component: header).';
COMMENT ON COLUMN ward_round_note.clinician_grade IS
    'Grade of the reviewing clinician: fy1, fy2, core-trainee, specialty-registrar, acp, physician-associate, or consultant (required component: header).';
COMMENT ON COLUMN ward_round_note.reviewed_at IS
    'Date and time of the review (required component: header).';
COMMENT ON COLUMN ward_round_note.ward IS
    'Ward or location where the review took place.';
COMMENT ON COLUMN ward_round_note.patient_identifier IS
    'Local patient identifier as recorded on the entry.';
COMMENT ON COLUMN ward_round_note.admission_date IS
    'Date of admission.';
COMMENT ON COLUMN ward_round_note.primary_diagnosis IS
    'Reason for admission or working diagnosis.';
COMMENT ON COLUMN ward_round_note.overnight_events IS
    'Component 2: overnight events since the previous review (recommended component).';
COMMENT ON COLUMN ward_round_note.no_overnight_events IS
    'Explicit "no overnight events" flag (yes/no); yes documents component 2 as a deliberate negative.';
COMMENT ON COLUMN ward_round_note.problem_list IS
    'Component 3: current issues, problem list, and progress (required component: problems).';
COMMENT ON COLUMN ward_round_note.examination_summary IS
    'Component 4: examination summary (required component: examination, with news2_total).';
COMMENT ON COLUMN ward_round_note.news2_total IS
    'Component 4: latest NEWS2 total (0..20+); NULL when unrecorded.';
COMMENT ON COLUMN ward_round_note.news2_single_param_three IS
    'Whether any single NEWS2 parameter scores 3 (yes/no); drives the deteriorating-NEWS2 flag.';
COMMENT ON COLUMN ward_round_note.observation_trend IS
    'Component 4: observation trend: improving, stable, or deteriorating.';
COMMENT ON COLUMN ward_round_note.investigations_reviewed IS
    'Component 5: investigations and results reviewed (required component: investigations).';
COMMENT ON COLUMN ward_round_note.no_investigations_outstanding IS
    'Explicit "none outstanding" flag (yes/no); yes documents component 5 as a deliberate negative.';
COMMENT ON COLUMN ward_round_note.abnormal_result_flagged IS
    'Whether an abnormal or critical result is present (yes/no); drives the abnormal-results-not-actioned flag.';
COMMENT ON COLUMN ward_round_note.abnormal_result_actioned IS
    'Whether an action was recorded for the abnormal result (yes/no).';
COMMENT ON COLUMN ward_round_note.vte_status IS
    'Component 6: VTE assessment status: assessed, not-required, or not-done (required component: vte).';
COMMENT ON COLUMN ward_round_note.vte_prophylaxis_in_place IS
    'Whether VTE prophylaxis is in place (yes/no).';
COMMENT ON COLUMN ward_round_note.medication_changes IS
    'Component 7: medication changes made on the review (required component: medication).';
COMMENT ON COLUMN ward_round_note.no_medication_changes IS
    'Explicit "no medication changes" flag (yes/no); yes documents component 7 as a deliberate negative.';
COMMENT ON COLUMN ward_round_note.plan_and_jobs IS
    'Component 8: plan and jobs for the day (required component: plan).';
COMMENT ON COLUMN ward_round_note.escalation_status IS
    'Component 9: escalation / ceiling-of-care status: for-full-escalation, ward-level-ceiling, dnacpr, or not-recorded (required component: escalation).';
COMMENT ON COLUMN ward_round_note.senior_review_present IS
    'Whether a consultant or senior grade is named on the entry (yes/no); drives the no-senior-review flag.';
COMMENT ON COLUMN ward_round_note.estimated_discharge_date IS
    'Component 10: estimated date of discharge; NULL when not set (recommended component).';
COMMENT ON COLUMN ward_round_note.discharge_not_estimable IS
    'Explicit "not yet estimable" flag (yes/no); yes documents component 10 as a deliberate negative.';
COMMENT ON COLUMN ward_round_note.clinical_note IS
    'Optional free-text summary note shown in the summary.';
