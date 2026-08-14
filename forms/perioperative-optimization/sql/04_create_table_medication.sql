-- Medication catalogue, carrying the perioperative hold guidance that drives
-- the `medication` optimization domain. A deployment can seed this table with
-- local formulary guidance so the front-end surfaces the right prompt per drug.
-- See ../doc/medication-hold-rules.md.

CREATE TABLE medication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    international_nonproprietary_name TEXT NOT NULL DEFAULT '',
    brand_name TEXT NOT NULL DEFAULT '',
    kind TEXT NOT NULL DEFAULT '' CHECK (kind IN ('prescription', 'over-the-counter', 'herbal', 'complementary', 'vitamin', 'mineral', 'other', '')),
    hold_class TEXT NOT NULL DEFAULT '' CHECK (hold_class IN (
        'anticoagulant',
        'antiplatelet',
        'ace-inhibitor-or-arb',
        'sglt2-inhibitor',
        'glp1-agonist',
        'insulin',
        'other-diabetes',
        'corticosteroid',
        'immunosuppressant',
        'hormone-therapy',
        'herbal',
        'psychotropic',
        'none',
        ''
    )),
    hold_required BOOLEAN NOT NULL DEFAULT FALSE,
    default_hold_start_before_days INTEGER CHECK (default_hold_start_before_days IS NULL OR default_hold_start_before_days BETWEEN 0 AND 60),
    default_restart_after_days INTEGER CHECK (default_restart_after_days IS NULL OR default_restart_after_days BETWEEN 0 AND 60),
    perioperative_hold_guidance TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medication_updated_at
    BEFORE UPDATE ON medication
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medication IS
    'Medication catalogue, carrying the perioperative hold guidance that drives the medication optimization domain.';
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
    'Brand name as the patient knows the product, such as for reconciling a patient-reported medicine to its ingredient.';
COMMENT ON COLUMN medication.kind IS
    'Kind of product, such as prescription, over-the-counter, or herbal.';
COMMENT ON COLUMN medication.hold_class IS
    'Perioperative hold class, such as anticoagulant, sglt2-inhibitor, or glp1-agonist. Drives which prompt the front-end shows and which safety flag can fire.';
COMMENT ON COLUMN medication.hold_required IS
    'Whether this product normally requires a perioperative hold-and-restart plan.';
COMMENT ON COLUMN medication.default_hold_start_before_days IS
    'Default number of days before surgery to stop the product, for reference only. The prescriber owns the decision.';
COMMENT ON COLUMN medication.default_restart_after_days IS
    'Default number of days after surgery to restart the product, for reference only. The prescriber owns the decision.';
COMMENT ON COLUMN medication.perioperative_hold_guidance IS
    'Free-text local guidance for holding and restarting this product around surgery.';
COMMENT ON COLUMN medication.description IS
    'Description of the medication, including its uses and properties.';

CREATE INDEX medication_index_gto
    ON medication
    USING GIN ((
        international_nonproprietary_name
    ) gin_trgm_ops);
