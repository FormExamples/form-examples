CREATE TABLE outpatient_outcome_prom_eq5d5l (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    outpatient_outcome_id UUID NOT NULL UNIQUE
        REFERENCES outpatient_outcome(id) ON DELETE CASCADE,

    -- Each dimension is 1 (no problems) to 5 (extreme problems); null if unanswered.
    before_mobility SMALLINT CHECK (before_mobility BETWEEN 1 AND 5),
    before_self_care SMALLINT CHECK (before_self_care BETWEEN 1 AND 5),
    before_usual_activities SMALLINT CHECK (before_usual_activities BETWEEN 1 AND 5),
    before_pain_discomfort SMALLINT CHECK (before_pain_discomfort BETWEEN 1 AND 5),
    before_anxiety_depression SMALLINT CHECK (before_anxiety_depression BETWEEN 1 AND 5),
    before_vas SMALLINT CHECK (before_vas BETWEEN 0 AND 100),

    after_mobility SMALLINT CHECK (after_mobility BETWEEN 1 AND 5),
    after_self_care SMALLINT CHECK (after_self_care BETWEEN 1 AND 5),
    after_usual_activities SMALLINT CHECK (after_usual_activities BETWEEN 1 AND 5),
    after_pain_discomfort SMALLINT CHECK (after_pain_discomfort BETWEEN 1 AND 5),
    after_anxiety_depression SMALLINT CHECK (after_anxiety_depression BETWEEN 1 AND 5),
    after_vas SMALLINT CHECK (after_vas BETWEEN 0 AND 100)
);

CREATE TRIGGER trigger_assessment_prom_eq5d5l_updated_at
    BEFORE UPDATE ON assessment_prom_eq5d5l
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_prom_eq5d5l IS
    'EQ-5D-5L PROM responses (before and after treatment): five dimensions (1-5) and VAS (0-100). © EuroQol Research Foundation; item wording paraphrased in the UI; production use requires a licence.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.outpatient_outcome_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.before_mobility IS
    'EQ-5D-5L mobility dimension before treatment (1 = no problems … 5 = extreme).';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.before_self_care IS
    'EQ-5D-5L self-care dimension before treatment.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.before_usual_activities IS
    'EQ-5D-5L usual-activities dimension before treatment.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.before_pain_discomfort IS
    'EQ-5D-5L pain/discomfort dimension before treatment.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.before_anxiety_depression IS
    'EQ-5D-5L anxiety/depression dimension before treatment.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.before_vas IS
    'EQ VAS health-rating 0-100 before treatment.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.after_mobility IS
    'EQ-5D-5L mobility dimension after treatment.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.after_self_care IS
    'EQ-5D-5L self-care dimension after treatment.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.after_usual_activities IS
    'EQ-5D-5L usual-activities dimension after treatment.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.after_pain_discomfort IS
    'EQ-5D-5L pain/discomfort dimension after treatment.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.after_anxiety_depression IS
    'EQ-5D-5L anxiety/depression dimension after treatment.';
COMMENT ON COLUMN outpatient_outcome_prom_eq5d5l.after_vas IS
    'EQ VAS health-rating 0-100 after treatment.';
