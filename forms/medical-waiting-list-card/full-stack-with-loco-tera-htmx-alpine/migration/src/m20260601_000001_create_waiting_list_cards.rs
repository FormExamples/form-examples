use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(WaitingListCards::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(WaitingListCards::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(WaitingListCards::Data)
                            .json_binary()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(WaitingListCards::Result)
                            .json_binary()
                            .null(),
                    )
                    .col(
                        ColumnDef::new(WaitingListCards::Status)
                            .string()
                            .not_null()
                            .default("in_progress"),
                    )
                    .col(
                        ColumnDef::new(WaitingListCards::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(WaitingListCards::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(WaitingListCards::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
enum WaitingListCards {
    Table,
    Id,
    Data,
    Result,
    Status,
    CreatedAt,
    UpdatedAt,
}
