use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "consent_informations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("information_provided", ColType::IntegerNull),
                ("risks_explained", ColType::IntegerNull),
                ("benefits_explained", ColType::IntegerNull),
                ("questions_answered", ColType::IntegerNull),
                ("consent_given", ColType::StringWithDefault(String::new())),
                ("consent_date", ColType::DateNull),
                (
                    "guardian_consent",
                    ColType::StringWithDefault(String::new()),
                ),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE consent_informations ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "consent_informations").await
    }
}
