use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "pre_operative_assessment_by_clinician_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("computed_asa_grade", ColType::String),
            ("final_asa_grade", ColType::String),
            ("asa_emergency_suffix", ColType::String),
            ("override_reason", ColType::String),
            ("mallampati_class", ColType::String),
            ("rcri_score", ColType::IntegerNull),
            ("stopbang_score", ColType::IntegerNull),
            ("frailty_scale", ColType::IntegerNull),
            ("composite_risk", ColType::String),
            ("recommendation", ColType::String),
            ("clinician_notes", ColType::Text),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("pre_operative_assessment_by_clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "pre_operative_assessment_by_clinician_grades").await
    }
}
