use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "medical_operation_note_procedures",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("role", ColType::StringWithDefault(String::new())),
                ("opcs4_code", ColType::StringWithDefault(String::new())),
                ("name", ColType::StringWithDefault(String::new())),
                ("description", ColType::TextWithDefault(String::new())),
                ("laterality", ColType::StringWithDefault(String::new())),
                ("sequence_index", ColType::IntegerWithDefault(0)),
                ("medical_operation_note_id", ColType::Uuid),
            ],
            &[("medical_operation_note", "medical_operation_note_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE medical_operation_note_procedures ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_operation_note_procedures").await
    }
}
