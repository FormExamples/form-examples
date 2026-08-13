-- Medication and supplement catalogue, covering prescription medicines,
-- over-the-counter medicines, vitamin and mineral supplements, herbal and
-- complementary products, and oral nutritional supplements.

CREATE TABLE medication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    international_nonproprietary_name TEXT NOT NULL DEFAULT '',
    brand_name TEXT NOT NULL DEFAULT '',
    kind TEXT NOT NULL DEFAULT '' CHECK (kind IN ('prescription', 'over-the-counter', 'vitamin', 'mineral', 'herbal', 'complementary', 'oral-nutritional-supplement', 'enteral-feed', 'parenteral-nutrition', 'other', '')),
    nutrient_interaction TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medication_updated_at
    BEFORE UPDATE ON medication
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medication IS
    'Medication, supplement, or nutrition product that a patient may be taking.';
COMMENT ON COLUMN medication.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medication.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medication.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medication.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medication.international_nonproprietary_name IS
    'International Nonproprietary Name (INN) of the medication, as designated by the WHO.';
COMMENT ON COLUMN medication.brand_name IS
    'Brand name as the patient knows the product, such as for reconciling a patient-reported supplement to its ingredient.';
COMMENT ON COLUMN medication.kind IS
    'Kind of product, such as prescription, over-the-counter, vitamin, mineral, herbal, or oral nutritional supplement.';
COMMENT ON COLUMN medication.nutrient_interaction IS
    'Known drug-nutrient interaction, such as for firing the drug-nutrient-interaction safety flag.';
COMMENT ON COLUMN medication.description IS
    'Description of the medication, including its uses and properties.';

CREATE INDEX medication_index_gto
    ON medication
    USING GIN ((
        international_nonproprietary_name
    ) gin_trgm_ops);
