-- The Return to Work assessment record. Captures all 12-step wizard
-- fields: absence history, clinical assessment, fitness statement,
-- phased-return plan, follow-up plan, and sign-off.

CREATE TABLE return_to_work (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL
        REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL
        REFERENCES clinician(id) ON DELETE CASCADE,
    employer_id UUID
        REFERENCES employer(id) ON DELETE SET NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'cancelled', 'superseded')),
    statement_kind VARCHAR(30) NOT NULL DEFAULT 'fit-note'
        CHECK (statement_kind IN ('fit-note', 'medical-clearance-letter', 'specialist-report', '')),

    -- Step 1: Clinician identification (date/time on the assessment itself)
    assessment_date DATE,
    assessment_time TIME,

    -- Step 4: Absence history
    absence_first_day DATE,
    absence_total_calendar_days INTEGER CHECK (absence_total_calendar_days IS NULL OR absence_total_calendar_days >= 0),
    prior_med3_reference VARCHAR(50) NOT NULL DEFAULT '',
    prior_self_certification_reference VARCHAR(50) NOT NULL DEFAULT '',

    -- Step 5: Reason for absence
    primary_diagnosis_text VARCHAR(500) NOT NULL DEFAULT '',
    primary_diagnosis_snomed VARCHAR(20) NOT NULL DEFAULT '',
    primary_diagnosis_icd10 VARCHAR(10) NOT NULL DEFAULT '',
    comorbid_conditions TEXT NOT NULL DEFAULT '',
    mechanism VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (mechanism IN ('illness', 'injury', 'surgery', 'mental-health', 'pregnancy-related', 'cancer-treatment', 'other', '')),
    workplace_cause VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (workplace_cause IN ('yes', 'no', '')),
    riddor_reference VARCHAR(50) NOT NULL DEFAULT '',

    -- Step 6: Current treatment
    current_medications TEXT NOT NULL DEFAULT '',
    ongoing_therapy TEXT NOT NULL DEFAULT '',
    last_consultation_date DATE,
    anticipated_recovery_trajectory VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (anticipated_recovery_trajectory IN (
            'full-recovery-imminent', 'full-recovery-expected', 'partial-recovery-expected',
            'chronic-managed', 'progressive', 'palliative', '')),
    specialist_followup_required VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (specialist_followup_required IN ('yes', 'no', '')),

    -- Step 7: Functional assessment
    mobility VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (mobility IN ('normal', 'reduced', 'severely-limited', 'wheelchair', '')),
    manual_handling_capacity_kg NUMERIC(4,1),
    cognition VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (cognition IN ('normal', 'mildly-impaired', 'moderately-impaired', 'severely-impaired', '')),
    mood VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (mood IN ('stable', 'low', 'anxious', 'agitated', 'crisis', '')),
    sleep VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (sleep IN ('normal', 'disturbed', 'severely-disturbed', '')),
    pain_score_0_10 INTEGER CHECK (pain_score_0_10 IS NULL OR pain_score_0_10 BETWEEN 0 AND 10),
    driving_capacity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (driving_capacity IN ('fit-to-drive', 'restricted', 'not-fit-to-drive', '')),
    standing_tolerance_minutes INTEGER,
    sitting_tolerance_minutes INTEGER,
    screen_tolerance_minutes INTEGER,
    adl_independence VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (adl_independence IN ('independent', 'minor-help', 'major-help', 'dependent', '')),

    -- Step 8: Fitness statement
    fitness_statement_computed VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (fitness_statement_computed IN ('fit', 'may-be-fit', 'not-fit', '')),
    fitness_statement_final VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (fitness_statement_final IN ('fit', 'may-be-fit', 'not-fit', '')),
    clinician_override VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (clinician_override IN ('yes', 'no', '')),
    clinician_override_reason TEXT NOT NULL DEFAULT '',
    clinician_confidence VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (clinician_confidence IN ('high', 'medium', 'low', '')),
    valid_from DATE,
    valid_until DATE,
    validity_weeks INTEGER CHECK (validity_weeks IS NULL OR validity_weeks BETWEEN 0 AND 52),
    reassessment_required VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (reassessment_required IN ('yes', 'no', '')),

    -- Step 9: Phased return plan
    phased_return_applicable VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (phased_return_applicable IN ('yes', 'no', '')),
    phased_return_template VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (phased_return_template IN ('2-week', '4-week', '8-week', '12-week', 'custom', '')),
    phased_return_target_date DATE,
    phased_return_schedule_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    phased_return_support_contact TEXT NOT NULL DEFAULT '',

    -- Step 10: Workplace adjustments and restrictions
    -- (individual restriction rows live in return_to_work_restriction)
    workstation_review_required VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (workstation_review_required IN ('yes', 'no', '')),
    additional_adjustments_text TEXT NOT NULL DEFAULT '',

    -- Step 11: Follow-up plan
    review_location VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (review_location IN ('gp', 'occupational-health', 'specialist', 'employer-oh', 'none', '')),
    review_date DATE,
    occupational_health_referral_made VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (occupational_health_referral_made IN ('yes', 'no', '')),
    dvla_notification_required VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (dvla_notification_required IN ('yes', 'no', '')),
    employer_oh_notified VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (employer_oh_notified IN ('yes', 'no', '')),
    return_to_work_meeting_scheduled VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (return_to_work_meeting_scheduled IN ('yes', 'no', '')),
    maternity_certificate_reference VARCHAR(50) NOT NULL DEFAULT '',

    -- Step 12: Sign-off
    final_notes TEXT NOT NULL DEFAULT '',
    signature_svg TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_return_to_work_updated_at
    BEFORE UPDATE ON return_to_work
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE return_to_work IS
    'Clinician-issued Statement of Fitness for Work (Med 3 / fit note) authorising an employee return to work after illness, injury, or extended absence.';
