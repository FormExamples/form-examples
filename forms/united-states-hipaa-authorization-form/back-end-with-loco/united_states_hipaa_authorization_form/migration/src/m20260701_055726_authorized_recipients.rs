use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "authorized_recipients",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("recipient_name", ColType::String),
            ("recipient_organization", ColType::String),
            ("recipient_role", ColType::String),
            ("recipient_address", ColType::Text),
            ("recipient_phone", ColType::String),
            ("recipient_email", ColType::String),
            ("recipient_relationship_to_patient", ColType::String),
            ],
            &[
            ("hipaa_authorization", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "authorized_recipients").await
    }
}
