use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "hernia_diagnostic_evaluation_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("hernia_type", ColType::StringWithDefault(String::new())),
            ("hernia_subtype", ColType::StringWithDefault(String::new())),
            ("ehs_classification", ColType::StringWithDefault(String::new())),
            ("ehs_size_grade", ColType::StringWithDefault(String::new())),
            ("reducibility_status", ColType::StringWithDefault(String::new())),
            ("computed_urgency", ColType::StringWithDefault(String::new())),
            ("final_urgency", ColType::StringWithDefault(String::new())),
            ("override_reason", ColType::StringWithDefault(String::new())),
            ("recommendation", ColType::StringWithDefault(String::new())),
            ("clinician_notes", ColType::TextWithDefault(String::new())),
            ("signed_by_name", ColType::StringWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("hernia_diagnostic_evaluation", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hernia_diagnostic_evaluation_grades").await
    }
}
