-- Main Ottawa Knee Rule assessment record: identification, context, and the
-- five objective bedside criterion inputs. This is a decision rule, not a
-- score: a knee radiograph is indicated when ANY one criterion is present.
-- Each criterion input is a yes/no/'' enum (age uses a nullable year value).
-- The computed decision, fired rules, and flags live in dedicated child tables.

CREATE TABLE ottawa_knee_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'amended', 'signed', '')),

    -- Context and identification
    patient_identifier VARCHAR(64) NOT NULL DEFAULT '',
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'minor-injuries-unit', 'urgent-care', 'other', '')),
    injury_mechanism VARCHAR(20) NOT NULL DEFAULT '' CHECK (injury_mechanism IN ('blunt-trauma', 'twisting', 'fall', 'other', '')),
    hours_since_injury NUMERIC(6,1),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    injured_side VARCHAR(10) NOT NULL DEFAULT '' CHECK (injured_side IN ('left', 'right', '')),

    -- Criterion inputs (ANY-of; presence of any one indicates imaging)
    age_years INT,
    patellar_tenderness VARCHAR(5) NOT NULL DEFAULT '' CHECK (patellar_tenderness IN ('yes', 'no', '')),
    other_bony_tenderness VARCHAR(5) NOT NULL DEFAULT '' CHECK (other_bony_tenderness IN ('yes', 'no', '')),
    fibular_head_tenderness VARCHAR(5) NOT NULL DEFAULT '' CHECK (fibular_head_tenderness IN ('yes', 'no', '')),
    unable_to_flex_90 VARCHAR(5) NOT NULL DEFAULT '' CHECK (unable_to_flex_90 IN ('yes', 'no', '')),
    unable_to_bear_weight VARCHAR(5) NOT NULL DEFAULT '' CHECK (unable_to_bear_weight IN ('yes', 'no', '')),

    clinical_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX ottawa_knee_rule_patient_id_idx
    ON ottawa_knee_rule (patient_id);
CREATE INDEX ottawa_knee_rule_clinician_id_idx
    ON ottawa_knee_rule (clinician_id);

CREATE TRIGGER trigger_ottawa_knee_rule_updated_at
    BEFORE UPDATE ON ottawa_knee_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ottawa_knee_rule IS
    'Main Ottawa Knee Rule assessment record: identification, context, and the five objective bedside criterion inputs. A decision rule (ANY-of), not a score.';
COMMENT ON COLUMN ottawa_knee_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ottawa_knee_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ottawa_knee_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ottawa_knee_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ottawa_knee_rule.patient_id IS
    'Foreign key to the patient being assessed (restricts delete).';
COMMENT ON COLUMN ottawa_knee_rule.clinician_id IS
    'Foreign key to the assessing clinician (restricts delete).';
COMMENT ON COLUMN ottawa_knee_rule.status IS
    'Workflow status: draft, submitted, amended, or signed.';
COMMENT ON COLUMN ottawa_knee_rule.patient_identifier IS
    'Local patient identifier as recorded at the point of assessment.';
COMMENT ON COLUMN ottawa_knee_rule.assessed_at IS
    'Date and time the assessment was carried out.';
COMMENT ON COLUMN ottawa_knee_rule.care_setting IS
    'Care setting: emergency-department, minor-injuries-unit, urgent-care, or other.';
COMMENT ON COLUMN ottawa_knee_rule.injury_mechanism IS
    'Mechanism of injury: blunt-trauma, twisting, fall, or other.';
COMMENT ON COLUMN ottawa_knee_rule.hours_since_injury IS
    'Hours elapsed since the injury; supports the applicability check (the rule is validated for acute injury).';
COMMENT ON COLUMN ottawa_knee_rule.sex IS
    'Patient sex recorded for clinical purposes: female, male, intersex, or unknown.';
COMMENT ON COLUMN ottawa_knee_rule.injured_side IS
    'Injured knee side: left or right.';
COMMENT ON COLUMN ottawa_knee_rule.age_years IS
    'Criterion 1: patient age in years; the criterion fires when age >= 55. Null when unanswered.';
COMMENT ON COLUMN ottawa_knee_rule.patellar_tenderness IS
    'Criterion 2 input: tenderness at the patella. Fires the isolated-patellar criterion only when other_bony_tenderness is no.';
COMMENT ON COLUMN ottawa_knee_rule.other_bony_tenderness IS
    'Criterion 2 modifier: bony tenderness other than the patella; when yes it prevents the isolated-patellar criterion from firing and raises a flag.';
COMMENT ON COLUMN ottawa_knee_rule.fibular_head_tenderness IS
    'Criterion 3: tenderness at the head of the fibula.';
COMMENT ON COLUMN ottawa_knee_rule.unable_to_flex_90 IS
    'Criterion 4: inability to flex the knee to 90 degrees.';
COMMENT ON COLUMN ottawa_knee_rule.unable_to_bear_weight IS
    'Criterion 5: inability to bear weight (take four steps) both immediately after injury and in the emergency department.';
COMMENT ON COLUMN ottawa_knee_rule.clinical_notes IS
    'Free-text clinical notes captured alongside the assessment.';
