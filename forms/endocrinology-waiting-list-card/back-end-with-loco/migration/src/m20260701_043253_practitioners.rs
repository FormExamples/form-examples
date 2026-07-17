use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "practitioners",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("name", ColType::String),
            ("email", ColType::TextNull),
            ("phone", ColType::TextNull),
            ("role", ColType::String),
            ("registration_body", ColType::String),
            ("registration_number", ColType::String),
            ("organisation_name", ColType::String),
            ("organisation_ods_code", ColType::String),
            ("site_name", ColType::String),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "practitioners").await
    }
}
