use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_operation_note_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("computed_composite_risk", ColType::StringWithDefault(String::new())),
            ("final_composite_risk", ColType::StringWithDefault(String::new())),
            ("override_reason", ColType::StringWithDefault(String::new())),
            ("worst_clavien_dindo_grade", ColType::StringWithDefault(String::new())),
            ("asa_physical_status", ColType::StringWithDefault(String::new())),
            ("blood_loss_band", ColType::StringWithDefault(String::new())),
            ("counts_agreed", ColType::StringWithDefault(String::new())),
            ("never_event_suspected", ColType::StringWithDefault(String::new())),
            ("recommendation", ColType::StringWithDefault(String::new())),
            ("surgeon_notes", ColType::TextWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("medical_operation_note", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_operation_note_grades").await
    }
}
