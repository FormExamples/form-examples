use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "immunization_histories",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("has_vaccination_record", ColType::String),
            ("record_source", ColType::String),
            ("last_review_date", ColType::DateNull),
            ("previous_adverse_reactions", ColType::String),
            ("adverse_reaction_details", ColType::Text),
            ("immunocompromised", ColType::String),
            ("immunocompromised_details", ColType::Text),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "immunization_histories").await
    }
}
