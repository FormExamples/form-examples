use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_dispositions",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("disposition", ColType::Text),
            ("admitting_specialty", ColType::Text),
            ("admitting_consultant", ColType::Text),
            ("ward", ColType::Text),
            ("level_of_care", ColType::Text),
            ("discharge_diagnosis", ColType::Text),
            ("discharge_medications", ColType::Text),
            ("discharge_instructions", ColType::Text),
            ("follow_up", ColType::Text),
            ("return_precautions", ColType::Text),
            ("receiving_hospital", ColType::Text),
            ("reason_for_transfer", ColType::Text),
            ("mode_of_transfer", ColType::Text),
            ("discharge_time", ColType::TimestampWithTimeZoneNull),
            ("total_time_in_department", ColType::Text),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_dispositions").await
    }
}
