use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "infect_dis_waiting_list_card_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("waiting_time_status", ColType::String),
            ("clinical_priority", ColType::String),
            ("target_wait_weeks", ColType::DoubleNull),
            ("days_waited", ColType::IntegerNull),
            ("weeks_waited", ColType::DoubleNull),
            ("days_to_target", ColType::IntegerNull),
            ("days_to_breach", ColType::IntegerNull),
            ("days_to_appointment", ColType::IntegerNull),
            ("grader_notes", ColType::Text),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("infect_dis_waiting_list_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "infect_dis_waiting_list_card_grades").await
    }
}
