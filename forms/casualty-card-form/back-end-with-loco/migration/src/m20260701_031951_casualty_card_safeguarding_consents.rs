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
            ("safeguarding_concern", ColType::TextWithDefault(String::new())),
            ("safeguarding_type", ColType::TextWithDefault(String::new())),
            ("referral_made", ColType::TextWithDefault(String::new())),
            ("mental_capacity_assessment", ColType::TextWithDefault(String::new())),
            ("mental_health_act_status", ColType::TextWithDefault(String::new())),
            ("consent_for_treatment", ColType::TextWithDefault(String::new())),
            ("completed_by_name", ColType::TextWithDefault(String::new())),
            ("completed_by_role", ColType::TextWithDefault(String::new())),
            ("completed_by_gmc_number", ColType::TextWithDefault(String::new())),
            ("senior_reviewing_clinician", ColType::TextWithDefault(String::new())),
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
