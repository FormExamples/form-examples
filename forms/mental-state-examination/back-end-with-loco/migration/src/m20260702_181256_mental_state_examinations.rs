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
            
            ("clinician_name", ColType::Text),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("assessment_reason", ColType::Text),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("appearance_grooming", ColType::String),
            ("appearance_eye_contact", ColType::String),
            ("appearance_rapport", ColType::String),
            ("appearance_psychomotor", ColType::String),
            ("appearance_abnormal_movements", ColType::Text),
            ("appearance_notes", ColType::Text),
            ("speech_rate", ColType::String),
            ("speech_volume", ColType::String),
            ("speech_quantity", ColType::String),
            ("speech_fluency", ColType::String),
            ("speech_notes", ColType::Text),
            ("mood_subjective", ColType::Text),
            ("mood_descriptor", ColType::String),
            ("affect_range", ColType::String),
            ("affect_congruence", ColType::String),
            ("affect_reactivity", ColType::String),
            ("emotion_notes", ColType::Text),
            ("hallucinations_present", ColType::String),
            ("command_hallucinations", ColType::String),
            ("illusions", ColType::String),
            ("depersonalisation", ColType::String),
            ("derealisation", ColType::String),
            ("perception_notes", ColType::Text),
            ("thought_form", ColType::String),
            ("delusions", ColType::String),
            ("obsessions", ColType::String),
            ("suicidal_ideation", ColType::String),
            ("homicidal_ideation", ColType::String),
            ("self_harm_thoughts", ColType::String),
            ("thought_notes", ColType::Text),
            ("insight_level", ColType::String),
            ("treatment_understanding", ColType::String),
            ("judgement", ColType::String),
            ("insight_notes", ColType::Text),
            ("orientation", ColType::String),
            ("attention", ColType::String),
            ("memory", ColType::String),
            ("cognitive_impression", ColType::String),
            ("cognition_notes", ColType::Text),
            ("clinical_formulation", ColType::Text),
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
