#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::allergy_skin_test_requests::Model;

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
    pub test_type: String,
    pub allergen_aeroallergens: bool,
    pub allergen_food: bool,
    pub allergen_drug: bool,
    pub allergen_venom: bool,
    pub allergen_latex: bool,
    pub allergen_contact: bool,
    pub primary_indication: String,
    pub clinical_question: String,
    pub clinical_details: String,
    pub previous_anaphylaxis: bool,
    pub on_antihistamines: bool,
    pub on_beta_blocker: bool,
    pub current_skin_disease: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO allergy_skin_test_requests (deleted_at, patient_id, clinician_id, \
            status, site_name, setting, referral_date, requested_by_date, test_type, \
            allergen_aeroallergens, allergen_food, allergen_drug, allergen_venom, \
            allergen_latex, allergen_contact, primary_indication, clinical_question, \
            clinical_details, previous_anaphylaxis, on_antihistamines, on_beta_blocker, \
            current_skin_disease, urgency, supervising_consultant, requester_contact, notes) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, \
            $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.test_type)
        .bind(self.allergen_aeroallergens)
        .bind(self.allergen_food)
        .bind(self.allergen_drug)
        .bind(self.allergen_venom)
        .bind(self.allergen_latex)
        .bind(self.allergen_contact)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.clinical_details)
        .bind(self.previous_anaphylaxis)
        .bind(self.on_antihistamines)
        .bind(self.on_beta_blocker)
        .bind(self.current_skin_disease)
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
            "UPDATE allergy_skin_test_requests SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, status = $5, site_name = $6, setting = $7, referral_date = $8, \
            requested_by_date = $9, test_type = $10, allergen_aeroallergens = $11, \
            allergen_food = $12, allergen_drug = $13, allergen_venom = $14, allergen_latex = \
            $15, allergen_contact = $16, primary_indication = $17, clinical_question = $18, \
            clinical_details = $19, previous_anaphylaxis = $20, on_antihistamines = $21, \
            on_beta_blocker = $22, current_skin_disease = $23, urgency = $24, \
            supervising_consultant = $25, requester_contact = $26, notes = $27, updated_at = \
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
        .bind(&self.test_type)
        .bind(self.allergen_aeroallergens)
        .bind(self.allergen_food)
        .bind(self.allergen_drug)
        .bind(self.allergen_venom)
        .bind(self.allergen_latex)
        .bind(self.allergen_contact)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.clinical_details)
        .bind(self.previous_anaphylaxis)
        .bind(self.on_antihistamines)
        .bind(self.on_beta_blocker)
        .bind(self.current_skin_disease)
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
        .prefix("api/allergy_skin_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
