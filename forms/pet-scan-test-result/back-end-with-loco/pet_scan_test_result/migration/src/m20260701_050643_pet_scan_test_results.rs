use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "pet_scan_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("scan_type", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("clinical_history", ColType::String),
            ("blood_glucose_mmol_l", ColType::DoubleNull),
            ("injected_activity_mbq", ColType::DoubleNull),
            ("examination_adequacy", ColType::String),
            ("findings_narrative", ColType::String),
            ("hypermetabolic_lesion", ColType::Boolean),
            ("nodal_uptake", ColType::Boolean),
            ("distant_metastasis", ColType::Boolean),
            ("no_abnormal_uptake", ColType::Boolean),
            ("physiological_uptake_only", ColType::Boolean),
            ("incidental_finding", ColType::Boolean),
            ("suv_max", ColType::DoubleNull),
            ("largest_lesion_size_mm", ColType::DoubleNull),
            ("comparison_with_previous", ColType::String),
            ("treatment_response", ColType::String),
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
        drop_table(m, "pet_scan_test_results").await
    }
}
