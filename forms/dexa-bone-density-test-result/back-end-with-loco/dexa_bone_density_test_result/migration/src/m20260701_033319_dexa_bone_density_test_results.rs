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
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("scan_region", ColType::String),
            ("examination_adequacy", ColType::String),
            ("clinical_history", ColType::String),
            ("lumbar_spine_t_score", ColType::DoubleNull),
            ("lumbar_spine_z_score", ColType::DoubleNull),
            ("femoral_neck_t_score", ColType::DoubleNull),
            ("femoral_neck_z_score", ColType::DoubleNull),
            ("total_hip_t_score", ColType::DoubleNull),
            ("lowest_t_score", ColType::DoubleNull),
            ("bone_mineral_density_g_cm2", ColType::DoubleNull),
            ("who_classification", ColType::String),
            ("frax_major_fracture_percent", ColType::DoubleNull),
            ("frax_hip_fracture_percent", ColType::DoubleNull),
            ("vertebral_fracture_identified", ColType::Boolean),
            ("comparison_with_previous", ColType::String),
            ("percent_change_since_previous", ColType::DoubleNull),
            ("impression", ColType::String),
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
        drop_table(m, "dexa_bone_density_test_results").await
    }
}
