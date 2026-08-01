use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "centers",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("name", ColType::TextWithDefault(String::new())),
            ("who_designation_reference", ColType::StringWithDefault(String::new())),
            ("national_authority_reference", ColType::StringWithDefault(String::new())),
            ("email", ColType::TextNull),
            ("phone", ColType::TextNull),
            ("postal_address_as_full_text", ColType::TextNull),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("country_as_iso_3166_1_alpha_3", ColType::StringNull),
            ("postcode", ColType::TextNull),
            ("uniform_stamp_image_data_url", ColType::TextWithDefault(String::new())),
            ("authorised_diseases", ColType::TextWithDefault("yellow-fever".to_string())),
            ("designation_valid_from", ColType::DateNull),
            ("designation_valid_until", ColType::DateNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "centers").await
    }
}
