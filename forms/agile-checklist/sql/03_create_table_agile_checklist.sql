CREATE DOMAIN agile_checklist_answer AS VARCHAR(20)
    CHECK (VALUE IN ('yes', 'no', 'not-applicable', ''));

COMMENT ON DOMAIN agile_checklist_answer IS
    'Per-item answer: yes, no, not-applicable, or empty string for unanswered.';

CREATE TABLE agile_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    respondent_id UUID NOT NULL REFERENCES respondent(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed')),
    assessment_date DATE,
    assessment_period VARCHAR(50) NOT NULL DEFAULT '' CHECK (assessment_period IN (
        'sprint',
        'quarter',
        'half-year',
        'annual',
        'ad-hoc',
        ''
    )),

    -- Section 1: Teams (25 items)
    t01_problems_to_solve            agile_checklist_answer NOT NULL DEFAULT '',
    t02_decisions_without_manager    agile_checklist_answer NOT NULL DEFAULT '',
    t03_adopt_and_improve_practices  agile_checklist_answer NOT NULL DEFAULT '',
    t04_actively_coordinate          agile_checklist_answer NOT NULL DEFAULT '',
    t05_openly_share_ideas           agile_checklist_answer NOT NULL DEFAULT '',
    t06_decide_how_to_execute        agile_checklist_answer NOT NULL DEFAULT '',
    t07_act_on_feedback              agile_checklist_answer NOT NULL DEFAULT '',
    t08_rarely_wait                  agile_checklist_answer NOT NULL DEFAULT '',
    t09_fully_complete_work          agile_checklist_answer NOT NULL DEFAULT '',
    t10_manage_own_performance       agile_checklist_answer NOT NULL DEFAULT '',
    t11_understand_agile             agile_checklist_answer NOT NULL DEFAULT '',
    t12_high_quality                 agile_checklist_answer NOT NULL DEFAULT '',
    t13_welcome_change               agile_checklist_answer NOT NULL DEFAULT '',
    t14_collaborate_to_finish        agile_checklist_answer NOT NULL DEFAULT '',
    t15_admit_mistakes               agile_checklist_answer NOT NULL DEFAULT '',
    t16_work_outside_specialty       agile_checklist_answer NOT NULL DEFAULT '',
    t17_seek_new_skills              agile_checklist_answer NOT NULL DEFAULT '',
    t18_improve_skills               agile_checklist_answer NOT NULL DEFAULT '',
    t19_improve_ways_of_working      agile_checklist_answer NOT NULL DEFAULT '',
    t20_various_ways_communicating   agile_checklist_answer NOT NULL DEFAULT '',
    t21_received_basic_training      agile_checklist_answer NOT NULL DEFAULT '',
    t22_safe_to_dissent              agile_checklist_answer NOT NULL DEFAULT '',
    t23_start_with_open_issues       agile_checklist_answer NOT NULL DEFAULT '',
    t24_motivated                    agile_checklist_answer NOT NULL DEFAULT '',
    t25_pride_in_craft               agile_checklist_answer NOT NULL DEFAULT '',

    -- Section 2: Stakeholders (14 items)
    s01_know_priority_factors        agile_checklist_answer NOT NULL DEFAULT '',
    s02_accept_plan_ranges           agile_checklist_answer NOT NULL DEFAULT '',
    s03_accept_plan_changes          agile_checklist_answer NOT NULL DEFAULT '',
    s04_evaluate_product             agile_checklist_answer NOT NULL DEFAULT '',
    s05_champion_agile               agile_checklist_answer NOT NULL DEFAULT '',
    s06_respect_quality              agile_checklist_answer NOT NULL DEFAULT '',
    s07_delegate_authority           agile_checklist_answer NOT NULL DEFAULT '',
    s08_keep_authority_delegated     agile_checklist_answer NOT NULL DEFAULT '',
    s09_support_experiments          agile_checklist_answer NOT NULL DEFAULT '',
    s10_no_punish_experiments        agile_checklist_answer NOT NULL DEFAULT '',
    s11_communicate_agile_goals      agile_checklist_answer NOT NULL DEFAULT '',
    s12_encourage_new_skills         agile_checklist_answer NOT NULL DEFAULT '',
    s13_encourage_new_ways           agile_checklist_answer NOT NULL DEFAULT '',
    s14_develop_people               agile_checklist_answer NOT NULL DEFAULT '',

    -- Section 3: Practices (18 items)
    p01_early_good_release           agile_checklist_answer NOT NULL DEFAULT '',
    p02_educated_sponsor             agile_checklist_answer NOT NULL DEFAULT '',
    p03_quick_decisions              agile_checklist_answer NOT NULL DEFAULT '',
    p04_plans_data_based             agile_checklist_answer NOT NULL DEFAULT '',
    p05_proactive_dependencies       agile_checklist_answer NOT NULL DEFAULT '',
    p06_good_intentions              agile_checklist_answer NOT NULL DEFAULT '',
    p07_reciprocal_trust             agile_checklist_answer NOT NULL DEFAULT '',
    p08_docs_plus_conversations      agile_checklist_answer NOT NULL DEFAULT '',
    p09_update_plans                 agile_checklist_answer NOT NULL DEFAULT '',
    p10_non_punitive                 agile_checklist_answer NOT NULL DEFAULT '',
    p11_outside_groups_aware         agile_checklist_answer NOT NULL DEFAULT '',
    p12_finished_over_wip            agile_checklist_answer NOT NULL DEFAULT '',
    p13_quality_over_deadline        agile_checklist_answer NOT NULL DEFAULT '',
    p14_solution_over_blame          agile_checklist_answer NOT NULL DEFAULT '',
    p15_change_agents_in_place       agile_checklist_answer NOT NULL DEFAULT '',
    p16_agile_beyond_origin          agile_checklist_answer NOT NULL DEFAULT '',
    p17_one_team                     agile_checklist_answer NOT NULL DEFAULT '',
    p18_honor_commitments            agile_checklist_answer NOT NULL DEFAULT '',

    overall_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX index_agile_checklist_respondent_id
    ON agile_checklist(respondent_id);

CREATE TRIGGER trigger_agile_checklist_updated_at
    BEFORE UPDATE ON agile_checklist
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_checklist IS
    'One row per submission. Stores answers to the 57 agile-checklist behaviour items grouped by section (Teams t01-t25, Stakeholders s01-s14, Practices p01-p18). Each column accepts yes / no / not-applicable / empty-string. Composite maturity is computed in agile_checklist_grade.';
COMMENT ON COLUMN agile_checklist.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_checklist.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_checklist.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_checklist.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_checklist.respondent_id IS
    'Foreign key to the respondent who completed this checklist.';
COMMENT ON COLUMN agile_checklist.status IS
    'Lifecycle status: draft, submitted, or reviewed.';
COMMENT ON COLUMN agile_checklist.assessment_date IS
    'Date on which the assessment was completed.';
COMMENT ON COLUMN agile_checklist.assessment_period IS
    'Cadence of the assessment: sprint, quarter, half-year, annual, or ad-hoc.';

COMMENT ON COLUMN agile_checklist.t01_problems_to_solve IS
    'Teams item 1: teams have problems to solve rather than lists of tasks to perform.';
COMMENT ON COLUMN agile_checklist.t02_decisions_without_manager IS
    'Teams item 2: teams generally make decisions without a manager''s approval.';
COMMENT ON COLUMN agile_checklist.t03_adopt_and_improve_practices IS
    'Teams item 3: teams adopt appropriate practices and improve them over time.';
COMMENT ON COLUMN agile_checklist.t04_actively_coordinate IS
    'Teams item 4: teams working on a common product actively coordinate.';
COMMENT ON COLUMN agile_checklist.t05_openly_share_ideas IS
    'Teams item 5: teams openly share new ideas and experiences with others.';
COMMENT ON COLUMN agile_checklist.t06_decide_how_to_execute IS
    'Teams item 6: teams decide how to execute work.';
COMMENT ON COLUMN agile_checklist.t07_act_on_feedback IS
    'Teams item 7: teams quickly act on stakeholder feedback to improve the product.';
COMMENT ON COLUMN agile_checklist.t08_rarely_wait IS
    'Teams item 8: teams rarely wait for work to be completed by others.';
COMMENT ON COLUMN agile_checklist.t09_fully_complete_work IS
    'Teams item 9: teams make every effort to fully complete all planned work.';
COMMENT ON COLUMN agile_checklist.t10_manage_own_performance IS
    'Teams item 10: teams monitor and manage their own performance.';
COMMENT ON COLUMN agile_checklist.t11_understand_agile IS
    'Teams item 11: teams understand the benefits and challenges of agile.';
COMMENT ON COLUMN agile_checklist.t12_high_quality IS
    'Teams item 12: teams responsibly deliver high quality work.';
COMMENT ON COLUMN agile_checklist.t13_welcome_change IS
    'Teams item 13: teams welcome rather than resist changing requirements.';
COMMENT ON COLUMN agile_checklist.t14_collaborate_to_finish IS
    'Teams item 14: teams collaborate to finish items.';
COMMENT ON COLUMN agile_checklist.t15_admit_mistakes IS
    'Teams item 15: teams admit challenges and mistakes.';
COMMENT ON COLUMN agile_checklist.t16_work_outside_specialty IS
    'Teams item 16: teams can work outside their specialties to achieve goals.';
COMMENT ON COLUMN agile_checklist.t17_seek_new_skills IS
    'Teams item 17: teams seek to learn relevant, new skills.';
COMMENT ON COLUMN agile_checklist.t18_improve_skills IS
    'Teams item 18: teams continue to learn and improve skills.';
COMMENT ON COLUMN agile_checklist.t19_improve_ways_of_working IS
    'Teams item 19: teams actively seek ways to improve ways of working.';
COMMENT ON COLUMN agile_checklist.t20_various_ways_communicating IS
    'Teams item 20: teams choose and use various ways of communicating.';
COMMENT ON COLUMN agile_checklist.t21_received_basic_training IS
    'Teams item 21: teams have all received basic training on agile concepts.';
COMMENT ON COLUMN agile_checklist.t22_safe_to_dissent IS
    'Teams item 22: teams feel safe to express dissenting views.';
COMMENT ON COLUMN agile_checklist.t23_start_with_open_issues IS
    'Teams item 23: teams start work even when some open issues remain.';
COMMENT ON COLUMN agile_checklist.t24_motivated IS
    'Teams item 24: teams are motivated by performing their work.';
COMMENT ON COLUMN agile_checklist.t25_pride_in_craft IS
    'Teams item 25: teams take pride in their craft.';

COMMENT ON COLUMN agile_checklist.s01_know_priority_factors IS
    'Stakeholders item 1: stakeholders know which factors determine priorities and deadlines.';
COMMENT ON COLUMN agile_checklist.s02_accept_plan_ranges IS
    'Stakeholders item 2: stakeholders accept plans that are expressed with ranges.';
COMMENT ON COLUMN agile_checklist.s03_accept_plan_changes IS
    'Stakeholders item 3: stakeholders and the team accept that plans may need to change.';
COMMENT ON COLUMN agile_checklist.s04_evaluate_product IS
    'Stakeholders item 4: stakeholders have frequent opportunities to evaluate the product.';
COMMENT ON COLUMN agile_checklist.s05_champion_agile IS
    'Stakeholders item 5: stakeholders champion agile values and agile principles.';
COMMENT ON COLUMN agile_checklist.s06_respect_quality IS
    'Stakeholders item 6: stakeholders see quality as a right that the team has and they respect it.';
COMMENT ON COLUMN agile_checklist.s07_delegate_authority IS
    'Stakeholders item 7: stakeholders delegate authority to teams.';
COMMENT ON COLUMN agile_checklist.s08_keep_authority_delegated IS
    'Stakeholders item 8: stakeholders don''t take authority back at the first sign of trouble.';
COMMENT ON COLUMN agile_checklist.s09_support_experiments IS
    'Stakeholders item 9: stakeholders support teams in experimenting.';
COMMENT ON COLUMN agile_checklist.s10_no_punish_experiments IS
    'Stakeholders item 10: stakeholders don''t punish an unsuccessful experiment.';
COMMENT ON COLUMN agile_checklist.s11_communicate_agile_goals IS
    'Stakeholders item 11: stakeholders communicate what they hope to achieve by becoming more agile.';
COMMENT ON COLUMN agile_checklist.s12_encourage_new_skills IS
    'Stakeholders item 12: stakeholders actively encourage teams to learn new skills.';
COMMENT ON COLUMN agile_checklist.s13_encourage_new_ways IS
    'Stakeholders item 13: stakeholders actively encourage teams to learn new ways of working.';
COMMENT ON COLUMN agile_checklist.s14_develop_people IS
    'Stakeholders item 14: stakeholders develop people rather than manage their performance.';

COMMENT ON COLUMN agile_checklist.p01_early_good_release IS
    'Practices item 1: the early release of a good product is generally favoured over the later release of a perfect product.';
COMMENT ON COLUMN agile_checklist.p02_educated_sponsor IS
    'Practices item 2: an educated executive sponsor ensures the change agent is empowered to make decisions.';
COMMENT ON COLUMN agile_checklist.p03_quick_decisions IS
    'Practices item 3: decisions are made quickly, sometimes with incomplete knowledge.';
COMMENT ON COLUMN agile_checklist.p04_plans_data_based IS
    'Practices item 4: plans are based on data and experience.';
COMMENT ON COLUMN agile_checklist.p05_proactive_dependencies IS
    'Practices item 5: dependencies between teams are proactively identified and addressed.';
COMMENT ON COLUMN agile_checklist.p06_good_intentions IS
    'Practices item 6: people are assumed to have acted with good intentions even when something goes wrong.';
COMMENT ON COLUMN agile_checklist.p07_reciprocal_trust IS
    'Practices item 7: trust is reciprocal within the team and with stakeholders.';
COMMENT ON COLUMN agile_checklist.p08_docs_plus_conversations IS
    'Practices item 8: although formal documentation may exist, it is supplemented by conversations to the extent possible.';
COMMENT ON COLUMN agile_checklist.p09_update_plans IS
    'Practices item 9: as more is learned, plans are updated rather than remaining based on outdated information.';
COMMENT ON COLUMN agile_checklist.p10_non_punitive IS
    'Practices item 10: a non-punitive attitude leads to the team''s willingness to experiment with new tools, technologies, and ways of working.';
COMMENT ON COLUMN agile_checklist.p11_outside_groups_aware IS
    'Practices item 11: outside groups that partner with the team are aware of how this new way of working may affect their interactions.';
COMMENT ON COLUMN agile_checklist.p12_finished_over_wip IS
    'Practices item 12: the organisation places a higher value on finished work than it does on the number of work items in process.';
COMMENT ON COLUMN agile_checklist.p13_quality_over_deadline IS
    'Practices item 13: quality is rarely, if ever, sacrificed to meet a deadline.';
COMMENT ON COLUMN agile_checklist.p14_solution_over_blame IS
    'Practices item 14: when problems arise between teams, everyone focuses on a solution rather than blame.';
COMMENT ON COLUMN agile_checklist.p15_change_agents_in_place IS
    'Practices item 15: change agents are in place to help support and guide the transition.';
COMMENT ON COLUMN agile_checklist.p16_agile_beyond_origin IS
    'Practices item 16: agile practices are being implemented beyond the group in which agile began.';
COMMENT ON COLUMN agile_checklist.p17_one_team IS
    'Practices item 17: most people are assigned to only one team.';
COMMENT ON COLUMN agile_checklist.p18_honor_commitments IS
    'Practices item 18: people honour commitments and keep promises.';

COMMENT ON COLUMN agile_checklist.overall_notes IS
    'Free-text overall notes captured on the summary step.';
