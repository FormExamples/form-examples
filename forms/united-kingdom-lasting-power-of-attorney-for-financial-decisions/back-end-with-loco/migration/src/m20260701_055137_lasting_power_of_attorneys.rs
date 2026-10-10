use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "lasting_power_of_attorneys",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("decision_mode", ColType::TextWithDefault(String::new())),
                (
                    "decision_mode_mixed_text",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "when_attorneys_can_act",
                    ColType::TextWithDefault(String::new()),
                ),
                ("preferences_text", ColType::TextWithDefault(String::new())),
                ("instructions_text", ColType::TextWithDefault(String::new())),
                (
                    "legal_rights_acknowledged",
                    ColType::BooleanWithDefault(false),
                ),
                (
                    "opg_reference_number",
                    ColType::TextWithDefault(String::new()),
                ),
                ("opg_registration_date", ColType::DateNull),
                ("status", ColType::TextWithDefault(String::new())),
                ("donor_person_id", ColType::Uuid),
            ],
            &[("people", "donor_person_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE lasting_power_of_attorneys ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lasting_power_of_attorneys").await
    }
}
