-- Computed grading result for a fluid balance chart. Stores the reconciled
-- intake/output totals, the net balance, urine output and its mL/kg/h rate, the
-- observed hours and weight used in the calculation, and the classified fluid
-- status (Balanced / Positive / Negative / Oliguria). One row per chart (1:1).

CREATE TABLE fluid_balance_chart_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    fluid_balance_chart_id UUID NOT NULL UNIQUE
        REFERENCES fluid_balance_chart(id) ON DELETE CASCADE,

    total_intake_ml NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_output_ml NUMERIC(10,2) NOT NULL DEFAULT 0,
    net_balance_ml NUMERIC(10,2) NOT NULL DEFAULT 0,
    urine_output_ml NUMERIC(10,2) NOT NULL DEFAULT 0,
    hours_observed NUMERIC(6,2),
    weight_kg NUMERIC(5,1),
    urine_output_ml_kg_h NUMERIC(8,4),
    fluid_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (fluid_status IN ('balanced', 'positive', 'negative', 'oliguria', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_fluid_balance_chart_grade_updated_at
    BEFORE UPDATE ON fluid_balance_chart_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE fluid_balance_chart_grade IS
    'Computed grading result for a fluid balance chart: intake/output totals, net balance, urine output rate, and the classified fluid status; 1:1 with the chart.';
COMMENT ON COLUMN fluid_balance_chart_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN fluid_balance_chart_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN fluid_balance_chart_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN fluid_balance_chart_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN fluid_balance_chart_grade.fluid_balance_chart_id IS
    'Foreign key to the parent fluid balance chart (unique, 1:1).';
COMMENT ON COLUMN fluid_balance_chart_grade.total_intake_ml IS
    'Sum of all recorded intake volumes in millilitres.';
COMMENT ON COLUMN fluid_balance_chart_grade.total_output_ml IS
    'Sum of all recorded output volumes in millilitres.';
COMMENT ON COLUMN fluid_balance_chart_grade.net_balance_ml IS
    'Net balance in millilitres (total intake minus total output); positive is a net gain.';
COMMENT ON COLUMN fluid_balance_chart_grade.urine_output_ml IS
    'Total urine output in millilitres (sum of output entries with category urine).';
COMMENT ON COLUMN fluid_balance_chart_grade.hours_observed IS
    'Hours over which the chart was observed (chart period, or the span of entries); null when unknown.';
COMMENT ON COLUMN fluid_balance_chart_grade.weight_kg IS
    'Patient weight in kilograms used for the mL/kg/h calculation; null when unknown.';
COMMENT ON COLUMN fluid_balance_chart_grade.urine_output_ml_kg_h IS
    'Urine output rate in millilitres per kilogram per hour; null when weight or hours are unknown.';
COMMENT ON COLUMN fluid_balance_chart_grade.fluid_status IS
    'Classified fluid status: balanced, positive, negative, or oliguria.';
COMMENT ON COLUMN fluid_balance_chart_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
