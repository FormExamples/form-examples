use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "nerve_conduction_study_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("study_type", ColType::StringWithDefault(String::new())),
            ("region", ColType::StringWithDefault(String::new())),
            ("laterality", ColType::StringWithDefault(String::new())),
            ("study_adequacy", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("nerve_conduction_findings", ColType::StringWithDefault(String::new())),
            ("emg_findings", ColType::StringWithDefault(String::new())),
            ("carpal_tunnel_syndrome", ColType::BooleanWithDefault(false)),
            ("peripheral_neuropathy", ColType::BooleanWithDefault(false)),
            ("radiculopathy", ColType::BooleanWithDefault(false)),
            ("motor_neurone_disease_features", ColType::BooleanWithDefault(false)),
            ("myopathy", ColType::BooleanWithDefault(false)),
            ("neuromuscular_junction_disorder", ColType::BooleanWithDefault(false)),
            ("normal_study", ColType::BooleanWithDefault(false)),
            ("severity", ColType::StringWithDefault(String::new())),
            ("pattern", ColType::StringWithDefault(String::new())),
            ("impression", ColType::StringWithDefault(String::new())),
            ("reporting_category", ColType::StringWithDefault(String::new())),
            ("recommended_follow_up", ColType::StringWithDefault(String::new())),
            ("critical_result_communicated", ColType::BooleanWithDefault(false)),
            ("reported_to", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "nerve_conduction_study_test_results").await
    }
}
