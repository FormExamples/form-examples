-- Nerve conduction study / EMG (electrodiagnostic) result (report) — the source-of-truth record.

CREATE TABLE nerve_conduction_study_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'final', 'amended', 'cancelled', '')),
    performed_date DATE,
    reported_date DATE,

    -- Examination
    study_type VARCHAR(35) NOT NULL DEFAULT ''
        CHECK (study_type IN ('nerve-conduction', 'emg', 'nerve-conduction-and-emg', 'repetitive-stimulation', 'other', '')),
    region VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (region IN ('upper-limb', 'lower-limb', 'all-limbs', 'cranial', 'generalised', 'other', '')),
    laterality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', 'not-applicable', '')),
    study_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (study_adequacy IN ('adequate', 'limited', 'non-diagnostic', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Findings
    nerve_conduction_findings VARCHAR(2000) NOT NULL DEFAULT '',
    emg_findings VARCHAR(2000) NOT NULL DEFAULT '',
    carpal_tunnel_syndrome BOOLEAN NOT NULL DEFAULT FALSE,
    peripheral_neuropathy BOOLEAN NOT NULL DEFAULT FALSE,
    radiculopathy BOOLEAN NOT NULL DEFAULT FALSE,
    motor_neurone_disease_features BOOLEAN NOT NULL DEFAULT FALSE,
    myopathy BOOLEAN NOT NULL DEFAULT FALSE,
    neuromuscular_junction_disorder BOOLEAN NOT NULL DEFAULT FALSE,
    normal_study BOOLEAN NOT NULL DEFAULT FALSE,

    -- Characterisation
    severity VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (severity IN ('mild', 'moderate', 'severe', 'not-applicable', '')),
    pattern VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (pattern IN ('demyelinating', 'axonal', 'mixed', 'not-applicable', '')),

    -- Impression and follow-up
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(100) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_nerve_conduction_study_test_result_patient_id
    ON nerve_conduction_study_test_result(patient_id);
CREATE INDEX index_nerve_conduction_study_test_result_clinician_id
    ON nerve_conduction_study_test_result(clinician_id);

CREATE TRIGGER trigger_nerve_conduction_study_test_result_updated_at
    BEFORE UPDATE ON nerve_conduction_study_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nerve_conduction_study_test_result IS
    'Nerve conduction study / EMG (electrodiagnostic) result (report). Captures the performed study type and region, clinical history, the nerve-conduction and needle-EMG findings, structured electrodiagnostic conclusions, severity and pattern characterisation, the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN nerve_conduction_study_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nerve_conduction_study_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN nerve_conduction_study_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN nerve_conduction_study_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN nerve_conduction_study_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN nerve_conduction_study_test_result.clinician_id IS
    'Foreign key to the reporting clinician (neurologist / clinical neurophysiologist).';
COMMENT ON COLUMN nerve_conduction_study_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating nerve conduction study / EMG request (referral).';
COMMENT ON COLUMN nerve_conduction_study_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN nerve_conduction_study_test_result.performed_date IS
    'Date the electrodiagnostic study was performed.';
COMMENT ON COLUMN nerve_conduction_study_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN nerve_conduction_study_test_result.study_type IS
    'Performed study type: nerve-conduction, emg, nerve-conduction-and-emg, repetitive-stimulation, other.';
COMMENT ON COLUMN nerve_conduction_study_test_result.region IS
    'Anatomical region studied: upper-limb, lower-limb, all-limbs, cranial, generalised, other.';
COMMENT ON COLUMN nerve_conduction_study_test_result.laterality IS
    'Laterality studied: left, right, bilateral, not-applicable.';
COMMENT ON COLUMN nerve_conduction_study_test_result.study_adequacy IS
    'Diagnostic adequacy of the study: adequate, limited, non-diagnostic.';
COMMENT ON COLUMN nerve_conduction_study_test_result.clinical_history IS
    'Clinical history and the question the study was performed to answer.';
COMMENT ON COLUMN nerve_conduction_study_test_result.comparison_with_previous IS
    'Comparison with relevant previous electrodiagnostic studies.';
COMMENT ON COLUMN nerve_conduction_study_test_result.nerve_conduction_findings IS
    'Narrative description of the nerve-conduction findings (latencies, amplitudes, conduction velocities, conduction block).';
COMMENT ON COLUMN nerve_conduction_study_test_result.emg_findings IS
    'Narrative description of the needle-EMG findings (insertional / spontaneous activity, motor-unit morphology, recruitment).';
COMMENT ON COLUMN nerve_conduction_study_test_result.carpal_tunnel_syndrome IS
    'Whether the study supports carpal tunnel syndrome (median neuropathy at the wrist).';
COMMENT ON COLUMN nerve_conduction_study_test_result.peripheral_neuropathy IS
    'Whether the study supports a peripheral neuropathy (e.g. distal symmetric polyneuropathy).';
COMMENT ON COLUMN nerve_conduction_study_test_result.radiculopathy IS
    'Whether the study supports a radiculopathy (nerve-root lesion).';
COMMENT ON COLUMN nerve_conduction_study_test_result.motor_neurone_disease_features IS
    'Whether the study shows features of motor neurone disease / anterior horn cell disease (e.g. widespread active and chronic denervation).';
COMMENT ON COLUMN nerve_conduction_study_test_result.myopathy IS
    'Whether the study supports a myopathy (primary muscle disorder).';
COMMENT ON COLUMN nerve_conduction_study_test_result.neuromuscular_junction_disorder IS
    'Whether the study supports a neuromuscular-junction disorder (e.g. decrement on repetitive stimulation).';
COMMENT ON COLUMN nerve_conduction_study_test_result.normal_study IS
    'Whether the study is electrodiagnostically normal.';
COMMENT ON COLUMN nerve_conduction_study_test_result.severity IS
    'Overall severity of the electrodiagnostic abnormality: mild, moderate, severe, not-applicable.';
COMMENT ON COLUMN nerve_conduction_study_test_result.pattern IS
    'Predominant pathophysiological pattern: demyelinating, axonal, mixed, not-applicable.';
COMMENT ON COLUMN nerve_conduction_study_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN nerve_conduction_study_test_result.reporting_category IS
    'Free-text structured-reporting label / diagnostic category for the study (e.g. an AANEM CTS severity grade).';
COMMENT ON COLUMN nerve_conduction_study_test_result.recommended_follow_up IS
    'Recommended follow-up study, referral, or management.';
COMMENT ON COLUMN nerve_conduction_study_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN nerve_conduction_study_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
