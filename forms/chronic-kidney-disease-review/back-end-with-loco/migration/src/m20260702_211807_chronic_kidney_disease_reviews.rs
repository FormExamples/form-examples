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
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("reviewed_at", ColType::DateNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("review_type", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("diabetes_status", ColType::StringWithDefault(String::new())),
            ("primary_cause", ColType::StringWithDefault(String::new())),
            ("months_since_diagnosis", ColType::IntegerNull),
            ("egfr", ColType::DoubleNull),
            ("egfr_sample_date", ColType::DateNull),
            ("previous_egfr", ColType::DoubleNull),
            ("previous_egfr_date", ColType::DateNull),
            ("acr", ColType::DoubleNull),
            ("acr_sample_date", ColType::DateNull),
            ("acr_measured", ColType::StringWithDefault(String::new())),
            ("systolic_blood_pressure", ColType::IntegerNull),
            ("diastolic_blood_pressure", ColType::IntegerNull),
            ("acei_or_arb_prescribed", ColType::StringWithDefault(String::new())),
            ("sglt2i_prescribed", ColType::StringWithDefault(String::new())),
            ("statin_prescribed", ColType::StringWithDefault(String::new())),
            ("nephrotoxic_drug_present", ColType::StringWithDefault(String::new())),
            ("nephrotoxic_dose_adjusted", ColType::StringWithDefault(String::new())),
            ("medication_review_completed", ColType::StringWithDefault(String::new())),
            ("hba1c", ColType::DoubleNull),
            ("potassium", ColType::DoubleNull),
            ("bicarbonate", ColType::DoubleNull),
            ("calcium", ColType::DoubleNull),
            ("phosphate", ColType::DoubleNull),
            ("pth", ColType::DoubleNull),
            ("haemoglobin", ColType::DoubleNull),
            ("referral_decision", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
