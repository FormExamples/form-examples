use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_arrival_triages",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("attendance_category", ColType::TextWithDefault(String::new())),
            ("arrival_mode", ColType::TextWithDefault(String::new())),
            ("referral_source", ColType::TextWithDefault(String::new())),
            ("ambulance_incident_number", ColType::TextWithDefault(String::new())),
            ("triage_time", ColType::TimestampWithTimeZoneNull),
            ("triage_nurse", ColType::TextWithDefault(String::new())),
            ("mts_flowchart", ColType::TextWithDefault(String::new())),
            ("mts_category", ColType::TextWithDefault(String::new())),
            ("mts_discriminator", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_arrival_triages").await
    }
}
