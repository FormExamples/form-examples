-- Organizer is the person who schedules a meeting and signs the record.
-- One organizer may run many meetings; the analogue of "patient" in a
-- clinical assessment.

CREATE TABLE organizer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(320) NOT NULL DEFAULT '',
    phone VARCHAR(64) NOT NULL DEFAULT '',
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN (
        'organizer', 'secretary', 'chair', 'facilitator',
        'project-manager', 'scrum-master', 'assistant',
        'team-lead', 'executive', 'clinician', 'other', ''
    )),
    organisation VARCHAR(255) NOT NULL DEFAULT '',
    team VARCHAR(255) NOT NULL DEFAULT '',
    location VARCHAR(255) NOT NULL DEFAULT '',
    timezone VARCHAR(64) NOT NULL DEFAULT '',
    preferred_contact VARCHAR(20) NOT NULL DEFAULT '' CHECK (preferred_contact IN (
        'email', 'phone', 'chat', 'in-person', ''
    ))
);

CREATE TRIGGER trigger_organizer_updated_at
    BEFORE UPDATE ON organizer
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE organizer IS
    'Person who schedules a meeting and signs the record. The analogue of patient in a clinical form: the subject of the assessment is the meeting itself, but the organizer is the human who scheduled it.';
COMMENT ON COLUMN organizer.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN organizer.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN organizer.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN organizer.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN organizer.name IS
    'Organizer full name.';
COMMENT ON COLUMN organizer.email IS
    'Organizer email address.';
COMMENT ON COLUMN organizer.phone IS
    'Organizer phone number.';
COMMENT ON COLUMN organizer.role IS
    'Organizer role: organizer, secretary, chair, facilitator, project-manager, scrum-master, etc.';
COMMENT ON COLUMN organizer.organisation IS
    'Organisation, company, or trust the organizer belongs to.';
COMMENT ON COLUMN organizer.team IS
    'Team or department within the organisation.';
COMMENT ON COLUMN organizer.location IS
    'Physical or virtual base location of the organizer.';
COMMENT ON COLUMN organizer.timezone IS
    'IANA timezone identifier (e.g. Europe/London).';
COMMENT ON COLUMN organizer.preferred_contact IS
    'Preferred contact channel: email, phone, chat, or in-person.';

CREATE INDEX organizer_index_name_trgm
    ON organizer
    USING GIN (name gin_trgm_ops);
