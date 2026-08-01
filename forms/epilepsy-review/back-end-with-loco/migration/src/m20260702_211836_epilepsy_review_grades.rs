use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "epilepsy_review_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("seizure_control", ColType::StringWithDefault(String::new())),
            ("review_status", ColType::StringWithDefault(String::new())),
            ("completeness_score", ColType::IntegerNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("epilepsy_review", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "epilepsy_review_grades").await
    }
}
