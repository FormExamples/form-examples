#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::newborn_blood_spot_screenings::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub sample_taker_role: String,
    pub care_setting: String,
    pub record_date: Option<Date>,
    pub time_of_birth: Option<String>,
    pub gestation_weeks: Option<f64>,
    pub previously_screened: String,
    pub consent_given: String,
    pub decline_reason: String,
    pub sample_date: Option<Date>,
    pub sample_time: Option<String>,
    pub age_at_sample_days: Option<i32>,
    pub sampling_site: String,
    pub sample_notes: String,
    pub sample_adequacy: String,
    pub spot_quality_issue: String,
    pub is_repeat: String,
    pub repeat_reason: String,
    pub scd_result: String,
    pub cf_result: String,
    pub cht_result: String,
    pub pku_result: String,
    pub mcadd_result: String,
    pub msud_result: String,
    pub iva_result: String,
    pub ga1_result: String,
    pub hcu_result: String,
    pub clinical_context: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO newborn_blood_spot_screenings (patient_id, clinician_id, \
            sample_taker_role, care_setting, record_date, time_of_birth, gestation_weeks, \
            previously_screened, consent_given, decline_reason, sample_date, sample_time, \
            age_at_sample_days, sampling_site, sample_notes, sample_adequacy, \
            spot_quality_issue, is_repeat, repeat_reason, scd_result, cf_result, cht_result, \
            pku_result, mcadd_result, msud_result, iva_result, ga1_result, hcu_result, \
            clinical_context) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29) \
            RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.sample_taker_role)
        .bind(&self.care_setting)
        .bind(self.record_date)
        .bind(&self.time_of_birth)
        .bind(self.gestation_weeks)
        .bind(&self.previously_screened)
        .bind(&self.consent_given)
        .bind(&self.decline_reason)
        .bind(self.sample_date)
        .bind(&self.sample_time)
        .bind(self.age_at_sample_days)
        .bind(&self.sampling_site)
        .bind(&self.sample_notes)
        .bind(&self.sample_adequacy)
        .bind(&self.spot_quality_issue)
        .bind(&self.is_repeat)
        .bind(&self.repeat_reason)
        .bind(&self.scd_result)
        .bind(&self.cf_result)
        .bind(&self.cht_result)
        .bind(&self.pku_result)
        .bind(&self.mcadd_result)
        .bind(&self.msud_result)
        .bind(&self.iva_result)
        .bind(&self.ga1_result)
        .bind(&self.hcu_result)
        .bind(&self.clinical_context)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE newborn_blood_spot_screenings SET patient_id = $2, clinician_id = $3, \
            sample_taker_role = $4, care_setting = $5, record_date = $6, time_of_birth = \
            $7, gestation_weeks = $8, previously_screened = $9, consent_given = $10, \
            decline_reason = $11, sample_date = $12, sample_time = $13, \
            age_at_sample_days = $14, sampling_site = $15, sample_notes = $16, \
            sample_adequacy = $17, spot_quality_issue = $18, is_repeat = $19, \
            repeat_reason = $20, scd_result = $21, cf_result = $22, cht_result = $23, \
            pku_result = $24, mcadd_result = $25, msud_result = $26, iva_result = $27, \
            ga1_result = $28, hcu_result = $29, clinical_context = $30, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.sample_taker_role)
        .bind(&self.care_setting)
        .bind(self.record_date)
        .bind(&self.time_of_birth)
        .bind(self.gestation_weeks)
        .bind(&self.previously_screened)
        .bind(&self.consent_given)
        .bind(&self.decline_reason)
        .bind(self.sample_date)
        .bind(&self.sample_time)
        .bind(self.age_at_sample_days)
        .bind(&self.sampling_site)
        .bind(&self.sample_notes)
        .bind(&self.sample_adequacy)
        .bind(&self.spot_quality_issue)
        .bind(&self.is_repeat)
        .bind(&self.repeat_reason)
        .bind(&self.scd_result)
        .bind(&self.cf_result)
        .bind(&self.cht_result)
        .bind(&self.pku_result)
        .bind(&self.mcadd_result)
        .bind(&self.msud_result)
        .bind(&self.iva_result)
        .bind(&self.ga1_result)
        .bind(&self.hcu_result)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/newborn_blood_spot_screenings/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
