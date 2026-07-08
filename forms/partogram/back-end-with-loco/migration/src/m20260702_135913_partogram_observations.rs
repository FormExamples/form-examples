use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "partogram_observations",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("observed_at", ColType::TimestampWithTimeZoneNull),
            ("cervical_dilatation_cm", ColType::DoubleNull),
            ("descent_fifths", ColType::DoubleNull),
            ("contractions_per_10_min", ColType::DoubleNull),
            ("contraction_duration_band", ColType::String),
            ("contraction_strength", ColType::String),
            ("fetal_heart_rate", ColType::IntegerNull),
            ("liquor_state", ColType::String),
            ("moulding", ColType::String),
            ("systolic_blood_pressure", ColType::IntegerNull),
            ("diastolic_blood_pressure", ColType::IntegerNull),
            ("pulse", ColType::IntegerNull),
            ("temperature", ColType::DoubleNull),
            ("urine_volume_ml", ColType::DoubleNull),
            ("urine_protein", ColType::String),
            ("urine_ketones", ColType::String),
            ("urine_glucose", ColType::String),
            ("oxytocin_rate", ColType::DoubleNull),
            ("drugs_and_fluids", ColType::Text),
            ],
            &[
            ("partogram", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "partogram_observations").await
    }
}
