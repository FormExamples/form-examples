use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "cystoscopy_test_requests",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("site_name", ColType::StringWithDefault(String::new())),
                ("setting", ColType::StringWithDefault(String::new())),
                ("referral_date", ColType::DateNull),
                ("requested_by_date", ColType::DateNull),
                ("procedure", ColType::StringWithDefault(String::new())),
                (
                    "primary_indication",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "clinical_question",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "relevant_history",
                    ColType::StringWithDefault(String::new()),
                ),
                ("symptom_haematuria", ColType::BooleanWithDefault(false)),
                ("symptom_dysuria", ColType::BooleanWithDefault(false)),
                ("symptom_frequency", ColType::BooleanWithDefault(false)),
                ("symptom_retention", ColType::BooleanWithDefault(false)),
                ("visible_haematuria", ColType::BooleanWithDefault(false)),
                ("current_uti", ColType::BooleanWithDefault(false)),
                ("taking_anticoagulant", ColType::BooleanWithDefault(false)),
                (
                    "anticoagulant_agent",
                    ColType::StringWithDefault(String::new()),
                ),
                ("taking_antiplatelet", ColType::BooleanWithDefault(false)),
                (
                    "previous_bladder_cancer",
                    ColType::BooleanWithDefault(false),
                ),
                ("urgency", ColType::StringWithDefault("routine".to_string())),
                (
                    "supervising_consultant",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "requester_contact",
                    ColType::StringWithDefault(String::new()),
                ),
                ("notes", ColType::StringWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::Uuid),
            ],
            &[("patient", "patient_id"), ("clinician", "clinician_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE cystoscopy_test_requests ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "cystoscopy_test_requests").await
    }
}
