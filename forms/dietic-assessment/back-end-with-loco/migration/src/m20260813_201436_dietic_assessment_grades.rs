use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "dietic_assessment_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("must_bmi_score", ColType::IntegerNull),
            ("must_weight_loss_score", ColType::IntegerNull),
            ("must_acute_disease_score", ColType::IntegerNull),
            ("must_score", ColType::IntegerNull),
            ("computed_must_risk", ColType::StringWithDefault(String::new())),
            ("final_must_risk", ColType::StringWithDefault(String::new())),
            ("must_is_estimated", ColType::BooleanWithDefault(false)),
            ("glim_phenotypic_criteria", ColType::StringWithDefault(String::new())),
            ("glim_etiologic_criteria", ColType::StringWithDefault(String::new())),
            ("glim_diagnosis", ColType::StringWithDefault(String::new())),
            ("nrs_2002_score", ColType::IntegerNull),
            ("sarcf_score", ColType::IntegerNull),
            ("scoff_score", ColType::IntegerNull),
            ("refeeding_risk", ColType::StringWithDefault(String::new())),
            ("energy_requirement_kcal", ColType::IntegerNull),
            ("protein_requirement_g", ColType::IntegerNull),
            ("computed_composite_risk", ColType::StringWithDefault(String::new())),
            ("final_composite_risk", ColType::StringWithDefault(String::new())),
            ("override_reason", ColType::StringWithDefault(String::new())),
            ("recommendation", ColType::StringWithDefault(String::new())),
            ("dietitian_notes", ColType::TextWithDefault(String::new())),
            ("signed_by_name", ColType::StringWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("dietic_assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "dietic_assessment_grades").await
    }
}
