use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "hypertension_reviews",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_role", ColType::String),
            ("reviewed_at", ColType::DateNull),
            ("practice_site", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("ethnicity", ColType::String),
            ("diagnosis_date", ColType::DateNull),
            ("type2_diabetes", ColType::String),
            ("chronic_kidney_disease", ColType::String),
            ("established_cvd", ColType::String),
            ("atrial_fibrillation", ColType::String),
            ("clinic_systolic", ColType::IntegerNull),
            ("clinic_diastolic", ColType::IntegerNull),
            ("home_systolic", ColType::IntegerNull),
            ("home_diastolic", ColType::IntegerNull),
            ("monitoring_method", ColType::String),
            ("postural_drop", ColType::String),
            ("antihypertensive_agents", ColType::IntegerNull),
            ("adherence", ColType::String),
            ("side_effects", ColType::String),
            ("qrisk_percent", ColType::DoubleNull),
            ("smoking_status", ColType::String),
            ("statin_therapy", ColType::String),
            ("bmi", ColType::DoubleNull),
            ("lifestyle_advice", ColType::Text),
            ("serum_creatinine", ColType::DoubleNull),
            ("egfr", ColType::DoubleNull),
            ("serum_potassium", ColType::DoubleNull),
            ("hba1c", ColType::DoubleNull),
            ("total_cholesterol", ColType::DoubleNull),
            ("hdl_cholesterol", ColType::DoubleNull),
            ("urine_acr", ColType::DoubleNull),
            ("complications", ColType::Text),
            ("review_context", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hypertension_reviews").await
    }
}
