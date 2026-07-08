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
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("psa", ColType::Boolean),
            ("ca125", ColType::Boolean),
            ("ca19_9", ColType::Boolean),
            ("carcinoembryonic_antigen_cea", ColType::Boolean),
            ("alpha_fetoprotein_afp", ColType::Boolean),
            ("beta_hcg", ColType::Boolean),
            ("ca15_3", ColType::Boolean),
            ("lactate_dehydrogenase_ldh", ColType::Boolean),
            ("calcitonin", ColType::Boolean),
            ("chromogranin_a", ColType::Boolean),
            ("primary_indication", ColType::String),
            ("clinical_details", ColType::String),
            ("known_cancer_site", ColType::String),
            ("on_treatment", ColType::Boolean),
            ("previous_marker_value", ColType::DoubleNull),
            ("previous_marker_date", ColType::DateNull),
            ("urgency", ColType::String),
            ("supervising_consultant", ColType::String),
            ("requester_contact", ColType::String),
            ("notes", ColType::String),
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
