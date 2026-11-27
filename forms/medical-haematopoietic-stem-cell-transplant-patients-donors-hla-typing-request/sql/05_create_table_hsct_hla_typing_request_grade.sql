-- Computed grading result for the request (four-axis engine).

CREATE TABLE medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    request_id UUID NOT NULL UNIQUE REFERENCES medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request(id) ON DELETE CASCADE,
    appropriateness_score INTEGER CHECK (appropriateness_score IS NULL OR appropriateness_score BETWEEN 1 AND 9),
    appropriateness_band VARCHAR(25) NOT NULL DEFAULT '' CHECK (appropriateness_band IN ('usually-appropriate', 'may-be-appropriate', 'usually-not-appropriate', '')),
    identity_safety_band VARCHAR(15) NOT NULL DEFAULT '' CHECK (identity_safety_band IN ('ok', 'caution', 'reject-risk', '')),
    completeness_percent INTEGER CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),
    triage_tier VARCHAR(15) NOT NULL DEFAULT '' CHECK (triage_tier IN ('routine', 'urgent', 'emergency', 'stat', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',
    required_samples_summary VARCHAR(500) NOT NULL DEFAULT '',
    recommendation VARCHAR(20) NOT NULL DEFAULT '' CHECK (recommendation IN ('accept', 'query-referrer', 'reject', '')),
    clinician_notes VARCHAR(1000) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_mhsct_grade_updated_at
    BEFORE UPDATE ON medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade
    FOR EACH ROW
    EXECUTE FUNCTION medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.set_updated_at();

COMMENT ON TABLE medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade IS
    'Computed result of the four-axis engine for one request: appropriateness, identity / sample safety, completeness and triage priority, plus the vetting recommendation.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.request_id IS
    'Foreign key to the graded request (one grade per request).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.appropriateness_score IS
    'Axis A appropriateness, 1-9 ordinal. No published score exists; anchored on laboratory standards and labelled as such.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.appropriateness_band IS
    'Axis A band: usually-appropriate (7-9), may-be-appropriate (4-6), usually-not-appropriate (1-3).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.identity_safety_band IS
    'Axis B identity / sample safety band: ok, caution, reject-risk.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.completeness_percent IS
    'Axis C completeness, 0-100 percent.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.triage_tier IS
    'Axis D triage tier: routine, urgent, emergency, stat.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.target_timeframe IS
    'Target turnaround implied by the triage tier (local policy).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.required_samples_summary IS
    'Sample tubes and volumes the requested tests need, derived from the tests chosen.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.recommendation IS
    'Vetting recommendation: accept, query-referrer, reject.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.clinician_notes IS
    'Free-text vetting notes.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.signed_at IS
    'Timestamp of the vetting person''s electronic signature.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
