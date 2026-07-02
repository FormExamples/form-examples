use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "chronic_kidney_disease_reviews",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("reviewed_at", ColType::DateNull),
            ("care_setting", ColType::String),
            ("review_type", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("diabetes_status", ColType::String),
            ("primary_cause", ColType::String),
            ("months_since_diagnosis", ColType::IntegerNull),
            ("egfr", ColType::DoubleNull),
            ("egfr_sample_date", ColType::DateNull),
            ("previous_egfr", ColType::DoubleNull),
            ("previous_egfr_date", ColType::DateNull),
            ("acr", ColType::DoubleNull),
            ("acr_sample_date", ColType::DateNull),
            ("acr_measured", ColType::String),
            ("systolic_blood_pressure", ColType::IntegerNull),
            ("diastolic_blood_pressure", ColType::IntegerNull),
            ("acei_or_arb_prescribed", ColType::String),
            ("sglt2i_prescribed", ColType::String),
            ("statin_prescribed", ColType::String),
            ("nephrotoxic_drug_present", ColType::String),
            ("nephrotoxic_dose_adjusted", ColType::String),
            ("medication_review_completed", ColType::String),
            ("hba1c", ColType::DoubleNull),
            ("potassium", ColType::DoubleNull),
            ("bicarbonate", ColType::DoubleNull),
            ("calcium", ColType::DoubleNull),
            ("phosphate", ColType::DoubleNull),
            ("pth", ColType::DoubleNull),
            ("haemoglobin", ColType::DoubleNull),
            ("referral_decision", ColType::String),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "chronic_kidney_disease_reviews").await
    }
}
