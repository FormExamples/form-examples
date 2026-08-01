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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("scan_type", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("blood_glucose_mmol_l", ColType::DoubleNull),
            ("injected_activity_mbq", ColType::DoubleNull),
            ("examination_adequacy", ColType::StringWithDefault(String::new())),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
            ("hypermetabolic_lesion", ColType::BooleanWithDefault(false)),
            ("nodal_uptake", ColType::BooleanWithDefault(false)),
            ("distant_metastasis", ColType::BooleanWithDefault(false)),
            ("no_abnormal_uptake", ColType::BooleanWithDefault(false)),
            ("physiological_uptake_only", ColType::BooleanWithDefault(false)),
            ("incidental_finding", ColType::BooleanWithDefault(false)),
            ("suv_max", ColType::DoubleNull),
            ("largest_lesion_size_mm", ColType::DoubleNull),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("treatment_response", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "pet_scan_test_results").await
    }
}
