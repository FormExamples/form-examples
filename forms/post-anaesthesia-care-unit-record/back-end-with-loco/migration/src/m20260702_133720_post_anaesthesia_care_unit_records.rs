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
            
            ("nurse_name", ColType::StringWithDefault(String::new())),
            ("nurse_role", ColType::StringWithDefault(String::new())),
            ("anaesthetist_name", ColType::StringWithDefault(String::new())),
            ("admitted_at", ColType::TimestampWithTimeZoneNull),
            ("anaesthetic_technique", ColType::StringWithDefault(String::new())),
            ("procedure", ColType::TextWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("asa_status", ColType::StringWithDefault(String::new())),
            ("baseline_systolic_bp", ColType::DoubleNull),
            ("ambulatory_case", ColType::StringWithDefault(String::new())),
            ("activity", ColType::StringWithDefault(String::new())),
            ("respiration", ColType::StringWithDefault(String::new())),
            ("circulation", ColType::StringWithDefault(String::new())),
            ("consciousness", ColType::StringWithDefault(String::new())),
            ("oxygen_saturation", ColType::StringWithDefault(String::new())),
            ("airway_status", ColType::StringWithDefault(String::new())),
            ("pain_score", ColType::DoubleNull),
            ("ponv_severity", ColType::StringWithDefault(String::new())),
            ("analgesia_given", ColType::TextWithDefault(String::new())),
            ("antiemetics_given", ColType::TextWithDefault(String::new())),
            ("padss_vital_signs", ColType::StringWithDefault(String::new())),
            ("padss_ambulation", ColType::StringWithDefault(String::new())),
            ("padss_nausea_vomiting", ColType::StringWithDefault(String::new())),
            ("padss_pain", ColType::StringWithDefault(String::new())),
            ("padss_surgical_bleeding", ColType::StringWithDefault(String::new())),
            ("recovery_note", ColType::TextWithDefault(String::new())),
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
