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
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("patient_identifier", ColType::String),
            ("age", ColType::DoubleNull),
            ("sex", ColType::String),
            ("ethnicity", ColType::String),
            ("townsend_score", ColType::DoubleNull),
            ("postcode", ColType::String),
            ("smoking_status", ColType::String),
            ("body_mass_index", ColType::DoubleNull),
            ("diabetes_status", ColType::String),
            ("cholesterol_hdl_ratio", ColType::DoubleNull),
            ("systolic_blood_pressure", ColType::DoubleNull),
            ("systolic_blood_pressure_sd", ColType::DoubleNull),
            ("on_blood_pressure_treatment", ColType::String),
            ("family_history_chd", ColType::String),
            ("atrial_fibrillation", ColType::String),
            ("chronic_kidney_disease_stage", ColType::String),
            ("migraine", ColType::String),
            ("rheumatoid_arthritis", ColType::String),
            ("systemic_lupus_erythematosus", ColType::String),
            ("severe_mental_illness", ColType::String),
            ("erectile_dysfunction", ColType::String),
            ("on_atypical_antipsychotics", ColType::String),
            ("on_corticosteroids", ColType::String),
            ("has_established_cvd", ColType::String),
            ("has_familial_hypercholesterolaemia", ColType::String),
            ("clinical_note", ColType::Text),
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
