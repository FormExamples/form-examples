#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::pet_scan_test_requests::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub requested_by_date: Option<Date>,
    pub scan_type: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub primary_tumour_site: String,
    pub diabetes: bool,
    pub blood_glucose_mmol_l: Option<f64>,
    pub pregnancy_status: String,
    pub breastfeeding: bool,
    pub egfr: Option<f64>,
    pub recent_chemo_radiotherapy: String,
    pub claustrophobia: bool,
    pub weight_kg: Option<f64>,
    pub urgency: String,
    pub ir_me_r_justification: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO pet_scan_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, scan_type, \
            primary_indication, clinical_question, relevant_history, \
            primary_tumour_site, diabetes, blood_glucose_mmol_l, pregnancy_status, \
            breastfeeding, egfr, recent_chemo_radiotherapy, claustrophobia, weight_kg, \
            urgency, ir_me_r_justification, supervising_consultant, requester_contact, \
            notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, \
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.scan_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(&self.primary_tumour_site)
        .bind(self.diabetes)
        .bind(self.blood_glucose_mmol_l)
        .bind(&self.pregnancy_status)
        .bind(self.breastfeeding)
        .bind(self.egfr)
        .bind(&self.recent_chemo_radiotherapy)
        .bind(self.claustrophobia)
        .bind(self.weight_kg)
        .bind(&self.urgency)
        .bind(&self.ir_me_r_justification)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE pet_scan_test_requests SET patient_id = $2, clinician_id = $3, status \
            = $4, site_name = $5, setting = $6, referral_date = $7, requested_by_date = \
            $8, scan_type = $9, primary_indication = $10, clinical_question = $11, \
            relevant_history = $12, primary_tumour_site = $13, diabetes = $14, \
            blood_glucose_mmol_l = $15, pregnancy_status = $16, breastfeeding = $17, \
            egfr = $18, recent_chemo_radiotherapy = $19, claustrophobia = $20, weight_kg \
            = $21, urgency = $22, ir_me_r_justification = $23, supervising_consultant = \
            $24, requester_contact = $25, notes = $26, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.scan_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(&self.primary_tumour_site)
        .bind(self.diabetes)
        .bind(self.blood_glucose_mmol_l)
        .bind(&self.pregnancy_status)
        .bind(self.breastfeeding)
        .bind(self.egfr)
        .bind(&self.recent_chemo_radiotherapy)
        .bind(self.claustrophobia)
        .bind(self.weight_kg)
        .bind(&self.urgency)
        .bind(&self.ir_me_r_justification)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/pet_scan_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
