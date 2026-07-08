use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "patient_rights_acknowledgements",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("acknowledged_right_to_revoke", ColType::String),
            ("acknowledged_revocation_procedure", ColType::String),
            ("acknowledged_no_conditioning", ColType::String),
            ("acknowledged_redisclosure_warning", ColType::String),
            ("acknowledged_right_to_copy", ColType::String),
            ("acknowledged_right_to_inspect_disclosed", ColType::String),
            ],
            &[
            ("hipaa_authorization", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patient_rights_acknowledgements").await
    }
}
