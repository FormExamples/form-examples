use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "assessment_current_medications",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "polypharmacy_concern",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "drug_interactions_identified",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "drug_interaction_details",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "complementary_medicines",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "complementary_medicine_details",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "medication_adherence",
                    ColType::StringWithDefault(String::new()),
                ),
                ("medications_notes", ColType::TextWithDefault(String::new())),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE assessment_current_medications ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_current_medications").await
    }
}
