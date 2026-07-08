use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "edinburgh_postnatal_depression_scale_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("total_score", ColType::IntegerNull),
            ("interpretation", ColType::String),
            ("item_10_score", ColType::IntegerNull),
            ("self_harm_flag", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("edinburgh_postnatal_depression_scale", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "edinburgh_postnatal_depression_scale_grades").await
    }
}
