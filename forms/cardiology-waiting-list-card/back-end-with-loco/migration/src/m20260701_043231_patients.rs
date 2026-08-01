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
            ("name", ColType::String),
            ("birth_date", ColType::Date),
            ("sex", ColType::StringWithDefault(String::new())),
            ("email", ColType::TextNull),
            ("phone", ColType::TextNull),
            ("postal_address_as_full_text", ColType::TextNull),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("postcode", ColType::TextNull),
            ("united_kingdom_nhs_number", ColType::StringNull),
            ("preferred_language_as_iso_639_1", ColType::StringWithDefault(String::new())),
            ("interpreter_required", ColType::StringWithDefault(String::new())),
            ("accessibility_needs", ColType::TextWithDefault(String::new())),
            ("preferred_contact_channel", ColType::StringWithDefault(String::new())),
            ],
            &[
            ]
        ).await?;

        m.create_index(
            Index::create()
                .if_not_exists()
                .unique()
                .name("index_patients_united_kingdom_nhs_number_unique")
                .table(Alias::new("patients"))
                .col(Alias::new("united_kingdom_nhs_number"))
                .to_owned(),
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patients").await
    }
}
