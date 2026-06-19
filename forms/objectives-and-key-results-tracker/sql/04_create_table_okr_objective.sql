--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_objective (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    reporter_id UUID NOT NULL REFERENCES reporter(id) ON DELETE CASCADE,
    parent_objective_id UUID REFERENCES okr_objective(id) ON DELETE SET NULL,

    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft','active','at-risk','achieved','missed','retired','cancelled')),
    level TEXT NOT NULL DEFAULT ''
        CHECK (level IN ('individual','team','department','company','')),
    cycle TEXT NOT NULL DEFAULT ''
        CHECK (cycle IN ('monthly','quarterly','half-yearly','annual','custom','')),
    cycle_start_date DATE,
    cycle_end_date DATE,

    team_or_org_name TEXT NOT NULL DEFAULT '',
    strategic_theme TEXT NOT NULL DEFAULT '',
    external_reference TEXT NOT NULL DEFAULT '',

    -- Step 2: Objective
    obj_title TEXT NOT NULL DEFAULT '',
    obj_long_description TEXT NOT NULL DEFAULT '',

    -- Step 4: Strategic alignment
    sa_parent_summary TEXT NOT NULL DEFAULT '',
    sa_business_value_statement TEXT NOT NULL DEFAULT '',

    -- Step 6: Initiatives
    in_initiatives TEXT NOT NULL DEFAULT '',
    in_supporting_links TEXT NOT NULL DEFAULT '',

    -- Step 7: Risks & dependencies
    rk_known_risks TEXT NOT NULL DEFAULT '',
    rk_dependencies TEXT NOT NULL DEFAULT '',
    rk_blockers TEXT NOT NULL DEFAULT '',
    rk_mitigation_plans TEXT NOT NULL DEFAULT '',

    -- Step 9: Forecast
    fc_expected_end_state TEXT NOT NULL DEFAULT '',
    fc_residual_risk TEXT NOT NULL DEFAULT '',

    -- Raw input scores (the seven scales)
    score_by_progress_percent NUMERIC(5,2)
        CHECK (score_by_progress_percent IS NULL OR score_by_progress_percent BETWEEN 0 AND 100),
    score_by_confidence_decile INTEGER
        CHECK (score_by_confidence_decile IS NULL OR score_by_confidence_decile BETWEEN 1 AND 10),
    score_by_stretch_tier INTEGER
        CHECK (score_by_stretch_tier IS NULL OR score_by_stretch_tier BETWEEN 1 AND 3),
    score_by_alignment_grade INTEGER
        CHECK (score_by_alignment_grade IS NULL OR score_by_alignment_grade BETWEEN 1 AND 5),
    score_by_impact_tier INTEGER
        CHECK (score_by_impact_tier IS NULL OR score_by_impact_tier BETWEEN 1 AND 5),
    score_by_smart_quality INTEGER
        CHECK (score_by_smart_quality IS NULL OR score_by_smart_quality BETWEEN 0 AND 5),
    score_by_pace_deviation_percent NUMERIC(5,2)
        CHECK (score_by_pace_deviation_percent IS NULL OR score_by_pace_deviation_percent BETWEEN -100 AND 100)
);

CREATE TRIGGER trigger_okr_objective_updated_at
    BEFORE UPDATE ON okr_objective
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

ALTER TABLE participant
    ADD CONSTRAINT participant_okr_objective_id_fkey
    FOREIGN KEY (okr_objective_id) REFERENCES okr_objective(id) ON DELETE CASCADE;

CREATE INDEX okr_objective_index_reporter_id ON okr_objective(reporter_id);
CREATE INDEX okr_objective_index_parent_objective_id ON okr_objective(parent_objective_id);
CREATE INDEX okr_objective_index_status ON okr_objective(status);
CREATE INDEX okr_objective_index_level ON okr_objective(level);
CREATE INDEX okr_objective_index_cycle ON okr_objective(cycle);
CREATE INDEX okr_objective_index_obj_title_trgm
    ON okr_objective
    USING GIN (obj_title gin_trgm_ops);

COMMENT ON TABLE okr_objective IS
    'Main OKR objective row. Holds reporter and metadata, all step fields, and the seven raw input scores. Computed scores live in okr_grade.';
