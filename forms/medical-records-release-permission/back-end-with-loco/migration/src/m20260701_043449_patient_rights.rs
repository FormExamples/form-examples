use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "patient_rights",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("acknowledged_right_to_revoke", ColType::StringWithDefault(String::new())),
            ("acknowledged_no_charge_for_access", ColType::StringWithDefault(String::new())),
            ("acknowledged_data_protection", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("release_form", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patient_rights").await
    }
}
