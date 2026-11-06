#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hearing_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub test_type: String,
    pub test_reliability: String,
    pub clinical_history: String,
    pub pure_tone_average_right_db: Option<f64>,
    pub pure_tone_average_left_db: Option<f64>,
    pub hearing_loss_type_right: String,
    pub hearing_loss_type_left: String,
    pub hearing_loss_severity_right: String,
    pub hearing_loss_severity_left: String,
    pub tympanometry_type_right: String,
    pub tympanometry_type_left: String,
    pub hearing_loss_present: bool,
    pub asymmetric_loss: bool,
    pub sudden_sensorineural_loss: bool,
    pub conductive_component: bool,
    pub normal_hearing: bool,
    pub findings_narrative: String,
    pub impression: String,
    pub reporting_category: String,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hearing_test_results (deleted_at, patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            test_type, test_reliability, clinical_history, pure_tone_average_right_db, \
            pure_tone_average_left_db, hearing_loss_type_right, hearing_loss_type_left, \
            hearing_loss_severity_right, hearing_loss_severity_left, tympanometry_type_right, \
            tympanometry_type_left, hearing_loss_present, asymmetric_loss, \
            sudden_sensorineural_loss, conductive_component, normal_hearing, \
            findings_narrative, impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28, $29) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.test_type)
        .bind(&self.test_reliability)
        .bind(&self.clinical_history)
        .bind(self.pure_tone_average_right_db)
        .bind(self.pure_tone_average_left_db)
        .bind(&self.hearing_loss_type_right)
        .bind(&self.hearing_loss_type_left)
        .bind(&self.hearing_loss_severity_right)
        .bind(&self.hearing_loss_severity_left)
        .bind(&self.tympanometry_type_right)
        .bind(&self.tympanometry_type_left)
        .bind(self.hearing_loss_present)
        .bind(self.asymmetric_loss)
        .bind(self.sudden_sensorineural_loss)
        .bind(self.conductive_component)
        .bind(self.normal_hearing)
        .bind(&self.findings_narrative)
        .bind(&self.impression)
        .bind(&self.reporting_category)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hearing_test_results SET deleted_at = $2, patient_id = $3, clinician_id = \
            $4, originating_request_reference = $5, report_status = $6, performed_date = $7, \
            reported_date = $8, test_type = $9, test_reliability = $10, clinical_history = \
            $11, pure_tone_average_right_db = $12, pure_tone_average_left_db = $13, \
            hearing_loss_type_right = $14, hearing_loss_type_left = $15, \
            hearing_loss_severity_right = $16, hearing_loss_severity_left = $17, \
            tympanometry_type_right = $18, tympanometry_type_left = $19, hearing_loss_present \
            = $20, asymmetric_loss = $21, sudden_sensorineural_loss = $22, \
            conductive_component = $23, normal_hearing = $24, findings_narrative = $25, \
            impression = $26, reporting_category = $27, recommended_follow_up = $28, \
            critical_result_communicated = $29, reported_to = $30, updated_at = now() WHERE \
            id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.test_type)
        .bind(&self.test_reliability)
        .bind(&self.clinical_history)
        .bind(self.pure_tone_average_right_db)
        .bind(self.pure_tone_average_left_db)
        .bind(&self.hearing_loss_type_right)
        .bind(&self.hearing_loss_type_left)
        .bind(&self.hearing_loss_severity_right)
        .bind(&self.hearing_loss_severity_left)
        .bind(&self.tympanometry_type_right)
        .bind(&self.tympanometry_type_left)
        .bind(self.hearing_loss_present)
        .bind(self.asymmetric_loss)
        .bind(self.sudden_sensorineural_loss)
        .bind(self.conductive_component)
        .bind(self.normal_hearing)
        .bind(&self.findings_narrative)
        .bind(&self.impression)
        .bind(&self.reporting_category)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
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
        .prefix("api/hearing_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
