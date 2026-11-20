-- Allergen catalogue, weighted towards the food allergens a dietetic
-- assessment must record, including the fourteen allergens that United Kingdom
-- and European Union food law requires to be declared.

CREATE TABLE dietic_assessment.allergy (
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
    BEFORE UPDATE ON dietic_assessment.allergy
    FOR EACH ROW
    EXECUTE FUNCTION dietic_assessment.set_updated_at();

COMMENT ON TABLE dietic_assessment.allergy IS
    'Allergen that a patient may react to.';
COMMENT ON COLUMN dietic_assessment.allergy.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN dietic_assessment.allergy.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN dietic_assessment.allergy.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN dietic_assessment.allergy.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN dietic_assessment.allergy.scientific_name IS
    'Scientific name of the allergen, such as the binomial name of the source species.';
COMMENT ON COLUMN dietic_assessment.allergy.european_union_name IS
    'European Union name of the allergen, as used in European Union food-labelling law.';
COMMENT ON COLUMN dietic_assessment.allergy.united_states_name IS
    'United States name of the allergen, as used in United States food-labelling law.';
COMMENT ON COLUMN dietic_assessment.allergy.cosmetic_name IS
    'Cosmetic-ingredient name of the allergen, where the allergen also appears in cosmetics.';
COMMENT ON COLUMN dietic_assessment.allergy.kind IS
    'Kind of allergen, such as food, medication, environmental, or contact.';
COMMENT ON COLUMN dietic_assessment.allergy.is_regulated_food_allergen IS
    'Whether the allergen is one that food law requires to be declared, such as the fourteen regulated allergens in the United Kingdom and the European Union.';

CREATE INDEX allergy_index_gto
    ON dietic_assessment.allergy
    USING GIN ((
        european_union_name
    ) gin_trgm_ops);
