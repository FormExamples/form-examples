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
            
            ("review_status", ColType::StringWithDefault(String::new())),
            ("anticholinergic_burden_score", ColType::IntegerWithDefault(0)),
            ("anticholinergic_band", ColType::StringWithDefault(String::new())),
            ("polypharmacy_band", ColType::StringWithDefault(String::new())),
            ("burden_band", ColType::StringWithDefault(String::new())),
            ("medicine_count", ColType::IntegerWithDefault(0)),
            ("regular_medicine_count", ColType::IntegerWithDefault(0)),
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
