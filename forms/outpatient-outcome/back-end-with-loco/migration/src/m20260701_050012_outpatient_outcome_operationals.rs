use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "outpatient_outcome_operationals",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("referral_date", ColType::DateNull),
            ("appointment_date", ColType::DateNull),
            ("wait_time_days", ColType::IntegerNull),
            ("service_target_days", ColType::IntegerNull),
            ("nhs_attendance_outcome", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("outpatient_outcome", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "outpatient_outcome_operationals").await
    }
}
