use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "medical_operation_note_complications",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("category", ColType::StringWithDefault(String::new())),
                ("description", ColType::TextWithDefault(String::new())),
                (
                    "clavien_dindo_grade",
                    ColType::StringWithDefault(String::new()),
                ),
                ("onset_at", ColType::TimestampWithTimeZoneNull),
                ("action_taken", ColType::TextWithDefault(String::new())),
                (
                    "resolved_in_theatre",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "reported_to_governance",
                    ColType::StringWithDefault(String::new()),
                ),
                ("medical_operation_note_id", ColType::Uuid),
            ],
            &[("medical_operation_note", "medical_operation_note_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE medical_operation_note_complications ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_operation_note_complications").await
    }
}
