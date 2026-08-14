use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "cataract_diagnostic_evaluation_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("computed_locs_iii_severity_right", ColType::String),
            ("computed_locs_iii_severity_left", ColType::String),
            ("computed_surgical_candidacy", ColType::String),
            ("final_surgical_candidacy", ColType::String),
            ("override_reason", ColType::String),
            ("functional_impact_score", ColType::IntegerNull),
            ("clinician_notes", ColType::Text),
            ("signed_by_name", ColType::String),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("cataract_diagnostic_evaluation", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "cataract_diagnostic_evaluation_grades").await
    }
}
