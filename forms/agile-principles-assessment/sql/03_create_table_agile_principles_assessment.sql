CREATE TABLE agile_principles_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    respondent_id UUID NOT NULL REFERENCES respondent(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed')),
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    assessment_date DATE,
    assessment_period VARCHAR(50) NOT NULL DEFAULT '' CHECK (assessment_period IN (
        'sprint',
        'quarter',
        'half-year',
        'annual',
        'ad-hoc',
        ''
    )),
    p01_customer_satisfaction SMALLINT CHECK (
        p01_customer_satisfaction IS NULL OR p01_customer_satisfaction BETWEEN 1 AND 5
    ),
    p01_comment TEXT NOT NULL DEFAULT '',
    p01_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p01_weight BETWEEN 0.50 AND 2.00),
    p02_welcome_change SMALLINT CHECK (
        p02_welcome_change IS NULL OR p02_welcome_change BETWEEN 1 AND 5
    ),
    p02_comment TEXT NOT NULL DEFAULT '',
    p02_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p02_weight BETWEEN 0.50 AND 2.00),
    p03_deliver_frequently SMALLINT CHECK (
        p03_deliver_frequently IS NULL OR p03_deliver_frequently BETWEEN 1 AND 5
    ),
    p03_comment TEXT NOT NULL DEFAULT '',
    p03_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p03_weight BETWEEN 0.50 AND 2.00),
    p04_collaboration SMALLINT CHECK (
        p04_collaboration IS NULL OR p04_collaboration BETWEEN 1 AND 5
    ),
    p04_comment TEXT NOT NULL DEFAULT '',
    p04_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p04_weight BETWEEN 0.50 AND 2.00),
    p05_motivated_individuals SMALLINT CHECK (
        p05_motivated_individuals IS NULL OR p05_motivated_individuals BETWEEN 1 AND 5
    ),
    p05_comment TEXT NOT NULL DEFAULT '',
    p05_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p05_weight BETWEEN 0.50 AND 2.00),
    p06_face_to_face SMALLINT CHECK (
        p06_face_to_face IS NULL OR p06_face_to_face BETWEEN 1 AND 5
    ),
    p06_comment TEXT NOT NULL DEFAULT '',
    p06_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p06_weight BETWEEN 0.50 AND 2.00),
    p07_working_software SMALLINT CHECK (
        p07_working_software IS NULL OR p07_working_software BETWEEN 1 AND 5
    ),
    p07_comment TEXT NOT NULL DEFAULT '',
    p07_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p07_weight BETWEEN 0.50 AND 2.00),
    p08_sustainable_development SMALLINT CHECK (
        p08_sustainable_development IS NULL OR p08_sustainable_development BETWEEN 1 AND 5
    ),
    p08_comment TEXT NOT NULL DEFAULT '',
    p08_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p08_weight BETWEEN 0.50 AND 2.00),
    p09_technical_excellence SMALLINT CHECK (
        p09_technical_excellence IS NULL OR p09_technical_excellence BETWEEN 1 AND 5
    ),
    p09_comment TEXT NOT NULL DEFAULT '',
    p09_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p09_weight BETWEEN 0.50 AND 2.00),
    p10_simplicity SMALLINT CHECK (
        p10_simplicity IS NULL OR p10_simplicity BETWEEN 1 AND 5
    ),
    p10_comment TEXT NOT NULL DEFAULT '',
    p10_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p10_weight BETWEEN 0.50 AND 2.00),
    p11_self_organising_teams SMALLINT CHECK (
        p11_self_organising_teams IS NULL OR p11_self_organising_teams BETWEEN 1 AND 5
    ),
    p11_comment TEXT NOT NULL DEFAULT '',
    p11_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p11_weight BETWEEN 0.50 AND 2.00),
    p12_regular_reflection SMALLINT CHECK (
        p12_regular_reflection IS NULL OR p12_regular_reflection BETWEEN 1 AND 5
    ),
    p12_comment TEXT NOT NULL DEFAULT '',
    p12_weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (p12_weight BETWEEN 0.50 AND 2.00),
    overall_notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_agile_principles_assessment_updated_at
    BEFORE UPDATE ON agile_principles_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_principles_assessment IS
    'One row per submission. Stores the 12 Agile Manifesto principle Likert scores (1-5, nullable when unanswered) and free-text comments per principle. Composite maturity is computed in agile_principles_assessment_grade.';
COMMENT ON COLUMN agile_principles_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_principles_assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_principles_assessment.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_principles_assessment.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_principles_assessment.respondent_id IS
    'Foreign key to the respondent who completed this assessment.';
COMMENT ON COLUMN agile_principles_assessment.status IS
    'Lifecycle status: draft, submitted, or reviewed.';
COMMENT ON COLUMN agile_principles_assessment.is_anonymous IS
    'TRUE when the respondent chose to submit anonymously; renderers must mask name, email, and role for these rows.';
