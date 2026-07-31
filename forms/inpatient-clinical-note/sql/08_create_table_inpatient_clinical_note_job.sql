-- Outstanding-job rows for an inpatient clinical note. One row per task the
-- entry generates, with an owner, a due time, and a status, so that the jobs
-- list can be handed over between shifts. Either a narrative plan or at least
-- one job satisfies the plan completeness component.

CREATE TABLE inpatient_clinical_note_job (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    inpatient_clinical_note_id UUID NOT NULL
        REFERENCES inpatient_clinical_note(id) ON DELETE CASCADE,

    sort_order INTEGER NOT NULL DEFAULT 0,
    job VARCHAR(500) NOT NULL DEFAULT '',
    category VARCHAR(30) NOT NULL DEFAULT '' CHECK (category IN ('investigation', 'referral', 'prescribing', 'procedure', 'review', 'communication', 'discharge-planning', 'other', '')),
    owner VARCHAR(255) NOT NULL DEFAULT '',
    priority VARCHAR(10) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', '')),
    due_at TIMESTAMPTZ,
    status VARCHAR(15) NOT NULL DEFAULT '' CHECK (status IN ('outstanding', 'in-progress', 'done', 'cancelled', '')),
    completed_at TIMESTAMPTZ,
    notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX inpatient_clinical_note_job_note_id_idx
    ON inpatient_clinical_note_job (inpatient_clinical_note_id);

CREATE TRIGGER trigger_inpatient_clinical_note_job_updated_at
    BEFORE UPDATE ON inpatient_clinical_note_job
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE inpatient_clinical_note_job IS
    'Outstanding-job rows for an inpatient clinical note: one row per task the entry generates, with owner, priority, due time, and status, so the jobs list can be handed over between shifts.';
COMMENT ON COLUMN inpatient_clinical_note_job.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN inpatient_clinical_note_job.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN inpatient_clinical_note_job.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN inpatient_clinical_note_job.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN inpatient_clinical_note_job.inpatient_clinical_note_id IS
    'Foreign key to the parent inpatient clinical note.';
COMMENT ON COLUMN inpatient_clinical_note_job.sort_order IS
    'Display order of the job within the list, ascending.';
COMMENT ON COLUMN inpatient_clinical_note_job.job IS
    'The task to be done.';
COMMENT ON COLUMN inpatient_clinical_note_job.category IS
    'Job category: investigation, referral, prescribing, procedure, review, communication, discharge-planning, or other.';
COMMENT ON COLUMN inpatient_clinical_note_job.owner IS
    'Person or team responsible for the job.';
COMMENT ON COLUMN inpatient_clinical_note_job.priority IS
    'Job priority: low, medium, or high.';
COMMENT ON COLUMN inpatient_clinical_note_job.due_at IS
    'Timestamp the job is due by.';
COMMENT ON COLUMN inpatient_clinical_note_job.status IS
    'Job status: outstanding, in-progress, done, or cancelled.';
COMMENT ON COLUMN inpatient_clinical_note_job.completed_at IS
    'Timestamp the job was completed.';
COMMENT ON COLUMN inpatient_clinical_note_job.notes IS
    'Free-text notes on the job.';
