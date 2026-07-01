use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "lpa_signatures",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("signer_role", ColType::String),
            ("signer_id", ColType::UuidNull),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("signature_method", ColType::String),
            ("signature_data", ColType::BlobNull),
            ("witness_name", ColType::String),
            ("witness_address", ColType::Text),
            ("witness_signed_at", ColType::TimestampWithTimeZoneNull),
            ("witness_is_attorney", ColType::String),
            ],
            &[
            ("lpa", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lpa_signatures").await
    }
}
