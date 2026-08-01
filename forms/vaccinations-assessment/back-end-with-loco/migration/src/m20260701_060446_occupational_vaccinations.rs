use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "occupational_vaccinations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("occupation", ColType::StringWithDefault(String::new())),
            ("healthcare_worker", ColType::StringWithDefault(String::new())),
            ("hepatitis_b_occupational", ColType::IntegerNull),
            ("influenza_occupational", ColType::IntegerNull),
            ("varicella", ColType::IntegerNull),
            ("bcg_tuberculosis", ColType::IntegerNull),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "occupational_vaccinations").await
    }
}
