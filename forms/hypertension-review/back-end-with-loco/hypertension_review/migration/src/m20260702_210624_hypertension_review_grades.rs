use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "hypertension_review_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("control_status", ColType::String),
            ("hypertension_stage", ColType::String),
            ("review_status", ColType::String),
            ("primary_source", ColType::String),
            ("target_group", ColType::String),
            ("clinic_target_systolic", ColType::IntegerNull),
            ("clinic_target_diastolic", ColType::IntegerNull),
            ("home_target_systolic", ColType::IntegerNull),
            ("home_target_diastolic", ColType::IntegerNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("hypertension_review", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hypertension_review_grades").await
    }
}
