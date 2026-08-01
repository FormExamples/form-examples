use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "tumor_marker_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("psa", ColType::BooleanWithDefault(false)),
            ("ca125", ColType::BooleanWithDefault(false)),
            ("ca19_9", ColType::BooleanWithDefault(false)),
            ("carcinoembryonic_antigen_cea", ColType::BooleanWithDefault(false)),
            ("alpha_fetoprotein_afp", ColType::BooleanWithDefault(false)),
            ("beta_hcg", ColType::BooleanWithDefault(false)),
            ("ca15_3", ColType::BooleanWithDefault(false)),
            ("lactate_dehydrogenase_ldh", ColType::BooleanWithDefault(false)),
            ("calcitonin", ColType::BooleanWithDefault(false)),
            ("chromogranin_a", ColType::BooleanWithDefault(false)),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_details", ColType::StringWithDefault(String::new())),
            ("known_cancer_site", ColType::StringWithDefault(String::new())),
            ("on_treatment", ColType::BooleanWithDefault(false)),
            ("previous_marker_value", ColType::DoubleNull),
            ("previous_marker_date", ColType::DateNull),
            ("urgency", ColType::StringWithDefault("routine".to_string())),
            ("supervising_consultant", ColType::StringWithDefault(String::new())),
            ("requester_contact", ColType::StringWithDefault(String::new())),
            ("notes", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "tumor_marker_test_requests").await
    }
}
