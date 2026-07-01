-- Cardiology response (consult reply) — the source-of-truth record.

CREATE TABLE cardiology_response (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Response identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    response_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (response_status IN ('preliminary', 'final', 'amended', 'cancelled', '')),
    consultation_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (consultation_type IN ('clinic-review', 'advice-and-guidance', 'telephone', 'inpatient-review', 'virtual', '')),
    assessed_date DATE,
    responded_date DATE,

    -- Clinical assessment
    clinical_summary VARCHAR(2000) NOT NULL DEFAULT '',
    examination_findings VARCHAR(1000) NOT NULL DEFAULT '',
    investigations_performed VARCHAR(1000) NOT NULL DEFAULT '',

    -- Structured findings
    ischaemia_or_cad BOOLEAN NOT NULL DEFAULT FALSE,
    significant_arrhythmia BOOLEAN NOT NULL DEFAULT FALSE,
    reduced_ejection_fraction BOOLEAN NOT NULL DEFAULT FALSE,
    significant_valve_disease BOOLEAN NOT NULL DEFAULT FALSE,
    structural_abnormality BOOLEAN NOT NULL DEFAULT FALSE,
    uncontrolled_hypertension BOOLEAN NOT NULL DEFAULT FALSE,
    non_cardiac_cause BOOLEAN NOT NULL DEFAULT FALSE,

    -- Diagnosis
    primary_diagnosis_category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (primary_diagnosis_category IN ('coronary-artery-disease', 'heart-failure', 'arrhythmia', 'valve-disease', 'hypertension', 'cardiomyopathy', 'non-cardiac', 'no-abnormality', 'other', '')),
    diagnosis_narrative VARCHAR(2000) NOT NULL DEFAULT '',

    -- Key measurement
    lv_ejection_fraction_percent NUMERIC(4,1)
        CHECK (lv_ejection_fraction_percent IS NULL OR lv_ejection_fraction_percent BETWEEN 0 AND 100),

    -- Management and follow-up
    management_plan VARCHAR(2000) NOT NULL DEFAULT '',
    medication_changes VARCHAR(1000) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result BOOLEAN NOT NULL DEFAULT FALSE,
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_cardiology_response_patient_id
    ON cardiology_response(patient_id);
CREATE INDEX index_cardiology_response_clinician_id
    ON cardiology_response(clinician_id);

CREATE TRIGGER trigger_cardiology_response_updated_at
    BEFORE UPDATE ON cardiology_response
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cardiology_response IS
    'Cardiology response (consult reply) authored by a cardiology clinician in answer to a cardiology referral. Captures the consultation type, clinical summary and examination, investigations performed, structured findings, the diagnosis, the key left-ventricular ejection fraction measurement, the management plan and follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN cardiology_response.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cardiology_response.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cardiology_response.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cardiology_response.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cardiology_response.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN cardiology_response.clinician_id IS
    'Foreign key to the responding cardiology clinician (author / signer).';
COMMENT ON COLUMN cardiology_response.originating_request_reference IS
    'Free-text reference linking this response back to the originating cardiology referral request.';
COMMENT ON COLUMN cardiology_response.response_status IS
    'Response lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN cardiology_response.consultation_type IS
    'Type of cardiology consultation: clinic-review, advice-and-guidance, telephone, inpatient-review, virtual.';
COMMENT ON COLUMN cardiology_response.assessed_date IS
    'Date the patient was assessed / reviewed.';
COMMENT ON COLUMN cardiology_response.responded_date IS
    'Date the response was authored / signed.';
COMMENT ON COLUMN cardiology_response.clinical_summary IS
    'Narrative clinical summary of the assessment.';
COMMENT ON COLUMN cardiology_response.examination_findings IS
    'Cardiovascular examination findings.';
COMMENT ON COLUMN cardiology_response.investigations_performed IS
    'Investigations performed or reviewed (e.g. ECG, echocardiogram, stress test) and their findings.';
COMMENT ON COLUMN cardiology_response.ischaemia_or_cad IS
    'Structured finding: ischaemia or coronary artery disease present.';
COMMENT ON COLUMN cardiology_response.significant_arrhythmia IS
    'Structured finding: significant arrhythmia present.';
COMMENT ON COLUMN cardiology_response.reduced_ejection_fraction IS
    'Structured finding: reduced left-ventricular ejection fraction.';
COMMENT ON COLUMN cardiology_response.significant_valve_disease IS
    'Structured finding: significant (moderate or severe) valve disease.';
COMMENT ON COLUMN cardiology_response.structural_abnormality IS
    'Structured finding: structural cardiac abnormality (e.g. cardiomyopathy, congenital).';
COMMENT ON COLUMN cardiology_response.uncontrolled_hypertension IS
    'Structured finding: uncontrolled hypertension.';
COMMENT ON COLUMN cardiology_response.non_cardiac_cause IS
    'Structured finding: a non-cardiac cause was identified or judged most likely.';
COMMENT ON COLUMN cardiology_response.primary_diagnosis_category IS
    'Primary diagnosis category: coronary-artery-disease, heart-failure, arrhythmia, valve-disease, hypertension, cardiomyopathy, non-cardiac, no-abnormality, other.';
COMMENT ON COLUMN cardiology_response.diagnosis_narrative IS
    'Narrative diagnosis answering the referral clinical question.';
COMMENT ON COLUMN cardiology_response.lv_ejection_fraction_percent IS
    'Left-ventricular ejection fraction as a percentage (0-100), the key prognostic measurement.';
COMMENT ON COLUMN cardiology_response.management_plan IS
    'Management plan including investigations arranged and treatment.';
COMMENT ON COLUMN cardiology_response.medication_changes IS
    'Medication changes recommended or made.';
COMMENT ON COLUMN cardiology_response.recommended_follow_up IS
    'Recommended follow-up, including who should action it and when.';
COMMENT ON COLUMN cardiology_response.critical_result IS
    'Whether a critical or unexpected significant cardiac result is present (e.g. critical arrhythmia, severe aortic stenosis, acute coronary syndrome).';
COMMENT ON COLUMN cardiology_response.critical_result_communicated IS
    'Whether the critical result was communicated directly to the referrer / responsible team.';
COMMENT ON COLUMN cardiology_response.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
