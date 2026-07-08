use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "structured_medication_review_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("review_status", ColType::String),
            ("anticholinergic_burden_score", ColType::Integer),
            ("anticholinergic_band", ColType::String),
            ("polypharmacy_band", ColType::String),
            ("burden_band", ColType::String),
            ("medicine_count", ColType::Integer),
            ("regular_medicine_count", ColType::Integer),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("structured_medication_review", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "structured_medication_review_grades").await
    }
}
