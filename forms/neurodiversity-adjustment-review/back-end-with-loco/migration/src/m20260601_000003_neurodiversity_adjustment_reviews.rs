use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

/// Build a non-null text column defaulting to the empty string.
fn empty_text(name: &str) -> ColumnDef {
    ColumnDef::new(Alias::new(name))
        .string()
        .not_null()
        .default("")
        .to_owned()
}

/// Build a non-null boolean column defaulting to `false`.
fn bool_false(name: &str) -> ColumnDef {
    ColumnDef::new(Alias::new(name))
        .boolean()
        .not_null()
        .default(false)
        .to_owned()
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.create_table(
            Table::create()
                .table(Alias::new("neurodiversity_adjustment_reviews"))
                .if_not_exists()
                .col(
                    ColumnDef::new(Alias::new("id"))
                        .uuid()
                        .not_null()
                        .default(Expr::cust("gen_random_uuid()"))
                        .primary_key(),
                )
                .col(
                    ColumnDef::new(Alias::new("created_at"))
                        .timestamp_with_time_zone()
                        .not_null()
                        .default(Expr::current_timestamp()),
                )
                .col(
                    ColumnDef::new(Alias::new("updated_at"))
                        .timestamp_with_time_zone()
                        .not_null()
                        .default(Expr::current_timestamp()),
                )
                .col(
                    ColumnDef::new(Alias::new("deleted_at"))
                        .timestamp_with_time_zone()
                        .null(),
                )
                .col(ColumnDef::new(Alias::new("worker_id")).uuid().not_null())
                .col(ColumnDef::new(Alias::new("manager_id")).uuid().not_null())
                .col(
                    ColumnDef::new(Alias::new("review_status"))
                        .string()
                        .not_null()
                        .default("draft"),
                )
                .col(empty_text("response_reference"))
                .col(empty_text("review_method"))
                .col(ColumnDef::new(Alias::new("review_date")).date().null())
                .col(ColumnDef::new(Alias::new("next_review_date")).date().null())
                .col(empty_text("effectiveness_working_environment"))
                .col(empty_text("effectiveness_equipment_technology"))
                .col(empty_text("effectiveness_working_arrangements"))
                .col(empty_text("effectiveness_communication"))
                .col(empty_text("effectiveness_support_mentoring"))
                .col(empty_text("effectiveness_recruitment_process"))
                .col(empty_text("effectiveness_policy_dress"))
                .col(empty_text("effectiveness_other"))
                .col(empty_text("worker_feedback"))
                .col(empty_text("worker_satisfied"))
                .col(empty_text("wellbeing_change"))
                .col(empty_text("barriers_detail"))
                .col(bool_false("changes_needed"))
                .col(empty_text("changes_detail"))
                .col(empty_text("updated_adjustments_detail"))
                .col(bool_false("occupational_health_rereferral"))
                .col(bool_false("escalated"))
                .col(empty_text("escalation_detail"))
                .col(empty_text("notes"))
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_neurodiversity_adjustment_reviews_worker_id")
                        .from(
                            Alias::new("neurodiversity_adjustment_reviews"),
                            Alias::new("worker_id"),
                        )
                        .to(Alias::new("workers"), Alias::new("id"))
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade),
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_neurodiversity_adjustment_reviews_manager_id")
                        .from(
                            Alias::new("neurodiversity_adjustment_reviews"),
                            Alias::new("manager_id"),
                        )
                        .to(Alias::new("managers"), Alias::new("id"))
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade),
                )
                .to_owned(),
        )
        .await?;

        m.create_index(
            Index::create()
                .if_not_exists()
                .name("index_neurodiversity_adjustment_review_worker_id")
                .table(Alias::new("neurodiversity_adjustment_reviews"))
                .col(Alias::new("worker_id"))
                .to_owned(),
        )
        .await?;

        m.create_index(
            Index::create()
                .if_not_exists()
                .name("index_neurodiversity_adjustment_review_manager_id")
                .table(Alias::new("neurodiversity_adjustment_reviews"))
                .col(Alias::new("manager_id"))
                .to_owned(),
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.drop_table(
            Table::drop()
                .table(Alias::new("neurodiversity_adjustment_reviews"))
                .to_owned(),
        )
        .await
    }
}
