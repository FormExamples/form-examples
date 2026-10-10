use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "arc42_documentations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("author_name", ColType::TextWithDefault(String::new())),
                ("author_role", ColType::TextWithDefault(String::new())),
                ("document_date", ColType::DateNull),
                ("introduction", ColType::TextWithDefault(String::new())),
                (
                    "business_context_description",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "technical_context_description",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "solution_strategy_summary",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "top_level_decomposition_summary",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "building_block_overview",
                    ColType::TextWithDefault(String::new()),
                ),
                ("runtime_overview", ColType::TextWithDefault(String::new())),
                (
                    "deployment_overview",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "crosscutting_overview",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "quality_tree_summary",
                    ColType::TextWithDefault(String::new()),
                ),
                ("recommendation", ColType::TextWithDefault(String::new())),
                ("additional_notes", ColType::TextWithDefault(String::new())),
                ("signed_by", ColType::TextWithDefault(String::new())),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
                ("architecture_id", ColType::Uuid),
            ],
            &[("architecture", "architecture_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE arc42_documentations ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "arc42_documentations").await
    }
}
