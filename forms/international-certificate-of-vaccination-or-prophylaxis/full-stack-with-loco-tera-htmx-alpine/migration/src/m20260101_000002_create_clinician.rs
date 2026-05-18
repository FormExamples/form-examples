use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Clinician::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Clinician::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Clinician::CreatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Clinician::UpdatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Clinician::DeletedAt).timestamp_with_time_zone().null())
                    .col(ColumnDef::new(Clinician::Name).text().not_null().default(""))
                    .col(ColumnDef::new(Clinician::ProfessionalStatus).string_len(50).not_null().default(""))
                    .col(ColumnDef::new(Clinician::RegistrationBody).string_len(30).not_null().default(""))
                    .col(ColumnDef::new(Clinician::RegistrationNumber).text().not_null().default(""))
                    .col(ColumnDef::new(Clinician::SignatureImageDataUrl).text().not_null().default(""))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(Clinician::Table).to_owned()).await
    }
}

#[derive(DeriveIden)]
enum Clinician {
    Table,
    Id,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    Name,
    ProfessionalStatus,
    RegistrationBody,
    RegistrationNumber,
    SignatureImageDataUrl,
}
