use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "endoscopy_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("requested_procedure", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("red_flag_dysphagia", ColType::Boolean),
            ("red_flag_weight_loss", ColType::Boolean),
            ("red_flag_anaemia", ColType::Boolean),
            ("red_flag_gi_bleeding", ColType::Boolean),
            ("red_flag_abdominal_mass", ColType::Boolean),
            ("red_flag_age_over_55", ColType::Boolean),
            ("fit_result_ug_g", ColType::DoubleNull),
            ("haemoglobin_g_l", ColType::DoubleNull),
            ("ferritin_ug_l", ColType::DoubleNull),
            ("taking_anticoagulant", ColType::Boolean),
            ("anticoagulant_agent", ColType::String),
            ("taking_antiplatelet", ColType::Boolean),
            ("antiplatelet_agent", ColType::String),
            ("diabetes_medication", ColType::String),
            ("allergies", ColType::String),
            ("latex_allergy", ColType::Boolean),
            ("cardiac_nyha_class", ColType::String),
            ("pacemaker_icd", ColType::Boolean),
            ("chronic_kidney_disease", ColType::Boolean),
            ("egfr_ml_min", ColType::DoubleNull),
            ("sleep_apnoea", ColType::Boolean),
            ("neutropenia", ColType::Boolean),
            ("asa_grade", ColType::String),
            ("vcjd_risk", ColType::Boolean),
            ("cpe_carriage", ColType::Boolean),
            ("mrsa", ColType::Boolean),
            ("blood_borne_virus", ColType::Boolean),
            ("fit_for_bowel_prep", ColType::Boolean),
            ("bowel_prep_agent", ColType::String),
            ("sedation", ColType::String),
            ("escort_available", ColType::Boolean),
            ("urgency", ColType::String),
            ("supervising_consultant", ColType::String),
            ("requester_contact", ColType::String),
            ("interpreter_required", ColType::Boolean),
            ("notes", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "endoscopy_test_requests").await
    }
}
