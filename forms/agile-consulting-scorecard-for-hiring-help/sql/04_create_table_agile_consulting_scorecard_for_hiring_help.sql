-- The main assessment record for the agile-consulting scorecard. Holds
-- organization and respondent metadata plus the sixteen yes/no items
-- (4 from the Agile Manifesto, 12 from the Agile Principles) with a
-- per-item evidence note. Computed scores live in the
-- agile_consulting_scorecard_for_hiring_help_grade child table.

CREATE TABLE agile_consulting_scorecard_for_hiring_help (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    organization_id UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    respondent_id UUID NOT NULL REFERENCES respondent(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'in-progress', 'submitted', 'finalized', 'cancelled')),
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    submitted_at TIMESTAMPTZ,
    finalized_at TIMESTAMPTZ,

    -- Manifesto item 1: Individuals and interactions over processes and tools
    m1_done BOOLEAN,
    m1_evidence TEXT NOT NULL DEFAULT '',

    -- Manifesto item 2: Working software over comprehensive documentation
    m2_done BOOLEAN,
    m2_evidence TEXT NOT NULL DEFAULT '',

    -- Manifesto item 3: Customer collaboration over contract negotiation
    m3_done BOOLEAN,
    m3_evidence TEXT NOT NULL DEFAULT '',

    -- Manifesto item 4: Responding to change over following a plan
    m4_done BOOLEAN,
    m4_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 1: Highest priority is customer satisfaction (NPS)
    p1_done BOOLEAN,
    p1_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 2: Welcome changing requirements (i18n hello world)
    p2_done BOOLEAN,
    p2_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 3: Deliver working software frequently (i18n shipped)
    p3_done BOOLEAN,
    p3_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 4: Business and developers work together daily (lead commitment)
    p4_done BOOLEAN,
    p4_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 5: Motivated individuals + environment + trust (3-amigos MVP)
    p5_done BOOLEAN,
    p5_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 6: Face-to-face conversation (>=50% time)
    p6_done BOOLEAN,
    p6_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 7: Working software is the primary measure (fizz buzz shipped)
    p7_done BOOLEAN,
    p7_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 8: Sustainable pace (1-year staff budget)
    p8_done BOOLEAN,
    p8_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 9: Technical excellence and good design (precommit + CI metrics)
    p9_done BOOLEAN,
    p9_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 10: Simplicity (>=2 process-improvement experts per team)
    p10_done BOOLEAN,
    p10_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 11: Self-organizing teams (Likert >= "Agree")
    p11_done BOOLEAN,
    p11_evidence TEXT NOT NULL DEFAULT '',

    -- Principle 12: Reflection at regular intervals (last 2 retros shared)
    p12_done BOOLEAN,
    p12_evidence TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_agile_consulting_scorecard_for_hiring_help_updated_at
    BEFORE UPDATE ON agile_consulting_scorecard_for_hiring_help
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_consulting_scorecard_for_hiring_help IS
    'A single agile-consulting readiness scorecard for an organization, captured via a 6-step single-page wizard. Holds organization/respondent FKs, the 16 yes/no items (4 manifesto + 12 principles), and per-item evidence text. Computed scores live in the *_grade child table.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.organization_id IS
    'Foreign key to the organization being assessed.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.respondent_id IS
    'Foreign key to the respondent who filled out the scorecard.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.status IS
    'Lifecycle status: draft, in-progress, submitted, finalized, cancelled.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.assessment_date IS
    'Date the scorecard was completed (defaults to today).';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.submitted_at IS
    'Timestamp the respondent submitted the scorecard.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.finalized_at IS
    'Timestamp the scorecard was finalized (signed off).';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.m1_done IS
    'Manifesto 1 (Individuals and interactions): every leader is in conversation with customers >=1 hour/week, with weekly results radiated to stakeholders. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.m1_evidence IS
    'Manifesto 1: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.m2_done IS
    'Manifesto 2 (Working software): the team has launched a brand-new "hello world" program to production and discussed the experience. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.m2_evidence IS
    'Manifesto 2: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.m3_done IS
    'Manifesto 3 (Customer collaboration): the organization has bought copies of the customer''s favourite book and shared with the team (org spend, not personal). NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.m3_evidence IS
    'Manifesto 3: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.m4_done IS
    'Manifesto 4 (Responding to change): every senior leader (BoD/CXO/VP/Dir) has read one agile change-management book and shared three takeaways. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.m4_evidence IS
    'Manifesto 4: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p1_done IS
    'Principle 1 (Customer satisfaction): every product lead measures customer Net Promoter Score (NPS). NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p1_evidence IS
    'Principle 1: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p2_done IS
    'Principle 2 (Welcome change): the "hello world" program has been internationalized to >=1 additional language using the user locale. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p2_evidence IS
    'Principle 2: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p3_done IS
    'Principle 3 (Deliver frequently): the internationalized "hello world" version has been launched to production and verified by a native speaker. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p3_evidence IS
    'Principle 3: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p4_done IS
    'Principle 4 (Business and developers together): commitment is in place from every product/project/programme/practice lead. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p4_evidence IS
    'Principle 4: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p5_done IS
    'Principle 5 (Motivated individuals): a 3-amigos team (business+dev+test) has shipped a real new MVP within 30 days and on budget. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p5_evidence IS
    'Principle 5: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p6_done IS
    'Principle 6 (Face-to-face): every product owner has committed to >=50% face-to-face time (or weekly-video equivalent for remote teams). NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p6_evidence IS
    'Principle 6: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p7_done IS
    'Principle 7 (Working software is primary measure): a new "fizz buzz" program has been created and shipped to production. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p7_evidence IS
    'Principle 7: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p8_done IS
    'Principle 8 (Sustainable pace): all staff have a sustaining budget for >=1 year secured. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p8_evidence IS
    'Principle 8: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p9_done IS
    'Principle 9 (Technical excellence): quality-attribute metrics are wired into pre-commit hooks and CI. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p9_evidence IS
    'Principle 9: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p10_done IS
    'Principle 10 (Simplicity): every product team has >=2 people with process-improvement skills (Lean/Six Sigma/VSM/TPS/TPC). NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p10_evidence IS
    'Principle 10: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p11_done IS
    'Principle 11 (Self-organizing teams): a 5-point Likert "our team is self-organizing" averages "Agree" or better. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p11_evidence IS
    'Principle 11: free-text evidence supporting the answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p12_done IS
    'Principle 12 (Reflection): every leader has shared their previous 2 retrospectives with all stakeholders. NULL = unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help.p12_evidence IS
    'Principle 12: free-text evidence supporting the answer.';

CREATE INDEX agile_consulting_scorecard_index_organization_id
    ON agile_consulting_scorecard_for_hiring_help(organization_id);
CREATE INDEX agile_consulting_scorecard_index_respondent_id
    ON agile_consulting_scorecard_for_hiring_help(respondent_id);
CREATE INDEX agile_consulting_scorecard_index_status
    ON agile_consulting_scorecard_for_hiring_help(status);
CREATE INDEX agile_consulting_scorecard_index_assessment_date
    ON agile_consulting_scorecard_for_hiring_help(assessment_date);
