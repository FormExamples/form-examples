use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(IcvpEntry::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(IcvpEntry::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(IcvpEntry::CreatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(IcvpEntry::UpdatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(IcvpEntry::DeletedAt).timestamp_with_time_zone().null())
                    .col(ColumnDef::new(IcvpEntry::CertificateId).uuid().not_null())
                    .col(ColumnDef::new(IcvpEntry::EntryIndex).integer().not_null().default(1))
                    .col(ColumnDef::new(IcvpEntry::Disease).string_len(30).not_null().default(""))
                    .col(ColumnDef::new(IcvpEntry::VaccineOrProphylaxisName).string_len(255).not_null().default(""))
                    .col(ColumnDef::new(IcvpEntry::Manufacturer).string_len(255).not_null().default(""))
                    .col(ColumnDef::new(IcvpEntry::BatchNumber).string_len(50).not_null().default(""))
                    .col(ColumnDef::new(IcvpEntry::VaccinationDate).date().null())
                    .col(ColumnDef::new(IcvpEntry::ValidityStartsOn).date().null())
                    .col(ColumnDef::new(IcvpEntry::ValidityEndsOn).date().null())
                    .col(ColumnDef::new(IcvpEntry::ValidityIsLifetime).string_len(5).not_null().default(""))
                    .col(ColumnDef::new(IcvpEntry::AdministeringClinicianSignatureDataUrl).text().not_null().default(""))
                    .col(ColumnDef::new(IcvpEntry::CentreStampImageDataUrl).text().not_null().default(""))
                    .col(ColumnDef::new(IcvpEntry::CentreStampApplied).string_len(5).not_null().default(""))
                    .col(ColumnDef::new(IcvpEntry::EntryValid).string_len(5).not_null().default(""))
                    .col(ColumnDef::new(IcvpEntry::EntryNotes).text().not_null().default(""))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.drop_table(Table::drop().table(IcvpEntry::Table).to_owned()).await
    }
}

#[derive(DeriveIden)]
enum IcvpEntry {
    #[sea_orm(iden = "international_certificate_of_vaccination_or_prophylaxis_entry")]
    Table,
    Id,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    #[sea_orm(iden = "international_certificate_of_vaccination_or_prophylaxis_id")]
    CertificateId,
    EntryIndex,
    Disease,
    VaccineOrProphylaxisName,
    Manufacturer,
    BatchNumber,
    VaccinationDate,
    ValidityStartsOn,
    ValidityEndsOn,
    ValidityIsLifetime,
    AdministeringClinicianSignatureDataUrl,
    CentreStampImageDataUrl,
    CentreStampApplied,
    EntryValid,
    EntryNotes,
}
