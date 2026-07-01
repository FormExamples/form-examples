use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "blood_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_type", ColType::String),
            ("specimen_condition", ColType::String),
            ("clinical_history", ColType::String),
            ("haemoglobin_g_l", ColType::DoubleNull),
            ("white_cell_count", ColType::DoubleNull),
            ("platelets", ColType::DoubleNull),
            ("neutrophils", ColType::DoubleNull),
            ("sodium_mmol_l", ColType::DoubleNull),
            ("potassium_mmol_l", ColType::DoubleNull),
            ("urea_mmol_l", ColType::DoubleNull),
            ("creatinine_umol_l", ColType::DoubleNull),
            ("egfr", ColType::DoubleNull),
            ("alt_u_l", ColType::DoubleNull),
            ("alkaline_phosphatase", ColType::DoubleNull),
            ("bilirubin_umol_l", ColType::DoubleNull),
            ("albumin_g_l", ColType::DoubleNull),
            ("c_reactive_protein", ColType::DoubleNull),
            ("hba1c_mmol_mol", ColType::DoubleNull),
            ("glucose_mmol_l", ColType::DoubleNull),
            ("tsh", ColType::DoubleNull),
            ("ferritin", ColType::DoubleNull),
            ("inr", ColType::DoubleNull),
            ("overall_result_status", ColType::String),
            ("abnormal_results_present", ColType::Boolean),
            ("critical_value_present", ColType::Boolean),
            ("critical_value_detail", ColType::String),
            ("findings_narrative", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("impression", ColType::String),
            ("reporting_category", ColType::String),
            ("recommended_follow_up", ColType::String),
            ("critical_result_communicated", ColType::Boolean),
            ("reported_to", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "blood_test_results").await
    }
}
