#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::genetic_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub test_type: String,
    pub genes_tested: String,
    pub sample_type: String,
    pub clinical_history: String,
    pub inheritance_pattern: String,
    pub variants_detected: String,
    pub variant_classification: String,
    pub zygosity: String,
    pub pathogenic_variant_found: bool,
    pub vus_found: bool,
    pub carrier_status_positive: bool,
    pub secondary_finding: bool,
    pub no_clinically_significant_variant: bool,
    pub interpretation: String,
    pub impression: String,
    pub reporting_category: String,
    pub recommended_cascade_testing: bool,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO genetic_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            test_type, genes_tested, sample_type, clinical_history, inheritance_pattern, \
            variants_detected, variant_classification, zygosity, \
            pathogenic_variant_found, vus_found, carrier_status_positive, \
            secondary_finding, no_clinically_significant_variant, interpretation, \
            impression, reporting_category, recommended_cascade_testing, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.test_type)
        .bind(&self.genes_tested)
        .bind(&self.sample_type)
        .bind(&self.clinical_history)
        .bind(&self.inheritance_pattern)
        .bind(&self.variants_detected)
        .bind(&self.variant_classification)
        .bind(&self.zygosity)
        .bind(self.pathogenic_variant_found)
        .bind(self.vus_found)
        .bind(self.carrier_status_positive)
        .bind(self.secondary_finding)
        .bind(self.no_clinically_significant_variant)
        .bind(&self.interpretation)
        .bind(&self.impression)
        .bind(&self.reporting_category)
        .bind(self.recommended_cascade_testing)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE genetic_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, test_type = $8, genes_tested = $9, sample_type = $10, \
            clinical_history = $11, inheritance_pattern = $12, variants_detected = $13, \
            variant_classification = $14, zygosity = $15, pathogenic_variant_found = \
            $16, vus_found = $17, carrier_status_positive = $18, secondary_finding = \
            $19, no_clinically_significant_variant = $20, interpretation = $21, \
            impression = $22, reporting_category = $23, recommended_cascade_testing = \
            $24, recommended_follow_up = $25, critical_result_communicated = $26, \
            reported_to = $27, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.test_type)
        .bind(&self.genes_tested)
        .bind(&self.sample_type)
        .bind(&self.clinical_history)
        .bind(&self.inheritance_pattern)
        .bind(&self.variants_detected)
        .bind(&self.variant_classification)
        .bind(&self.zygosity)
        .bind(self.pathogenic_variant_found)
        .bind(self.vus_found)
        .bind(self.carrier_status_positive)
        .bind(self.secondary_finding)
        .bind(self.no_clinically_significant_variant)
        .bind(&self.interpretation)
        .bind(&self.impression)
        .bind(&self.reporting_category)
        .bind(self.recommended_cascade_testing)
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
        .prefix("api/genetic_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
