use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "inpatient_clinical_note_grades",
            &[

            ("id", ColType::PkAuto),

            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("completeness_percent", ColType::IntegerNull),
            ("required_component_count", ColType::IntegerNull),
            ("documented_component_count", ColType::IntegerNull),
            ("acuity_band", ColType::String),
            ("computed_acuity_band", ColType::String),
            ("news2_total", ColType::IntegerNull),
            ("header_documented", ColType::String),
            ("interval_history_documented", ColType::String),
            ("observations_documented", ColType::String),
            ("examination_documented", ColType::String),
            ("investigations_documented", ColType::String),
            ("problems_documented", ColType::String),
            ("medications_documented", ColType::String),
            ("risk_assessments_documented", ColType::String),
            ("impression_documented", ColType::String),
            ("plan_documented", ColType::String),
            ("escalation_documented", ColType::String),
            ("communication_documented", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("inpatient_clinical_note", "inpatient_clinical_note_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "inpatient_clinical_note_grades").await
    }
}
