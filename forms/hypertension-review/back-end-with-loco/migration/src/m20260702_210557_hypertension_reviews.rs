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
            
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("reviewed_at", ColType::DateNull),
            ("practice_site", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("ethnicity", ColType::StringWithDefault(String::new())),
            ("diagnosis_date", ColType::DateNull),
            ("type2_diabetes", ColType::StringWithDefault(String::new())),
            ("chronic_kidney_disease", ColType::StringWithDefault(String::new())),
            ("established_cvd", ColType::StringWithDefault(String::new())),
            ("atrial_fibrillation", ColType::StringWithDefault(String::new())),
            ("clinic_systolic", ColType::IntegerNull),
            ("clinic_diastolic", ColType::IntegerNull),
            ("home_systolic", ColType::IntegerNull),
            ("home_diastolic", ColType::IntegerNull),
            ("monitoring_method", ColType::StringWithDefault(String::new())),
            ("postural_drop", ColType::StringWithDefault(String::new())),
            ("antihypertensive_agents", ColType::IntegerNull),
            ("adherence", ColType::StringWithDefault(String::new())),
            ("side_effects", ColType::StringWithDefault(String::new())),
            ("qrisk_percent", ColType::DoubleNull),
            ("smoking_status", ColType::StringWithDefault(String::new())),
            ("statin_therapy", ColType::StringWithDefault(String::new())),
            ("bmi", ColType::DoubleNull),
            ("lifestyle_advice", ColType::TextWithDefault(String::new())),
            ("serum_creatinine", ColType::DoubleNull),
            ("egfr", ColType::DoubleNull),
            ("serum_potassium", ColType::DoubleNull),
            ("hba1c", ColType::DoubleNull),
            ("total_cholesterol", ColType::DoubleNull),
            ("hdl_cholesterol", ColType::DoubleNull),
            ("urine_acr", ColType::DoubleNull),
            ("complications", ColType::TextWithDefault(String::new())),
            ("review_context", ColType::TextWithDefault(String::new())),
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
