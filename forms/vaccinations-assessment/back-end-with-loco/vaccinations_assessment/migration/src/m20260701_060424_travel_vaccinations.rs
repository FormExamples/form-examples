use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "travel_vaccinations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("travel_planned", ColType::String),
            ("travel_destination", ColType::String),
            ("hepatitis_a", ColType::IntegerNull),
            ("hepatitis_b", ColType::IntegerNull),
            ("typhoid", ColType::IntegerNull),
            ("yellow_fever", ColType::IntegerNull),
            ("rabies", ColType::IntegerNull),
            ("japanese_encephalitis", ColType::IntegerNull),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "travel_vaccinations").await
    }
}
