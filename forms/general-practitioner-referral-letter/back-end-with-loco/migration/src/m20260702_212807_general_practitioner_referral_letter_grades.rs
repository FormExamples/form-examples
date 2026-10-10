use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "general_practitioner_referral_letter_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault(String::new())),
                ("urgency", ColType::StringWithDefault(String::new())),
                ("completeness_percent", ColType::IntegerNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("general_practitioner_referral_letter_id", ColType::Uuid),
            ],
            &[(
                "general_practitioner_referral_letter",
                "general_practitioner_referral_letter_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE general_practitioner_referral_letter_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "general_practitioner_referral_letter_grades").await
    }
}
