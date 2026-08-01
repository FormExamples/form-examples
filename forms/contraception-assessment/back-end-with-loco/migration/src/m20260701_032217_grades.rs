use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("overall_highest_ukmec_category", ColType::IntegerWithDefault(1)),
            ("ukmec_cocp", ColType::IntegerNull),
            ("ukmec_pop", ColType::IntegerNull),
            ("ukmec_patch", ColType::IntegerNull),
            ("ukmec_ring", ColType::IntegerNull),
            ("ukmec_injection", ColType::IntegerNull),
            ("ukmec_implant", ColType::IntegerNull),
            ("ukmec_cu_iud", ColType::IntegerNull),
            ("ukmec_lng_ius", ColType::IntegerNull),
            ("ukmec_condom_male", ColType::IntegerNull),
            ("ukmec_condom_female", ColType::IntegerNull),
            ("ukmec_diaphragm", ColType::IntegerNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grades").await
    }
}
