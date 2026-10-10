use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "dexa_bone_density_test_result_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("axis", ColType::StringWithDefault(String::new())),
                ("category", ColType::StringWithDefault(String::new())),
                ("description", ColType::StringWithDefault(String::new())),
                ("dexa_bone_density_test_result_grade_id", ColType::Uuid),
            ],
            &[(
                "dexa_bone_density_test_result_grade",
                "dexa_bone_density_test_result_grade_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE dexa_bone_density_test_result_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "dexa_bone_density_test_result_grade_rules").await
    }
}
