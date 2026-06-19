-- The person(s) or class of persons to whom the disclosure may be made.

CREATE TABLE authorized_recipient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL DEFAULT '',
    recipient_organization VARCHAR(255) NOT NULL DEFAULT '',
    recipient_role VARCHAR(255) NOT NULL DEFAULT '',
    recipient_address TEXT NOT NULL DEFAULT '',
    recipient_phone VARCHAR(30) NOT NULL DEFAULT '',
    recipient_email VARCHAR(255) NOT NULL DEFAULT '',
    recipient_relationship_to_patient VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (recipient_relationship_to_patient IN (
            '',
            'health-plan',
            'state-agency',
            'employer',
            'attorney',
            'researcher',
            'family-member',
            'self',
            'health-care-provider',
            'other'
        ))
);

CREATE TRIGGER trigger_authorized_recipient_updated_at
    BEFORE UPDATE ON authorized_recipient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE authorized_recipient IS
    'Person(s) or class of persons to whom the disclosure may be made. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(iii).';
COMMENT ON COLUMN authorized_recipient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN authorized_recipient.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN authorized_recipient.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN authorized_recipient.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN authorized_recipient.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN authorized_recipient.recipient_name IS
    'Full name of the authorized recipient (individual or organisation contact).';
COMMENT ON COLUMN authorized_recipient.recipient_organization IS
    'Organisation the recipient belongs to (e.g. "Tennessee Department of Human Services").';
COMMENT ON COLUMN authorized_recipient.recipient_role IS
    'Professional role or title of the recipient.';
COMMENT ON COLUMN authorized_recipient.recipient_address IS
    'Postal address of the recipient.';
COMMENT ON COLUMN authorized_recipient.recipient_phone IS
    'Phone number of the recipient.';
COMMENT ON COLUMN authorized_recipient.recipient_email IS
    'Email address of the recipient.';
COMMENT ON COLUMN authorized_recipient.recipient_relationship_to_patient IS
    'Recipient relationship: health-plan, state-agency, employer, attorney, researcher, family-member, self, health-care-provider, other, or empty.';
