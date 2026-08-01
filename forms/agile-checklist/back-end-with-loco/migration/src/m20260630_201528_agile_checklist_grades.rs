use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "agile_checklist_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("answered_count", ColType::IntegerWithDefault(0)),
            ("teams_yes_count", ColType::IntegerWithDefault(0)),
            ("teams_applicable_count", ColType::IntegerWithDefault(0)),
            ("teams_percent", ColType::DoubleNull),
            ("stakeholders_yes_count", ColType::IntegerWithDefault(0)),
            ("stakeholders_applicable_count", ColType::IntegerWithDefault(0)),
            ("stakeholders_percent", ColType::DoubleNull),
            ("practices_yes_count", ColType::IntegerWithDefault(0)),
            ("practices_applicable_count", ColType::IntegerWithDefault(0)),
            ("practices_percent", ColType::DoubleNull),
            ("overall_percent", ColType::DoubleNull),
            ("teams_band", ColType::StringWithDefault(String::new())),
            ("stakeholders_band", ColType::StringWithDefault(String::new())),
            ("practices_band", ColType::StringWithDefault(String::new())),
            ("maturity", ColType::StringWithDefault(String::new())),
            ("top_action_1", ColType::StringWithDefault(String::new())),
            ("top_action_2", ColType::StringWithDefault(String::new())),
            ("top_action_3", ColType::StringWithDefault(String::new())),
            ("coach_notes", ColType::TextWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("agile_checklist", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "agile_checklist_grades").await
    }
}
