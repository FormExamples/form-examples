use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "abdominal_aortic_aneurysm_screening_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("category", ColType::StringWithDefault(String::new())),
                (
                    "surveillance_band",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "recommended_action",
                    ColType::TextWithDefault(String::new()),
                ),
                ("growth_cm", ColType::DoubleNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("abdominal_aortic_aneurysm_screening_id", ColType::Uuid),
            ],
            &[(
                "abdominal_aortic_aneurysm_screening",
                "abdominal_aortic_aneurysm_screening_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE abdominal_aortic_aneurysm_screening_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "abdominal_aortic_aneurysm_screening_grades").await
    }
}
