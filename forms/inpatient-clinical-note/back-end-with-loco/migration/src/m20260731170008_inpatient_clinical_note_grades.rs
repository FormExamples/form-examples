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
            ("status", ColType::StringWithDefault(String::new())),
            ("completeness_percent", ColType::IntegerNull),
            ("required_component_count", ColType::IntegerNull),
            ("documented_component_count", ColType::IntegerNull),
            ("acuity_band", ColType::StringWithDefault(String::new())),
            ("computed_acuity_band", ColType::StringWithDefault(String::new())),
            ("news2_total", ColType::IntegerNull),
            ("header_documented", ColType::StringWithDefault(String::new())),
            ("interval_history_documented", ColType::StringWithDefault(String::new())),
            ("observations_documented", ColType::StringWithDefault(String::new())),
            ("examination_documented", ColType::StringWithDefault(String::new())),
            ("investigations_documented", ColType::StringWithDefault(String::new())),
            ("problems_documented", ColType::StringWithDefault(String::new())),
            ("medications_documented", ColType::StringWithDefault(String::new())),
            ("risk_assessments_documented", ColType::StringWithDefault(String::new())),
            ("impression_documented", ColType::StringWithDefault(String::new())),
            ("plan_documented", ColType::StringWithDefault(String::new())),
            ("escalation_documented", ColType::StringWithDefault(String::new())),
            ("communication_documented", ColType::StringWithDefault(String::new())),
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
