use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "outpatient_outcome_signoffs",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("reporting_clinician_name", ColType::StringWithDefault(String::new())),
            ("reporting_clinician_role", ColType::StringWithDefault(String::new())),
            ("signed_off_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("outpatient_outcome", ""),
            ("clinician", "reporting_clinician_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "outpatient_outcome_signoffs").await
    }
}
