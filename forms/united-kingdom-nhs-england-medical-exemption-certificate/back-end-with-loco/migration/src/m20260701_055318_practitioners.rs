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
            ("name", ColType::StringWithDefault(String::new())),
            ("email", ColType::TextNull),
            ("phone", ColType::TextNull),
            ("role", ColType::TextWithDefault(String::new())),
            ("registration_body", ColType::TextWithDefault(String::new())),
            ("registration_number", ColType::TextWithDefault(String::new())),
            ("practice_name", ColType::StringWithDefault(String::new())),
            ("practice_code", ColType::StringWithDefault(String::new())),
            ("practitioner_code", ColType::StringWithDefault(String::new())),
            ("postal_address_as_full_text", ColType::TextNull),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("postcode", ColType::TextNull),
            ("united_kingdom_nhs_number", ColType::StringUniq),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "practitioners").await
    }
}
