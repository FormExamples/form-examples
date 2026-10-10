use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "hipaa_authorizations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("state_template", ColType::StringWithDefault(String::new())),
                ("revoked_at", ColType::TimestampWithTimeZoneNull),
                (
                    "revocation_method",
                    ColType::StringWithDefault(String::new()),
                ),
                ("patient_id", ColType::Uuid),
            ],
            &[("patient", "patient_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE hipaa_authorizations ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hipaa_authorizations").await
    }
}
