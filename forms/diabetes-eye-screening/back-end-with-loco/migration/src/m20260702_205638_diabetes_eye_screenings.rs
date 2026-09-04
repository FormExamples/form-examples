use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "diabetes_eye_screenings",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("grader_name", ColType::TextWithDefault(String::new())),
            ("grader_role", ColType::StringWithDefault(String::new())),
            ("graded_at", ColType::DateNull),
            ("image_captured_at", ColType::DateNull),
            ("imaging_media", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("diabetes_type", ColType::StringWithDefault(String::new())),
            ("years_since_diagnosis", ColType::DoubleNull),
            ("previous_screen_date", ColType::DateNull),
            ("previous_screen_result", ColType::StringWithDefault(String::new())),
            ("right_retinopathy_grade", ColType::StringWithDefault(String::new())),
            ("right_maculopathy_grade", ColType::StringWithDefault(String::new())),
            ("right_photocoagulation", ColType::StringWithDefault(String::new())),
            ("right_ungradable", ColType::StringWithDefault(String::new())),
            ("right_visual_acuity", ColType::TextWithDefault(String::new())),
            ("left_retinopathy_grade", ColType::StringWithDefault(String::new())),
            ("left_maculopathy_grade", ColType::StringWithDefault(String::new())),
            ("left_photocoagulation", ColType::StringWithDefault(String::new())),
            ("left_ungradable", ColType::StringWithDefault(String::new())),
            ("left_visual_acuity", ColType::TextWithDefault(String::new())),
            ("clinical_context", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "diabetes_eye_screenings").await
    }
}
