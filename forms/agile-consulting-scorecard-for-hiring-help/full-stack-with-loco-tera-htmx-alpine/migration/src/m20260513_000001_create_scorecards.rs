use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Scorecards::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Scorecards::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Scorecards::Data).json_binary().not_null())
                    .col(ColumnDef::new(Scorecards::Result).json_binary().null())
                    .col(
                        ColumnDef::new(Scorecards::Status)
                            .string()
                            .not_null()
                            .default("submitted"),
                    )
                    .col(
                        ColumnDef::new(Scorecards::OrganizationName)
                            .string()
                            .not_null()
                            .default(""),
                    )
                    .col(
                        ColumnDef::new(Scorecards::Sector)
                            .string()
                            .not_null()
                            .default(""),
                    )
                    .col(
                        ColumnDef::new(Scorecards::SizeBand)
                            .string()
                            .not_null()
                            .default(""),
                    )
                    .col(
                        ColumnDef::new(Scorecards::ComputedBand)
                            .string()
                            .not_null()
                            .default(""),
                    )
                    .col(
                        ColumnDef::new(Scorecards::ScoreTotal)
                            .small_integer()
                            .not_null()
                            .default(0),
                    )
                    .col(
                        ColumnDef::new(Scorecards::AssessmentDate)
                            .string()
                            .not_null()
                            .default(""),
                    )
                    .col(
                        ColumnDef::new(Scorecards::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Scorecards::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_scorecards_computed_band")
                    .table(Scorecards::Table)
                    .col(Scorecards::ComputedBand)
                    .to_owned(),
            )
            .await?;
        manager
            .create_index(
                Index::create()
                    .name("idx_scorecards_sector")
                    .table(Scorecards::Table)
                    .col(Scorecards::Sector)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Scorecards::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
enum Scorecards {
    Table,
    Id,
    Data,
    Result,
    Status,
    OrganizationName,
    Sector,
    SizeBand,
    ComputedBand,
    ScoreTotal,
    AssessmentDate,
    CreatedAt,
    UpdatedAt,
}
