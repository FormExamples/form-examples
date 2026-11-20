-- Healthcare professional authorised to issue a fit note. Following the
-- 2022 DWP amendment, this includes doctors, nurses, occupational
-- therapists, pharmacists, and physiotherapists.

CREATE TABLE united_kingdom_statement_of_fitness_for_work.clinician (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    profession TEXT NOT NULL DEFAULT '' CHECK (profession IN (
        'doctor',
        'nurse',
        'occupational_therapist',
        'pharmacist',
        'physiotherapist',
        'other',
        ''
    )),
    registration_body TEXT NOT NULL DEFAULT '' CHECK (registration_body IN (
        'GMC',
        'NMC',
        'HCPC',
        'GPhC',
        'other',
        ''
    )),
    registration_number TEXT NOT NULL DEFAULT '',
    is_private_practice VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_private_practice IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON united_kingdom_statement_of_fitness_for_work.clinician
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_statement_of_fitness_for_work.set_updated_at();

COMMENT ON TABLE united_kingdom_statement_of_fitness_for_work.clinician IS
    'Healthcare professional issuing the fit note (doctor, nurse, OT, pharmacist, or physiotherapist).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.name IS
    'Full name of the issuing clinician (mandatory per DWP policy 3.7).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.postal_address_as_full_text IS
    'Postal address (typically the practice).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.profession IS
    'Profession: doctor, nurse, occupational_therapist, pharmacist, physiotherapist, or other.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.registration_body IS
    'Regulator: GMC (doctors), NMC (nurses), HCPC (OTs/physios), GPhC (pharmacists).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.registration_number IS
    'Registration number issued by the regulator.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician.is_private_practice IS
    'Whether the clinician is operating in private practice (non-NHS).';

CREATE INDEX clinician_index_gto
    ON united_kingdom_statement_of_fitness_for_work.clinician
    USING GIN ((
        name
    ) gin_trgm_ops);
