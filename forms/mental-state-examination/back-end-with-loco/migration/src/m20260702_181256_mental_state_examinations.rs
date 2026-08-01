use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "mental_state_examinations",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::TextWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("assessment_reason", ColType::TextWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("appearance_grooming", ColType::StringWithDefault(String::new())),
            ("appearance_eye_contact", ColType::StringWithDefault(String::new())),
            ("appearance_rapport", ColType::StringWithDefault(String::new())),
            ("appearance_psychomotor", ColType::StringWithDefault(String::new())),
            ("appearance_abnormal_movements", ColType::TextWithDefault(String::new())),
            ("appearance_notes", ColType::TextWithDefault(String::new())),
            ("speech_rate", ColType::StringWithDefault(String::new())),
            ("speech_volume", ColType::StringWithDefault(String::new())),
            ("speech_quantity", ColType::StringWithDefault(String::new())),
            ("speech_fluency", ColType::StringWithDefault(String::new())),
            ("speech_notes", ColType::TextWithDefault(String::new())),
            ("mood_subjective", ColType::TextWithDefault(String::new())),
            ("mood_descriptor", ColType::StringWithDefault(String::new())),
            ("affect_range", ColType::StringWithDefault(String::new())),
            ("affect_congruence", ColType::StringWithDefault(String::new())),
            ("affect_reactivity", ColType::StringWithDefault(String::new())),
            ("emotion_notes", ColType::TextWithDefault(String::new())),
            ("hallucinations_present", ColType::StringWithDefault(String::new())),
            ("command_hallucinations", ColType::StringWithDefault(String::new())),
            ("illusions", ColType::StringWithDefault(String::new())),
            ("depersonalisation", ColType::StringWithDefault(String::new())),
            ("derealisation", ColType::StringWithDefault(String::new())),
            ("perception_notes", ColType::TextWithDefault(String::new())),
            ("thought_form", ColType::StringWithDefault(String::new())),
            ("delusions", ColType::StringWithDefault(String::new())),
            ("obsessions", ColType::StringWithDefault(String::new())),
            ("suicidal_ideation", ColType::StringWithDefault(String::new())),
            ("homicidal_ideation", ColType::StringWithDefault(String::new())),
            ("self_harm_thoughts", ColType::StringWithDefault(String::new())),
            ("thought_notes", ColType::TextWithDefault(String::new())),
            ("insight_level", ColType::StringWithDefault(String::new())),
            ("treatment_understanding", ColType::StringWithDefault(String::new())),
            ("judgement", ColType::StringWithDefault(String::new())),
            ("insight_notes", ColType::TextWithDefault(String::new())),
            ("orientation", ColType::StringWithDefault(String::new())),
            ("attention", ColType::StringWithDefault(String::new())),
            ("memory", ColType::StringWithDefault(String::new())),
            ("cognitive_impression", ColType::StringWithDefault(String::new())),
            ("cognition_notes", ColType::TextWithDefault(String::new())),
            ("clinical_formulation", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "mental_state_examinations").await
    }
}
