use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "authorized_recipients",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("recipient_name", ColType::StringWithDefault(String::new())),
                (
                    "recipient_organization",
                    ColType::StringWithDefault(String::new()),
                ),
                ("recipient_role", ColType::StringWithDefault(String::new())),
                ("recipient_address", ColType::TextWithDefault(String::new())),
                ("recipient_phone", ColType::StringWithDefault(String::new())),
                ("recipient_email", ColType::StringWithDefault(String::new())),
                (
                    "recipient_relationship_to_patient",
                    ColType::StringWithDefault(String::new()),
                ),
                ("hipaa_authorization_id", ColType::Uuid),
            ],
            &[("hipaa_authorization", "hipaa_authorization_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE authorized_recipients ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "authorized_recipients").await
    }
}
