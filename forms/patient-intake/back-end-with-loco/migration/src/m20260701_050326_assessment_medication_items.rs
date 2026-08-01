use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_medication_items",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("medication_name", ColType::StringWithDefault(String::new())),
            ("dose", ColType::StringWithDefault(String::new())),
            ("frequency", ColType::StringWithDefault(String::new())),
            ("route", ColType::StringWithDefault(String::new())),
            ("prescriber", ColType::StringWithDefault(String::new())),
            ("reason", ColType::StringWithDefault(String::new())),
            ("start_date", ColType::DateNull),
            ("sort_order", ColType::IntegerWithDefault(0)),
            ],
            &[
            ("assessment_medication", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_medication_items").await
    }
}
