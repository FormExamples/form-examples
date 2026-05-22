-- Instructions are binding constraints on the attorneys. Attorneys MUST follow
-- valid instructions. LP1H s.7 (Instructions). MCA 2005 s.9(4): instructions
-- must be lawful, possible, and consistent with the donor's best interests.
-- Cannot contradict an Advance Decision to Refuse Treatment (MCA 2005 s.25).

CREATE TABLE lpa_instruction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL
        REFERENCES lpa(id) ON DELETE CASCADE,
    order_position INTEGER NOT NULL DEFAULT 1
        CHECK (order_position >= 1),
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'medical-treatment-limit',
            'residence-restriction',
            'contact-restriction',
            'religion-and-belief',
            'food-and-drink',
            'end-of-life-care',
            'other',
            ''
        )),
    statement TEXT NOT NULL DEFAULT '',
    lawfulness_assessed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (lawfulness_assessed IN ('yes', 'no', '')),
    contradicts_adrt VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (contradicts_adrt IN ('yes', 'no', ''))
);

CREATE INDEX index_lpa_instruction_lpa_id ON lpa_instruction(lpa_id);

CREATE TRIGGER trigger_lpa_instruction_updated_at
    BEFORE UPDATE ON lpa_instruction
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_instruction IS
    'Binding instruction the attorneys must follow. LP1H s.7 (instructions), MCA 2005 s.9(4).';
COMMENT ON COLUMN lpa_instruction.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_instruction.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_instruction.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_instruction.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_instruction.lpa_id IS
    'Foreign key to the parent LPA.';
COMMENT ON COLUMN lpa_instruction.order_position IS
    'Order in which the instruction appears in the LP1H s.7 block.';
COMMENT ON COLUMN lpa_instruction.category IS
    'Topical category for the instruction.';
COMMENT ON COLUMN lpa_instruction.statement IS
    'The binding instruction text.';
COMMENT ON COLUMN lpa_instruction.lawfulness_assessed IS
    'Whether a solicitor or certificate provider has assessed the instruction as lawful (R-MCA-INSTR-LAW).';
COMMENT ON COLUMN lpa_instruction.contradicts_adrt IS
    'Whether this instruction is known to contradict a paired ADRT (R-MCA-INSTR-ADRT fires when yes).';
