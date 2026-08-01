use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "satisfaction_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("composite_score", ColType::Double),
            ("category", ColType::TextWithDefault(String::new())),
            ("answered_count", ColType::IntegerWithDefault(0)),
            ("scored_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("encounter_satisfaction", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "satisfaction_results").await
    }
}
