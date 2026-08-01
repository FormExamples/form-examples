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
            
            ("referrer_organisation", ColType::TextWithDefault(String::new())),
            ("referred_at", ColType::TimestampWithTimeZoneNull),
            ("relationship_to_child", ColType::TextWithDefault(String::new())),
            ("child_age", ColType::DoubleNull),
            ("child_setting", ColType::TextWithDefault(String::new())),
            ("child_reference", ColType::TextWithDefault(String::new())),
            ("child_ethnicity", ColType::TextWithDefault(String::new())),
            ("child_first_language", ColType::TextWithDefault(String::new())),
            ("child_disability", ColType::TextWithDefault(String::new())),
            ("carers", ColType::TextWithDefault(String::new())),
            ("household_members", ColType::TextWithDefault(String::new())),
            ("other_children", ColType::TextWithDefault(String::new())),
            ("professionals_involved", ColType::TextWithDefault(String::new())),
            ("concern_description", ColType::TextWithDefault(String::new())),
            ("concern_onset", ColType::TextWithDefault(String::new())),
            ("child_disclosed", ColType::StringWithDefault(String::new())),
            ("referrer_observations", ColType::TextWithDefault(String::new())),
            ("primary_category", ColType::StringWithDefault(String::new())),
            ("additional_categories", ColType::TextWithDefault(String::new())),
            ("presenting_evidence", ColType::TextWithDefault(String::new())),
            ("immediate_danger", ColType::StringWithDefault(String::new())),
            ("child_whereabouts", ColType::TextWithDefault(String::new())),
            ("who_with_child", ColType::TextWithDefault(String::new())),
            ("alleged_person_in_contact", ColType::StringWithDefault(String::new())),
            ("other_children_at_risk", ColType::StringWithDefault(String::new())),
            ("consent_sought", ColType::StringWithDefault(String::new())),
            ("consent_status", ColType::StringWithDefault(String::new())),
            ("sharing_basis_without_consent", ColType::StringWithDefault(String::new())),
            ("family_aware", ColType::StringWithDefault(String::new())),
            ("unsafe_to_inform_reason", ColType::TextWithDefault(String::new())),
            ("agencies_contacted", ColType::TextWithDefault(String::new())),
            ("strategy_discussion_held", ColType::StringWithDefault(String::new())),
            ("previous_safeguarding_history", ColType::TextWithDefault(String::new())),
            ("requested_action", ColType::TextWithDefault(String::new())),
            ("referrer_declaration", ColType::StringWithDefault(String::new())),
            ("notes", ColType::TextWithDefault(String::new())),
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
