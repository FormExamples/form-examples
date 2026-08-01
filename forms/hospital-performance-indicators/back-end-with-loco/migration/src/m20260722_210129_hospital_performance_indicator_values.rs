use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "hospital_performance_indicator_values",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("indicator_code", ColType::String),
            ("category_number", ColType::Integer),
            ("category_title", ColType::StringWithDefault(String::new())),
            ("indicator_text", ColType::TextWithDefault(String::new())),
            ("indicator_value", ColType::DoubleNull),
            ("notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("hospital_performance_indicators", "hospital_performance_indicators_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hospital_performance_indicator_values").await
    }
}
