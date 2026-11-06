#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::ct_scan_test_requests::Model;

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
    pub body_region: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub contrast_required: String,
    pub pregnancy_status: String,
    pub egfr: Option<f64>,
    pub previous_contrast_reaction: String,
    pub iodine_contrast_allergy: bool,
    pub metformin: bool,
    pub diabetes: bool,
    pub renal_impairment: bool,
    pub weight_kg: Option<f64>,
    pub relevant_previous_imaging: String,
    pub urgency: String,
    pub supervising_consultant: String,
    pub ir_me_r_justification: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO ct_scan_test_requests (deleted_at, patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, body_region, \
            primary_indication, clinical_question, relevant_history, contrast_required, \
            pregnancy_status, egfr, previous_contrast_reaction, iodine_contrast_allergy, \
            metformin, diabetes, renal_impairment, weight_kg, relevant_previous_imaging, \
            urgency, supervising_consultant, ir_me_r_justification, notes) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.body_region)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(&self.contrast_required)
        .bind(&self.pregnancy_status)
        .bind(self.egfr)
        .bind(&self.previous_contrast_reaction)
        .bind(self.iodine_contrast_allergy)
        .bind(self.metformin)
        .bind(self.diabetes)
        .bind(self.renal_impairment)
        .bind(self.weight_kg)
        .bind(&self.relevant_previous_imaging)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.ir_me_r_justification)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE ct_scan_test_requests SET deleted_at = $2, patient_id = $3, clinician_id = \
            $4, status = $5, site_name = $6, setting = $7, referral_date = $8, \
            requested_by_date = $9, body_region = $10, primary_indication = $11, \
            clinical_question = $12, relevant_history = $13, contrast_required = $14, \
            pregnancy_status = $15, egfr = $16, previous_contrast_reaction = $17, \
            iodine_contrast_allergy = $18, metformin = $19, diabetes = $20, renal_impairment \
            = $21, weight_kg = $22, relevant_previous_imaging = $23, urgency = $24, \
            supervising_consultant = $25, ir_me_r_justification = $26, notes = $27, \
            updated_at = now() WHERE id = $1 RETURNING *",
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
        .bind(&self.body_region)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(&self.contrast_required)
        .bind(&self.pregnancy_status)
        .bind(self.egfr)
        .bind(&self.previous_contrast_reaction)
        .bind(self.iodine_contrast_allergy)
        .bind(self.metformin)
        .bind(self.diabetes)
        .bind(self.renal_impairment)
        .bind(self.weight_kg)
        .bind(&self.relevant_previous_imaging)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.ir_me_r_justification)
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
        .prefix("api/ct_scan_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
