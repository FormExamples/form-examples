use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_certificate_of_cause_of_death_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("validity_class", ColType::String),
            ("underlying_cause", ColType::Text),
            ("coroner_referral_indicated", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("medical_certificate_of_cause_of_death", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_certificate_of_cause_of_death_grades").await
    }
}
