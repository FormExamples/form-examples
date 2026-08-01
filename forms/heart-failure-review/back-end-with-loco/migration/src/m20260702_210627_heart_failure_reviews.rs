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
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("review_date", ColType::DateNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("review_type", ColType::StringWithDefault(String::new())),
            ("last_review_date", ColType::DateNull),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("year_of_diagnosis", ColType::IntegerNull),
            ("heart_failure_type", ColType::StringWithDefault(String::new())),
            ("latest_lvef", ColType::DoubleNull),
            ("last_echo_date", ColType::DateNull),
            ("aetiology", ColType::StringWithDefault(String::new())),
            ("nyha_class", ColType::IntegerNull),
            ("breathlessness", ColType::StringWithDefault(String::new())),
            ("orthopnoea", ColType::StringWithDefault(String::new())),
            ("paroxysmal_nocturnal_dyspnoea", ColType::StringWithDefault(String::new())),
            ("fatigue", ColType::StringWithDefault(String::new())),
            ("change_since_last_review", ColType::StringWithDefault(String::new())),
            ("decompensation", ColType::StringWithDefault(String::new())),
            ("weight_kg", ColType::DoubleNull),
            ("weight_change_kg", ColType::DoubleNull),
            ("peripheral_oedema", ColType::StringWithDefault(String::new())),
            ("raised_jvp", ColType::StringWithDefault(String::new())),
            ("lung_crackles", ColType::StringWithDefault(String::new())),
            ("systolic_blood_pressure", ColType::IntegerNull),
            ("diastolic_blood_pressure", ColType::IntegerNull),
            ("heart_rate", ColType::IntegerNull),
            ("heart_rhythm", ColType::StringWithDefault(String::new())),
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
            ("raas_inhibitor_status", ColType::StringWithDefault(String::new())),
            ("raas_inhibitor_agent", ColType::StringWithDefault(String::new())),
            ("raas_inhibitor_dose", ColType::StringWithDefault(String::new())),
            ("raas_inhibitor_at_target_dose", ColType::StringWithDefault(String::new())),
            ("raas_inhibitor_adherence", ColType::StringWithDefault(String::new())),
            ("beta_blocker_status", ColType::StringWithDefault(String::new())),
            ("beta_blocker_agent", ColType::StringWithDefault(String::new())),
            ("beta_blocker_dose", ColType::StringWithDefault(String::new())),
            ("beta_blocker_at_target_dose", ColType::StringWithDefault(String::new())),
            ("beta_blocker_adherence", ColType::StringWithDefault(String::new())),
            ("mra_status", ColType::StringWithDefault(String::new())),
            ("mra_agent", ColType::StringWithDefault(String::new())),
            ("mra_dose", ColType::StringWithDefault(String::new())),
            ("mra_at_target_dose", ColType::StringWithDefault(String::new())),
            ("mra_adherence", ColType::StringWithDefault(String::new())),
            ("sglt2_inhibitor_status", ColType::StringWithDefault(String::new())),
            ("sglt2_inhibitor_agent", ColType::StringWithDefault(String::new())),
            ("sglt2_inhibitor_dose", ColType::StringWithDefault(String::new())),
            ("sglt2_inhibitor_at_target_dose", ColType::StringWithDefault(String::new())),
            ("sglt2_inhibitor_adherence", ColType::StringWithDefault(String::new())),
            ("loop_diuretic_agent", ColType::StringWithDefault(String::new())),
            ("loop_diuretic_dose", ColType::StringWithDefault(String::new())),
            ("other_medications", ColType::TextWithDefault(String::new())),
            ("icd", ColType::StringWithDefault(String::new())),
            ("crt", ColType::StringWithDefault(String::new())),
            ("pacemaker", ColType::StringWithDefault(String::new())),
            ("device_check_status", ColType::StringWithDefault(String::new())),
            ("influenza_vaccination", ColType::StringWithDefault(String::new())),
            ("pneumococcal_vaccination", ColType::StringWithDefault(String::new())),
            ("covid_vaccination", ColType::StringWithDefault(String::new())),
            ("smoking_status", ColType::StringWithDefault(String::new())),
            ("alcohol_status", ColType::StringWithDefault(String::new())),
            ("daily_weights", ColType::StringWithDefault(String::new())),
            ("self_management_plan", ColType::StringWithDefault(String::new())),
            ("cardiac_rehab", ColType::StringWithDefault(String::new())),
            ("review_context", ColType::TextWithDefault(String::new())),
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
