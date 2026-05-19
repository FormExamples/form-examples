-- Audit trail of every fitness-to-fly rule that fired for a MEDIF.

CREATE TABLE medical_information_form_for_air_travel_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_information_form_for_air_travel_grade_id UUID NOT NULL
        REFERENCES medical_information_form_for_air_travel_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (instrument IN (
            'cardiovascular',
            'respiratory',
            'recent-event',
            'pregnancy',
            'communicable',
            'equipment',
            'haematology',
            'gas-expansion',
            'composite',
            ''
        )),
    fitness_band VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (fitness_band IN (
            'fit',
            'fit-with-conditions',
            'requires-review',
            'unfit-to-fly',
            ''
        )),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_medical_information_form_for_air_travel_grade_rule_grade_id
    ON medical_information_form_for_air_travel_grade_rule(medical_information_form_for_air_travel_grade_id);

CREATE TRIGGER trigger_medical_information_form_for_air_travel_grade_rule_updated_at
    BEFORE UPDATE ON medical_information_form_for_air_travel_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_information_form_for_air_travel_grade_rule IS
    'Audit trail of every fitness-to-fly rule that fired for this MEDIF, including the contributing instrument and resulting band.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_rule.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_rule.deleted_at IS
    'Timestamp when this row was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_rule.medical_information_form_for_air_travel_grade_id IS
    'Foreign key to the parent grade row.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-PNEUMOTHORAX-14D-01).';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_rule.instrument IS
    'Source instrument: cardiovascular, respiratory, recent-event, pregnancy, communicable, equipment, haematology, gas-expansion, or composite.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_rule.fitness_band IS
    'Fitness band contributed by this rule.';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_rule.category IS
    'Body-system or risk category (e.g. cardiac, pulmonary).';
COMMENT ON COLUMN medical_information_form_for_air_travel_grade_rule.description IS
    'Human-readable description of why the rule fired.';
