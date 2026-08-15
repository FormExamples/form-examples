use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "hernia_diagnostic_evaluations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("assessment_date", ColType::DateNull),
            ("assessment_time", ColType::StringNull),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("duration_of_bulge", ColType::StringWithDefault(String::new())),
            ("pain_score_0_10", ColType::IntegerNull),
            ("pain_onset", ColType::StringWithDefault(String::new())),
            ("aggravated_by_straining", ColType::StringWithDefault(String::new())),
            ("aggravated_by_lifting", ColType::StringWithDefault(String::new())),
            ("aggravated_by_coughing", ColType::StringWithDefault(String::new())),
            ("prior_hernia_history", ColType::StringWithDefault(String::new())),
            ("prior_hernia_repair", ColType::StringWithDefault(String::new())),
            ("prior_hernia_repair_mesh", ColType::StringWithDefault(String::new())),
            ("prior_hernia_repair_site", ColType::StringWithDefault(String::new())),
            ("history_notes", ColType::TextWithDefault(String::new())),
            ("risk_chronic_cough", ColType::StringWithDefault(String::new())),
            ("risk_constipation_or_straining", ColType::StringWithDefault(String::new())),
            ("risk_heavy_lifting_occupation", ColType::StringWithDefault(String::new())),
            ("risk_obesity", ColType::StringWithDefault(String::new())),
            ("risk_smoking", ColType::StringWithDefault(String::new())),
            ("risk_family_history", ColType::StringWithDefault(String::new())),
            ("risk_prior_abdominal_surgery", ColType::StringWithDefault(String::new())),
            ("risk_pregnancy", ColType::StringWithDefault(String::new())),
            ("risk_connective_tissue_disorder", ColType::StringWithDefault(String::new())),
            ("risk_ascites", ColType::StringWithDefault(String::new())),
            ("risk_factors_notes", ColType::TextWithDefault(String::new())),
            ("inspection_location", ColType::StringWithDefault(String::new())),
            ("inspection_location_other", ColType::StringWithDefault(String::new())),
            ("bulge_visible_at_rest", ColType::StringWithDefault(String::new())),
            ("bulge_enlarges_on_standing_or_straining", ColType::StringWithDefault(String::new())),
            ("skin_changes", ColType::StringWithDefault(String::new())),
            ("inspection_notes", ColType::TextWithDefault(String::new())),
            ("palpable_mass", ColType::StringWithDefault(String::new())),
            ("cough_impulse_positive", ColType::StringWithDefault(String::new())),
            ("tenderness", ColType::StringWithDefault(String::new())),
            ("mass_size_as_cm", ColType::DoubleNull),
            ("palpation_notes", ColType::TextWithDefault(String::new())),
            ("reducibility_status", ColType::StringWithDefault(String::new())),
            ("reduces_spontaneously", ColType::StringWithDefault(String::new())),
            ("reduces_with_manual_pressure", ColType::StringWithDefault(String::new())),
            ("does_not_reduce", ColType::StringWithDefault(String::new())),
            ("reducibility_notes", ColType::TextWithDefault(String::new())),
            ("red_flag_severe_pain", ColType::StringWithDefault(String::new())),
            ("red_flag_vomiting", ColType::StringWithDefault(String::new())),
            ("red_flag_fever", ColType::StringWithDefault(String::new())),
            ("red_flag_absolute_constipation", ColType::StringWithDefault(String::new())),
            ("red_flag_erythema_or_discolouration", ColType::StringWithDefault(String::new())),
            ("red_flag_previously_reducible_now_irreducible", ColType::StringWithDefault(String::new())),
            ("red_flag_tachycardia", ColType::StringWithDefault(String::new())),
            ("red_flag_notes", ColType::TextWithDefault(String::new())),
            ("hernia_type", ColType::StringWithDefault(String::new())),
            ("hernia_type_other", ColType::StringWithDefault(String::new())),
            ("inguinal_subtype", ColType::StringWithDefault(String::new())),
            ("laterality", ColType::StringWithDefault(String::new())),
            ("ehs_size_grade", ColType::StringWithDefault(String::new())),
            ("classification_notes", ColType::TextWithDefault(String::new())),
            ("ultrasound_performed", ColType::StringWithDefault(String::new())),
            ("ultrasound_findings", ColType::StringWithDefault(String::new())),
            ("ct_performed", ColType::StringWithDefault(String::new())),
            ("ct_findings", ColType::StringWithDefault(String::new())),
            ("mri_performed", ColType::StringWithDefault(String::new())),
            ("mri_findings", ColType::StringWithDefault(String::new())),
            ("imaging_indication", ColType::StringWithDefault(String::new())),
            ("imaging_notes", ColType::TextWithDefault(String::new())),
            ("differential_lipoma", ColType::StringWithDefault(String::new())),
            ("differential_lymphadenopathy", ColType::StringWithDefault(String::new())),
            ("differential_hydrocele", ColType::StringWithDefault(String::new())),
            ("differential_undescended_testis", ColType::StringWithDefault(String::new())),
            ("differential_femoral_aneurysm", ColType::StringWithDefault(String::new())),
            ("differential_abscess", ColType::StringWithDefault(String::new())),
            ("differential_other", ColType::StringWithDefault(String::new())),
            ("differential_notes", ColType::TextWithDefault(String::new())),
            ("pain_interferes_with_work_or_activity", ColType::StringWithDefault(String::new())),
            ("functional_impact_scale_0_10", ColType::IntegerNull),
            ("activity_limitation", ColType::StringWithDefault(String::new())),
            ("management_plan", ColType::StringWithDefault(String::new())),
            ("conservative_detail", ColType::StringWithDefault(String::new())),
            ("referral_made", ColType::StringWithDefault(String::new())),
            ("referral_target_timeframe", ColType::StringWithDefault(String::new())),
            ("management_notes", ColType::TextWithDefault(String::new())),
            ("additional_notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hernia_diagnostic_evaluations").await
    }
}
