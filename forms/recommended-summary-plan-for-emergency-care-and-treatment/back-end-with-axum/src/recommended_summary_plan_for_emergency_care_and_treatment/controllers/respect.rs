#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::respect::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub person_name: String,
    pub date_of_birth: Option<Date>,
    pub identifier: String,
    pub address: String,
    pub key_contact: String,
    pub health_summary: String,
    pub diagnoses: String,
    pub existing_documents: String,
    pub what_matters: String,
    pub care_preferences: String,
    pub priority_balance: String,
    pub recommended_interventions: String,
    pub not_recommended_interventions: String,
    pub cpr_recommendation: String,
    pub cpr_rationale: String,
    pub cpr_discussed: String,
    pub hospital_transfer: String,
    pub critical_care_admission: String,
    pub treatment_ceilings: String,
    pub has_capacity: String,
    pub capacity_assessment: String,
    pub involvement: String,
    pub proxy_details: String,
    pub clinician_name: String,
    pub clinician_role: String,
    pub clinician_registration: String,
    pub signature: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub senior_endorsement: String,
    pub emergency_contacts: String,
    pub review_date: Option<Date>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO respect (patient_id, clinician_id, person_name, date_of_birth, \
            identifier, address, key_contact, health_summary, diagnoses, existing_documents, \
            what_matters, care_preferences, priority_balance, recommended_interventions, \
            not_recommended_interventions, cpr_recommendation, cpr_rationale, cpr_discussed, \
            hospital_transfer, critical_care_admission, treatment_ceilings, has_capacity, \
            capacity_assessment, involvement, proxy_details, clinician_name, clinician_role, \
            clinician_registration, signature, signed_at, senior_endorsement, \
            emergency_contacts, review_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, \
            $27, $28, $29, $30, $31, $32, $33) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.person_name)
        .bind(self.date_of_birth)
        .bind(&self.identifier)
        .bind(&self.address)
        .bind(&self.key_contact)
        .bind(&self.health_summary)
        .bind(&self.diagnoses)
        .bind(&self.existing_documents)
        .bind(&self.what_matters)
        .bind(&self.care_preferences)
        .bind(&self.priority_balance)
        .bind(&self.recommended_interventions)
        .bind(&self.not_recommended_interventions)
        .bind(&self.cpr_recommendation)
        .bind(&self.cpr_rationale)
        .bind(&self.cpr_discussed)
        .bind(&self.hospital_transfer)
        .bind(&self.critical_care_admission)
        .bind(&self.treatment_ceilings)
        .bind(&self.has_capacity)
        .bind(&self.capacity_assessment)
        .bind(&self.involvement)
        .bind(&self.proxy_details)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(&self.clinician_registration)
        .bind(&self.signature)
        .bind(self.signed_at)
        .bind(&self.senior_endorsement)
        .bind(&self.emergency_contacts)
        .bind(self.review_date)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE respect SET patient_id = $2, clinician_id = $3, person_name = $4, \
            date_of_birth = $5, identifier = $6, address = $7, key_contact = $8, \
            health_summary = $9, diagnoses = $10, existing_documents = $11, what_matters = \
            $12, care_preferences = $13, priority_balance = $14, recommended_interventions = \
            $15, not_recommended_interventions = $16, cpr_recommendation = $17, cpr_rationale \
            = $18, cpr_discussed = $19, hospital_transfer = $20, critical_care_admission = \
            $21, treatment_ceilings = $22, has_capacity = $23, capacity_assessment = $24, \
            involvement = $25, proxy_details = $26, clinician_name = $27, clinician_role = \
            $28, clinician_registration = $29, signature = $30, signed_at = $31, \
            senior_endorsement = $32, emergency_contacts = $33, review_date = $34, updated_at \
            = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.person_name)
        .bind(self.date_of_birth)
        .bind(&self.identifier)
        .bind(&self.address)
        .bind(&self.key_contact)
        .bind(&self.health_summary)
        .bind(&self.diagnoses)
        .bind(&self.existing_documents)
        .bind(&self.what_matters)
        .bind(&self.care_preferences)
        .bind(&self.priority_balance)
        .bind(&self.recommended_interventions)
        .bind(&self.not_recommended_interventions)
        .bind(&self.cpr_recommendation)
        .bind(&self.cpr_rationale)
        .bind(&self.cpr_discussed)
        .bind(&self.hospital_transfer)
        .bind(&self.critical_care_admission)
        .bind(&self.treatment_ceilings)
        .bind(&self.has_capacity)
        .bind(&self.capacity_assessment)
        .bind(&self.involvement)
        .bind(&self.proxy_details)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(&self.clinician_registration)
        .bind(&self.signature)
        .bind(self.signed_at)
        .bind(&self.senior_endorsement)
        .bind(&self.emergency_contacts)
        .bind(self.review_date)
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
        .prefix("api/respect/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
