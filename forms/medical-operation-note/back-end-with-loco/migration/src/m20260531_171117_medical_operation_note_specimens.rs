use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "medical_operation_note_specimens",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("label", ColType::StringWithDefault(String::new())),
                ("specimen_type", ColType::StringWithDefault(String::new())),
                ("anatomical_site", ColType::StringWithDefault(String::new())),
                ("container", ColType::StringWithDefault(String::new())),
                ("fixative", ColType::StringWithDefault(String::new())),
                ("destination", ColType::StringWithDefault(String::new())),
                ("urgency", ColType::StringWithDefault(String::new())),
                ("label_verified", ColType::StringWithDefault(String::new())),
                (
                    "chain_of_custody_documented",
                    ColType::StringWithDefault(String::new()),
                ),
                ("notes", ColType::TextWithDefault(String::new())),
                ("medical_operation_note_id", ColType::Uuid),
            ],
            &[("medical_operation_note", "medical_operation_note_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE medical_operation_note_specimens ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_operation_note_specimens").await
    }
}
