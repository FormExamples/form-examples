#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::breast_screenings::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub reporting_clinician_role: String,
    pub reported_at: Option<DateTimeWithTimeZone>,
    pub screening_unit: String,
    pub episode_type: String,
    pub patient_identifier: String,
    pub age_years: Option<i32>,
    pub last_screened_date: Option<Date>,
    pub higher_risk_surveillance: String,
    pub symptomatic: String,
    pub consent_given: String,
    pub views_taken: String,
    pub image_adequacy: String,
    pub first_read_opinion: String,
    pub second_read_opinion: String,
    pub arbitration_outcome: String,
    pub reading_outcome: String,
    pub assessment_performed: String,
    pub assessment_modalities: String,
    pub imaging_classification: Option<i32>,
    pub clinical_context: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO breast_screenings (patient_id, clinician_id, \
            reporting_clinician_role, reported_at, screening_unit, episode_type, \
            patient_identifier, age_years, last_screened_date, higher_risk_surveillance, \
            symptomatic, consent_given, views_taken, image_adequacy, first_read_opinion, \
            second_read_opinion, arbitration_outcome, reading_outcome, assessment_performed, \
            assessment_modalities, imaging_classification, clinical_context) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.reporting_clinician_role)
        .bind(self.reported_at)
        .bind(&self.screening_unit)
        .bind(&self.episode_type)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(self.last_screened_date)
        .bind(&self.higher_risk_surveillance)
        .bind(&self.symptomatic)
        .bind(&self.consent_given)
        .bind(&self.views_taken)
        .bind(&self.image_adequacy)
        .bind(&self.first_read_opinion)
        .bind(&self.second_read_opinion)
        .bind(&self.arbitration_outcome)
        .bind(&self.reading_outcome)
        .bind(&self.assessment_performed)
        .bind(&self.assessment_modalities)
        .bind(self.imaging_classification)
        .bind(&self.clinical_context)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE breast_screenings SET patient_id = $2, clinician_id = $3, \
            reporting_clinician_role = $4, reported_at = $5, screening_unit = $6, \
            episode_type = $7, patient_identifier = $8, age_years = $9, \
            last_screened_date = $10, higher_risk_surveillance = $11, symptomatic = $12, \
            consent_given = $13, views_taken = $14, image_adequacy = $15, \
            first_read_opinion = $16, second_read_opinion = $17, arbitration_outcome = \
            $18, reading_outcome = $19, assessment_performed = $20, \
            assessment_modalities = $21, imaging_classification = $22, clinical_context \
            = $23, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.reporting_clinician_role)
        .bind(self.reported_at)
        .bind(&self.screening_unit)
        .bind(&self.episode_type)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(self.last_screened_date)
        .bind(&self.higher_risk_surveillance)
        .bind(&self.symptomatic)
        .bind(&self.consent_given)
        .bind(&self.views_taken)
        .bind(&self.image_adequacy)
        .bind(&self.first_read_opinion)
        .bind(&self.second_read_opinion)
        .bind(&self.arbitration_outcome)
        .bind(&self.reading_outcome)
        .bind(&self.assessment_performed)
        .bind(&self.assessment_modalities)
        .bind(self.imaging_classification)
        .bind(&self.clinical_context)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/breast_screenings/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
