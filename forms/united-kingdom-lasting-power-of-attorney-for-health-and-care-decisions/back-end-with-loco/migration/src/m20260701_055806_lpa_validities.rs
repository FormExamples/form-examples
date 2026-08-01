use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "lpa_validities",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("validity_status", ColType::StringWithDefault(String::new())),
            ("completeness_score", ColType::IntegerWithDefault(0)),
            ("effective_date", ColType::DateNull),
            ("computed_at", ColType::TimestampWithTimeZone),
            ("engine_version", ColType::StringWithDefault(String::new())),
            ("notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("lpa", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lpa_validities").await
    }
}
