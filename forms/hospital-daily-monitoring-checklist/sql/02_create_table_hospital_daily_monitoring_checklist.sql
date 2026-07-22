-- One row per daily-monitoring inspection round at one hospital site.

CREATE TABLE hospital_daily_monitoring_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    hospital_name VARCHAR(255) NOT NULL DEFAULT '',
    department_or_site VARCHAR(255) NOT NULL DEFAULT '',
    inspection_date DATE,
    inspecting_officer_name VARCHAR(255) NOT NULL DEFAULT '',
    inspecting_officer_designation VARCHAR(255) NOT NULL DEFAULT '',

    overall_notes TEXT NOT NULL DEFAULT '',
    action_plan TEXT NOT NULL DEFAULT '',

    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
    signed_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_hospital_daily_monitoring_checklist_updated_at
    BEFORE UPDATE ON hospital_daily_monitoring_checklist
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hospital_daily_monitoring_checklist IS
    'One daily-monitoring inspection round at one hospital site: who inspected, when, and the sign-off notes.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.hospital_name IS
    'Name of the hospital or facility being inspected.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.department_or_site IS
    'Specific department, ward, or site visited during this round, if narrower than the whole hospital.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.inspection_date IS
    'Date the inspection round was carried out.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.inspecting_officer_name IS
    'Name of the inspecting officer (e.g. RMO, Medical Superintendent, hospital administrator).';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.inspecting_officer_designation IS
    'Designation / job title of the inspecting officer.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.overall_notes IS
    'Free-text overall notes recorded at sign-off.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.action_plan IS
    'Free-text action plan recorded at sign-off, addressing needs-attention checkpoints.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.status IS
    'Submission status: draft or submitted.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist.signed_at IS
    'Timestamp the inspecting officer signed off this round.';
