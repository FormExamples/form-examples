use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "health_screening_questionnaire_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("parq_plus_clearance", ColType::StringWithDefault(String::new())),
            ("audit_c_score", ColType::IntegerNull),
            ("audit_c_band", ColType::StringWithDefault(String::new())),
            ("computed_risk_band", ColType::StringWithDefault(String::new())),
            ("final_risk_band", ColType::StringWithDefault(String::new())),
            ("computed_recommendation", ColType::StringWithDefault(String::new())),
            ("final_recommendation", ColType::StringWithDefault(String::new())),
            ("override_reason", ColType::StringWithDefault(String::new())),
            ("notes", ColType::TextWithDefault(String::new())),
            ("signed_by_name", ColType::StringWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("health_screening_questionnaire", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "health_screening_questionnaire_grades").await
    }
}
