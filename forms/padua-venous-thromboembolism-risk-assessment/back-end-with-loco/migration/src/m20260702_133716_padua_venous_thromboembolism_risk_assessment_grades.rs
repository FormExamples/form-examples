use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "padua_venous_thromboembolism_risk_assessment_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("active_cancer_points", ColType::IntegerNull),
            ("previous_vte_points", ColType::IntegerNull),
            ("reduced_mobility_points", ColType::IntegerNull),
            ("known_thrombophilia_points", ColType::IntegerNull),
            ("recent_trauma_or_surgery_points", ColType::IntegerNull),
            ("elderly_age_points", ColType::IntegerNull),
            ("heart_or_respiratory_failure_points", ColType::IntegerNull),
            ("acute_mi_or_ischaemic_stroke_points", ColType::IntegerNull),
            ("acute_infection_or_rheumatological_points", ColType::IntegerNull),
            ("obesity_points", ColType::IntegerNull),
            ("ongoing_hormonal_treatment_points", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("risk_band", ColType::String),
            ("prophylaxis_recommendation", ColType::Text),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("padua_venous_thromboembolism_risk_assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "padua_venous_thromboembolism_risk_assessment_grades").await
    }
}
