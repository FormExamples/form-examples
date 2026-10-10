use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "ct_scan_test_requests",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("site_name", ColType::StringWithDefault(String::new())),
                ("setting", ColType::StringWithDefault(String::new())),
                ("referral_date", ColType::DateNull),
                ("requested_by_date", ColType::DateNull),
                ("body_region", ColType::StringWithDefault(String::new())),
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
                (
                    "contrast_required",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "pregnancy_status",
                    ColType::StringWithDefault(String::new()),
                ),
                ("egfr", ColType::DoubleNull),
                (
                    "previous_contrast_reaction",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "iodine_contrast_allergy",
                    ColType::BooleanWithDefault(false),
                ),
                ("metformin", ColType::BooleanWithDefault(false)),
                ("diabetes", ColType::BooleanWithDefault(false)),
                ("renal_impairment", ColType::BooleanWithDefault(false)),
                ("weight_kg", ColType::DoubleNull),
                (
                    "relevant_previous_imaging",
                    ColType::StringWithDefault(String::new()),
                ),
                ("urgency", ColType::StringWithDefault("routine".to_string())),
                (
                    "supervising_consultant",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "ir_me_r_justification",
                    ColType::StringWithDefault(String::new()),
                ),
                ("notes", ColType::StringWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::Uuid),
            ],
            &[("patient", "patient_id"), ("clinician", "clinician_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE ct_scan_test_requests ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "ct_scan_test_requests").await
    }
}
