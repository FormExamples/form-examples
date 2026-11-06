#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::bowel_cancer_screening_fits::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub reviewed_at: Option<DateTimeWithTimeZone>,
    pub screening_hub: String,
    pub participant_identifier: String,
    pub age: Option<i32>,
    pub within_age_range: String,
    pub recall_interval: String,
    pub invitation_date: Option<Date>,
    pub previous_outcome: String,
    pub last_screen_date: Option<Date>,
    pub kit_returned: String,
    pub return_date: Option<Date>,
    pub sample_adequacy: String,
    pub spoilt_reason: String,
    pub faecal_haemoglobin_ug_g: Option<f64>,
    pub assay: String,
    pub threshold_applied: Option<f64>,
    pub red_flag_symptoms: String,
    pub clinical_note: String,
    pub context: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO bowel_cancer_screening_fits (patient_id, clinician_id, reviewed_at, \
            screening_hub, participant_identifier, age, within_age_range, recall_interval, \
            invitation_date, previous_outcome, last_screen_date, kit_returned, return_date, \
            sample_adequacy, spoilt_reason, faecal_haemoglobin_ug_g, assay, \
            threshold_applied, red_flag_symptoms, clinical_note, context) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.reviewed_at)
        .bind(&self.screening_hub)
        .bind(&self.participant_identifier)
        .bind(self.age)
        .bind(&self.within_age_range)
        .bind(&self.recall_interval)
        .bind(self.invitation_date)
        .bind(&self.previous_outcome)
        .bind(self.last_screen_date)
        .bind(&self.kit_returned)
        .bind(self.return_date)
        .bind(&self.sample_adequacy)
        .bind(&self.spoilt_reason)
        .bind(self.faecal_haemoglobin_ug_g)
        .bind(&self.assay)
        .bind(self.threshold_applied)
        .bind(&self.red_flag_symptoms)
        .bind(&self.clinical_note)
        .bind(&self.context)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE bowel_cancer_screening_fits SET patient_id = $2, clinician_id = $3, \
            reviewed_at = $4, screening_hub = $5, participant_identifier = $6, age = $7, \
            within_age_range = $8, recall_interval = $9, invitation_date = $10, \
            previous_outcome = $11, last_screen_date = $12, kit_returned = $13, return_date = \
            $14, sample_adequacy = $15, spoilt_reason = $16, faecal_haemoglobin_ug_g = $17, \
            assay = $18, threshold_applied = $19, red_flag_symptoms = $20, clinical_note = \
            $21, context = $22, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.reviewed_at)
        .bind(&self.screening_hub)
        .bind(&self.participant_identifier)
        .bind(self.age)
        .bind(&self.within_age_range)
        .bind(&self.recall_interval)
        .bind(self.invitation_date)
        .bind(&self.previous_outcome)
        .bind(self.last_screen_date)
        .bind(&self.kit_returned)
        .bind(self.return_date)
        .bind(&self.sample_adequacy)
        .bind(&self.spoilt_reason)
        .bind(self.faecal_haemoglobin_ug_g)
        .bind(&self.assay)
        .bind(self.threshold_applied)
        .bind(&self.red_flag_symptoms)
        .bind(&self.clinical_note)
        .bind(&self.context)
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
        .prefix("api/bowel_cancer_screening_fits/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
