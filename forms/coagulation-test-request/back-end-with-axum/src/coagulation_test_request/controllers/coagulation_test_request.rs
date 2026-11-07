#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::coagulation_test_requests::Model;

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
    pub prothrombin_time_inr: bool,
    pub activated_partial_thromboplastin_time: bool,
    pub fibrinogen: bool,
    pub d_dimer: bool,
    pub thrombophilia_screen: bool,
    pub factor_assays: bool,
    pub anti_xa_assay: bool,
    pub mixing_studies: bool,
    pub von_willebrand_screen: bool,
    pub primary_indication: String,
    pub clinical_details: String,
    pub on_anticoagulant: bool,
    pub anticoagulant_agent: String,
    pub bleeding_history: bool,
    pub thrombosis_history: bool,
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
            "INSERT INTO coagulation_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, prothrombin_time_inr, \
            activated_partial_thromboplastin_time, fibrinogen, d_dimer, \
            thrombophilia_screen, factor_assays, anti_xa_assay, mixing_studies, \
            von_willebrand_screen, primary_indication, clinical_details, \
            on_anticoagulant, anticoagulant_agent, bleeding_history, thrombosis_history, \
            specimen_collected, collection_datetime, urgency, supervising_consultant, \
            requester_contact, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, \
            $26, $27, $28) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(self.prothrombin_time_inr)
        .bind(self.activated_partial_thromboplastin_time)
        .bind(self.fibrinogen)
        .bind(self.d_dimer)
        .bind(self.thrombophilia_screen)
        .bind(self.factor_assays)
        .bind(self.anti_xa_assay)
        .bind(self.mixing_studies)
        .bind(self.von_willebrand_screen)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(self.on_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.bleeding_history)
        .bind(self.thrombosis_history)
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
            "UPDATE coagulation_test_requests SET patient_id = $2, clinician_id = $3, \
            status = $4, site_name = $5, setting = $6, referral_date = $7, \
            requested_by_date = $8, prothrombin_time_inr = $9, \
            activated_partial_thromboplastin_time = $10, fibrinogen = $11, d_dimer = \
            $12, thrombophilia_screen = $13, factor_assays = $14, anti_xa_assay = $15, \
            mixing_studies = $16, von_willebrand_screen = $17, primary_indication = $18, \
            clinical_details = $19, on_anticoagulant = $20, anticoagulant_agent = $21, \
            bleeding_history = $22, thrombosis_history = $23, specimen_collected = $24, \
            collection_datetime = $25, urgency = $26, supervising_consultant = $27, \
            requester_contact = $28, notes = $29, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(self.prothrombin_time_inr)
        .bind(self.activated_partial_thromboplastin_time)
        .bind(self.fibrinogen)
        .bind(self.d_dimer)
        .bind(self.thrombophilia_screen)
        .bind(self.factor_assays)
        .bind(self.anti_xa_assay)
        .bind(self.mixing_studies)
        .bind(self.von_willebrand_screen)
        .bind(&self.primary_indication)
        .bind(&self.clinical_details)
        .bind(self.on_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.bleeding_history)
        .bind(self.thrombosis_history)
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
        .prefix("api/coagulation_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
