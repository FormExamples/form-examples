CREATE TABLE pre_anaesthesia_assessment.allergy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    scientific_name TEXT NOT NULL DEFAULT '',
    european_union_name TEXT NOT NULL DEFAULT '',
    united_states_name TEXT NOT NULL DEFAULT '',
    cosmetic_name TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_allergy_updated_at
    BEFORE UPDATE ON pre_anaesthesia_assessment.allergy
    FOR EACH ROW
    EXECUTE FUNCTION pre_anaesthesia_assessment.set_updated_at();

COMMENT ON TABLE pre_anaesthesia_assessment.allergy IS
    'Allergy';
COMMENT ON COLUMN pre_anaesthesia_assessment.allergy.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pre_anaesthesia_assessment.allergy.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pre_anaesthesia_assessment.allergy.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pre_anaesthesia_assessment.allergy.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.allergy.scientific_name IS
    'Scientific name of the allergen, following WHO/IUIS taxonomy (e.g. Betula pendula for birch pollen).';
COMMENT ON COLUMN pre_anaesthesia_assessment.allergy.european_union_name IS
    'European Union name of the allergen, following EU FSA major food allergen list (e.g. wheat).';
COMMENT ON COLUMN pre_anaesthesia_assessment.allergy.united_states_name IS
    'United States name of the allergen, following US FDA major food allergen list (e.g. wheat).';
COMMENT ON COLUMN pre_anaesthesia_assessment.allergy.cosmetic_name IS
    'Cosmetic name of the allergen, following cosmetic ingredient regulations (e.g. Limonene).';

CREATE INDEX allergy_index_gto
    ON pre_anaesthesia_assessment.allergy
    USING GIN ((
        scientific_name
            || ' ' ||
        european_union_name
            || ' ' ||
        united_states_name
            || ' ' ||
        cosmetic_name
    ) gin_trgm_ops);
