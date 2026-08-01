use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_medications",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("takes_medications", ColType::StringWithDefault(String::new())),
            ("takes_over_the_counter", ColType::StringWithDefault(String::new())),
            ("takes_supplements", ColType::StringWithDefault(String::new())),
            ("supplement_details", ColType::TextWithDefault(String::new())),
            ("medication_adherence", ColType::StringWithDefault(String::new())),
            ("pharmacy_name", ColType::StringWithDefault(String::new())),
            ("pharmacy_phone", ColType::StringWithDefault(String::new())),
            ("medications_notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_medications").await
    }
}
