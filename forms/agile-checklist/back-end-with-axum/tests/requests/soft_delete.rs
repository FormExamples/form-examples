use agile_checklist::app::App;
use axa::testing::prelude::*;
use serial_test::serial;
use uuid::Uuid;

#[tokio::test]
#[serial]
async fn delete_hides_the_row_and_keeps_it() {
    request::<App, _, _>(|request, ctx| async move {
        let row0: Uuid = sqlx::query_scalar("INSERT INTO respondents DEFAULT VALUES RETURNING id")
            .fetch_one(&ctx.db)
            .await
            .unwrap();
        let row1: Uuid = sqlx::query_scalar(
            "INSERT INTO agile_checklists (t01_problems_to_solve, \
            t02_decisions_without_manager, t03_adopt_and_improve_practices, \
            t04_actively_coordinate, t05_openly_share_ideas, t06_decide_how_to_execute, \
            t07_act_on_feedback, t08_rarely_wait, t09_fully_complete_work, \
            t10_manage_own_performance, t11_understand_agile, t12_high_quality, \
            t13_welcome_change, t14_collaborate_to_finish, t15_admit_mistakes, \
            t16_work_outside_specialty, t17_seek_new_skills, t18_improve_skills, \
            t19_improve_ways_of_working, t20_various_ways_communicating, \
            t21_received_basic_training, t22_safe_to_dissent, \
            t23_start_with_open_issues, t24_motivated, t25_pride_in_craft, \
            s01_know_priority_factors, s02_accept_plan_ranges, s03_accept_plan_changes, \
            s04_evaluate_product, s05_champion_agile, s06_respect_quality, \
            s07_delegate_authority, s08_keep_authority_delegated, \
            s09_support_experiments, s10_no_punish_experiments, \
            s11_communicate_agile_goals, s12_encourage_new_skills, \
            s13_encourage_new_ways, s14_develop_people, p01_early_good_release, \
            p02_educated_sponsor, p03_quick_decisions, p04_plans_data_based, \
            p05_proactive_dependencies, p06_good_intentions, p07_reciprocal_trust, \
            p08_docs_plus_conversations, p09_update_plans, p10_non_punitive, \
            p11_outside_groups_aware, p12_finished_over_wip, p13_quality_over_deadline, \
            p14_solution_over_blame, p15_change_agents_in_place, \
            p16_agile_beyond_origin, p17_one_team, p18_honor_commitments, respondent_id) \
            VALUES ('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', \
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', \
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', \
            '', '', $1) RETURNING id",
        )
        .bind(row0)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row2: Uuid = sqlx::query_scalar(
            "INSERT INTO agile_checklist_grades (graded_at, agile_checklist_id) VALUES \
            (now(), $1) RETURNING id",
        )
        .bind(row1)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row3: Uuid = sqlx::query_scalar(
            "INSERT INTO agile_checklist_grade_rules (rule_id, agile_checklist_grade_id) \
            VALUES ('', $1) RETURNING id",
        )
        .bind(row2)
        .fetch_one(&ctx.db)
        .await
        .unwrap();

        let path = format!("/api/agile_checklist_grades/{row2}");
        let live = request.get(&path).await;
        assert_eq!(live.status_code(), 200);
        let body = live.json::<serde_json::Value>();
        assert!(body.get("deletedAt").is_none());

        request.delete(&path).await.assert_status_success();
        assert_eq!(request.get(&path).await.status_code(), 404);
        assert_eq!(request.delete(&path).await.status_code(), 404);
        let listed = request
            .get("/api/agile_checklist_grades")
            .await
            .json::<serde_json::Value>();
        assert!(!listed.to_string().contains(&row2.to_string()));
        let stale = request.patch(&path).json(&body).await;
        assert!(
            !stale.status_code().is_success(),
            "an update reached a deleted row"
        );

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM agile_checklist_grades WHERE id = $1",
        )
        .bind(row2)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert!(hidden, "the row was removed, not marked");

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM agile_checklist_grade_rules WHERE id = $1",
        )
        .bind(row3)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert!(hidden, "the delete did not cascade");

        let unnarrowed: i64 = sqlx::query_scalar(
            "SELECT count(*) FROM pg_index i JOIN pg_class c ON c.oid = i.indrelid JOIN \
            pg_namespace n ON n.oid = c.relnamespace JOIN pg_attribute a ON a.attrelid = \
            i.indrelid AND a.attname = 'deleted_at' WHERE i.indisunique AND NOT \
            i.indisprimary AND i.indpred IS NULL AND n.nspname = current_schema()",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert_eq!(unnarrowed, 0, "a deleted row can block its replacement");
    })
    .await;
}
