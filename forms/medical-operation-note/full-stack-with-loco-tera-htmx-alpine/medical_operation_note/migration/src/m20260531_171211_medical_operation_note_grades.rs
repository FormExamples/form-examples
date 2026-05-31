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
            ("computed_composite_risk", ColType::String),
            ("final_composite_risk", ColType::String),
            ("override_reason", ColType::String),
            ("worst_clavien_dindo_grade", ColType::String),
            ("asa_physical_status", ColType::String),
            ("blood_loss_band", ColType::String),
            ("counts_agreed", ColType::String),
            ("never_event_suspected", ColType::String),
            ("recommendation", ColType::String),
            ("surgeon_notes", ColType::Text),
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
