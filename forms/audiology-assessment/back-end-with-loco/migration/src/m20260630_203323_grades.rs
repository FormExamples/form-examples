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
            ("right_pta_db", ColType::DoubleNull),
            ("left_pta_db", ColType::DoubleNull),
            ("better_ear_pta_db", ColType::DoubleNull),
            ("right_hearing_grade", ColType::StringWithDefault("normal".to_string())),
            ("left_hearing_grade", ColType::StringWithDefault("normal".to_string())),
            ("overall_hearing_grade", ColType::StringWithDefault("normal".to_string())),
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
