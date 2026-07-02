use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "diabetic_eye_screenings",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("grader_name", ColType::Text),
            ("grader_role", ColType::String),
            ("graded_at", ColType::DateNull),
            ("image_captured_at", ColType::DateNull),
            ("imaging_media", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("diabetes_type", ColType::String),
            ("years_since_diagnosis", ColType::DoubleNull),
            ("previous_screen_date", ColType::DateNull),
            ("previous_screen_result", ColType::String),
            ("right_retinopathy_grade", ColType::String),
            ("right_maculopathy_grade", ColType::String),
            ("right_photocoagulation", ColType::String),
            ("right_ungradable", ColType::String),
            ("right_visual_acuity", ColType::Text),
            ("left_retinopathy_grade", ColType::String),
            ("left_maculopathy_grade", ColType::String),
            ("left_photocoagulation", ColType::String),
            ("left_ungradable", ColType::String),
            ("left_visual_acuity", ColType::Text),
            ("clinical_context", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "diabetic_eye_screenings").await
    }
}
