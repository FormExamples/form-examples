use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "validation_results",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("validity_status", ColType::StringWithDefault(String::new())),
                ("completeness_score", ColType::IntegerWithDefault(0)),
                (
                    "completeness_status",
                    ColType::StringWithDefault(String::new()),
                ),
                ("validated_at", ColType::TimestampWithTimeZoneNull),
                (
                    "validator_version",
                    ColType::StringWithDefault(String::new()),
                ),
                ("hipaa_authorization_id", ColType::Uuid),
            ],
            &[("hipaa_authorization", "hipaa_authorization_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE validation_results ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "validation_results").await
    }
}
