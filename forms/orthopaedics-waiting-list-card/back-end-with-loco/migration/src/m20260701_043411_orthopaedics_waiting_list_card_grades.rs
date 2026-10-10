use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "orthopaedics_waiting_list_card_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "waiting_time_status",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "clinical_priority",
                    ColType::StringWithDefault(String::new()),
                ),
                ("target_wait_weeks", ColType::DoubleNull),
                ("days_waited", ColType::IntegerNull),
                ("weeks_waited", ColType::DoubleNull),
                ("days_to_target", ColType::IntegerNull),
                ("days_to_breach", ColType::IntegerNull),
                ("days_to_appointment", ColType::IntegerNull),
                ("grader_notes", ColType::TextWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("orthopaedics_waiting_list_card_id", ColType::Uuid),
            ],
            &[(
                "orthopaedics_waiting_list_card",
                "orthopaedics_waiting_list_card_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE orthopaedics_waiting_list_card_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "orthopaedics_waiting_list_card_grades").await
    }
}