COMMENT ON COLUMN okr_objective.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_objective.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_objective.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_objective.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_objective.reporter_id IS 'Foreign key to the reporter who submitted the objective.';
COMMENT ON COLUMN okr_objective.parent_objective_id IS
    'Self-referential foreign key: the parent objective this one ladders up to. NULL for top-level objectives.';
COMMENT ON COLUMN okr_objective.status IS
    'Lifecycle status: draft, active, at-risk, achieved, missed, retired, cancelled.';
COMMENT ON COLUMN okr_objective.level IS
    'Organisational level: individual, team, department, company.';
COMMENT ON COLUMN okr_objective.cycle IS
    'Time horizon: monthly, quarterly, half-yearly, annual, custom.';
COMMENT ON COLUMN okr_objective.cycle_start_date IS 'First day of the OKR cycle.';
COMMENT ON COLUMN okr_objective.cycle_end_date IS 'Last day of the OKR cycle.';
COMMENT ON COLUMN okr_objective.team_or_org_name IS 'Owning team or organisational unit name.';
COMMENT ON COLUMN okr_objective.strategic_theme IS 'Strategic theme or pillar this objective ladders to.';
COMMENT ON COLUMN okr_objective.external_reference IS 'External tracker id, ticket, or strategy doc reference.';
COMMENT ON COLUMN okr_objective.obj_title IS 'Step 2: one-sentence qualitative objective statement.';
COMMENT ON COLUMN okr_objective.obj_long_description IS 'Step 2: free-text long description of the objective.';
COMMENT ON COLUMN okr_objective.sa_parent_summary IS
    'Step 4: how this objective ladders to the parent or to the mission.';
COMMENT ON COLUMN okr_objective.sa_business_value_statement IS
    'Step 4: business value statement — why this objective matters.';
COMMENT ON COLUMN okr_objective.in_initiatives IS
    'Step 6: planned actions, projects, programmes that drive each KR.';
COMMENT ON COLUMN okr_objective.in_supporting_links IS 'Step 6: free-text supporting links and references.';
COMMENT ON COLUMN okr_objective.rk_known_risks IS 'Step 7: known risks to achieving the objective.';
COMMENT ON COLUMN okr_objective.rk_dependencies IS 'Step 7: external dependencies.';
COMMENT ON COLUMN okr_objective.rk_blockers IS 'Step 7: current blockers.';
COMMENT ON COLUMN okr_objective.rk_mitigation_plans IS 'Step 7: planned mitigations for the risks above.';
COMMENT ON COLUMN okr_objective.fc_expected_end_state IS
    'Step 9: forecast — expected end-of-cycle state per KR (free text).';
COMMENT ON COLUMN okr_objective.fc_residual_risk IS 'Step 9: residual risk to the objective at end-of-cycle.';
COMMENT ON COLUMN okr_objective.score_by_progress_percent IS
    'Score 1 of 7: progress percent 0-100. Mean of per-KR progress_fraction (clamped) expressed as percent.';
COMMENT ON COLUMN okr_objective.score_by_confidence_decile IS
    'Score 2 of 7: owner confidence decile 1-10.';
COMMENT ON COLUMN okr_objective.score_by_stretch_tier IS
    'Score 3 of 7: stretch tier 1-3 — 1=committed, 2=aspirational, 3=moonshot.';
COMMENT ON COLUMN okr_objective.score_by_alignment_grade IS
    'Score 4 of 7: alignment grade 1-5 to parent or strategic theme.';
COMMENT ON COLUMN okr_objective.score_by_impact_tier IS
    'Score 5 of 7: impact tier 1-5 — business value if achieved.';
COMMENT ON COLUMN okr_objective.score_by_smart_quality IS
    'Score 6 of 7: SMART criteria count 0-5 (Specific, Measurable, Achievable, Relevant, Time-bound).';
COMMENT ON COLUMN okr_objective.score_by_pace_deviation_percent IS
    'Score 7 of 7: pace deviation percent -100..+100 from expected linear pace at this point in the cycle.';

--rollback DROP TABLE okr_objective CASCADE;
