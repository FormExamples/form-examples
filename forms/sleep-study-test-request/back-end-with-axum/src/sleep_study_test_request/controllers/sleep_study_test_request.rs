#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::sleep_study_test_requests::Model;

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
    pub study_type: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub epworth_score: Option<i32>,
    pub stop_bang_score: Option<i32>,
    pub body_mass_index: Option<f64>,
    pub neck_circumference_cm: Option<f64>,
    pub witnessed_apnoeas: bool,
    pub occupational_driver: bool,
    pub cardiovascular_disease: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO sleep_study_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, study_type, \
            primary_indication, clinical_question, relevant_history, epworth_score, \
            stop_bang_score, body_mass_index, neck_circumference_cm, witnessed_apnoeas, \
            occupational_driver, cardiovascular_disease, urgency, \
            supervising_consultant, requester_contact, notes) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21, $22) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.study_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.epworth_score)
        .bind(self.stop_bang_score)
        .bind(self.body_mass_index)
        .bind(self.neck_circumference_cm)
        .bind(self.witnessed_apnoeas)
        .bind(self.occupational_driver)
        .bind(self.cardiovascular_disease)
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
            "UPDATE sleep_study_test_requests SET patient_id = $2, clinician_id = $3, \
            status = $4, site_name = $5, setting = $6, referral_date = $7, \
            requested_by_date = $8, study_type = $9, primary_indication = $10, \
            clinical_question = $11, relevant_history = $12, epworth_score = $13, \
            stop_bang_score = $14, body_mass_index = $15, neck_circumference_cm = $16, \
            witnessed_apnoeas = $17, occupational_driver = $18, cardiovascular_disease = \
            $19, urgency = $20, supervising_consultant = $21, requester_contact = $22, \
            notes = $23, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.study_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.epworth_score)
        .bind(self.stop_bang_score)
        .bind(self.body_mass_index)
        .bind(self.neck_circumference_cm)
        .bind(self.witnessed_apnoeas)
        .bind(self.occupational_driver)
        .bind(self.cardiovascular_disease)
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
        .prefix("api/sleep_study_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
