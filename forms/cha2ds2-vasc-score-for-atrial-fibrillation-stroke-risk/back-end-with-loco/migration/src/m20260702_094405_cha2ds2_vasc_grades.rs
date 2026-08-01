use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "cha2ds2_vasc_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("congestive_heart_failure_points", ColType::IntegerNull),
            ("hypertension_points", ColType::IntegerNull),
            ("age_points", ColType::IntegerNull),
            ("diabetes_points", ColType::IntegerNull),
            ("stroke_points", ColType::IntegerNull),
            ("vascular_disease_points", ColType::IntegerNull),
            ("sex_points", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("risk_band", ColType::StringWithDefault(String::new())),
            ("annual_stroke_risk_percent", ColType::DoubleNull),
            ("anticoagulation_recommendation", ColType::TextWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("cha2ds2_vasc", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "cha2ds2_vasc_grades").await
    }
}
