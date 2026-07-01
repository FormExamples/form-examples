-- Computed Parkland-formula result. Stores the total 24-hour crystalloid
-- volume, the first-8-hour and next-16-hour phase volumes and infusion rates
-- (offset for time elapsed since injury), and the urine-output titration
-- target band, 1:1 with the parent calculation record.

CREATE TABLE parkland_formula_for_burns_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    parkland_formula_for_burns_id UUID NOT NULL UNIQUE
        REFERENCES parkland_formula_for_burns(id) ON DELETE CASCADE,

    total_24h_volume_ml NUMERIC(10,2),
    first_8h_volume_ml NUMERIC(10,2),
    next_16h_volume_ml NUMERIC(10,2),
    hours_since_injury NUMERIC(6,2),
    remaining_first_8h_hours NUMERIC(5,2),
    first_8h_rate_ml_h NUMERIC(10,2),
    next_16h_rate_ml_h NUMERIC(10,2),
    urine_output_target_min_ml_h NUMERIC(8,2),
    urine_output_target_max_ml_h NUMERIC(8,2),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_parkland_formula_for_burns_grade_updated_at
    BEFORE UPDATE ON parkland_formula_for_burns_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE parkland_formula_for_burns_grade IS
    'Computed Parkland-formula result: total 24-hour volume, phase volumes and rates (time-offset), and the urine-output titration band (1:1 with the parent calculation record).';
COMMENT ON COLUMN parkland_formula_for_burns_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN parkland_formula_for_burns_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN parkland_formula_for_burns_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN parkland_formula_for_burns_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN parkland_formula_for_burns_grade.parkland_formula_for_burns_id IS
    'Foreign key to the parent calculation record (unique, 1:1).';
COMMENT ON COLUMN parkland_formula_for_burns_grade.total_24h_volume_ml IS
    'Total 24-hour crystalloid volume in mL: 4 x weight_kg x tbsa_percent (null when weight or %TBSA is missing).';
COMMENT ON COLUMN parkland_formula_for_burns_grade.first_8h_volume_ml IS
    'First-8-hour phase volume in mL: half of the total 24-hour volume (null when the total is null).';
COMMENT ON COLUMN parkland_formula_for_burns_grade.next_16h_volume_ml IS
    'Next-16-hour phase volume in mL: half of the total 24-hour volume (null when the total is null).';
COMMENT ON COLUMN parkland_formula_for_burns_grade.hours_since_injury IS
    'Hours elapsed from time of injury to assessment, clamped at >= 0 (null when injury_at or assessed_at is missing).';
COMMENT ON COLUMN parkland_formula_for_burns_grade.remaining_first_8h_hours IS
    'Hours remaining in the first-8-hour window from injury: max(8 - hours_since_injury, 0); defaults to 8 when hours_since_injury is unknown.';
COMMENT ON COLUMN parkland_formula_for_burns_grade.first_8h_rate_ml_h IS
    'First-phase infusion rate in mL/hour: first_8h_volume_ml / remaining_first_8h_hours (null when overdue, i.e. the first-8-hour window has passed).';
COMMENT ON COLUMN parkland_formula_for_burns_grade.next_16h_rate_ml_h IS
    'Second-phase infusion rate in mL/hour: next_16h_volume_ml / 16 (null when the next-16-hour volume is null).';
COMMENT ON COLUMN parkland_formula_for_burns_grade.urine_output_target_min_ml_h IS
    'Lower urine-output titration target in mL/hour: 0.5 x weight_kg (null when weight is missing).';
COMMENT ON COLUMN parkland_formula_for_burns_grade.urine_output_target_max_ml_h IS
    'Upper urine-output titration target in mL/hour: 1.0 x weight_kg (null when weight is missing).';
COMMENT ON COLUMN parkland_formula_for_burns_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