COMMENT ON COLUMN agile_principles_assessment.assessment_date IS
    'Date on which the assessment was completed.';
COMMENT ON COLUMN agile_principles_assessment.assessment_period IS
    'Cadence of the assessment: sprint, quarter, half-year, annual, or ad-hoc.';
COMMENT ON COLUMN agile_principles_assessment.p01_customer_satisfaction IS
    'Likert 1-5 for principle 1: highest priority is to satisfy the customer through early and continuous delivery of valuable software.';
COMMENT ON COLUMN agile_principles_assessment.p01_comment IS
    'Free-text comment for principle 1.';
COMMENT ON COLUMN agile_principles_assessment.p02_welcome_change IS
    'Likert 1-5 for principle 2: changing requirements are welcomed, even late in development, to harness competitive advantage.';
COMMENT ON COLUMN agile_principles_assessment.p02_comment IS
    'Free-text comment for principle 2.';
COMMENT ON COLUMN agile_principles_assessment.p03_deliver_frequently IS
    'Likert 1-5 for principle 3: deliver working software frequently, within a few weeks or months.';
COMMENT ON COLUMN agile_principles_assessment.p03_comment IS
    'Free-text comment for principle 3.';
COMMENT ON COLUMN agile_principles_assessment.p04_collaboration IS
    'Likert 1-5 for principle 4: business stakeholders and developers must work together daily.';
COMMENT ON COLUMN agile_principles_assessment.p04_comment IS
    'Free-text comment for principle 4.';
COMMENT ON COLUMN agile_principles_assessment.p05_motivated_individuals IS
    'Likert 1-5 for principle 5: build projects around motivated individuals, providing them with the environment and support needed.';
COMMENT ON COLUMN agile_principles_assessment.p05_comment IS
    'Free-text comment for principle 5.';
COMMENT ON COLUMN agile_principles_assessment.p06_face_to_face IS
    'Likert 1-5 for principle 6: the most efficient method for conveying information within a development team is face-to-face communication.';
COMMENT ON COLUMN agile_principles_assessment.p06_comment IS
    'Free-text comment for principle 6.';
COMMENT ON COLUMN agile_principles_assessment.p07_working_software IS
    'Likert 1-5 for principle 7: working software is the primary measure of progress.';
COMMENT ON COLUMN agile_principles_assessment.p07_comment IS
    'Free-text comment for principle 7.';
COMMENT ON COLUMN agile_principles_assessment.p08_sustainable_development IS
    'Likert 1-5 for principle 8: agile processes promote a sustainable, consistent pace for developers and users.';
COMMENT ON COLUMN agile_principles_assessment.p08_comment IS
    'Free-text comment for principle 8.';
COMMENT ON COLUMN agile_principles_assessment.p09_technical_excellence IS
    'Likert 1-5 for principle 9: continuous attention to technical excellence and good design enhances agility.';
COMMENT ON COLUMN agile_principles_assessment.p09_comment IS
    'Free-text comment for principle 9.';
COMMENT ON COLUMN agile_principles_assessment.p10_simplicity IS
    'Likert 1-5 for principle 10: the art of maximising the amount of work not done is essential.';
COMMENT ON COLUMN agile_principles_assessment.p10_comment IS
    'Free-text comment for principle 10.';
COMMENT ON COLUMN agile_principles_assessment.p11_self_organising_teams IS
    'Likert 1-5 for principle 11: the best architectures, requirements, and designs emerge from self-organising teams.';
COMMENT ON COLUMN agile_principles_assessment.p11_comment IS
    'Free-text comment for principle 11.';
COMMENT ON COLUMN agile_principles_assessment.p12_regular_reflection IS
    'Likert 1-5 for principle 12: at regular intervals, the team reflects on how to become more effective, then adjusts behaviour accordingly.';
COMMENT ON COLUMN agile_principles_assessment.p12_comment IS
    'Free-text comment for principle 12.';
COMMENT ON COLUMN agile_principles_assessment.p01_weight IS
    'Configurable weight for principle 1, range 0.50-2.00, default 1.00. Affects the weighted-mean composite maturity.';
COMMENT ON COLUMN agile_principles_assessment.p02_weight IS
    'Configurable weight for principle 2, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.p03_weight IS
    'Configurable weight for principle 3, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.p04_weight IS
    'Configurable weight for principle 4, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.p05_weight IS
    'Configurable weight for principle 5, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.p06_weight IS
    'Configurable weight for principle 6, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.p07_weight IS
    'Configurable weight for principle 7, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.p08_weight IS
    'Configurable weight for principle 8, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.p09_weight IS
    'Configurable weight for principle 9, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.p10_weight IS
    'Configurable weight for principle 10, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.p11_weight IS
    'Configurable weight for principle 11, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.p12_weight IS
    'Configurable weight for principle 12, range 0.50-2.00, default 1.00.';
COMMENT ON COLUMN agile_principles_assessment.overall_notes IS
    'Free-text overall notes captured on the summary step.';
