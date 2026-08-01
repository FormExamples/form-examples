use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_polypharmacy_reviews",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("total_regular_medications", ColType::IntegerNull),
            ("total_prn_medications", ColType::IntegerNull),
            ("polypharmacy_flag", ColType::StringWithDefault(String::new())),
            ("medication_review_date", ColType::DateNull),
            ("falls_risk_medications", ColType::StringWithDefault(String::new())),
            ("falls_risk_medication_details", ColType::TextWithDefault(String::new())),
            ("anticholinergic_burden", ColType::StringWithDefault(String::new())),
            ("drug_interactions_identified", ColType::StringWithDefault(String::new())),
            ("drug_interaction_details", ColType::TextWithDefault(String::new())),
            ("adherence_concerns", ColType::StringWithDefault(String::new())),
            ("adherence_details", ColType::TextWithDefault(String::new())),
            ("stopp_start_review_done", ColType::StringWithDefault(String::new())),
            ("deprescribing_opportunities", ColType::TextWithDefault(String::new())),
            ("polypharmacy_notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_polypharmacy_reviews").await
    }
}
