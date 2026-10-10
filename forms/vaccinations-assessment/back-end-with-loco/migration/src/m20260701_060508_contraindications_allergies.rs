use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "contraindications_allergies",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("egg_allergy", ColType::StringWithDefault(String::new())),
                ("gelatin_allergy", ColType::StringWithDefault(String::new())),
                ("latex_allergy", ColType::StringWithDefault(String::new())),
                (
                    "neomycin_allergy",
                    ColType::StringWithDefault(String::new()),
                ),
                ("pregnant", ColType::StringWithDefault(String::new())),
                ("pregnancy_weeks", ColType::StringWithDefault(String::new())),
                ("severe_illness", ColType::StringWithDefault(String::new())),
                (
                    "previous_anaphylaxis",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "anaphylaxis_details",
                    ColType::TextWithDefault(String::new()),
                ),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE contraindications_allergies ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "contraindications_allergies").await
    }
}
