use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "centor_score_for_streptococcal_pharyngitis_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("centor_score", ColType::IntegerNull),
                ("age_modifier", ColType::IntegerNull),
                ("mcisaac_score", ColType::IntegerNull),
                ("risk_band", ColType::StringWithDefault(String::new())),
                ("management", ColType::TextWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                (
                    "centor_score_for_streptococcal_pharyngitis_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "centor_score_for_streptococcal_pharyngitis",
                "centor_score_for_streptococcal_pharyngitis_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE centor_score_for_streptococcal_pharyngitis_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "centor_score_for_streptococcal_pharyngitis_grades").await
    }
}
