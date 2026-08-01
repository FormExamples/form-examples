use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "body_mass_index_and_body_surface_area_calculator_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("bmi", ColType::DoubleNull),
            ("bmi_category", ColType::StringWithDefault(String::new())),
            ("bsa_mosteller", ColType::DoubleNull),
            ("bsa_du_bois", ColType::DoubleNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("body_mass_index_and_body_surface_area_calculator", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "body_mass_index_and_body_surface_area_calculator_grades").await
    }
}
