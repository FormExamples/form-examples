-- Computed completeness classification for a death registration: ready to
-- register, incomplete, referred to the coroner and pending, or registered,
-- with the 5-day deadline status. A process classification, not a clinical
-- score, and not legal advice.

CREATE TABLE united_kingdom_death_registration.united_kingdom_death_registration_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_death_registration_id UUID NOT NULL UNIQUE REFERENCES united_kingdom_death_registration.united_kingdom_death_registration(id) ON DELETE CASCADE,
    registration_class VARCHAR(30) NOT NULL DEFAULT '' CHECK (registration_class IN ('ready-to-register', 'incomplete', 'referred-to-coroner-pending', 'registered', '')),
    deadline_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (deadline_status IN ('not-started', 'paused-coroner', 'on-track', 'due-soon', 'overdue', 'registered', 'registered-late', '')),
    days_since_confirmation INTEGER,
    informant_qualified VARCHAR(5) NOT NULL DEFAULT '' CHECK (informant_qualified IN ('yes', 'no', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_kingdom_death_registration_grade_updated_at
    BEFORE UPDATE ON united_kingdom_death_registration.united_kingdom_death_registration_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_death_registration.set_updated_at();

COMMENT ON TABLE united_kingdom_death_registration.united_kingdom_death_registration_grade IS
    'Computed completeness classification for a death registration: registration class, 5-day deadline status, days since medical examiner confirmation, and whether the informant is qualified.';
COMMENT ON COLUMN united_kingdom_death_registration.united_kingdom_death_registration_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_death_registration.united_kingdom_death_registration_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_death_registration.united_kingdom_death_registration_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_death_registration.united_kingdom_death_registration_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_death_registration.united_kingdom_death_registration_grade.united_kingdom_death_registration_id IS
    'Foreign key to the parent registration (unique, 1:1).';
COMMENT ON COLUMN united_kingdom_death_registration.united_kingdom_death_registration_grade.registration_class IS
    'Registration class; referred-to-coroner-pending takes precedence, then incomplete, then registered, else ready-to-register.';
COMMENT ON COLUMN united_kingdom_death_registration.united_kingdom_death_registration_grade.deadline_status IS
    'Status of the 5-day registration deadline counted from medical examiner confirmation.';
COMMENT ON COLUMN united_kingdom_death_registration.united_kingdom_death_registration_grade.days_since_confirmation IS
    'Whole days from medical examiner confirmation to the registration date, or to the assessment date while unregistered; null when unconfirmed.';
COMMENT ON COLUMN united_kingdom_death_registration.united_kingdom_death_registration_grade.informant_qualified IS
    'Whether the informant is a qualified informant under section 16 of the 1953 Act.';
COMMENT ON COLUMN united_kingdom_death_registration.united_kingdom_death_registration_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
