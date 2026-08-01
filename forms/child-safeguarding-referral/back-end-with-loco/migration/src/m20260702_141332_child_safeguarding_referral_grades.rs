use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "child_safeguarding_referral_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("status", ColType::StringWithDefault(String::new())),
            ("urgency", ColType::StringWithDefault(String::new())),
            ("completeness_percent", ColType::IntegerNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("child_safeguarding_referral", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "child_safeguarding_referral_grades").await
    }
}
