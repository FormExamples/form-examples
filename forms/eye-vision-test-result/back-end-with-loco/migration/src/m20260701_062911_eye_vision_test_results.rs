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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("test_type", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("visual_acuity_right", ColType::StringWithDefault(String::new())),
            ("visual_acuity_left", ColType::StringWithDefault(String::new())),
            ("intraocular_pressure_right_mmhg", ColType::DoubleNull),
            ("intraocular_pressure_left_mmhg", ColType::DoubleNull),
            ("visual_field_result", ColType::StringWithDefault(String::new())),
            ("reduced_visual_acuity", ColType::BooleanWithDefault(false)),
            ("visual_field_defect", ColType::BooleanWithDefault(false)),
            ("raised_intraocular_pressure", ColType::BooleanWithDefault(false)),
            ("diabetic_retinopathy", ColType::BooleanWithDefault(false)),
            ("optic_disc_abnormality", ColType::BooleanWithDefault(false)),
            ("macular_abnormality", ColType::BooleanWithDefault(false)),
            ("normal_examination", ColType::BooleanWithDefault(false)),
            ("retinopathy_grade", ColType::StringWithDefault(String::new())),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "eye_vision_test_results").await
    }
}
