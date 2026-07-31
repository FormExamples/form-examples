-- Problem-list rows for an inpatient clinical note. The problem list is the
-- spine of the problem-oriented medical record: one row per active, resolving,
-- resolved, or chronic problem, each with its own progress commentary.

CREATE TABLE inpatient_clinical_note_problem (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    inpatient_clinical_note_id UUID NOT NULL
        REFERENCES inpatient_clinical_note(id) ON DELETE CASCADE,

    sort_order INTEGER NOT NULL DEFAULT 0,
    problem VARCHAR(255) NOT NULL DEFAULT '',
    category VARCHAR(30) NOT NULL DEFAULT '' CHECK (category IN ('presenting', 'comorbidity', 'complication', 'hospital-acquired', 'social', 'psychological', 'other', '')),
    status VARCHAR(15) NOT NULL DEFAULT '' CHECK (status IN ('active', 'resolving', 'resolved', 'chronic', '')),
    priority VARCHAR(10) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', '')),
    onset_date DATE,
    snomed_code VARCHAR(30) NOT NULL DEFAULT '',
    progress_commentary TEXT NOT NULL DEFAULT ''
);

CREATE INDEX inpatient_clinical_note_problem_note_id_idx
    ON inpatient_clinical_note_problem (inpatient_clinical_note_id);

CREATE TRIGGER trigger_inpatient_clinical_note_problem_updated_at
    BEFORE UPDATE ON inpatient_clinical_note_problem
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE inpatient_clinical_note_problem IS
    'Problem-list rows for an inpatient clinical note: one row per active, resolving, resolved, or chronic problem, with category, priority, onset, and progress commentary.';
COMMENT ON COLUMN inpatient_clinical_note_problem.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN inpatient_clinical_note_problem.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN inpatient_clinical_note_problem.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN inpatient_clinical_note_problem.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN inpatient_clinical_note_problem.inpatient_clinical_note_id IS
    'Foreign key to the parent inpatient clinical note.';
COMMENT ON COLUMN inpatient_clinical_note_problem.sort_order IS
    'Display order of the problem within the list, ascending.';
COMMENT ON COLUMN inpatient_clinical_note_problem.problem IS
    'The problem as stated by the clinician.';
COMMENT ON COLUMN inpatient_clinical_note_problem.category IS
    'Problem category: presenting, comorbidity, complication, hospital-acquired, social, psychological, or other.';
COMMENT ON COLUMN inpatient_clinical_note_problem.status IS
    'Problem status: active, resolving, resolved, or chronic.';
COMMENT ON COLUMN inpatient_clinical_note_problem.priority IS
    'Clinical priority: low, medium, or high.';
COMMENT ON COLUMN inpatient_clinical_note_problem.onset_date IS
    'Date the problem began, where known.';
COMMENT ON COLUMN inpatient_clinical_note_problem.snomed_code IS
    'SNOMED CT concept identifier for the problem, where coded.';
COMMENT ON COLUMN inpatient_clinical_note_problem.progress_commentary IS
    'Commentary on how the problem has progressed since the previous note.';
