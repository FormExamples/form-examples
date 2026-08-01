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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("echo_type", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("study_quality", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("lv_ejection_fraction_percent", ColType::DoubleNull),
            ("lv_function", ColType::StringWithDefault(String::new())),
            ("lv_internal_diameter_diastole_mm", ColType::DoubleNull),
            ("aortic_stenosis", ColType::StringWithDefault(String::new())),
            ("aortic_regurgitation", ColType::StringWithDefault(String::new())),
            ("mitral_stenosis", ColType::StringWithDefault(String::new())),
            ("mitral_regurgitation", ColType::StringWithDefault(String::new())),
            ("pulmonary_artery_systolic_pressure_mmhg", ColType::DoubleNull),
            ("lv_hypertrophy", ColType::BooleanWithDefault(false)),
            ("regional_wall_motion_abnormality", ColType::BooleanWithDefault(false)),
            ("pericardial_effusion", ColType::BooleanWithDefault(false)),
            ("vegetation", ColType::BooleanWithDefault(false)),
            ("intracardiac_thrombus", ColType::BooleanWithDefault(false)),
            ("normal_study", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "echocardiogram_test_results").await
    }
}
