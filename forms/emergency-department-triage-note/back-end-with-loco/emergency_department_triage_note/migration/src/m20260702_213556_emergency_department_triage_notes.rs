use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "emergency_department_triage_notes",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("status", ColType::String),
            ("nurse_name", ColType::Text),
            ("triaged_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("arrival_mode", ColType::String),
            ("arrived_at", ColType::TimestampWithTimeZoneNull),
            ("referral_source", ColType::Text),
            ("patient_identifier", ColType::Text),
            ("age_band", ColType::String),
            ("presenting_complaint", ColType::Text),
            ("brief_history", ColType::Text),
            ("symptom_onset", ColType::Text),
            ("respiratory_rate", ColType::IntegerNull),
            ("spo2", ColType::IntegerNull),
            ("on_oxygen", ColType::String),
            ("systolic_bp", ColType::IntegerNull),
            ("pulse", ColType::IntegerNull),
            ("consciousness_acvpu", ColType::String),
            ("temperature", ColType::DoubleNull),
            ("glasgow_coma_scale", ColType::IntegerNull),
            ("pain_score", ColType::IntegerNull),
            ("airway_threat", ColType::String),
            ("breathing_inadequate", ColType::String),
            ("circulation_shock", ColType::String),
            ("haemorrhage_major", ColType::String),
            ("consciousness_reduced", ColType::String),
            ("seizure_active", ColType::String),
            ("focal_neurology", ColType::String),
            ("sepsis_features", ColType::String),
            ("chest_pain_cardiac", ColType::String),
            ("stroke_features", ColType::String),
            ("paediatric_red_flag", ColType::String),
            ("clinical_notes", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "emergency_department_triage_notes").await
    }
}
