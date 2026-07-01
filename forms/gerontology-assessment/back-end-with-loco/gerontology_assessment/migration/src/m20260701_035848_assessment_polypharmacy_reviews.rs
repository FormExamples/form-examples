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
            ("polypharmacy_flag", ColType::String),
            ("medication_review_date", ColType::DateNull),
            ("falls_risk_medications", ColType::String),
            ("falls_risk_medication_details", ColType::Text),
            ("anticholinergic_burden", ColType::String),
            ("drug_interactions_identified", ColType::String),
            ("drug_interaction_details", ColType::Text),
            ("adherence_concerns", ColType::String),
            ("adherence_details", ColType::Text),
            ("stopp_start_review_done", ColType::String),
            ("deprescribing_opportunities", ColType::Text),
            ("polypharmacy_notes", ColType::Text),
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
