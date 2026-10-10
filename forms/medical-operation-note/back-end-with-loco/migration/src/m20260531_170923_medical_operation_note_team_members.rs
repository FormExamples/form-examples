use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "medical_operation_note_team_members",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("team_role", ColType::StringWithDefault(String::new())),
                ("arrived_at", ColType::TimestampWithTimeZoneNull),
                ("left_at", ColType::TimestampWithTimeZoneNull),
                ("notes", ColType::TextWithDefault(String::new())),
                ("medical_operation_note_id", ColType::Uuid),
                ("clinician_id", ColType::Uuid),
            ],
            &[
                ("medical_operation_note", "medical_operation_note_id"),
                ("clinician", "clinician_id"),
            ],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE medical_operation_note_team_members ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_operation_note_team_members").await
    }
}
