#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::nerve_conduction_study_test_results::Model;

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
    pub study_type: String,
    pub region: String,
    pub laterality: String,
    pub study_adequacy: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub nerve_conduction_findings: String,
    pub emg_findings: String,
    pub carpal_tunnel_syndrome: bool,
    pub peripheral_neuropathy: bool,
    pub radiculopathy: bool,
    pub motor_neurone_disease_features: bool,
    pub myopathy: bool,
    pub neuromuscular_junction_disorder: bool,
    pub normal_study: bool,
    pub severity: String,
    pub pattern: String,
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
            "INSERT INTO nerve_conduction_study_test_results (deleted_at, patient_id, \
            clinician_id, originating_request_reference, report_status, performed_date, \
            reported_date, study_type, region, laterality, study_adequacy, clinical_history, \
            comparison_with_previous, nerve_conduction_findings, emg_findings, \
            carpal_tunnel_syndrome, peripheral_neuropathy, radiculopathy, \
            motor_neurone_disease_features, myopathy, neuromuscular_junction_disorder, \
            normal_study, severity, pattern, impression, reporting_category, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.study_type)
        .bind(&self.region)
        .bind(&self.laterality)
        .bind(&self.study_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.nerve_conduction_findings)
        .bind(&self.emg_findings)
        .bind(self.carpal_tunnel_syndrome)
        .bind(self.peripheral_neuropathy)
        .bind(self.radiculopathy)
        .bind(self.motor_neurone_disease_features)
        .bind(self.myopathy)
        .bind(self.neuromuscular_junction_disorder)
        .bind(self.normal_study)
        .bind(&self.severity)
        .bind(&self.pattern)
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
            "UPDATE nerve_conduction_study_test_results SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, originating_request_reference = $5, report_status = $6, \
            performed_date = $7, reported_date = $8, study_type = $9, region = $10, \
            laterality = $11, study_adequacy = $12, clinical_history = $13, \
            comparison_with_previous = $14, nerve_conduction_findings = $15, emg_findings = \
            $16, carpal_tunnel_syndrome = $17, peripheral_neuropathy = $18, radiculopathy = \
            $19, motor_neurone_disease_features = $20, myopathy = $21, \
            neuromuscular_junction_disorder = $22, normal_study = $23, severity = $24, \
            pattern = $25, impression = $26, reporting_category = $27, recommended_follow_up \
            = $28, critical_result_communicated = $29, reported_to = $30, updated_at = now() \
            WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.study_type)
        .bind(&self.region)
        .bind(&self.laterality)
        .bind(&self.study_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.nerve_conduction_findings)
        .bind(&self.emg_findings)
        .bind(self.carpal_tunnel_syndrome)
        .bind(self.peripheral_neuropathy)
        .bind(self.radiculopathy)
        .bind(self.motor_neurone_disease_features)
        .bind(self.myopathy)
        .bind(self.neuromuscular_junction_disorder)
        .bind(self.normal_study)
        .bind(&self.severity)
        .bind(&self.pattern)
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
        .prefix("api/nerve_conduction_study_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
