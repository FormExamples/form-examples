use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "smoking_alcohols",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("smoking_status", ColType::StringWithDefault(String::new())),
            ("cigarettes_per_day", ColType::IntegerNull),
            ("years_since_quit", ColType::IntegerNull),
            ("alcohol_units_per_week", ColType::DoubleNull),
            ("alcohol_frequency", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "smoking_alcohols").await
    }
}
