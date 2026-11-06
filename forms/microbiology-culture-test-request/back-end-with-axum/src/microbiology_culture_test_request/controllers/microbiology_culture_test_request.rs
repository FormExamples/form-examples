#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::microbiology_culture_test_requests::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub requested_by_date: Option<Date>,
    pub specimen_type: String,
    pub specimen_site_detail: String,
    pub test_culture_and_sensitivity: bool,
    pub test_gram_stain: bool,
    pub test_acid_fast_bacilli_tb: bool,
    pub test_fungal_culture: bool,
    pub test_pcr_molecular: bool,
    pub test_c_difficile_toxin: bool,
    pub test_mrsa_screen: bool,
    pub primary_indication: String,
    pub clinical_details: String,
    pub fever: bool,
    pub current_antibiotics: bool,
    pub antibiotic_name: String,
    pub recent_travel: bool,
    pub immunocompromised: bool,
    pub specimen_collected: String,
    pub collection_datetime: Option<DateTimeWithTimeZone>,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO microbiology_culture_test_requests (deleted_at, patient_id, \
            clinician_id, status, site_name, setting, referral_date, requested_by_date, \
            specimen_type, specimen_site_detail, test_culture_and_sensitivity, \
            test_gram_stain, test_acid_fast_bacilli_tb, test_fungal_culture, \
            test_pcr_molecular, test_c_difficile_toxin, test_mrsa_screen, primary_indication, \
            clinical_details, fever, current_antibiotics, antibiotic_name, recent_travel, \
            immunocompromised, specimen_collected, collection_datetime, urgency, \
            supervising_consultant, requester_contact, notes) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28, $29, $30) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.specimen_type)
        .bind(&self.specimen_site_detail)
        .bind(self.test_culture_and_sensitivity)
        .bind(self.test_gram_stain)
        .bind(self.test_acid_fast_bacilli_tb)
        .bind(self.test_fungal_culture)
        .bind(self.test_pcr_molecular)
        .bind(self.test_c_difficile_toxin)
        .bind(self.test_mrsa_screen)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(self.fever)
        .bind(self.current_antibiotics)
        .bind(&self.antibiotic_name)
        .bind(self.recent_travel)
        .bind(self.immunocompromised)
        .bind(&self.specimen_collected)
        .bind(self.collection_datetime)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE microbiology_culture_test_requests SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, status = $5, site_name = $6, setting = $7, referral_date = $8, \
            requested_by_date = $9, specimen_type = $10, specimen_site_detail = $11, \
            test_culture_and_sensitivity = $12, test_gram_stain = $13, \
            test_acid_fast_bacilli_tb = $14, test_fungal_culture = $15, test_pcr_molecular = \
            $16, test_c_difficile_toxin = $17, test_mrsa_screen = $18, primary_indication = \
            $19, clinical_details = $20, fever = $21, current_antibiotics = $22, \
            antibiotic_name = $23, recent_travel = $24, immunocompromised = $25, \
            specimen_collected = $26, collection_datetime = $27, urgency = $28, \
            supervising_consultant = $29, requester_contact = $30, notes = $31, updated_at = \
            now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.specimen_type)
        .bind(&self.specimen_site_detail)
        .bind(self.test_culture_and_sensitivity)
        .bind(self.test_gram_stain)
        .bind(self.test_acid_fast_bacilli_tb)
        .bind(self.test_fungal_culture)
        .bind(self.test_pcr_molecular)
        .bind(self.test_c_difficile_toxin)
        .bind(self.test_mrsa_screen)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(self.fever)
        .bind(self.current_antibiotics)
        .bind(&self.antibiotic_name)
        .bind(self.recent_travel)
        .bind(self.immunocompromised)
        .bind(&self.specimen_collected)
        .bind(self.collection_datetime)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(&self.notes)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/microbiology_culture_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
