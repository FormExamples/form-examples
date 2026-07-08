use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "replacement_attorneys",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("title", ColType::String),
            ("given_names", ColType::String),
            ("family_name", ColType::String),
            ("birth_date", ColType::DateNull),
            ("email", ColType::Text),
            ("phone", ColType::Text),
            ("postal_address_as_full_text", ColType::Text),
            ("country_as_iso_3166_1_alpha_2", ColType::String),
            ("postcode", ColType::Text),
            ("relationship_to_donor", ColType::String),
            ("is_bankrupt", ColType::String),
            ("capacity_declared", ColType::String),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "replacement_attorneys").await
    }
}