COMMENT ON COLUMN return_to_work.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN return_to_work.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN return_to_work.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN return_to_work.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN return_to_work.patient_id IS
    'Foreign key to the patient (employee) being assessed.';
COMMENT ON COLUMN return_to_work.clinician_id IS
    'Foreign key to the clinician issuing the statement.';
COMMENT ON COLUMN return_to_work.employer_id IS
    'Foreign key to the employer receiving the statement.';
COMMENT ON COLUMN return_to_work.status IS
    'Lifecycle status: draft, submitted, reviewed, cancelled, or superseded.';
COMMENT ON COLUMN return_to_work.statement_kind IS
    'Statement output style: fit-note (UK Med 3), medical-clearance-letter, or specialist-report.';
COMMENT ON COLUMN return_to_work.assessment_date IS
    'Date the assessment was performed.';
COMMENT ON COLUMN return_to_work.assessment_time IS
    'Time the assessment was performed.';
COMMENT ON COLUMN return_to_work.absence_first_day IS
    'First calendar day of the current absence.';
COMMENT ON COLUMN return_to_work.absence_total_calendar_days IS
    'Total calendar days absent as of the assessment.';
COMMENT ON COLUMN return_to_work.prior_med3_reference IS
    'Reference identifier of an earlier Med 3 if this is a continuation.';
COMMENT ON COLUMN return_to_work.prior_self_certification_reference IS
    'Reference identifier of an earlier SC2 self-certification if one was filed.';
COMMENT ON COLUMN return_to_work.primary_diagnosis_text IS
    'Free-text primary diagnosis as it will appear on the fit note.';
COMMENT ON COLUMN return_to_work.primary_diagnosis_snomed IS
    'SNOMED CT concept ID for the primary diagnosis.';
COMMENT ON COLUMN return_to_work.primary_diagnosis_icd10 IS
    'ICD-10 code for the primary diagnosis.';
COMMENT ON COLUMN return_to_work.comorbid_conditions IS
    'Free-text list of comorbid conditions relevant to the return-to-work decision.';
COMMENT ON COLUMN return_to_work.mechanism IS
    'Mechanism of absence: illness, injury, surgery, mental-health, pregnancy-related, cancer-treatment, or other.';
COMMENT ON COLUMN return_to_work.workplace_cause IS
    'Whether the absence has a workplace cause (triggers RIDDOR check).';
COMMENT ON COLUMN return_to_work.riddor_reference IS
    'RIDDOR report reference if one has been filed by the employer.';
COMMENT ON COLUMN return_to_work.current_medications IS
    'Current medications relevant to the return-to-work assessment.';
COMMENT ON COLUMN return_to_work.ongoing_therapy IS
    'Ongoing non-pharmacological therapy (physiotherapy, counselling, specialist follow-up).';
COMMENT ON COLUMN return_to_work.last_consultation_date IS
    'Date of the most recent consultation before this assessment.';
COMMENT ON COLUMN return_to_work.anticipated_recovery_trajectory IS
    'Anticipated trajectory: full-recovery-imminent, full-recovery-expected, partial-recovery-expected, chronic-managed, progressive, or palliative.';
COMMENT ON COLUMN return_to_work.specialist_followup_required IS
    'Whether specialist follow-up is required before the next review.';
COMMENT ON COLUMN return_to_work.mobility IS
    'Mobility: normal, reduced, severely-limited, or wheelchair.';
COMMENT ON COLUMN return_to_work.manual_handling_capacity_kg IS
    'Maximum safe manual-handling load in kilograms.';
COMMENT ON COLUMN return_to_work.cognition IS
    'Cognition: normal, mildly-impaired, moderately-impaired, or severely-impaired.';
