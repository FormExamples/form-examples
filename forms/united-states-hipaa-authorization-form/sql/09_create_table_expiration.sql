-- Expiration date or expiration event for the authorization.

CREATE TABLE united_states_hipaa_authorization_form.expiration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES united_states_hipaa_authorization_form.hipaa_authorization(id) ON DELETE CASCADE,
    kind VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (kind IN ('', 'date', 'event', 'duration')),
    expiration_date DATE,
    expiration_event TEXT NOT NULL DEFAULT '',
    duration_months INTEGER,
    duration_label VARCHAR(80) NOT NULL DEFAULT '',
    CHECK (duration_months IS NULL OR duration_months > 0),
    CHECK (expiration_event !~* '^(none|n/a)$')
);

CREATE TRIGGER trigger_expiration_updated_at
    BEFORE UPDATE ON united_states_hipaa_authorization_form.expiration
    FOR EACH ROW
    EXECUTE FUNCTION united_states_hipaa_authorization_form.set_updated_at();

COMMENT ON TABLE united_states_hipaa_authorization_form.expiration IS
    'Expiration date or expiration event for the authorization. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(v); the string "none" is not permitted (except for research).';
COMMENT ON COLUMN united_states_hipaa_authorization_form.expiration.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.expiration.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.expiration.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.expiration.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.expiration.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN united_states_hipaa_authorization_form.expiration.kind IS
    'Expiration mechanism: date, event, duration, or empty if unanswered.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.expiration.expiration_date IS
    'Calendar expiration date (used when kind is date).';
COMMENT ON COLUMN united_states_hipaa_authorization_form.expiration.expiration_event IS
    'Free-text expiration event (e.g. "upon conclusion of my claim"). Used when kind is event. Cannot be the string "none".';
COMMENT ON COLUMN united_states_hipaa_authorization_form.expiration.duration_months IS
    'Validity duration in months from signature (e.g. 12). Used when kind is duration.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.expiration.duration_label IS
    'Human-readable duration label (e.g. "12 months from signature").';
