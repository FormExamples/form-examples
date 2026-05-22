-- Person to notify: a person to be informed when the donor or attorneys
-- apply to register the LPA with the Office of the Public Guardian.
-- LP1H s.6: 0 to 5 persons may be named.

CREATE TABLE person_to_notify (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    title VARCHAR(20) NOT NULL DEFAULT '',
    given_names VARCHAR(255) NOT NULL DEFAULT '',
    family_name VARCHAR(255) NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    postal_address_as_full_text TEXT NOT NULL DEFAULT '',
    country_as_iso_3166_1_alpha_2 CHAR(2) NOT NULL DEFAULT '',
    postcode TEXT NOT NULL DEFAULT '',
    relationship_to_donor VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (relationship_to_donor IN (
            'spouse', 'civil-partner', 'child', 'parent', 'sibling',
            'friend', 'professional', 'other', ''
        ))
);

CREATE TRIGGER trigger_person_to_notify_updated_at
    BEFORE UPDATE ON person_to_notify
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE person_to_notify IS
    'Person to be notified when the LPA is being registered (LP1H s.6, max 5).';
COMMENT ON COLUMN person_to_notify.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN person_to_notify.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN person_to_notify.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN person_to_notify.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN person_to_notify.title IS
    'Honorific title.';
COMMENT ON COLUMN person_to_notify.given_names IS
    'Given names.';
COMMENT ON COLUMN person_to_notify.family_name IS
    'Family name.';
COMMENT ON COLUMN person_to_notify.email IS
    'Email address.';
COMMENT ON COLUMN person_to_notify.phone IS
    'Phone number.';
COMMENT ON COLUMN person_to_notify.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN person_to_notify.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN person_to_notify.postcode IS
    'Postal code.';
COMMENT ON COLUMN person_to_notify.relationship_to_donor IS
    'Stated relationship to the donor.';
