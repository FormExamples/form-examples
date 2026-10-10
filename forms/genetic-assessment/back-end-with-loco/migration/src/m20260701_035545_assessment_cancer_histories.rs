use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "assessment_cancer_histories",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "family_cancer_history",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "multiple_family_cancers",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "early_onset_cancer",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "bilateral_cancer",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "rare_tumour_types",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "rare_tumour_details",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "known_cancer_syndrome",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "cancer_syndrome_details",
                    ColType::TextWithDefault(String::new()),
                ),
                ("cancer_risk_score", ColType::IntegerNull),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE assessment_cancer_histories ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_cancer_histories").await
    }
}
