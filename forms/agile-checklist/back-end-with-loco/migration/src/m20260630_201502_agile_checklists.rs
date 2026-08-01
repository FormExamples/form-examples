use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "agile_checklists",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("assessment_date", ColType::DateNull),
            ("assessment_period", ColType::StringWithDefault(String::new())),
            ("t01_problems_to_solve", ColType::String),
            ("t02_decisions_without_manager", ColType::String),
            ("t03_adopt_and_improve_practices", ColType::String),
            ("t04_actively_coordinate", ColType::String),
            ("t05_openly_share_ideas", ColType::String),
            ("t06_decide_how_to_execute", ColType::String),
            ("t07_act_on_feedback", ColType::String),
            ("t08_rarely_wait", ColType::String),
            ("t09_fully_complete_work", ColType::String),
            ("t10_manage_own_performance", ColType::String),
            ("t11_understand_agile", ColType::String),
            ("t12_high_quality", ColType::String),
            ("t13_welcome_change", ColType::String),
            ("t14_collaborate_to_finish", ColType::String),
            ("t15_admit_mistakes", ColType::String),
            ("t16_work_outside_specialty", ColType::String),
            ("t17_seek_new_skills", ColType::String),
            ("t18_improve_skills", ColType::String),
            ("t19_improve_ways_of_working", ColType::String),
            ("t20_various_ways_communicating", ColType::String),
            ("t21_received_basic_training", ColType::String),
            ("t22_safe_to_dissent", ColType::String),
            ("t23_start_with_open_issues", ColType::String),
            ("t24_motivated", ColType::String),
            ("t25_pride_in_craft", ColType::String),
            ("s01_know_priority_factors", ColType::String),
            ("s02_accept_plan_ranges", ColType::String),
            ("s03_accept_plan_changes", ColType::String),
            ("s04_evaluate_product", ColType::String),
            ("s05_champion_agile", ColType::String),
            ("s06_respect_quality", ColType::String),
            ("s07_delegate_authority", ColType::String),
            ("s08_keep_authority_delegated", ColType::String),
            ("s09_support_experiments", ColType::String),
            ("s10_no_punish_experiments", ColType::String),
            ("s11_communicate_agile_goals", ColType::String),
            ("s12_encourage_new_skills", ColType::String),
            ("s13_encourage_new_ways", ColType::String),
            ("s14_develop_people", ColType::String),
            ("p01_early_good_release", ColType::String),
            ("p02_educated_sponsor", ColType::String),
            ("p03_quick_decisions", ColType::String),
            ("p04_plans_data_based", ColType::String),
            ("p05_proactive_dependencies", ColType::String),
            ("p06_good_intentions", ColType::String),
            ("p07_reciprocal_trust", ColType::String),
            ("p08_docs_plus_conversations", ColType::String),
            ("p09_update_plans", ColType::String),
            ("p10_non_punitive", ColType::String),
            ("p11_outside_groups_aware", ColType::String),
            ("p12_finished_over_wip", ColType::String),
            ("p13_quality_over_deadline", ColType::String),
            ("p14_solution_over_blame", ColType::String),
            ("p15_change_agents_in_place", ColType::String),
            ("p16_agile_beyond_origin", ColType::String),
            ("p17_one_team", ColType::String),
            ("p18_honor_commitments", ColType::String),
            ("overall_notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("respondent", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "agile_checklists").await
    }
}
