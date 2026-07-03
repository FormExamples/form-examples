use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_polypharmacy_review_medications",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("medication_name", ColType::String),
            ("dose", ColType::String),
            ("frequency", ColType::String),
            ("route", ColType::String),
            ("indication", ColType::String),
            ("is_prn", ColType::String),
            ("sort_order", ColType::Integer),
            ],
            &[
            ("assessment_polypharmacy_review", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_polypharmacy_review_medications").await
    }
}
