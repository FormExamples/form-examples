use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "signers",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("relationship", ColType::StringWithDefault(String::new())),
                (
                    "representative_name",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "representative_authority_description",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "representative_authority_proof_attached",
                    ColType::StringWithDefault(String::new()),
                ),
                ("hipaa_authorization_id", ColType::Uuid),
            ],
            &[("hipaa_authorization", "hipaa_authorization_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared("ALTER TABLE signers ALTER COLUMN id SET DEFAULT gen_random_uuid()")
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "signers").await
    }
}
