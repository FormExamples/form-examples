use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "arc42_documentations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("author_name", ColType::Text),
            ("author_role", ColType::Text),
            ("document_date", ColType::DateNull),
            ("introduction", ColType::Text),
            ("business_context_description", ColType::Text),
            ("technical_context_description", ColType::Text),
            ("solution_strategy_summary", ColType::Text),
            ("top_level_decomposition_summary", ColType::Text),
            ("building_block_overview", ColType::Text),
            ("runtime_overview", ColType::Text),
            ("deployment_overview", ColType::Text),
            ("crosscutting_overview", ColType::Text),
            ("quality_tree_summary", ColType::Text),
            ("recommendation", ColType::Text),
            ("additional_notes", ColType::Text),
            ("signed_by", ColType::Text),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("architecture", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "arc42_documentations").await
    }
}
