use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "chronic_kidney_disease_review_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("gfr_category", ColType::String),
            ("albuminuria_category", ColType::String),
            ("kdigo_risk_zone", ColType::String),
            ("review_status", ColType::String),
            ("blood_pressure_target_systolic", ColType::IntegerNull),
            ("blood_pressure_target_diastolic", ColType::IntegerNull),
            ("blood_pressure_at_target", ColType::BooleanNull),
            ("completeness_score", ColType::IntegerNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("chronic_kidney_disease_review", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "chronic_kidney_disease_review_grades").await
    }
}
