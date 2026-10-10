use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "outpatient_outcome_followups",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("disposition", ColType::StringWithDefault(String::new())),
                ("next_appointment_date", ColType::DateNull),
                (
                    "onward_referral_specialty",
                    ColType::StringWithDefault(String::new()),
                ),
                ("followup_notes", ColType::TextWithDefault(String::new())),
                ("outpatient_outcome_id", ColType::Uuid),
            ],
            &[("outpatient_outcome", "outpatient_outcome_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE outpatient_outcome_followups ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "outpatient_outcome_followups").await
    }
}
