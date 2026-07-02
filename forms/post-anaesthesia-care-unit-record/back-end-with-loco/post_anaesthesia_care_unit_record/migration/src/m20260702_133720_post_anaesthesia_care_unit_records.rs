use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "post_anaesthesia_care_unit_records",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("nurse_name", ColType::String),
            ("nurse_role", ColType::String),
            ("anaesthetist_name", ColType::String),
            ("admitted_at", ColType::TimestampWithTimeZoneNull),
            ("anaesthetic_technique", ColType::String),
            ("procedure", ColType::Text),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("asa_status", ColType::String),
            ("baseline_systolic_bp", ColType::DoubleNull),
            ("ambulatory_case", ColType::String),
            ("activity", ColType::String),
            ("respiration", ColType::String),
            ("circulation", ColType::String),
            ("consciousness", ColType::String),
            ("oxygen_saturation", ColType::String),
            ("airway_status", ColType::String),
            ("pain_score", ColType::DoubleNull),
            ("ponv_severity", ColType::String),
            ("analgesia_given", ColType::Text),
            ("antiemetics_given", ColType::Text),
            ("padss_vital_signs", ColType::String),
            ("padss_ambulation", ColType::String),
            ("padss_nausea_vomiting", ColType::String),
            ("padss_pain", ColType::String),
            ("padss_surgical_bleeding", ColType::String),
            ("recovery_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "post_anaesthesia_care_unit_records").await
    }
}
