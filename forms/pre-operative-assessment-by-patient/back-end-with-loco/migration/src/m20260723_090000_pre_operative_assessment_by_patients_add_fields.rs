use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        add_column(m, "pre_operative_assessment_by_patients", "cancer_history", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "cancer_history_details", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "mrsa_history", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "recent_hospital_or_care_home_admission", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "palpitations_or_blackouts", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "heart_or_artery_surgery", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "swollen_ankles", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "snoring", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "snoring_loud", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "collar_size_inches", ColType::DoubleNull).await?;
        add_column(m, "pre_operative_assessment_by_patients", "daytime_sleepiness", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "observed_apnoea_episodes", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "urinary_symptoms", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "urinary_catheter_history", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "prostate_problems", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "personal_vte_history", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "family_vte_history", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "blood_transfusion_history", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "joint_or_arthritis_problems", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "back_or_neck_problems", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "skin_conditions", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "pressure_sore_risk", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "bowel_problems", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "food_intolerances", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "food_intolerances_details", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "blood_donor", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "body_piercings", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "hearing_problems", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "vision_problems", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "balance_issues", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "contraceptive_or_hrt_use", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "last_menstrual_period", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "head_injury_requiring_hospitalisation", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "memory_concerns", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "dementia_diagnosis", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "depression_or_anxiety_history", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "depression_anxiety_impacts_daily_life", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "depression_anxiety_seen_doctor", ColType::Text).await?;
        add_column(m, "pre_operative_assessment_by_patients", "learning_difficulties", ColType::Text).await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        remove_column(m, "pre_operative_assessment_by_patients", "learning_difficulties").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "depression_anxiety_seen_doctor").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "depression_anxiety_impacts_daily_life").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "depression_or_anxiety_history").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "dementia_diagnosis").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "memory_concerns").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "head_injury_requiring_hospitalisation").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "last_menstrual_period").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "contraceptive_or_hrt_use").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "balance_issues").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "vision_problems").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "hearing_problems").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "body_piercings").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "blood_donor").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "food_intolerances_details").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "food_intolerances").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "bowel_problems").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "pressure_sore_risk").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "skin_conditions").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "back_or_neck_problems").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "joint_or_arthritis_problems").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "blood_transfusion_history").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "family_vte_history").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "personal_vte_history").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "prostate_problems").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "urinary_catheter_history").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "urinary_symptoms").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "observed_apnoea_episodes").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "daytime_sleepiness").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "collar_size_inches").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "snoring_loud").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "snoring").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "swollen_ankles").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "heart_or_artery_surgery").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "palpitations_or_blackouts").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "recent_hospital_or_care_home_admission").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "mrsa_history").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "cancer_history_details").await?;
        remove_column(m, "pre_operative_assessment_by_patients", "cancer_history").await?;
        Ok(())
    }
}
