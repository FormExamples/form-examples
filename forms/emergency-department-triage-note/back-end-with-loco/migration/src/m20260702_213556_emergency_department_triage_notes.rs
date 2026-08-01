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
            
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("nurse_name", ColType::TextWithDefault(String::new())),
            ("triaged_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("arrival_mode", ColType::StringWithDefault(String::new())),
            ("arrived_at", ColType::TimestampWithTimeZoneNull),
            ("referral_source", ColType::TextWithDefault(String::new())),
            ("patient_identifier", ColType::TextWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("presenting_complaint", ColType::TextWithDefault(String::new())),
            ("brief_history", ColType::TextWithDefault(String::new())),
            ("symptom_onset", ColType::TextWithDefault(String::new())),
            ("respiratory_rate", ColType::IntegerNull),
            ("spo2", ColType::IntegerNull),
            ("on_oxygen", ColType::StringWithDefault(String::new())),
            ("systolic_bp", ColType::IntegerNull),
            ("pulse", ColType::IntegerNull),
            ("consciousness_acvpu", ColType::StringWithDefault(String::new())),
            ("temperature", ColType::DoubleNull),
            ("glasgow_coma_scale", ColType::IntegerNull),
            ("pain_score", ColType::IntegerNull),
            ("airway_threat", ColType::StringWithDefault(String::new())),
            ("breathing_inadequate", ColType::StringWithDefault(String::new())),
            ("circulation_shock", ColType::StringWithDefault(String::new())),
            ("haemorrhage_major", ColType::StringWithDefault(String::new())),
            ("consciousness_reduced", ColType::StringWithDefault(String::new())),
            ("seizure_active", ColType::StringWithDefault(String::new())),
            ("focal_neurology", ColType::StringWithDefault(String::new())),
            ("sepsis_features", ColType::StringWithDefault(String::new())),
            ("chest_pain_cardiac", ColType::StringWithDefault(String::new())),
            ("stroke_features", ColType::StringWithDefault(String::new())),
            ("paediatric_red_flag", ColType::StringWithDefault(String::new())),
            ("clinical_notes", ColType::TextWithDefault(String::new())),
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
