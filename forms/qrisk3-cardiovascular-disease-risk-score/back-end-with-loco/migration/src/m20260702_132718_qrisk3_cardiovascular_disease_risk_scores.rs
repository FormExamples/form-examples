use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "qrisk3_cardiovascular_disease_risk_scores",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age", ColType::DoubleNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("ethnicity", ColType::StringWithDefault(String::new())),
            ("townsend_score", ColType::DoubleNull),
            ("postcode", ColType::StringWithDefault(String::new())),
            ("smoking_status", ColType::StringWithDefault(String::new())),
            ("body_mass_index", ColType::DoubleNull),
            ("diabetes_status", ColType::StringWithDefault(String::new())),
            ("cholesterol_hdl_ratio", ColType::DoubleNull),
            ("systolic_blood_pressure", ColType::DoubleNull),
            ("systolic_blood_pressure_sd", ColType::DoubleNull),
            ("on_blood_pressure_treatment", ColType::StringWithDefault(String::new())),
            ("family_history_chd", ColType::StringWithDefault(String::new())),
            ("atrial_fibrillation", ColType::StringWithDefault(String::new())),
            ("chronic_kidney_disease_stage", ColType::StringWithDefault(String::new())),
            ("migraine", ColType::StringWithDefault(String::new())),
            ("rheumatoid_arthritis", ColType::StringWithDefault(String::new())),
            ("systemic_lupus_erythematosus", ColType::StringWithDefault(String::new())),
            ("severe_mental_illness", ColType::StringWithDefault(String::new())),
            ("erectile_dysfunction", ColType::StringWithDefault(String::new())),
            ("on_atypical_antipsychotics", ColType::StringWithDefault(String::new())),
            ("on_corticosteroids", ColType::StringWithDefault(String::new())),
            ("has_established_cvd", ColType::StringWithDefault(String::new())),
            ("has_familial_hypercholesterolaemia", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "qrisk3_cardiovascular_disease_risk_scores").await
    }
}
