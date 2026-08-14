use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        // GLP-1 receptor agonist perioperative management.
        add_column(
            m,
            "perioperative_optimizations",
            "glp1_formulation",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "glp1_held_per_guideline",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "glp1_extended_clear_fluids_confirmed",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "glp1_gi_symptoms",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "glp1_gi_symptoms_details",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "glp1_gastric_ultrasound_performed",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "glp1_gastric_ultrasound_findings",
            ColType::StringWithDefault(String::new()),
        )
        .await?;

        // Expanded frailty assessment and prehabilitation.
        add_column(
            m,
            "perioperative_optimizations",
            "protein_supplementation_recommended",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "fried_weakness",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "fried_slowness",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "fried_low_physical_activity",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "fried_exhaustion",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "fried_unintentional_weight_loss",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "risk_analysis_index_score",
            ColType::IntegerNull,
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "mini_cog_performed",
            ColType::StringWithDefault(String::new()),
        )
        .await?;
        add_column(
            m,
            "perioperative_optimizations",
            "mini_cog_score",
            ColType::IntegerNull,
        )
        .await?;

        // Fried Frailty Phenotype computed result on the grade table.
        add_column(
            m,
            "perioperative_optimization_grades",
            "fried_phenotype_score",
            ColType::IntegerNull,
        )
        .await?;
        add_column(
            m,
            "perioperative_optimization_grades",
            "fried_frailty_category",
            ColType::StringWithDefault(String::new()),
        )
        .await?;

        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        remove_column(m, "perioperative_optimization_grades", "fried_frailty_category").await?;
        remove_column(m, "perioperative_optimization_grades", "fried_phenotype_score").await?;

        remove_column(m, "perioperative_optimizations", "mini_cog_score").await?;
        remove_column(m, "perioperative_optimizations", "mini_cog_performed").await?;
        remove_column(m, "perioperative_optimizations", "risk_analysis_index_score").await?;
        remove_column(m, "perioperative_optimizations", "fried_unintentional_weight_loss").await?;
        remove_column(m, "perioperative_optimizations", "fried_exhaustion").await?;
        remove_column(m, "perioperative_optimizations", "fried_low_physical_activity").await?;
        remove_column(m, "perioperative_optimizations", "fried_slowness").await?;
        remove_column(m, "perioperative_optimizations", "fried_weakness").await?;
        remove_column(m, "perioperative_optimizations", "protein_supplementation_recommended").await?;

        remove_column(m, "perioperative_optimizations", "glp1_gastric_ultrasound_findings").await?;
        remove_column(m, "perioperative_optimizations", "glp1_gastric_ultrasound_performed").await?;
        remove_column(m, "perioperative_optimizations", "glp1_gi_symptoms_details").await?;
        remove_column(m, "perioperative_optimizations", "glp1_gi_symptoms").await?;
        remove_column(m, "perioperative_optimizations", "glp1_extended_clear_fluids_confirmed").await?;
        remove_column(m, "perioperative_optimizations", "glp1_held_per_guideline").await?;
        remove_column(m, "perioperative_optimizations", "glp1_formulation").await?;

        Ok(())
    }
}