COMMENT ON COLUMN return_to_work.mood IS
    'Mood: stable, low, anxious, agitated, or crisis.';
COMMENT ON COLUMN return_to_work.sleep IS
    'Sleep: normal, disturbed, or severely-disturbed.';
COMMENT ON COLUMN return_to_work.pain_score_0_10 IS
    'Patient-reported pain on a 0-10 numeric rating scale.';
COMMENT ON COLUMN return_to_work.driving_capacity IS
    'Driving capacity: fit-to-drive, restricted, or not-fit-to-drive.';
COMMENT ON COLUMN return_to_work.standing_tolerance_minutes IS
    'Continuous standing tolerance in minutes.';
COMMENT ON COLUMN return_to_work.sitting_tolerance_minutes IS
    'Continuous sitting tolerance in minutes.';
COMMENT ON COLUMN return_to_work.screen_tolerance_minutes IS
    'Continuous screen-use tolerance in minutes.';
COMMENT ON COLUMN return_to_work.adl_independence IS
    'Independence in activities of daily living: independent, minor-help, major-help, or dependent.';
COMMENT ON COLUMN return_to_work.fitness_statement_computed IS
    'Engine-computed fitness statement before clinician override.';
COMMENT ON COLUMN return_to_work.fitness_statement_final IS
    'Final fitness statement after any clinician override.';
COMMENT ON COLUMN return_to_work.clinician_override IS
    'Whether the clinician overrode the computed fitness statement.';
COMMENT ON COLUMN return_to_work.clinician_override_reason IS
    'Documented reason for any clinician override.';
COMMENT ON COLUMN return_to_work.clinician_confidence IS
    'Clinician confidence in the statement: high, medium, or low.';
COMMENT ON COLUMN return_to_work.valid_from IS
    'First date the statement is valid.';
COMMENT ON COLUMN return_to_work.valid_until IS
    'Last date the statement is valid.';
COMMENT ON COLUMN return_to_work.validity_weeks IS
    'Number of weeks the statement is valid (alternative expression of valid_until).';
COMMENT ON COLUMN return_to_work.reassessment_required IS
    'Whether the patient must be reassessed at expiry.';
COMMENT ON COLUMN return_to_work.phased_return_applicable IS
    'Whether a phased return is recommended.';
COMMENT ON COLUMN return_to_work.phased_return_template IS
    'Selected phased-return template: 2-week, 4-week, 8-week, 12-week, or custom.';
COMMENT ON COLUMN return_to_work.phased_return_target_date IS
    'Target date for full-hours resumption.';
COMMENT ON COLUMN return_to_work.phased_return_schedule_json IS
    'Ordered list of {week, hoursPerWeek, daysPerWeek, notes} entries.';
COMMENT ON COLUMN return_to_work.phased_return_support_contact IS
    'Workplace support contact during the phased return.';
COMMENT ON COLUMN return_to_work.workstation_review_required IS
    'Whether a workstation / ergonomic review is required before return.';
COMMENT ON COLUMN return_to_work.additional_adjustments_text IS
    'Free-text additional workplace adjustments not captured in the enumerated restriction list.';
COMMENT ON COLUMN return_to_work.review_location IS
    'Location of the next review: gp, occupational-health, specialist, employer-oh, or none.';
COMMENT ON COLUMN return_to_work.review_date IS
    'Scheduled date of the next review.';
COMMENT ON COLUMN return_to_work.occupational_health_referral_made IS
    'Whether an occupational-health referral has been made.';
COMMENT ON COLUMN return_to_work.dvla_notification_required IS
    'Whether the patient must notify the DVLA of the condition.';
COMMENT ON COLUMN return_to_work.employer_oh_notified IS
    'Whether the employer occupational-health team has been notified.';
COMMENT ON COLUMN return_to_work.return_to_work_meeting_scheduled IS
    'Whether a return-to-work meeting has been scheduled with the employer.';
COMMENT ON COLUMN return_to_work.maternity_certificate_reference IS
    'MAT B1 reference if the absence is pregnancy-related.';
COMMENT ON COLUMN return_to_work.final_notes IS
    'Free-text final notes from the clinician.';
COMMENT ON COLUMN return_to_work.signature_svg IS
    'Clinician electronic signature captured as an SVG path.';
COMMENT ON COLUMN return_to_work.signed_at IS
    'Timestamp when the clinician signed off the statement.';

CREATE INDEX return_to_work_patient_id_index ON return_to_work (patient_id);
CREATE INDEX return_to_work_clinician_id_index ON return_to_work (clinician_id);
CREATE INDEX return_to_work_employer_id_index ON return_to_work (employer_id);
CREATE INDEX return_to_work_status_index ON return_to_work (status);
CREATE INDEX return_to_work_valid_until_index ON return_to_work (valid_until);
