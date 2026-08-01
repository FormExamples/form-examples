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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_type", ColType::StringWithDefault(String::new())),
            ("specimen_condition", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
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
            ("overall_result_status", ColType::StringWithDefault(String::new())),
            ("abnormal_results_present", ColType::BooleanWithDefault(false)),
            ("critical_value_present", ColType::BooleanWithDefault(false)),
            ("critical_value_detail", ColType::StringWithDefault(String::new())),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("impression", ColType::StringWithDefault(String::new())),
            ("reporting_category", ColType::StringWithDefault(String::new())),
            ("recommended_follow_up", ColType::StringWithDefault(String::new())),
            ("critical_result_communicated", ColType::BooleanWithDefault(false)),
            ("reported_to", ColType::StringWithDefault(String::new())),
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
