use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "eye_vision_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("test_type", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("clinical_history", ColType::String),
            ("visual_acuity_right", ColType::String),
            ("visual_acuity_left", ColType::String),
            ("intraocular_pressure_right_mmhg", ColType::DoubleNull),
            ("intraocular_pressure_left_mmhg", ColType::DoubleNull),
            ("visual_field_result", ColType::String),
            ("reduced_visual_acuity", ColType::Boolean),
            ("visual_field_defect", ColType::Boolean),
            ("raised_intraocular_pressure", ColType::Boolean),
            ("diabetic_retinopathy", ColType::Boolean),
            ("optic_disc_abnormality", ColType::Boolean),
            ("macular_abnormality", ColType::Boolean),
            ("normal_examination", ColType::Boolean),
            ("retinopathy_grade", ColType::String),
            ("findings_narrative", ColType::String),
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
        drop_table(m, "eye_vision_test_results").await
    }
}
