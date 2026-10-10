use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "assessment_current_medications",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "takes_respiratory_medications",
                    ColType::StringWithDefault(String::new()),
                ),
                ("inhaler_use", ColType::StringWithDefault(String::new())),
                (
                    "inhaler_technique_assessed",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "inhaler_technique_adequate",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "long_term_oxygen_therapy",
                    ColType::StringWithDefault(String::new()),
                ),
                ("nebuliser_use", ColType::StringWithDefault(String::new())),
                (
                    "takes_other_medications",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "medication_adherence",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "adverse_drug_reactions",
                    ColType::TextWithDefault(String::new()),
                ),
                ("additional_notes", ColType::TextWithDefault(String::new())),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE assessment_current_medications ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_current_medications").await
    }
}
