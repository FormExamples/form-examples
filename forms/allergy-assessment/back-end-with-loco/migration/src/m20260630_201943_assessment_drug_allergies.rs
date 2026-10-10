use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "assessment_drug_allergies",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "has_drug_allergies",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "cross_reactivity_concerns",
                    ColType::TextWithDefault(String::new()),
                ),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE assessment_drug_allergies ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_drug_allergies").await
    }
}
