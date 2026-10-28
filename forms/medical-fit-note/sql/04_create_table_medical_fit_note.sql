-- Fit note (Statement of Fitness for Work): a clinician's signed advice on an employee's sick leave.

CREATE TABLE medical_fit_note (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    employee_id UUID NOT NULL REFERENCES employee(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'signed', 'issued', 'cancelled')),
    assessment_date DATE,
    assessment_method VARCHAR(20) NOT NULL DEFAULT '' CHECK (assessment_method IN ('face-to-face', 'video', 'telephone', 'records-review', '')),
    diagnosis_primary VARCHAR(255) NOT NULL DEFAULT '',
    diagnosis_additional VARCHAR(500) NOT NULL DEFAULT '',
    fitness_advice VARCHAR(30) NOT NULL DEFAULT '' CHECK (fitness_advice IN ('not-fit-for-work', 'may-be-fit-for-work', '')),
    period_from DATE,
    period_to DATE,
    period_duration_days INTEGER CHECK (period_duration_days IS NULL OR period_duration_days > 0),
    reassessment_required VARCHAR(5) NOT NULL DEFAULT '' CHECK (reassessment_required IN ('yes', 'no', '')),
    adjustment_phased_return VARCHAR(5) NOT NULL DEFAULT '' CHECK (adjustment_phased_return IN ('yes', 'no', '')),
    adjustment_altered_hours VARCHAR(5) NOT NULL DEFAULT '' CHECK (adjustment_altered_hours IN ('yes', 'no', '')),
    adjustment_amended_duties VARCHAR(5) NOT NULL DEFAULT '' CHECK (adjustment_amended_duties IN ('yes', 'no', '')),
    adjustment_workplace_adaptations VARCHAR(5) NOT NULL DEFAULT '' CHECK (adjustment_workplace_adaptations IN ('yes', 'no', '')),
    functional_effects TEXT NOT NULL DEFAULT '',
    comments TEXT NOT NULL DEFAULT '',
    employee_consent_to_share VARCHAR(5) NOT NULL DEFAULT '' CHECK (employee_consent_to_share IN ('yes', 'no', '')),
    clinician_declaration VARCHAR(5) NOT NULL DEFAULT '' CHECK (clinician_declaration IN ('yes', 'no', '')),
    signed_at TIMESTAMPTZ,
    CHECK (period_to IS NULL OR period_from IS NULL OR period_to >= period_from)
);

CREATE TRIGGER trigger_medical_fit_note_updated_at
    BEFORE UPDATE ON medical_fit_note
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_medical_fit_note_employee_id ON medical_fit_note(employee_id);
CREATE INDEX index_medical_fit_note_clinician_id ON medical_fit_note(clinician_id);

COMMENT ON TABLE medical_fit_note IS
    'Medical fit note.';
COMMENT ON COLUMN medical_fit_note.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_fit_note.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_fit_note.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_fit_note.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN medical_fit_note.employee_id IS
    'Foreign key to the employee table.';
COMMENT ON COLUMN medical_fit_note.clinician_id IS
    'Foreign key to the clinician table.';
COMMENT ON COLUMN medical_fit_note.status IS
    'Lifecycle status of this row.';
COMMENT ON COLUMN medical_fit_note.assessment_date IS
    'Assessment date.';
COMMENT ON COLUMN medical_fit_note.assessment_method IS
    'Assessment method. One of: face-to-face, video, telephone, records-review.';
COMMENT ON COLUMN medical_fit_note.diagnosis_primary IS
    'Diagnosis primary.';
COMMENT ON COLUMN medical_fit_note.diagnosis_additional IS
    'Diagnosis additional.';
COMMENT ON COLUMN medical_fit_note.fitness_advice IS
    'Fitness advice. One of: not-fit-for-work, may-be-fit-for-work.';
COMMENT ON COLUMN medical_fit_note.period_from IS
    'Period from.';
COMMENT ON COLUMN medical_fit_note.period_to IS
    'Period to.';
COMMENT ON COLUMN medical_fit_note.period_duration_days IS
    'Period duration days.';
COMMENT ON COLUMN medical_fit_note.reassessment_required IS
    'Reassessment required. One of: yes, no.';
COMMENT ON COLUMN medical_fit_note.adjustment_phased_return IS
    'Adjustment phased return. One of: yes, no.';
COMMENT ON COLUMN medical_fit_note.adjustment_altered_hours IS
    'Adjustment altered hours. One of: yes, no.';
COMMENT ON COLUMN medical_fit_note.adjustment_amended_duties IS
    'Adjustment amended duties. One of: yes, no.';
COMMENT ON COLUMN medical_fit_note.adjustment_workplace_adaptations IS
    'Adjustment workplace adaptations. One of: yes, no.';
COMMENT ON COLUMN medical_fit_note.functional_effects IS
    'Functional effects.';
COMMENT ON COLUMN medical_fit_note.comments IS
    'Comments.';
COMMENT ON COLUMN medical_fit_note.employee_consent_to_share IS
    'Employee consent to share. One of: yes, no.';
COMMENT ON COLUMN medical_fit_note.clinician_declaration IS
    'Clinician declaration. One of: yes, no.';
COMMENT ON COLUMN medical_fit_note.signed_at IS
    'Signed at.';
