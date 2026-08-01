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
            ("recipient_name", ColType::StringWithDefault(String::new())),
            ("recipient_organization", ColType::StringWithDefault(String::new())),
            ("recipient_role", ColType::StringWithDefault(String::new())),
            ("recipient_address", ColType::TextWithDefault(String::new())),
            ("recipient_phone", ColType::StringWithDefault(String::new())),
            ("recipient_email", ColType::StringWithDefault(String::new())),
            ("recipient_relationship_to_patient", ColType::StringWithDefault(String::new())),
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
