-- Assessor: the person conducting the screen. Deliberately not named
-- "clinician" -- this form's assessors are frequently non-clinical, such as
-- gym instructors, personal trainers, and HR officers, alongside GPs,
-- practice nurses, and occupational-health nurses. See ../AGENTS.md
-- "assessor, not clinician" for the naming rationale.

CREATE TABLE health_screening_questionnaire.assessor (
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
    BEFORE UPDATE ON health_screening_questionnaire.assessor
    FOR EACH ROW
    EXECUTE FUNCTION health_screening_questionnaire.set_updated_at();

COMMENT ON TABLE health_screening_questionnaire.assessor IS
    'Assessor, i.e. the person who conducts the health screening questionnaire. Often not a clinician.';
COMMENT ON COLUMN health_screening_questionnaire.assessor.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN health_screening_questionnaire.assessor.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN health_screening_questionnaire.assessor.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN health_screening_questionnaire.assessor.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN health_screening_questionnaire.assessor.name IS
    'Name.';
COMMENT ON COLUMN health_screening_questionnaire.assessor.email IS
    'Email address.';
COMMENT ON COLUMN health_screening_questionnaire.assessor.phone IS
    'Phone number.';
COMMENT ON COLUMN health_screening_questionnaire.assessor.role IS
    'Assessor role, spanning both clinical roles (occupational-health-nurse, general-practitioner, practice-nurse, physiotherapist) and non-clinical roles (personal-trainer, gym-instructor, sports-therapist, hr-officer).';
COMMENT ON COLUMN health_screening_questionnaire.assessor.registration_body IS
    'Professional registration body, such as HCPC or NMC, where applicable. Blank for non-clinical assessors.';
COMMENT ON COLUMN health_screening_questionnaire.assessor.registration_number IS
    'Professional registration number issued by the registration body, where applicable.';
COMMENT ON COLUMN health_screening_questionnaire.assessor.employer IS
    'Employer, such as the employer commissioning an occupational-health screen, the gym or fitness studio, or the GP practice.';

CREATE INDEX assessor_index_gto
    ON health_screening_questionnaire.assessor
    USING GIN ((
        name
    ) gin_trgm_ops);
