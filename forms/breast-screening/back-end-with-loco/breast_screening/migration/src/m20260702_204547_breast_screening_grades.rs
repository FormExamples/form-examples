use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "breast_screening_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("eligibility_status", ColType::String),
            ("result_class", ColType::String),
            ("management_action", ColType::String),
            ("status", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("breast_screening", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "breast_screening_grades").await
    }
}
