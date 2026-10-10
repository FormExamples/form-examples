use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "medical_certificate_of_cause_of_death_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("validity_class", ColType::StringWithDefault(String::new())),
                ("underlying_cause", ColType::TextWithDefault(String::new())),
                (
                    "coroner_referral_indicated",
                    ColType::StringWithDefault(String::new()),
                ),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("medical_certificate_of_cause_of_death_id", ColType::Uuid),
            ],
            &[(
                "medical_certificate_of_cause_of_death",
                "medical_certificate_of_cause_of_death_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE medical_certificate_of_cause_of_death_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_certificate_of_cause_of_death_grades").await
    }
}
