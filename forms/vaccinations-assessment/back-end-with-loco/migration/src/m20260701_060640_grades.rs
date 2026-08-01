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
            ("vaccination_level", ColType::StringWithDefault(String::new())),
            ("vaccination_score", ColType::SmallIntegerWithDefault(0)),
            ("graded_at", ColType::TimestampWithTimeZoneNull),
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
