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
            
            ("clinician_name", ColType::TextWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("reviewed_at", ColType::DateNull),
            ("review_type", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("diagnosis_year", ColType::IntegerNull),
            ("spirometry_confirmed", ColType::StringWithDefault(String::new())),
            ("exposure_notes", ColType::TextWithDefault(String::new())),
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
            ("smoking_status", ColType::StringWithDefault(String::new())),
            ("pack_years", ColType::DoubleNull),
            ("cessation_support_offered", ColType::StringWithDefault(String::new())),
            ("inhaled_therapy", ColType::TextWithDefault(String::new())),
            ("device_type", ColType::TextWithDefault(String::new())),
            ("inhaler_technique_checked", ColType::StringWithDefault(String::new())),
            ("inhaler_technique_adequate", ColType::StringWithDefault(String::new())),
            ("adherence", ColType::StringWithDefault(String::new())),
            ("influenza_vaccine", ColType::StringWithDefault(String::new())),
            ("pneumococcal_vaccine", ColType::StringWithDefault(String::new())),
            ("covid_vaccine", ColType::StringWithDefault(String::new())),
            ("pulmonary_rehab_status", ColType::StringWithDefault(String::new())),
            ("oxygen_use", ColType::StringWithDefault(String::new())),
            ("resting_spo2", ColType::IntegerNull),
            ("comorbidities", ColType::TextWithDefault(String::new())),
            ("self_management_plan", ColType::StringWithDefault(String::new())),
            ("rescue_pack_supplied", ColType::StringWithDefault(String::new())),
            ("next_review_interval", ColType::TextWithDefault(String::new())),
            ("clinician_note", ColType::TextWithDefault(String::new())),
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
