use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.create_table(
            Table::create()
                .table(Alias::new("cardiology_response_grade_rules"))
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
                .col(
                    ColumnDef::new(Alias::new("cardiology_response_grade_id"))
                        .uuid()
                        .not_null(),
                )
                .col(ColumnDef::new(Alias::new("rule_id")).string().not_null())
                .col(ColumnDef::new(Alias::new("axis")).string().not_null())
                .col(ColumnDef::new(Alias::new("category")).string().not_null())
                .col(
                    ColumnDef::new(Alias::new("description"))
                        .string()
                        .not_null(),
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_cardiology_response_grade_rules_grade_id")
                        .from(
                            Alias::new("cardiology_response_grade_rules"),
                            Alias::new("cardiology_response_grade_id"),
                        )
                        .to(Alias::new("cardiology_response_grades"), Alias::new("id"))
                        .on_delete(ForeignKeyAction::Cascade)
                        .on_update(ForeignKeyAction::Cascade),
                )
                .to_owned(),
        )
        .await?;

        m.create_index(
            Index::create()
                .if_not_exists()
                .name("index_cardiology_response_grade_rule_grade_id")
                .table(Alias::new("cardiology_response_grade_rules"))
                .col(Alias::new("cardiology_response_grade_id"))
                .to_owned(),
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.drop_table(
            Table::drop()
                .table(Alias::new("cardiology_response_grade_rules"))
                .to_owned(),
        )
        .await
    }
}
