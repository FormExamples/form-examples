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
            ("name", ColType::TextWithDefault(String::new())),
            ("professional_status", ColType::StringWithDefault(String::new())),
            ("email", ColType::TextNull),
            ("phone", ColType::TextNull),
            ("postal_address_as_full_text", ColType::TextNull),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("postcode", ColType::TextNull),
            ("registration_body", ColType::StringWithDefault(String::new())),
            ("registration_number", ColType::TextWithDefault(String::new())),
            ("signature_image_data_url", ColType::TextWithDefault(String::new())),
            ("united_kingdom_nhs_number", ColType::StringNull),
            ],
            &[
            ]
        ).await?;

        m.create_index(
            Index::create()
                .if_not_exists()
                .unique()
                .name("index_clinicians_united_kingdom_nhs_number_unique")
                .table(Alias::new("clinicians"))
                .col(Alias::new("united_kingdom_nhs_number"))
                .to_owned(),
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "clinicians").await
    }
}
