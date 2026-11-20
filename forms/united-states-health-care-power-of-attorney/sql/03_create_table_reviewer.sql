-- The attorney, social worker, or facility staff member who reviews the
-- directive for execution readiness.

CREATE TABLE united_states_health_care_power_of_attorney.reviewer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('attorney', 'paralegal', 'social-worker', 'nurse', 'chaplain', 'other', '')),
    bar_or_license_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_reviewer_updated_at
    BEFORE UPDATE ON united_states_health_care_power_of_attorney.reviewer
    FOR EACH ROW
    EXECUTE FUNCTION united_states_health_care_power_of_attorney.set_updated_at();

COMMENT ON TABLE united_states_health_care_power_of_attorney.reviewer IS
    'Reviewer: the attorney, social worker, or facility staff member who reviews the directive for execution readiness.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.reviewer.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.reviewer.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.reviewer.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.reviewer.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.reviewer.name IS
    'Full name of the reviewer.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.reviewer.email IS
    'Email address.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.reviewer.phone IS
    'Phone number.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.reviewer.role IS
    'Reviewer role: attorney, paralegal, social-worker, nurse, chaplain, or other.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.reviewer.bar_or_license_number IS
    'State bar or professional license number, where applicable.';
