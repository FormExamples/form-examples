use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "return_to_work_grade_flags",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("flag_code", ColType::String),
            ("flag_title", ColType::String),
            ("flag_category", ColType::String),
            ("flag_priority", ColType::String),
            ("flag_evidence", ColType::Text),
            ("flag_recommendation", ColType::Text),
            ],
            &[
            ("return_to_work_grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "return_to_work_grade_flags").await
    }
}
