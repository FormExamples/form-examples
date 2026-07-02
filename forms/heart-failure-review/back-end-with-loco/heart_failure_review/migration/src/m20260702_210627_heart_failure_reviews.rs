use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "heart_failure_reviews",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("review_date", ColType::DateNull),
            ("care_setting", ColType::String),
            ("review_type", ColType::String),
            ("last_review_date", ColType::DateNull),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("year_of_diagnosis", ColType::IntegerNull),
            ("heart_failure_type", ColType::String),
            ("latest_lvef", ColType::DoubleNull),
            ("last_echo_date", ColType::DateNull),
            ("aetiology", ColType::String),
            ("nyha_class", ColType::IntegerNull),
            ("breathlessness", ColType::String),
            ("orthopnoea", ColType::String),
            ("paroxysmal_nocturnal_dyspnoea", ColType::String),
            ("fatigue", ColType::String),
            ("change_since_last_review", ColType::String),
            ("decompensation", ColType::String),
            ("weight_kg", ColType::DoubleNull),
            ("weight_change_kg", ColType::DoubleNull),
            ("peripheral_oedema", ColType::String),
            ("raised_jvp", ColType::String),
            ("lung_crackles", ColType::String),
            ("systolic_blood_pressure", ColType::IntegerNull),
            ("diastolic_blood_pressure", ColType::IntegerNull),
            ("heart_rate", ColType::IntegerNull),
            ("heart_rhythm", ColType::String),
            ("nt_pro_bnp", ColType::DoubleNull),
            ("sodium", ColType::DoubleNull),
            ("potassium", ColType::DoubleNull),
            ("urea", ColType::DoubleNull),
            ("creatinine", ColType::DoubleNull),
            ("egfr", ColType::DoubleNull),
            ("haemoglobin", ColType::DoubleNull),
            ("ferritin", ColType::DoubleNull),
            ("transferrin_saturation", ColType::DoubleNull),
            ("hba1c", ColType::DoubleNull),
            ("bloods_date", ColType::DateNull),
            ("raas_inhibitor_status", ColType::String),
            ("raas_inhibitor_agent", ColType::String),
            ("raas_inhibitor_dose", ColType::String),
            ("raas_inhibitor_at_target_dose", ColType::String),
            ("raas_inhibitor_adherence", ColType::String),
            ("beta_blocker_status", ColType::String),
            ("beta_blocker_agent", ColType::String),
            ("beta_blocker_dose", ColType::String),
            ("beta_blocker_at_target_dose", ColType::String),
            ("beta_blocker_adherence", ColType::String),
            ("mra_status", ColType::String),
            ("mra_agent", ColType::String),
            ("mra_dose", ColType::String),
            ("mra_at_target_dose", ColType::String),
            ("mra_adherence", ColType::String),
            ("sglt2_inhibitor_status", ColType::String),
            ("sglt2_inhibitor_agent", ColType::String),
            ("sglt2_inhibitor_dose", ColType::String),
            ("sglt2_inhibitor_at_target_dose", ColType::String),
            ("sglt2_inhibitor_adherence", ColType::String),
            ("loop_diuretic_agent", ColType::String),
            ("loop_diuretic_dose", ColType::String),
            ("other_medications", ColType::Text),
            ("icd", ColType::String),
            ("crt", ColType::String),
            ("pacemaker", ColType::String),
            ("device_check_status", ColType::String),
            ("influenza_vaccination", ColType::String),
            ("pneumococcal_vaccination", ColType::String),
            ("covid_vaccination", ColType::String),
            ("smoking_status", ColType::String),
            ("alcohol_status", ColType::String),
            ("daily_weights", ColType::String),
            ("self_management_plan", ColType::String),
            ("cardiac_rehab", ColType::String),
            ("review_context", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "heart_failure_reviews").await
    }
}
