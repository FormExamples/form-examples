use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "patient_medications",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("dose", ColType::TextWithDefault(String::new())),
            ("frequency", ColType::TextWithDefault(String::new())),
            ("route", ColType::TextWithDefault(String::new())),
            ("started_on", ColType::DateNull),
            ("prescribed_by", ColType::TextWithDefault(String::new())),
            ("adherence", ColType::TextWithDefault(String::new())),
            ("notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("medication", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patient_medications").await
    }
}
