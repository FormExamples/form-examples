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
            ("birth_date", ColType::DateNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("united_kingdom_nhs_number", ColType::StringNull),
            ("medical_record_number", ColType::StringNull),
            ("weight_as_kg", ColType::DoubleNull),
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
