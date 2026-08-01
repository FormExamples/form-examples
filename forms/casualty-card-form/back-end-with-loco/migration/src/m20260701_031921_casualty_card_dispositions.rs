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
            ("disposition", ColType::TextWithDefault(String::new())),
            ("admitting_specialty", ColType::TextWithDefault(String::new())),
            ("admitting_consultant", ColType::TextWithDefault(String::new())),
            ("ward", ColType::TextWithDefault(String::new())),
            ("level_of_care", ColType::TextWithDefault(String::new())),
            ("discharge_diagnosis", ColType::TextWithDefault(String::new())),
            ("discharge_medications", ColType::TextWithDefault(String::new())),
            ("discharge_instructions", ColType::TextWithDefault(String::new())),
            ("follow_up", ColType::TextWithDefault(String::new())),
            ("return_precautions", ColType::TextWithDefault(String::new())),
            ("receiving_hospital", ColType::TextWithDefault(String::new())),
            ("reason_for_transfer", ColType::TextWithDefault(String::new())),
            ("mode_of_transfer", ColType::TextWithDefault(String::new())),
            ("discharge_time", ColType::TimestampWithTimeZoneNull),
            ("total_time_in_department", ColType::TextWithDefault(String::new())),
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
