use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("compliance_status", ColType::StringWithDefault(String::new())),
            ("overall_risk_level", ColType::StringWithDefault(String::new())),
            ("childhood_complete", ColType::StringWithDefault(String::new())),
            ("occupational_complete", ColType::StringWithDefault(String::new())),
            ("covid_complete", ColType::StringWithDefault(String::new())),
            ("flu_current", ColType::StringWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grades").await
    }
}
