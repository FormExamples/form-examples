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
            ("has_vaccination_record", ColType::StringWithDefault(String::new())),
            ("record_source", ColType::StringWithDefault(String::new())),
            ("last_review_date", ColType::DateNull),
            ("previous_adverse_reactions", ColType::StringWithDefault(String::new())),
            ("adverse_reaction_details", ColType::TextWithDefault(String::new())),
            ("immunocompromised", ColType::StringWithDefault(String::new())),
            ("immunocompromised_details", ColType::TextWithDefault(String::new())),
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
