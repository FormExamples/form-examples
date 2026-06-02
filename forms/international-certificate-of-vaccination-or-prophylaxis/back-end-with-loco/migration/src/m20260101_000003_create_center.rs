use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Center::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Center::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Center::CreatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Center::UpdatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Center::DeletedAt).timestamp_with_time_zone().null())
                    .col(ColumnDef::new(Center::Name).text().not_null().default(""))
                    .col(ColumnDef::new(Center::WhoDesignationReference).string_len(50).not_null().default(""))
                    .col(ColumnDef::new(Center::NationalAuthorityReference).string_len(50).not_null().default(""))
                    .col(ColumnDef::new(Center::UniformStampImageDataUrl).text().not_null().default(""))
                    .col(ColumnDef::new(Center::AuthorisedDiseases).text().not_null().default("yellow-fever"))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Center::Table).to_owned()).await
    }
}

#[derive(DeriveIden)]
enum Center {
    Table,
    Id,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    Name,
    WhoDesignationReference,
    NationalAuthorityReference,
    UniformStampImageDataUrl,
    AuthorisedDiseases,
}
