#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::toxicology_test_requests::Model;

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
    pub paracetamol_level: bool,
    pub salicylate_level: bool,
    pub alcohol_level: bool,
    pub drugs_of_abuse_screen: bool,
    pub lithium_level: bool,
    pub digoxin_level: bool,
    pub antiepileptic_drug_level: bool,
    pub carboxyhaemoglobin: bool,
    pub heavy_metals: bool,
    pub specific_drug_level: bool,
    pub primary_indication: String,
    pub clinical_details: String,
    pub suspected_agent: String,
    pub time_since_ingestion_hours: Option<f64>,
    pub deliberate_overdose: bool,
    pub symptomatic: bool,
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
            "INSERT INTO toxicology_test_requests (deleted_at, patient_id, clinician_id, \
            status, site_name, setting, referral_date, requested_by_date, paracetamol_level, \
            salicylate_level, alcohol_level, drugs_of_abuse_screen, lithium_level, \
            digoxin_level, antiepileptic_drug_level, carboxyhaemoglobin, heavy_metals, \
            specific_drug_level, primary_indication, clinical_details, suspected_agent, \
            time_since_ingestion_hours, deliberate_overdose, symptomatic, specimen_collected, \
            collection_datetime, urgency, supervising_consultant, requester_contact, notes) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, \
            $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(self.paracetamol_level)
        .bind(self.salicylate_level)
        .bind(self.alcohol_level)
        .bind(self.drugs_of_abuse_screen)
        .bind(self.lithium_level)
        .bind(self.digoxin_level)
        .bind(self.antiepileptic_drug_level)
        .bind(self.carboxyhaemoglobin)
        .bind(self.heavy_metals)
        .bind(self.specific_drug_level)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(&self.suspected_agent)
        .bind(self.time_since_ingestion_hours)
        .bind(self.deliberate_overdose)
        .bind(self.symptomatic)
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
            "UPDATE toxicology_test_requests SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, status = $5, site_name = $6, setting = $7, referral_date = $8, \
            requested_by_date = $9, paracetamol_level = $10, salicylate_level = $11, \
            alcohol_level = $12, drugs_of_abuse_screen = $13, lithium_level = $14, \
            digoxin_level = $15, antiepileptic_drug_level = $16, carboxyhaemoglobin = $17, \
            heavy_metals = $18, specific_drug_level = $19, primary_indication = $20, \
            clinical_details = $21, suspected_agent = $22, time_since_ingestion_hours = $23, \
            deliberate_overdose = $24, symptomatic = $25, specimen_collected = $26, \
            collection_datetime = $27, urgency = $28, supervising_consultant = $29, \
            requester_contact = $30, notes = $31, updated_at = now() WHERE id = $1 RETURNING \
            *",
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
        .bind(self.paracetamol_level)
        .bind(self.salicylate_level)
        .bind(self.alcohol_level)
        .bind(self.drugs_of_abuse_screen)
        .bind(self.lithium_level)
        .bind(self.digoxin_level)
        .bind(self.antiepileptic_drug_level)
        .bind(self.carboxyhaemoglobin)
        .bind(self.heavy_metals)
        .bind(self.specific_drug_level)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(&self.suspected_agent)
        .bind(self.time_since_ingestion_hours)
        .bind(self.deliberate_overdose)
        .bind(self.symptomatic)
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
        .prefix("api/toxicology_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
