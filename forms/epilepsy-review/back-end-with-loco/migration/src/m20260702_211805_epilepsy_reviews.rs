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
            
            ("reviewer_name", ColType::TextWithDefault(String::new())),
            ("reviewer_role", ColType::StringWithDefault(String::new())),
            ("reviewed_at", ColType::DateNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("review_type", ColType::StringWithDefault(String::new())),
            ("months_since_last_review", ColType::DoubleNull),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("epilepsy_type", ColType::StringWithDefault(String::new())),
            ("age_at_onset", ColType::DoubleNull),
            ("years_since_diagnosis", ColType::DoubleNull),
            ("learning_disability", ColType::StringWithDefault(String::new())),
            ("seizure_types", ColType::TextWithDefault(String::new())),
            ("seizure_frequency", ColType::StringWithDefault(String::new())),
            ("last_seizure_date", ColType::DateNull),
            ("seizure_free_months", ColType::DoubleNull),
            ("seizure_trend", ColType::StringWithDefault(String::new())),
            ("current_asms", ColType::TextWithDefault(String::new())),
            ("asm_adherence", ColType::StringWithDefault(String::new())),
            ("asm_side_effects", ColType::StringWithDefault(String::new())),
            ("drug_level", ColType::DoubleNull),
            ("triggers", ColType::TextWithDefault(String::new())),
            ("sudep_discussed", ColType::StringWithDefault(String::new())),
            ("status_epilepticus", ColType::StringWithDefault(String::new())),
            ("seizure_injury", ColType::StringWithDefault(String::new())),
            ("dvla_eligible", ColType::StringWithDefault(String::new())),
            ("currently_driving", ColType::StringWithDefault(String::new())),
            ("bathing_advice_given", ColType::StringWithDefault(String::new())),
            ("woman_of_childbearing_potential", ColType::StringWithDefault(String::new())),
            ("on_valproate", ColType::StringWithDefault(String::new())),
            ("pregnancy_prevention_programme", ColType::StringWithDefault(String::new())),
            ("folic_acid", ColType::StringWithDefault(String::new())),
            ("contraception_interaction_reviewed", ColType::StringWithDefault(String::new())),
            ("mental_health_concern", ColType::StringWithDefault(String::new())),
            ("specialist_review_needed", ColType::StringWithDefault(String::new())),
            ("next_review_due", ColType::DateNull),
            ("care_plan", ColType::TextWithDefault(String::new())),
            ("review_context", ColType::TextWithDefault(String::new())),
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
