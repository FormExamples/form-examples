use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "chronic_obstructive_pulmonary_disease_review_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("gold_airflow_grade", ColType::String),
            ("symptom_burden", ColType::String),
            ("exacerbation_risk", ColType::String),
            ("abe_group", ColType::String),
            ("review_status", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("chronic_obstructive_pulmonary_disease_review", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "chronic_obstructive_pulmonary_disease_review_grades").await
    }
}
