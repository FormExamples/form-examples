use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "prescription_details",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("request_date", ColType::Date),
            ("medication_name", ColType::StringWithDefault(String::new())),
            ("dosage", ColType::StringWithDefault(String::new())),
            ("frequency", ColType::StringWithDefault(String::new())),
            ("route_of_administration", ColType::StringWithDefault(String::new())),
            ("treatment_instructions", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("prescription_request", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "prescription_details").await
    }
}
