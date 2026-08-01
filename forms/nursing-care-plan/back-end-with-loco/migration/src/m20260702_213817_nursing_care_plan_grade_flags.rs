use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "nursing_care_plan_grade_flags",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("flag_id", ColType::String),
            ("category", ColType::StringWithDefault(String::new())),
            ("priority", ColType::StringWithDefault(String::new())),
            ("description", ColType::StringWithDefault(String::new())),
            ("suggested_action", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("nursing_care_plan_grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "nursing_care_plan_grade_flags").await
    }
}
