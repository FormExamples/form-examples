use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "diabetes_podiatry_assessments",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("assessed_at", ColType::DateNull),
            ("assessment_setting", ColType::StringWithDefault(String::new())),
            ("diabetes_type", ColType::StringWithDefault(String::new())),
            ("years_since_diagnosis", ColType::DoubleNull),
            ("on_renal_replacement_therapy", ColType::StringWithDefault(String::new())),
            ("visual_acuity_impairment", ColType::StringWithDefault(String::new())),
            ("self_care_ability", ColType::StringWithDefault(String::new())),
            ("footwear_appropriate", ColType::StringWithDefault(String::new())),
            ("right_neuropathy_status", ColType::StringWithDefault(String::new())),
            ("right_pulses_status", ColType::StringWithDefault(String::new())),
            ("right_deformity", ColType::StringWithDefault(String::new())),
            ("right_callus", ColType::StringWithDefault(String::new())),
            ("right_skin_breakdown", ColType::StringWithDefault(String::new())),
            ("right_active_ulcer", ColType::StringWithDefault(String::new())),
            ("right_ulcer_severity", ColType::StringWithDefault(String::new())),
            ("right_previous_ulcer", ColType::StringWithDefault(String::new())),
            ("right_previous_amputation", ColType::StringWithDefault(String::new())),
            ("right_suspected_charcot", ColType::StringWithDefault(String::new())),
            ("left_neuropathy_status", ColType::StringWithDefault(String::new())),
            ("left_pulses_status", ColType::StringWithDefault(String::new())),
            ("left_deformity", ColType::StringWithDefault(String::new())),
            ("left_callus", ColType::StringWithDefault(String::new())),
            ("left_skin_breakdown", ColType::StringWithDefault(String::new())),
            ("left_active_ulcer", ColType::StringWithDefault(String::new())),
            ("left_ulcer_severity", ColType::StringWithDefault(String::new())),
            ("left_previous_ulcer", ColType::StringWithDefault(String::new())),
            ("left_previous_amputation", ColType::StringWithDefault(String::new())),
            ("left_suspected_charcot", ColType::StringWithDefault(String::new())),
            ("clinical_context", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "diabetes_podiatry_assessments").await
    }
}
