use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "lpa_signatures",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("signer_role", ColType::StringWithDefault(String::new())),
                ("signer_id", ColType::UuidNull),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
                (
                    "signature_method",
                    ColType::StringWithDefault(String::new()),
                ),
                ("signature_data", ColType::BlobNull),
                ("witness_name", ColType::StringWithDefault(String::new())),
                ("witness_address", ColType::TextWithDefault(String::new())),
                ("witness_signed_at", ColType::TimestampWithTimeZoneNull),
                (
                    "witness_is_attorney",
                    ColType::StringWithDefault(String::new()),
                ),
                ("lpa_id", ColType::Uuid),
            ],
            &[("lpa", "lpa_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE lpa_signatures ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lpa_signatures").await
    }
}
