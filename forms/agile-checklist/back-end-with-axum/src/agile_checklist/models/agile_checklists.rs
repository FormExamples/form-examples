//! agile_checklists model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
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
    pub respondent_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM agile_checklists WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM agile_checklists WHERE deleted_at IS NULL")
                .fetch_one(db)
                .await?;
        Ok((rows, total))
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM agile_checklists WHERE id = $1 AND deleted_at IS NULL")
            .bind(id)
            .fetch_optional(db)
            .await
    }

    /// Delete the row with this id.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn delete(db: &PgPool, id: Uuid) -> sqlx::Result<()> {
        sqlx::query(
            "WITH target AS (UPDATE agile_checklists SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            agile_checklist_grades SET deleted_at = now(), updated_at = now() WHERE \
            agile_checklist_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE agile_checklist_grade_rules SET deleted_at \
            = now(), updated_at = now() WHERE agile_checklist_grade_id IN (SELECT id \
            FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            agile_checklist_grade_flags SET deleted_at = now(), updated_at = now() WHERE \
            agile_checklist_grade_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
