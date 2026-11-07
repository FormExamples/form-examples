//! International certificate of vaccination or prophylaxis entry module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::international_certificate_of_vaccination_or_prophylaxis_entries::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// International certificate of vaccination or prophylaxis id.
    pub international_certificate_of_vaccination_or_prophylaxis_id: Uuid,
    /// Entry index.
    pub entry_index: i32,
    /// Disease.
    pub disease: String,
    /// Disease other label.
    pub disease_other_label: String,
    /// Disease as snomed ct.
    pub disease_as_snomed_ct: String,
    /// Disease as icd 11.
    pub disease_as_icd_11: String,
    /// Vaccine or prophylaxis name.
    pub vaccine_or_prophylaxis_name: String,
    /// Vaccine as snomed ct.
    pub vaccine_as_snomed_ct: String,
    /// Vaccine as atc.
    pub vaccine_as_atc: String,
    /// Manufacturer.
    pub manufacturer: String,
    /// Manufacturer country as iso 3166 1 alpha 3.
    pub manufacturer_country_as_iso_3166_1_alpha_3: String,
    /// Batch number.
    pub batch_number: String,
    /// Lot expiry date.
    pub lot_expiry_date: Option<Date>,
    /// Route.
    pub route: String,
    /// Anatomical site.
    pub anatomical_site: String,
    /// Dose amount value.
    pub dose_amount_value: Option<f64>,
    /// Dose amount unit.
    pub dose_amount_unit: String,
    /// Dose sequence.
    pub dose_sequence: Option<i32>,
    /// Dose sequence total.
    pub dose_sequence_total: Option<i32>,
    /// Vaccination date.
    pub vaccination_date: Option<Date>,
    /// Vaccination time.
    pub vaccination_time: Option<Time>,
    /// Administered by clinician id.
    pub administered_by_clinician_id: Option<Uuid>,
    /// Administering clinician signature data url.
    pub administering_clinician_signature_data_url: String,
    /// Administering clinician professional status.
    pub administering_clinician_professional_status: String,
    /// Validity starts on.
    pub validity_starts_on: Option<Date>,
    /// Validity ends on.
    pub validity_ends_on: Option<Date>,
    /// Validity is lifetime.
    pub validity_is_lifetime: String,
    /// Centre id.
    pub centre_id: Option<Uuid>,
    /// Centre stamp image data url.
    pub centre_stamp_image_data_url: String,
    /// Centre stamp applied.
    pub centre_stamp_applied: String,
    /// Adverse event.
    pub adverse_event: String,
    /// Adverse event notes.
    pub adverse_event_notes: String,
    /// Entry valid.
    pub entry_valid: String,
    /// Entry notes.
    pub entry_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO international_certificate_of_vaccination_or_prophylaxis_entries \
            (international_certificate_of_vaccination_or_prophylaxis_id, entry_index, \
            disease, disease_other_label, disease_as_snomed_ct, disease_as_icd_11, \
            vaccine_or_prophylaxis_name, vaccine_as_snomed_ct, vaccine_as_atc, \
            manufacturer, manufacturer_country_as_iso_3166_1_alpha_3, batch_number, \
            lot_expiry_date, route, anatomical_site, dose_amount_value, \
            dose_amount_unit, dose_sequence, dose_sequence_total, vaccination_date, \
            vaccination_time, administered_by_clinician_id, \
            administering_clinician_signature_data_url, \
            administering_clinician_professional_status, validity_starts_on, \
            validity_ends_on, validity_is_lifetime, centre_id, \
            centre_stamp_image_data_url, centre_stamp_applied, adverse_event, \
            adverse_event_notes, entry_valid, entry_notes) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, \
            $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34) RETURNING *",
        )
        .bind(self.international_certificate_of_vaccination_or_prophylaxis_id)
        .bind(self.entry_index)
        .bind(&self.disease)
        .bind(&self.disease_other_label)
        .bind(&self.disease_as_snomed_ct)
        .bind(&self.disease_as_icd_11)
        .bind(&self.vaccine_or_prophylaxis_name)
        .bind(&self.vaccine_as_snomed_ct)
        .bind(&self.vaccine_as_atc)
        .bind(&self.manufacturer)
        .bind(&self.manufacturer_country_as_iso_3166_1_alpha_3)
        .bind(&self.batch_number)
        .bind(self.lot_expiry_date)
        .bind(&self.route)
        .bind(&self.anatomical_site)
        .bind(self.dose_amount_value)
        .bind(&self.dose_amount_unit)
        .bind(self.dose_sequence)
        .bind(self.dose_sequence_total)
        .bind(self.vaccination_date)
        .bind(self.vaccination_time)
        .bind(self.administered_by_clinician_id)
        .bind(&self.administering_clinician_signature_data_url)
        .bind(&self.administering_clinician_professional_status)
        .bind(self.validity_starts_on)
        .bind(self.validity_ends_on)
        .bind(&self.validity_is_lifetime)
        .bind(self.centre_id)
        .bind(&self.centre_stamp_image_data_url)
        .bind(&self.centre_stamp_applied)
        .bind(&self.adverse_event)
        .bind(&self.adverse_event_notes)
        .bind(&self.entry_valid)
        .bind(&self.entry_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE international_certificate_of_vaccination_or_prophylaxis_entries SET \
            international_certificate_of_vaccination_or_prophylaxis_id = $2, entry_index \
            = $3, disease = $4, disease_other_label = $5, disease_as_snomed_ct = $6, \
            disease_as_icd_11 = $7, vaccine_or_prophylaxis_name = $8, \
            vaccine_as_snomed_ct = $9, vaccine_as_atc = $10, manufacturer = $11, \
            manufacturer_country_as_iso_3166_1_alpha_3 = $12, batch_number = $13, \
            lot_expiry_date = $14, route = $15, anatomical_site = $16, dose_amount_value \
            = $17, dose_amount_unit = $18, dose_sequence = $19, dose_sequence_total = \
            $20, vaccination_date = $21, vaccination_time = $22, \
            administered_by_clinician_id = $23, \
            administering_clinician_signature_data_url = $24, \
            administering_clinician_professional_status = $25, validity_starts_on = $26, \
            validity_ends_on = $27, validity_is_lifetime = $28, centre_id = $29, \
            centre_stamp_image_data_url = $30, centre_stamp_applied = $31, adverse_event \
            = $32, adverse_event_notes = $33, entry_valid = $34, entry_notes = $35, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.international_certificate_of_vaccination_or_prophylaxis_id)
        .bind(self.entry_index)
        .bind(&self.disease)
        .bind(&self.disease_other_label)
        .bind(&self.disease_as_snomed_ct)
        .bind(&self.disease_as_icd_11)
        .bind(&self.vaccine_or_prophylaxis_name)
        .bind(&self.vaccine_as_snomed_ct)
        .bind(&self.vaccine_as_atc)
        .bind(&self.manufacturer)
        .bind(&self.manufacturer_country_as_iso_3166_1_alpha_3)
        .bind(&self.batch_number)
        .bind(self.lot_expiry_date)
        .bind(&self.route)
        .bind(&self.anatomical_site)
        .bind(self.dose_amount_value)
        .bind(&self.dose_amount_unit)
        .bind(self.dose_sequence)
        .bind(self.dose_sequence_total)
        .bind(self.vaccination_date)
        .bind(self.vaccination_time)
        .bind(self.administered_by_clinician_id)
        .bind(&self.administering_clinician_signature_data_url)
        .bind(&self.administering_clinician_professional_status)
        .bind(self.validity_starts_on)
        .bind(self.validity_ends_on)
        .bind(&self.validity_is_lifetime)
        .bind(self.centre_id)
        .bind(&self.centre_stamp_image_data_url)
        .bind(&self.centre_stamp_applied)
        .bind(&self.adverse_event)
        .bind(&self.adverse_event_notes)
        .bind(&self.entry_valid)
        .bind(&self.entry_notes)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/international_certificate_of_vaccination_or_prophylaxis_entries/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
