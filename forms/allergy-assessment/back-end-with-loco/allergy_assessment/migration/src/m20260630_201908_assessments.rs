use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessments",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("age_of_onset", ColType::IntegerNull),
            ("known_allergens", ColType::Text),
            ("family_history_of_atopy", ColType::String),
            ("family_atopy_details", ColType::Text),
            ("family_history_of_allergy", ColType::String),
            ("family_allergy_details", ColType::Text),
            ("pollen_allergy", ColType::String),
            ("dust_mite_allergy", ColType::String),
            ("mould_allergy", ColType::String),
            ("animal_dander_allergy", ColType::String),
            ("latex_allergy", ColType::String),
            ("insect_sting_allergy", ColType::String),
            ("insect_sting_severity", ColType::String),
            ("seasonal_pattern", ColType::String),
            ("other_environmental_allergens", ColType::Text),
            ("asthma", ColType::String),
            ("asthma_severity", ColType::String),
            ("eczema", ColType::String),
            ("eczema_severity", ColType::String),
            ("rhinitis", ColType::String),
            ("rhinitis_severity", ColType::String),
            ("eosinophilic_oesophagitis", ColType::String),
            ("mast_cell_disorders", ColType::String),
            ("mast_cell_details", ColType::Text),
            ("mental_health_impact", ColType::String),
            ("mental_health_details", ColType::Text),
            ("quality_of_life_score", ColType::IntegerNull),
            ("school_work_impact", ColType::String),
            ("school_work_impact_details", ColType::Text),
            ("emergency_action_plan_status", ColType::String),
            ("training_provided", ColType::String),
            ("training_details", ColType::Text),
            ("follow_up_schedule", ColType::Text),
            ],
            &[
            ("patient", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessments").await
    }
}
