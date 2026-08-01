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
            ("medication_name", ColType::StringWithDefault(String::new())),
            ("dose", ColType::StringWithDefault(String::new())),
            ("frequency", ColType::StringWithDefault(String::new())),
            ("route", ColType::StringWithDefault(String::new())),
            ("indication", ColType::StringWithDefault(String::new())),
            ("is_prn", ColType::StringWithDefault(String::new())),
            ("sort_order", ColType::IntegerWithDefault(0)),
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
