use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "sequential_organ_failure_assessment_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("respiration_score", ColType::IntegerNull),
            ("coagulation_score", ColType::IntegerNull),
            ("liver_score", ColType::IntegerNull),
            ("cardiovascular_score", ColType::IntegerNull),
            ("cns_score", ColType::IntegerNull),
            ("renal_score", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("delta_sofa", ColType::IntegerNull),
            ("mortality_band", ColType::String),
            ("sepsis3", ColType::Boolean),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("sequential_organ_failure_assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "sequential_organ_failure_assessment_grades").await
    }
}
