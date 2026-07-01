use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "lpa_registration_applications",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("applicant_role", ColType::String),
            ("applicant_signed_at", ColType::TimestampWithTimeZoneNull),
            ("fee_amount_pounds", ColType::Double),
            ("fee_remission", ColType::String),
            ("fee_remission_reason", ColType::String),
            ("submitted_at", ColType::TimestampWithTimeZoneNull),
            ("submission_channel", ColType::String),
            ],
            &[
            ("lpa", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lpa_registration_applications").await
    }
}
