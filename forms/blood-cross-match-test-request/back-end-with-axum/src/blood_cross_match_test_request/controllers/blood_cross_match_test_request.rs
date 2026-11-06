#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::blood_cross_match_test_requests::Model;

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
    pub request_type: String,
    pub component: String,
    pub units_required: Option<i32>,
    pub primary_indication: String,
    pub clinical_details: String,
    pub patient_blood_group: String,
    pub known_antibodies: bool,
    pub antibody_detail: String,
    pub previous_transfusion: bool,
    pub previous_transfusion_reaction: bool,
    pub pregnant: bool,
    pub sample_collected: String,
    pub collection_datetime: Option<DateTimeWithTimeZone>,
    pub two_sample_rule_met: bool,
    pub required_by_datetime: Option<DateTimeWithTimeZone>,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO blood_cross_match_test_requests (deleted_at, patient_id, \
            clinician_id, status, site_name, setting, referral_date, requested_by_date, \
            request_type, component, units_required, primary_indication, clinical_details, \
            patient_blood_group, known_antibodies, antibody_detail, previous_transfusion, \
            previous_transfusion_reaction, pregnant, sample_collected, collection_datetime, \
            two_sample_rule_met, required_by_datetime, urgency, supervising_consultant, \
            requester_contact, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) \
            RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.request_type)
        .bind(&self.component)
        .bind(self.units_required)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(&self.patient_blood_group)
        .bind(self.known_antibodies)
        .bind(&self.antibody_detail)
        .bind(self.previous_transfusion)
        .bind(self.previous_transfusion_reaction)
        .bind(self.pregnant)
        .bind(&self.sample_collected)
        .bind(self.collection_datetime)
        .bind(self.two_sample_rule_met)
        .bind(self.required_by_datetime)
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
            "UPDATE blood_cross_match_test_requests SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, status = $5, site_name = $6, setting = $7, referral_date = $8, \
            requested_by_date = $9, request_type = $10, component = $11, units_required = \
            $12, primary_indication = $13, clinical_details = $14, patient_blood_group = $15, \
            known_antibodies = $16, antibody_detail = $17, previous_transfusion = $18, \
            previous_transfusion_reaction = $19, pregnant = $20, sample_collected = $21, \
            collection_datetime = $22, two_sample_rule_met = $23, required_by_datetime = $24, \
            urgency = $25, supervising_consultant = $26, requester_contact = $27, notes = \
            $28, updated_at = now() WHERE id = $1 RETURNING *",
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
        .bind(&self.request_type)
        .bind(&self.component)
        .bind(self.units_required)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(&self.patient_blood_group)
        .bind(self.known_antibodies)
        .bind(&self.antibody_detail)
        .bind(self.previous_transfusion)
        .bind(self.previous_transfusion_reaction)
        .bind(self.pregnant)
        .bind(&self.sample_collected)
        .bind(self.collection_datetime)
        .bind(self.two_sample_rule_met)
        .bind(self.required_by_datetime)
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
        .prefix("api/blood_cross_match_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
