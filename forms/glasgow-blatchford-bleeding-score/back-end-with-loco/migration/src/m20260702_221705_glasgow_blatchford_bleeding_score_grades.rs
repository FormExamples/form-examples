use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "glasgow_blatchford_bleeding_score_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("blood_urea_points", ColType::IntegerNull),
            ("haemoglobin_points", ColType::IntegerNull),
            ("systolic_blood_pressure_points", ColType::IntegerNull),
            ("pulse_point", ColType::IntegerNull),
            ("melaena_point", ColType::IntegerNull),
            ("syncope_point", ColType::IntegerNull),
            ("hepatic_disease_point", ColType::IntegerNull),
            ("cardiac_failure_point", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("risk_band", ColType::StringWithDefault(String::new())),
            ("recommended_management", ColType::TextWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("glasgow_blatchford_bleeding_score", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "glasgow_blatchford_bleeding_score_grades").await
    }
}
