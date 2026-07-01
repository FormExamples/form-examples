use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "clinicians",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("name", ColType::Text),
            ("email", ColType::TextNull),
            ("phone", ColType::TextNull),
            ("role", ColType::Text),
            ("registration_body", ColType::Text),
            ("registration_number", ColType::Text),
            ("employee_number", ColType::Text),
            ("united_kingdom_nhs_number", ColType::StringUniq),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "clinicians").await
    }
}
