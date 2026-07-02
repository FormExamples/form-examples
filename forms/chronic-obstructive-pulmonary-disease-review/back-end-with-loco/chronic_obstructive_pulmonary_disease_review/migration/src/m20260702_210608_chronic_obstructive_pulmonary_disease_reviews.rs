use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "chronic_obstructive_pulmonary_disease_reviews",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::Text),
            ("clinician_role", ColType::String),
            ("reviewed_at", ColType::DateNull),
            ("review_type", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("diagnosis_year", ColType::IntegerNull),
            ("spirometry_confirmed", ColType::String),
            ("exposure_notes", ColType::Text),
            ("fev1_litres", ColType::DoubleNull),
            ("fev1_percent_predicted", ColType::DoubleNull),
            ("fvc_litres", ColType::DoubleNull),
            ("fev1_fvc_ratio", ColType::DoubleNull),
            ("spirometry_date", ColType::DateNull),
            ("mrc_grade", ColType::IntegerNull),
            ("mmrc_grade", ColType::IntegerNull),
            ("cat_score", ColType::IntegerNull),
            ("exacerbations_last_12m", ColType::IntegerNull),
            ("hospitalisations_last_12m", ColType::IntegerNull),
            ("last_exacerbation_date", ColType::DateNull),
            ("rescue_pack_courses", ColType::IntegerNull),
            ("smoking_status", ColType::String),
            ("pack_years", ColType::DoubleNull),
            ("cessation_support_offered", ColType::String),
            ("inhaled_therapy", ColType::Text),
            ("device_type", ColType::Text),
            ("inhaler_technique_checked", ColType::String),
            ("inhaler_technique_adequate", ColType::String),
            ("adherence", ColType::String),
            ("influenza_vaccine", ColType::String),
            ("pneumococcal_vaccine", ColType::String),
            ("covid_vaccine", ColType::String),
            ("pulmonary_rehab_status", ColType::String),
            ("oxygen_use", ColType::String),
            ("resting_spo2", ColType::IntegerNull),
            ("comorbidities", ColType::Text),
            ("self_management_plan", ColType::String),
            ("rescue_pack_supplied", ColType::String),
            ("next_review_interval", ColType::Text),
            ("clinician_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "chronic_obstructive_pulmonary_disease_reviews").await
    }
}
