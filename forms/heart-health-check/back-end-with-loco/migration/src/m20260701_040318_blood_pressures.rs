use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "blood_pressures",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("systolic_bp", ColType::IntegerNull),
            ("systolic_bp_sd", ColType::DoubleNull),
            ("diastolic_bp", ColType::IntegerNull),
            ("on_bp_treatment", ColType::StringWithDefault(String::new())),
            ("number_of_bp_medications", ColType::IntegerNull),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "blood_pressures").await
    }
}
