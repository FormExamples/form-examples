use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "overall_satisfactions",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("overall_rating", ColType::IntegerNull),
            ("likely_to_recommend", ColType::IntegerNull),
            ("likely_to_return", ColType::IntegerNull),
            ("comments", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("encounter_satisfaction", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "overall_satisfactions").await
    }
}
