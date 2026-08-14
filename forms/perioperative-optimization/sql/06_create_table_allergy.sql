-- Allergen catalogue, weighted towards the food allergens a dietetic
-- assessment must record, including the fourteen allergens that United Kingdom
-- and European Union food law requires to be declared.

CREATE TABLE allergy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    scientific_name TEXT NOT NULL DEFAULT '',
    european_union_name TEXT NOT NULL DEFAULT '',
    united_states_name TEXT NOT NULL DEFAULT '',
    cosmetic_name TEXT NOT NULL DEFAULT '',
    kind TEXT NOT NULL DEFAULT '' CHECK (kind IN ('food', 'medication', 'environmental', 'contact', 'other', '')),
    is_regulated_food_allergen BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TRIGGER trigger_allergy_updated_at
    BEFORE UPDATE ON allergy
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE allergy IS
    'Allergen that a patient may react to.';
COMMENT ON COLUMN allergy.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN allergy.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN allergy.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN allergy.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN allergy.scientific_name IS
    'Scientific name of the allergen, such as the binomial name of the source species.';
COMMENT ON COLUMN allergy.european_union_name IS
    'European Union name of the allergen, as used in European Union food-labelling law.';
COMMENT ON COLUMN allergy.united_states_name IS
    'United States name of the allergen, as used in United States food-labelling law.';
COMMENT ON COLUMN allergy.cosmetic_name IS
    'Cosmetic-ingredient name of the allergen, where the allergen also appears in cosmetics.';
COMMENT ON COLUMN allergy.kind IS
    'Kind of allergen, such as food, medication, environmental, or contact.';
COMMENT ON COLUMN allergy.is_regulated_food_allergen IS
    'Whether the allergen is one that food law requires to be declared, such as the fourteen regulated allergens in the United Kingdom and the European Union.';

CREATE INDEX allergy_index_gto
    ON allergy
    USING GIN ((
        european_union_name
    ) gin_trgm_ops);
