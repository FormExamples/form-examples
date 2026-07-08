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
            ("attendance_category", ColType::Text),
            ("arrival_mode", ColType::Text),
            ("referral_source", ColType::Text),
            ("ambulance_incident_number", ColType::Text),
            ("triage_time", ColType::TimestampWithTimeZoneNull),
            ("triage_nurse", ColType::Text),
            ("mts_flowchart", ColType::Text),
            ("mts_category", ColType::Text),
            ("mts_discriminator", ColType::Text),
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
