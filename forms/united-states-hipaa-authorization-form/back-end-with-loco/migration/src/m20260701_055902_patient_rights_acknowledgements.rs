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
            ("acknowledged_right_to_revoke", ColType::StringWithDefault(String::new())),
            ("acknowledged_revocation_procedure", ColType::StringWithDefault(String::new())),
            ("acknowledged_no_conditioning", ColType::StringWithDefault(String::new())),
            ("acknowledged_redisclosure_warning", ColType::StringWithDefault(String::new())),
            ("acknowledged_right_to_copy", ColType::StringWithDefault(String::new())),
            ("acknowledged_right_to_inspect_disclosed", ColType::StringWithDefault(String::new())),
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
