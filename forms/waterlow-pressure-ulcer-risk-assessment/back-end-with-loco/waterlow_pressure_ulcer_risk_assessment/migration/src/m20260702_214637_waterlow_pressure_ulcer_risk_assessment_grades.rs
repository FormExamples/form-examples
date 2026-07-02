use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "waterlow_pressure_ulcer_risk_assessment_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("build_points", ColType::IntegerNull),
            ("skin_points", ColType::IntegerNull),
            ("sex_points", ColType::IntegerNull),
            ("age_points", ColType::IntegerNull),
            ("continence_points", ColType::IntegerNull),
            ("mobility_points", ColType::IntegerNull),
            ("tissue_malnutrition_points", ColType::IntegerNull),
            ("neurological_deficit_points", ColType::IntegerNull),
            ("major_surgery_trauma_points", ColType::IntegerNull),
            ("medication_points", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("risk_band", ColType::String),
            ("prevention_actions", ColType::Text),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("waterlow_pressure_ulcer_risk_assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "waterlow_pressure_ulcer_risk_assessment_grades").await
    }
}
