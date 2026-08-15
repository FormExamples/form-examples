-- Assessor: the person conducting the screen. Deliberately not named
-- "clinician" -- this form's assessors are frequently non-clinical, such as
-- gym instructors, personal trainers, and HR officers, alongside GPs,
-- practice nurses, and occupational-health nurses. See ../AGENTS.md
-- "assessor, not clinician" for the naming rationale.

CREATE TABLE assessor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role VARCHAR(30) NOT NULL DEFAULT '' CHECK (role IN ('occupational-health-nurse', 'general-practitioner', 'practice-nurse', 'physiotherapist', 'personal-trainer', 'gym-instructor', 'sports-therapist', 'hr-officer', 'other', '')),
    registration_body TEXT NOT NULL DEFAULT '',
    registration_number TEXT NOT NULL DEFAULT '',
    employer TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_assessor_updated_at
    BEFORE UPDATE ON assessor
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE assessor IS
    'Assessor, i.e. the person who conducts the health screening questionnaire. Often not a clinician.';
COMMENT ON COLUMN assessor.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN assessor.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN assessor.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN assessor.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN assessor.name IS
    'Name.';
COMMENT ON COLUMN assessor.email IS
    'Email address.';
COMMENT ON COLUMN assessor.phone IS
    'Phone number.';
COMMENT ON COLUMN assessor.role IS
    'Assessor role, spanning both clinical roles (occupational-health-nurse, general-practitioner, practice-nurse, physiotherapist) and non-clinical roles (personal-trainer, gym-instructor, sports-therapist, hr-officer).';
COMMENT ON COLUMN assessor.registration_body IS
    'Professional registration body, such as HCPC or NMC, where applicable. Blank for non-clinical assessors.';
COMMENT ON COLUMN assessor.registration_number IS
    'Professional registration number issued by the registration body, where applicable.';
COMMENT ON COLUMN assessor.employer IS
    'Employer, such as the employer commissioning an occupational-health screen, the gym or fitness studio, or the GP practice.';

CREATE INDEX assessor_index_gto
    ON assessor
    USING GIN ((
        name
    ) gin_trgm_ops);
