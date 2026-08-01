use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "dexa_bone_density_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("scan_region", ColType::StringWithDefault(String::new())),
            ("examination_adequacy", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("lumbar_spine_t_score", ColType::DoubleNull),
            ("lumbar_spine_z_score", ColType::DoubleNull),
            ("femoral_neck_t_score", ColType::DoubleNull),
            ("femoral_neck_z_score", ColType::DoubleNull),
            ("total_hip_t_score", ColType::DoubleNull),
            ("lowest_t_score", ColType::DoubleNull),
            ("bone_mineral_density_g_cm2", ColType::DoubleNull),
            ("who_classification", ColType::StringWithDefault(String::new())),
            ("frax_major_fracture_percent", ColType::DoubleNull),
            ("frax_hip_fracture_percent", ColType::DoubleNull),
            ("vertebral_fracture_identified", ColType::BooleanWithDefault(false)),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("percent_change_since_previous", ColType::DoubleNull),
            ("impression", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "dexa_bone_density_test_results").await
    }
}
