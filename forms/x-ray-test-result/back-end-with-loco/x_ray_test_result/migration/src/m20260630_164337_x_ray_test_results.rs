use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "x_ray_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("body_region", ColType::String),
            ("laterality", ColType::String),
            ("projections", ColType::String),
            ("examination_adequacy", ColType::String),
            ("clinical_history", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("findings_narrative", ColType::String),
            ("fracture", ColType::Boolean),
            ("dislocation", ColType::Boolean),
            ("consolidation", ColType::Boolean),
            ("pneumothorax", ColType::Boolean),
            ("pleural_effusion", ColType::Boolean),
            ("foreign_body", ColType::Boolean),
            ("free_air", ColType::Boolean),
            ("bony_lesion", ColType::Boolean),
            ("incidental_finding", ColType::Boolean),
            ("impression", ColType::String),
            ("reporting_category", ColType::String),
            ("recommended_follow_up", ColType::String),
            ("critical_result_communicated", ColType::Boolean),
            ("reported_to", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "x_ray_test_results").await
    }
}
