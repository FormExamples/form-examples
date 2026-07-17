use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "internal_med_waiting_list_card_appointments",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("appointment_date", ColType::DateNull),
            ("appointment_time", ColType::StringNull),
            ("duration_minutes", ColType::IntegerNull),
            ("appointment_type", ColType::String),
            ("site_name", ColType::String),
            ("site_address", ColType::Text),
            ("clinic_name", ColType::String),
            ("room", ColType::String),
            ("clinician_name", ColType::String),
            ("clinician_team", ColType::String),
            ("status", ColType::String),
            ("travel_notes", ColType::Text),
            ("access_notes", ColType::Text),
            ],
            &[
            ("internal_med_waiting_list_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "internal_med_waiting_list_card_appointments").await
    }
}
