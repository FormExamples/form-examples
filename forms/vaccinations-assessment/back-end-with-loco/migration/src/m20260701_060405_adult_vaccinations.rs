use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "adult_vaccinations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("td_ipv_booster", ColType::IntegerNull),
            ("hpv", ColType::IntegerNull),
            ("meningitis_acwy", ColType::IntegerNull),
            ("influenza_annual", ColType::IntegerNull),
            ("covid19", ColType::IntegerNull),
            ("shingles", ColType::IntegerNull),
            ("pneumococcal_ppv", ColType::IntegerNull),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "adult_vaccinations").await
    }
}
