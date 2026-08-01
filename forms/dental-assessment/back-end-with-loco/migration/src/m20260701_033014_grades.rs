use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("dmft_score", ColType::IntegerWithDefault(0)),
            ("decayed_count", ColType::IntegerWithDefault(0)),
            ("missing_count", ColType::IntegerWithDefault(0)),
            ("filled_count", ColType::IntegerWithDefault(0)),
            ("severity_level", ColType::StringWithDefault("very_low".to_string())),
            ("periodontal_risk", ColType::StringWithDefault("low".to_string())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grades").await
    }
}
