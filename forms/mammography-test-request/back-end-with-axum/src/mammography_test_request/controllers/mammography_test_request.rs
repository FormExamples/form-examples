#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::mammography_test_requests::Model;

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
    pub exam_type: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub laterality: String,
    pub symptom_lump: bool,
    pub symptom_pain: bool,
    pub symptom_nipple_discharge: bool,
    pub symptom_skin_change: bool,
    pub symptom_nipple_inversion: bool,
    pub previous_mammogram: String,
    pub previous_mammogram_date: Option<Date>,
    pub family_history_breast_cancer: bool,
    pub breast_implants: bool,
    pub pregnancy_or_lactating: String,
    pub hormone_replacement_therapy: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO mammography_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, exam_type, \
            primary_indication, clinical_question, relevant_history, laterality, \
            symptom_lump, symptom_pain, symptom_nipple_discharge, symptom_skin_change, \
            symptom_nipple_inversion, previous_mammogram, previous_mammogram_date, \
            family_history_breast_cancer, breast_implants, pregnancy_or_lactating, \
            hormone_replacement_therapy, urgency, supervising_consultant, \
            requester_contact, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, \
            $26, $27) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.exam_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(&self.laterality)
        .bind(self.symptom_lump)
        .bind(self.symptom_pain)
        .bind(self.symptom_nipple_discharge)
        .bind(self.symptom_skin_change)
        .bind(self.symptom_nipple_inversion)
        .bind(&self.previous_mammogram)
        .bind(self.previous_mammogram_date)
        .bind(self.family_history_breast_cancer)
        .bind(self.breast_implants)
        .bind(&self.pregnancy_or_lactating)
        .bind(self.hormone_replacement_therapy)
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
            "UPDATE mammography_test_requests SET patient_id = $2, clinician_id = $3, \
            status = $4, site_name = $5, setting = $6, referral_date = $7, \
            requested_by_date = $8, exam_type = $9, primary_indication = $10, \
            clinical_question = $11, relevant_history = $12, laterality = $13, \
            symptom_lump = $14, symptom_pain = $15, symptom_nipple_discharge = $16, \
            symptom_skin_change = $17, symptom_nipple_inversion = $18, \
            previous_mammogram = $19, previous_mammogram_date = $20, \
            family_history_breast_cancer = $21, breast_implants = $22, \
            pregnancy_or_lactating = $23, hormone_replacement_therapy = $24, urgency = \
            $25, supervising_consultant = $26, requester_contact = $27, notes = $28, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.exam_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(&self.laterality)
        .bind(self.symptom_lump)
        .bind(self.symptom_pain)
        .bind(self.symptom_nipple_discharge)
        .bind(self.symptom_skin_change)
        .bind(self.symptom_nipple_inversion)
        .bind(&self.previous_mammogram)
        .bind(self.previous_mammogram_date)
        .bind(self.family_history_breast_cancer)
        .bind(self.breast_implants)
        .bind(&self.pregnancy_or_lactating)
        .bind(self.hormone_replacement_therapy)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/mammography_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
