use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.create_table(
            Table::create()
                .table(Alias::new("managers"))
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
                .col(ColumnDef::new(Alias::new("name")).text().not_null())
                .col(ColumnDef::new(Alias::new("email")).text().null())
                .col(ColumnDef::new(Alias::new("phone")).text().null())
                .col(
                    ColumnDef::new(Alias::new("postal_address_as_full_text"))
                        .text()
                        .null(),
                )
                .col(
                    ColumnDef::new(Alias::new("country_as_iso_3166_1_alpha_2"))
                        .string()
                        .null(),
                )
                .col(ColumnDef::new(Alias::new("postcode")).text().null())
                .col(
                    ColumnDef::new(Alias::new("role"))
                        .text()
                        .not_null()
                        .default(""),
                )
                .col(
                    ColumnDef::new(Alias::new("job_title"))
                        .text()
                        .not_null()
                        .default(""),
                )
                .col(
                    ColumnDef::new(Alias::new("department"))
                        .text()
                        .not_null()
                        .default(""),
                )
                .to_owned(),
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        m.drop_table(Table::drop().table(Alias::new("managers")).to_owned())
            .await
    }
}
