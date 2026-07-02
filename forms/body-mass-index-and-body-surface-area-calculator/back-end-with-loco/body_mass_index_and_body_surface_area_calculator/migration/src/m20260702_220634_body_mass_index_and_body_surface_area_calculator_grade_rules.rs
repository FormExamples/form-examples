use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "body_mass_index_and_body_surface_area_calculator_grade_rules",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("rule_id", ColType::String),
            ("instrument", ColType::String),
            ("band", ColType::String),
            ("category", ColType::String),
            ("description", ColType::String),
            ],
            &[
            ("body_mass_index_and_body_surface_area_calculator_grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "body_mass_index_and_body_surface_area_calculator_grade_rules").await
    }
}
