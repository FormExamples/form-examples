use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "abdominal_aortic_aneurysm_screening_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("stage", ColType::StringWithDefault(String::new())),
                ("category", ColType::StringWithDefault(String::new())),
                ("description", ColType::StringWithDefault(String::new())),
                (
                    "abdominal_aortic_aneurysm_screening_grade_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "abdominal_aortic_aneurysm_screening_grade",
                "abdominal_aortic_aneurysm_screening_grade_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE abdominal_aortic_aneurysm_screening_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "abdominal_aortic_aneurysm_screening_grade_rules").await
    }
}
