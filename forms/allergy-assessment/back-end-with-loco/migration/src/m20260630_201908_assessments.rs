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
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("age_of_onset", ColType::IntegerNull),
            ("known_allergens", ColType::TextWithDefault(String::new())),
            ("family_history_of_atopy", ColType::StringWithDefault(String::new())),
            ("family_atopy_details", ColType::TextWithDefault(String::new())),
            ("family_history_of_allergy", ColType::StringWithDefault(String::new())),
            ("family_allergy_details", ColType::TextWithDefault(String::new())),
            ("pollen_allergy", ColType::StringWithDefault(String::new())),
            ("dust_mite_allergy", ColType::StringWithDefault(String::new())),
            ("mould_allergy", ColType::StringWithDefault(String::new())),
            ("animal_dander_allergy", ColType::StringWithDefault(String::new())),
            ("latex_allergy", ColType::StringWithDefault(String::new())),
            ("insect_sting_allergy", ColType::StringWithDefault(String::new())),
            ("insect_sting_severity", ColType::StringWithDefault(String::new())),
            ("seasonal_pattern", ColType::StringWithDefault(String::new())),
            ("other_environmental_allergens", ColType::TextWithDefault(String::new())),
            ("asthma", ColType::StringWithDefault(String::new())),
            ("asthma_severity", ColType::StringWithDefault(String::new())),
            ("eczema", ColType::StringWithDefault(String::new())),
            ("eczema_severity", ColType::StringWithDefault(String::new())),
            ("rhinitis", ColType::StringWithDefault(String::new())),
            ("rhinitis_severity", ColType::StringWithDefault(String::new())),
            ("eosinophilic_oesophagitis", ColType::StringWithDefault(String::new())),
            ("mast_cell_disorders", ColType::StringWithDefault(String::new())),
            ("mast_cell_details", ColType::TextWithDefault(String::new())),
            ("mental_health_impact", ColType::StringWithDefault(String::new())),
            ("mental_health_details", ColType::TextWithDefault(String::new())),
            ("quality_of_life_score", ColType::IntegerNull),
            ("school_work_impact", ColType::StringWithDefault(String::new())),
            ("school_work_impact_details", ColType::TextWithDefault(String::new())),
            ("emergency_action_plan_status", ColType::StringWithDefault(String::new())),
            ("training_provided", ColType::StringWithDefault(String::new())),
            ("training_details", ColType::TextWithDefault(String::new())),
            ("follow_up_schedule", ColType::TextWithDefault(String::new())),
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
