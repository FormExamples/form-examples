use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "clinical_reviews",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("post_vaccination_observation", ColType::IntegerNull),
            ("immediate_reaction", ColType::StringWithDefault(String::new())),
            ("reaction_details", ColType::TextWithDefault(String::new())),
            ("next_dose_due", ColType::DateNull),
            ("catch_up_schedule_needed", ColType::StringWithDefault(String::new())),
            ("referral_needed", ColType::StringWithDefault(String::new())),
            ("clinician_notes", ColType::TextWithDefault(String::new())),
            ("reviewing_clinician", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "clinical_reviews").await
    }
}
