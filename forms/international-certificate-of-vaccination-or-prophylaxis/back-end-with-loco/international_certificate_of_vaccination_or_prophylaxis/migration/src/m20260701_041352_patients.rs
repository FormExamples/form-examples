use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "patients",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("surname", ColType::String),
            ("given_names", ColType::String),
            ("birth_date", ColType::DateNull),
            ("sex", ColType::String),
            ("nationality_as_iso_3166_1_alpha_3", ColType::String),
            ("travel_document_kind", ColType::String),
            ("travel_document_number", ColType::String),
            ("travel_document_issuer_as_iso_3166_1_alpha_3", ColType::String),
            ("email", ColType::TextNull),
            ("phone", ColType::TextNull),
            ("postal_address_as_full_text", ColType::TextNull),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("postcode", ColType::TextNull),
            ("consented_to_data_sharing", ColType::String),
            ("signature_image_data_url", ColType::Text),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patients").await
    }
}
