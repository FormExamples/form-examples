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
            ("patient_signature_confirmed", ColType::StringWithDefault(String::new())),
            ("signature_date", ColType::DateNull),
            ("witness_name", ColType::StringWithDefault(String::new())),
            ("witness_signature_confirmed", ColType::StringWithDefault(String::new())),
            ("witness_date", ColType::DateNull),
            ("parent_guardian_name", ColType::StringWithDefault(String::new())),
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
