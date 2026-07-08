use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "casualty_card_safeguarding_consents",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("safeguarding_concern", ColType::Text),
            ("safeguarding_type", ColType::Text),
            ("referral_made", ColType::Text),
            ("mental_capacity_assessment", ColType::Text),
            ("mental_health_act_status", ColType::Text),
            ("consent_for_treatment", ColType::Text),
            ("completed_by_name", ColType::Text),
            ("completed_by_role", ColType::Text),
            ("completed_by_gmc_number", ColType::Text),
            ("senior_reviewing_clinician", ColType::Text),
            ],
            &[
            ("casualty_card", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_safeguarding_consents").await
    }
}
