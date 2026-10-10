use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "hospital_daily_monitoring_checklists",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("hospital_name", ColType::StringWithDefault(String::new())),
                (
                    "department_or_site",
                    ColType::StringWithDefault(String::new()),
                ),
                ("inspection_date", ColType::DateNull),
                (
                    "inspecting_officer_name",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "inspecting_officer_designation",
                    ColType::StringWithDefault(String::new()),
                ),
                ("overall_notes", ColType::TextWithDefault(String::new())),
                ("action_plan", ColType::TextWithDefault(String::new())),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE hospital_daily_monitoring_checklists ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hospital_daily_monitoring_checklists").await
    }
}
