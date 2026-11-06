#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::echocardiogram_test_requests::Model;

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
    pub echo_type: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub breathlessness: bool,
    pub chest_pain: bool,
    pub palpitations: bool,
    pub syncope: bool,
    pub oedema: bool,
    pub nyha_class: String,
    pub ecg_findings: String,
    pub bnp_or_nt_probnp: Option<f64>,
    pub known_murmur: bool,
    pub previous_echo: String,
    pub previous_echo_date: Option<Date>,
    pub ejection_fraction_known: Option<f64>,
    pub on_cardiotoxic_chemotherapy: bool,
    pub relevant_medications: String,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO echocardiogram_test_requests (deleted_at, patient_id, clinician_id, \
            status, site_name, setting, referral_date, requested_by_date, echo_type, \
            primary_indication, clinical_question, relevant_history, breathlessness, \
            chest_pain, palpitations, syncope, oedema, nyha_class, ecg_findings, \
            bnp_or_nt_probnp, known_murmur, previous_echo, previous_echo_date, \
            ejection_fraction_known, on_cardiotoxic_chemotherapy, relevant_medications, \
            urgency, supervising_consultant, requester_contact, notes) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.echo_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.breathlessness)
        .bind(self.chest_pain)
        .bind(self.palpitations)
        .bind(self.syncope)
        .bind(self.oedema)
        .bind(&self.nyha_class)
        .bind(&self.ecg_findings)
        .bind(self.bnp_or_nt_probnp)
        .bind(self.known_murmur)
        .bind(&self.previous_echo)
        .bind(self.previous_echo_date)
        .bind(self.ejection_fraction_known)
        .bind(self.on_cardiotoxic_chemotherapy)
        .bind(&self.relevant_medications)
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
            "UPDATE echocardiogram_test_requests SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, status = $5, site_name = $6, setting = $7, referral_date = $8, \
            requested_by_date = $9, echo_type = $10, primary_indication = $11, \
            clinical_question = $12, relevant_history = $13, breathlessness = $14, chest_pain \
            = $15, palpitations = $16, syncope = $17, oedema = $18, nyha_class = $19, \
            ecg_findings = $20, bnp_or_nt_probnp = $21, known_murmur = $22, previous_echo = \
            $23, previous_echo_date = $24, ejection_fraction_known = $25, \
            on_cardiotoxic_chemotherapy = $26, relevant_medications = $27, urgency = $28, \
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
        .bind(&self.echo_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.breathlessness)
        .bind(self.chest_pain)
        .bind(self.palpitations)
        .bind(self.syncope)
        .bind(self.oedema)
        .bind(&self.nyha_class)
        .bind(&self.ecg_findings)
        .bind(self.bnp_or_nt_probnp)
        .bind(self.known_murmur)
        .bind(&self.previous_echo)
        .bind(self.previous_echo_date)
        .bind(self.ejection_fraction_known)
        .bind(self.on_cardiotoxic_chemotherapy)
        .bind(&self.relevant_medications)
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
        .prefix("api/echocardiogram_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
