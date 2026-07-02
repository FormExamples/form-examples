use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "child_safeguarding_referrals",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("referrer_organisation", ColType::Text),
            ("referred_at", ColType::TimestampWithTimeZoneNull),
            ("relationship_to_child", ColType::Text),
            ("child_age", ColType::DoubleNull),
            ("child_setting", ColType::Text),
            ("child_reference", ColType::Text),
            ("child_ethnicity", ColType::Text),
            ("child_first_language", ColType::Text),
            ("child_disability", ColType::Text),
            ("carers", ColType::Text),
            ("household_members", ColType::Text),
            ("other_children", ColType::Text),
            ("professionals_involved", ColType::Text),
            ("concern_description", ColType::Text),
            ("concern_onset", ColType::Text),
            ("child_disclosed", ColType::String),
            ("referrer_observations", ColType::Text),
            ("primary_category", ColType::String),
            ("additional_categories", ColType::Text),
            ("presenting_evidence", ColType::Text),
            ("immediate_danger", ColType::String),
            ("child_whereabouts", ColType::Text),
            ("who_with_child", ColType::Text),
            ("alleged_person_in_contact", ColType::String),
            ("other_children_at_risk", ColType::String),
            ("consent_sought", ColType::String),
            ("consent_status", ColType::String),
            ("sharing_basis_without_consent", ColType::String),
            ("family_aware", ColType::String),
            ("unsafe_to_inform_reason", ColType::Text),
            ("agencies_contacted", ColType::Text),
            ("strategy_discussion_held", ColType::String),
            ("previous_safeguarding_history", ColType::Text),
            ("requested_action", ColType::Text),
            ("referrer_declaration", ColType::String),
            ("notes", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "child_safeguarding_referrals").await
    }
}
