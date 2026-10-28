use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_fit_note_grades", &[
            
            ("id", ColType::PkUuid),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("outcome", ColType::StringWithDefault(String::new())),
            ("approval_status", ColType::StringWithDefault(String::new())),
            ("duration_days", ColType::IntegerNull),
            ("adjustment_count", ColType::IntegerNull),
            ("graded_at", ColType::TimestampWithTimeZone),
("medical_fit_note_id", ColType::Uuid),
], &[("medical_fit_note", "medical_fit_note_id")]).await?;
m.get_connection().execute_unprepared("ALTER TABLE medical_fit_note_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_fit_note_grades").await
    }
}
