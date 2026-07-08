use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "epilepsy_reviews",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("reviewer_name", ColType::Text),
            ("reviewer_role", ColType::String),
            ("reviewed_at", ColType::DateNull),
            ("care_setting", ColType::String),
            ("review_type", ColType::String),
            ("months_since_last_review", ColType::DoubleNull),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("epilepsy_type", ColType::String),
            ("age_at_onset", ColType::DoubleNull),
            ("years_since_diagnosis", ColType::DoubleNull),
            ("learning_disability", ColType::String),
            ("seizure_types", ColType::Text),
            ("seizure_frequency", ColType::String),
            ("last_seizure_date", ColType::DateNull),
            ("seizure_free_months", ColType::DoubleNull),
            ("seizure_trend", ColType::String),
            ("current_asms", ColType::Text),
            ("asm_adherence", ColType::String),
            ("asm_side_effects", ColType::String),
            ("drug_level", ColType::DoubleNull),
            ("triggers", ColType::Text),
            ("sudep_discussed", ColType::String),
            ("status_epilepticus", ColType::String),
            ("seizure_injury", ColType::String),
            ("dvla_eligible", ColType::String),
            ("currently_driving", ColType::String),
            ("bathing_advice_given", ColType::String),
            ("woman_of_childbearing_potential", ColType::String),
            ("on_valproate", ColType::String),
            ("pregnancy_prevention_programme", ColType::String),
            ("folic_acid", ColType::String),
            ("contraception_interaction_reviewed", ColType::String),
            ("mental_health_concern", ColType::String),
            ("specialist_review_needed", ColType::String),
            ("next_review_due", ColType::DateNull),
            ("care_plan", ColType::Text),
            ("review_context", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "epilepsy_reviews").await
    }
}
