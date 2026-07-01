use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "signature_witnesses",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("individual_signature_confirmed", ColType::String),
            ("individual_signature_image_uri", ColType::Text),
            ("signature_date", ColType::DateNull),
            ("signed_at_location", ColType::Text),
            ("parent_guardian_co_signature_required", ColType::String),
            ("parent_guardian_name", ColType::String),
            ("parent_guardian_signature_confirmed", ColType::String),
            ("parent_guardian_signature_date", ColType::DateNull),
            ("witness_name", ColType::String),
            ("witness_signature_confirmed", ColType::String),
            ("witness_date", ColType::DateNull),
            ("witness_role", ColType::String),
            ],
            &[
            ("hipaa_authorization", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "signature_witnesses").await
    }
}
