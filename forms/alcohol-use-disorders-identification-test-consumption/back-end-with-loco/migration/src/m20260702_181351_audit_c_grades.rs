use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "audit_c_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("total_score", ColType::IntegerNull),
                ("risk_band", ColType::StringWithDefault(String::new())),
                ("positive_screen", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("audit_c_id", ColType::Uuid),
            ],
            &[("audit_c", "audit_c_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE audit_c_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "audit_c_grades").await
    }
}
