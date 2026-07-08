use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "echocardiogram_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("echo_type", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("report_status", ColType::String),
            ("study_quality", ColType::String),
            ("clinical_history", ColType::String),
            ("lv_ejection_fraction_percent", ColType::DoubleNull),
            ("lv_function", ColType::String),
            ("lv_internal_diameter_diastole_mm", ColType::DoubleNull),
            ("aortic_stenosis", ColType::String),
            ("aortic_regurgitation", ColType::String),
            ("mitral_stenosis", ColType::String),
            ("mitral_regurgitation", ColType::String),
            ("pulmonary_artery_systolic_pressure_mmhg", ColType::DoubleNull),
            ("lv_hypertrophy", ColType::Boolean),
            ("regional_wall_motion_abnormality", ColType::Boolean),
            ("pericardial_effusion", ColType::Boolean),
            ("vegetation", ColType::Boolean),
            ("intracardiac_thrombus", ColType::Boolean),
            ("normal_study", ColType::Boolean),
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
        drop_table(m, "echocardiogram_test_results").await
    }
}
