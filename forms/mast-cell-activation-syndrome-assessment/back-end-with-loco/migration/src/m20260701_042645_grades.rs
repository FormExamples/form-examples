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
            ("total_symptom_score", ColType::IntegerWithDefault(0)),
            ("dermatological_score", ColType::IntegerWithDefault(0)),
            ("gastrointestinal_score", ColType::IntegerWithDefault(0)),
            ("cardiovascular_score", ColType::IntegerWithDefault(0)),
            ("respiratory_score", ColType::IntegerWithDefault(0)),
            ("neurological_score", ColType::IntegerWithDefault(0)),
            ("organ_system_count", ColType::IntegerWithDefault(0)),
            ("severity_level", ColType::StringWithDefault(String::new())),
            ("trigger_count", ColType::IntegerWithDefault(0)),
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
