use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "trop_med_waiting_list_card_appointments",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("appointment_date", ColType::DateNull),
            ("appointment_time", ColType::StringNull),
            ("duration_minutes", ColType::IntegerNull),
            ("appointment_type", ColType::StringWithDefault(String::new())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("site_address", ColType::TextWithDefault(String::new())),
            ("clinic_name", ColType::StringWithDefault(String::new())),
            ("room", ColType::StringWithDefault(String::new())),
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_team", ColType::StringWithDefault(String::new())),
            ("status", ColType::StringWithDefault("scheduled".to_string())),
            ("travel_notes", ColType::TextWithDefault(String::new())),
            ("access_notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("trop_med_waiting_list_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "trop_med_waiting_list_card_appointments").await
    }
}
