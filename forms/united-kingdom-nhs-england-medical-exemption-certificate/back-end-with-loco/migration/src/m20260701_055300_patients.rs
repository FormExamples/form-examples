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
            ("title", ColType::TextWithDefault(String::new())),
            ("surname", ColType::StringWithDefault(String::new())),
            ("forenames", ColType::StringWithDefault(String::new())),
            ("name", ColType::StringWithDefault(String::new())),
            ("birth_date", ColType::DateNull),
            ("sex", ColType::TextWithDefault(String::new())),
            ("email", ColType::TextNull),
            ("phone", ColType::TextNull),
            ("postal_address_as_full_text", ColType::TextNull),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("postcode", ColType::TextNull),
            ("united_kingdom_nhs_number", ColType::StringNull),
            ("full_time_education", ColType::StringWithDefault(String::new())),
            ("pregnancy_status", ColType::TextWithDefault(String::new())),
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
