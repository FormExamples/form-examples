#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::agile_checklists::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub respondent_id: Uuid,
    pub status: String,
    pub assessment_date: Option<Date>,
    pub assessment_period: String,
    pub t01_problems_to_solve: String,
    pub t02_decisions_without_manager: String,
    pub t03_adopt_and_improve_practices: String,
    pub t04_actively_coordinate: String,
    pub t05_openly_share_ideas: String,
    pub t06_decide_how_to_execute: String,
    pub t07_act_on_feedback: String,
    pub t08_rarely_wait: String,
    pub t09_fully_complete_work: String,
    pub t10_manage_own_performance: String,
    pub t11_understand_agile: String,
    pub t12_high_quality: String,
    pub t13_welcome_change: String,
    pub t14_collaborate_to_finish: String,
    pub t15_admit_mistakes: String,
    pub t16_work_outside_specialty: String,
    pub t17_seek_new_skills: String,
    pub t18_improve_skills: String,
    pub t19_improve_ways_of_working: String,
    pub t20_various_ways_communicating: String,
    pub t21_received_basic_training: String,
    pub t22_safe_to_dissent: String,
    pub t23_start_with_open_issues: String,
    pub t24_motivated: String,
    pub t25_pride_in_craft: String,
    pub s01_know_priority_factors: String,
    pub s02_accept_plan_ranges: String,
    pub s03_accept_plan_changes: String,
    pub s04_evaluate_product: String,
    pub s05_champion_agile: String,
    pub s06_respect_quality: String,
    pub s07_delegate_authority: String,
    pub s08_keep_authority_delegated: String,
    pub s09_support_experiments: String,
    pub s10_no_punish_experiments: String,
    pub s11_communicate_agile_goals: String,
    pub s12_encourage_new_skills: String,
    pub s13_encourage_new_ways: String,
    pub s14_develop_people: String,
    pub p01_early_good_release: String,
    pub p02_educated_sponsor: String,
    pub p03_quick_decisions: String,
    pub p04_plans_data_based: String,
    pub p05_proactive_dependencies: String,
    pub p06_good_intentions: String,
    pub p07_reciprocal_trust: String,
    pub p08_docs_plus_conversations: String,
    pub p09_update_plans: String,
    pub p10_non_punitive: String,
    pub p11_outside_groups_aware: String,
    pub p12_finished_over_wip: String,
    pub p13_quality_over_deadline: String,
    pub p14_solution_over_blame: String,
    pub p15_change_agents_in_place: String,
    pub p16_agile_beyond_origin: String,
    pub p17_one_team: String,
    pub p18_honor_commitments: String,
    pub overall_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO agile_checklists (respondent_id, status, assessment_date, \
            assessment_period, t01_problems_to_solve, t02_decisions_without_manager, \
            t03_adopt_and_improve_practices, t04_actively_coordinate, \
            t05_openly_share_ideas, t06_decide_how_to_execute, t07_act_on_feedback, \
            t08_rarely_wait, t09_fully_complete_work, t10_manage_own_performance, \
            t11_understand_agile, t12_high_quality, t13_welcome_change, \
            t14_collaborate_to_finish, t15_admit_mistakes, t16_work_outside_specialty, \
            t17_seek_new_skills, t18_improve_skills, t19_improve_ways_of_working, \
            t20_various_ways_communicating, t21_received_basic_training, \
            t22_safe_to_dissent, t23_start_with_open_issues, t24_motivated, \
            t25_pride_in_craft, s01_know_priority_factors, s02_accept_plan_ranges, \
            s03_accept_plan_changes, s04_evaluate_product, s05_champion_agile, \
            s06_respect_quality, s07_delegate_authority, s08_keep_authority_delegated, \
            s09_support_experiments, s10_no_punish_experiments, \
            s11_communicate_agile_goals, s12_encourage_new_skills, \
            s13_encourage_new_ways, s14_develop_people, p01_early_good_release, \
            p02_educated_sponsor, p03_quick_decisions, p04_plans_data_based, \
            p05_proactive_dependencies, p06_good_intentions, p07_reciprocal_trust, \
            p08_docs_plus_conversations, p09_update_plans, p10_non_punitive, \
            p11_outside_groups_aware, p12_finished_over_wip, p13_quality_over_deadline, \
            p14_solution_over_blame, p15_change_agents_in_place, \
            p16_agile_beyond_origin, p17_one_team, p18_honor_commitments, overall_notes) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, \
            $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, \
            $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, \
            $61, $62) RETURNING *",
        )
        .bind(self.respondent_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_period)
        .bind(&self.t01_problems_to_solve)
        .bind(&self.t02_decisions_without_manager)
        .bind(&self.t03_adopt_and_improve_practices)
        .bind(&self.t04_actively_coordinate)
        .bind(&self.t05_openly_share_ideas)
        .bind(&self.t06_decide_how_to_execute)
        .bind(&self.t07_act_on_feedback)
        .bind(&self.t08_rarely_wait)
        .bind(&self.t09_fully_complete_work)
        .bind(&self.t10_manage_own_performance)
        .bind(&self.t11_understand_agile)
        .bind(&self.t12_high_quality)
        .bind(&self.t13_welcome_change)
        .bind(&self.t14_collaborate_to_finish)
        .bind(&self.t15_admit_mistakes)
        .bind(&self.t16_work_outside_specialty)
        .bind(&self.t17_seek_new_skills)
        .bind(&self.t18_improve_skills)
        .bind(&self.t19_improve_ways_of_working)
        .bind(&self.t20_various_ways_communicating)
        .bind(&self.t21_received_basic_training)
        .bind(&self.t22_safe_to_dissent)
        .bind(&self.t23_start_with_open_issues)
        .bind(&self.t24_motivated)
        .bind(&self.t25_pride_in_craft)
        .bind(&self.s01_know_priority_factors)
        .bind(&self.s02_accept_plan_ranges)
        .bind(&self.s03_accept_plan_changes)
        .bind(&self.s04_evaluate_product)
        .bind(&self.s05_champion_agile)
        .bind(&self.s06_respect_quality)
        .bind(&self.s07_delegate_authority)
        .bind(&self.s08_keep_authority_delegated)
        .bind(&self.s09_support_experiments)
        .bind(&self.s10_no_punish_experiments)
        .bind(&self.s11_communicate_agile_goals)
        .bind(&self.s12_encourage_new_skills)
        .bind(&self.s13_encourage_new_ways)
        .bind(&self.s14_develop_people)
        .bind(&self.p01_early_good_release)
        .bind(&self.p02_educated_sponsor)
        .bind(&self.p03_quick_decisions)
        .bind(&self.p04_plans_data_based)
        .bind(&self.p05_proactive_dependencies)
        .bind(&self.p06_good_intentions)
        .bind(&self.p07_reciprocal_trust)
        .bind(&self.p08_docs_plus_conversations)
        .bind(&self.p09_update_plans)
        .bind(&self.p10_non_punitive)
        .bind(&self.p11_outside_groups_aware)
        .bind(&self.p12_finished_over_wip)
        .bind(&self.p13_quality_over_deadline)
        .bind(&self.p14_solution_over_blame)
        .bind(&self.p15_change_agents_in_place)
        .bind(&self.p16_agile_beyond_origin)
        .bind(&self.p17_one_team)
        .bind(&self.p18_honor_commitments)
        .bind(&self.overall_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE agile_checklists SET respondent_id = $2, status = $3, assessment_date \
            = $4, assessment_period = $5, t01_problems_to_solve = $6, \
            t02_decisions_without_manager = $7, t03_adopt_and_improve_practices = $8, \
            t04_actively_coordinate = $9, t05_openly_share_ideas = $10, \
            t06_decide_how_to_execute = $11, t07_act_on_feedback = $12, t08_rarely_wait \
            = $13, t09_fully_complete_work = $14, t10_manage_own_performance = $15, \
            t11_understand_agile = $16, t12_high_quality = $17, t13_welcome_change = \
            $18, t14_collaborate_to_finish = $19, t15_admit_mistakes = $20, \
            t16_work_outside_specialty = $21, t17_seek_new_skills = $22, \
            t18_improve_skills = $23, t19_improve_ways_of_working = $24, \
            t20_various_ways_communicating = $25, t21_received_basic_training = $26, \
            t22_safe_to_dissent = $27, t23_start_with_open_issues = $28, t24_motivated = \
            $29, t25_pride_in_craft = $30, s01_know_priority_factors = $31, \
            s02_accept_plan_ranges = $32, s03_accept_plan_changes = $33, \
            s04_evaluate_product = $34, s05_champion_agile = $35, s06_respect_quality = \
            $36, s07_delegate_authority = $37, s08_keep_authority_delegated = $38, \
            s09_support_experiments = $39, s10_no_punish_experiments = $40, \
            s11_communicate_agile_goals = $41, s12_encourage_new_skills = $42, \
            s13_encourage_new_ways = $43, s14_develop_people = $44, \
            p01_early_good_release = $45, p02_educated_sponsor = $46, \
            p03_quick_decisions = $47, p04_plans_data_based = $48, \
            p05_proactive_dependencies = $49, p06_good_intentions = $50, \
            p07_reciprocal_trust = $51, p08_docs_plus_conversations = $52, \
            p09_update_plans = $53, p10_non_punitive = $54, p11_outside_groups_aware = \
            $55, p12_finished_over_wip = $56, p13_quality_over_deadline = $57, \
            p14_solution_over_blame = $58, p15_change_agents_in_place = $59, \
            p16_agile_beyond_origin = $60, p17_one_team = $61, p18_honor_commitments = \
            $62, overall_notes = $63, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.respondent_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_period)
        .bind(&self.t01_problems_to_solve)
        .bind(&self.t02_decisions_without_manager)
        .bind(&self.t03_adopt_and_improve_practices)
        .bind(&self.t04_actively_coordinate)
        .bind(&self.t05_openly_share_ideas)
        .bind(&self.t06_decide_how_to_execute)
        .bind(&self.t07_act_on_feedback)
        .bind(&self.t08_rarely_wait)
        .bind(&self.t09_fully_complete_work)
        .bind(&self.t10_manage_own_performance)
        .bind(&self.t11_understand_agile)
        .bind(&self.t12_high_quality)
        .bind(&self.t13_welcome_change)
        .bind(&self.t14_collaborate_to_finish)
        .bind(&self.t15_admit_mistakes)
        .bind(&self.t16_work_outside_specialty)
        .bind(&self.t17_seek_new_skills)
        .bind(&self.t18_improve_skills)
        .bind(&self.t19_improve_ways_of_working)
        .bind(&self.t20_various_ways_communicating)
        .bind(&self.t21_received_basic_training)
        .bind(&self.t22_safe_to_dissent)
        .bind(&self.t23_start_with_open_issues)
        .bind(&self.t24_motivated)
        .bind(&self.t25_pride_in_craft)
        .bind(&self.s01_know_priority_factors)
        .bind(&self.s02_accept_plan_ranges)
        .bind(&self.s03_accept_plan_changes)
        .bind(&self.s04_evaluate_product)
        .bind(&self.s05_champion_agile)
        .bind(&self.s06_respect_quality)
        .bind(&self.s07_delegate_authority)
        .bind(&self.s08_keep_authority_delegated)
        .bind(&self.s09_support_experiments)
        .bind(&self.s10_no_punish_experiments)
        .bind(&self.s11_communicate_agile_goals)
        .bind(&self.s12_encourage_new_skills)
        .bind(&self.s13_encourage_new_ways)
        .bind(&self.s14_develop_people)
        .bind(&self.p01_early_good_release)
        .bind(&self.p02_educated_sponsor)
        .bind(&self.p03_quick_decisions)
        .bind(&self.p04_plans_data_based)
        .bind(&self.p05_proactive_dependencies)
        .bind(&self.p06_good_intentions)
        .bind(&self.p07_reciprocal_trust)
        .bind(&self.p08_docs_plus_conversations)
        .bind(&self.p09_update_plans)
        .bind(&self.p10_non_punitive)
        .bind(&self.p11_outside_groups_aware)
        .bind(&self.p12_finished_over_wip)
        .bind(&self.p13_quality_over_deadline)
        .bind(&self.p14_solution_over_blame)
        .bind(&self.p15_change_agents_in_place)
        .bind(&self.p16_agile_beyond_origin)
        .bind(&self.p17_one_team)
        .bind(&self.p18_honor_commitments)
        .bind(&self.overall_notes)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/agile_checklists/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
