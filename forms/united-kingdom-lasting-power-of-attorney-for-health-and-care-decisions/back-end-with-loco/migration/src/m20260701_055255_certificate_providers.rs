use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "certificate_providers",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("title", ColType::StringWithDefault(String::new())),
            ("given_names", ColType::StringWithDefault(String::new())),
            ("family_name", ColType::StringWithDefault(String::new())),
            ("email", ColType::TextWithDefault(String::new())),
            ("phone", ColType::TextWithDefault(String::new())),
            ("postal_address_as_full_text", ColType::TextWithDefault(String::new())),
            ("country_as_iso_3166_1_alpha_2", ColType::StringWithDefault(String::new())),
            ("postcode", ColType::TextWithDefault(String::new())),
            ("route", ColType::StringWithDefault(String::new())),
            ("profession", ColType::StringWithDefault(String::new())),
            ("profession_registration_number", ColType::StringWithDefault(String::new())),
            ("years_known_donor", ColType::DoubleNull),
            ("relationship_to_donor", ColType::StringWithDefault(String::new())),
            ("declared_not_family", ColType::StringWithDefault(String::new())),
            ("declared_not_employee", ColType::StringWithDefault(String::new())),
            ("declared_not_attorney", ColType::StringWithDefault(String::new())),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "certificate_providers").await
    }
}
