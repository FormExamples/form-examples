use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "signature_consents",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("patient_signature_confirmed", ColType::String),
            ("signature_date", ColType::DateNull),
            ("witness_name", ColType::String),
            ("witness_signature_confirmed", ColType::String),
            ("witness_date", ColType::DateNull),
            ("parent_guardian_name", ColType::String),
            ],
            &[
            ("release_form", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "signature_consents").await
    }
}
