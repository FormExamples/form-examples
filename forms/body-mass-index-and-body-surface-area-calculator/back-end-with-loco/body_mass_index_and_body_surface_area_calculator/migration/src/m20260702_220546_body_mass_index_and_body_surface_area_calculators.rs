use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "body_mass_index_and_body_surface_area_calculators",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("purpose", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("ancestry", ColType::String),
            ("height_cm", ColType::DoubleNull),
            ("weight_kg", ColType::DoubleNull),
            ("bsa_formula", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "body_mass_index_and_body_surface_area_calculators").await
    }
}
