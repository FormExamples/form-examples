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
            ("united_kingdom_nhs_number", ColType::StringUniq),
            ("hospital_mrn", ColType::StringNull),
            ("height_as_cm", ColType::DoubleNull),
            ("weight_as_kg", ColType::DoubleNull),
            ("body_mass_index", ColType::DoubleNull),
            ("allergies_summary", ColType::TextWithDefault(String::new())),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patients").await
    }
}
