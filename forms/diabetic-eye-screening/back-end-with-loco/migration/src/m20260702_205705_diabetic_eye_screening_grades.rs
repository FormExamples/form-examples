use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "diabetic_eye_screening_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("worst_retinopathy", ColType::StringWithDefault(String::new())),
            ("worst_maculopathy", ColType::StringWithDefault(String::new())),
            ("any_ungradable", ColType::StringWithDefault(String::new())),
            ("outcome", ColType::StringWithDefault(String::new())),
            ("referral", ColType::StringWithDefault(String::new())),
            ("recall_interval_months", ColType::IntegerNull),
            ("status", ColType::StringWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("diabetic_eye_screening", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "diabetic_eye_screening_grades").await
    }
}
