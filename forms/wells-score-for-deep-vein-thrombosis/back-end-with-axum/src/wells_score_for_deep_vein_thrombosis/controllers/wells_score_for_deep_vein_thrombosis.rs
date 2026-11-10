#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::wells_score_for_deep_vein_thromboses::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub status: String,
    pub patient_identifier: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub age_band: String,
    pub symptomatic_leg: String,
    pub active_cancer: String,
    pub paralysis_or_immobilisation: String,
    pub recently_bedridden_or_surgery: String,
    pub localised_tenderness: String,
    pub entire_leg_swollen: String,
    pub calf_swelling_over_3cm: String,
    pub pitting_oedema: String,
    pub collateral_superficial_veins: String,
    pub previously_documented_dvt: String,
    pub alternative_diagnosis_as_likely: String,
    pub clinical_notes: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO wells_score_for_deep_vein_thromboses (status, patient_identifier, \
            assessed_at, care_setting, age_band, symptomatic_leg, active_cancer, \
            paralysis_or_immobilisation, recently_bedridden_or_surgery, localised_tenderness, \
            entire_leg_swollen, calf_swelling_over_3cm, pitting_oedema, \
            collateral_superficial_veins, previously_documented_dvt, \
            alternative_diagnosis_as_likely, clinical_notes, patient_id, clinician_id) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, \
            $19) RETURNING *",
        )
        .bind(&self.status)
        .bind(&self.patient_identifier)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.age_band)
        .bind(&self.symptomatic_leg)
        .bind(&self.active_cancer)
        .bind(&self.paralysis_or_immobilisation)
        .bind(&self.recently_bedridden_or_surgery)
        .bind(&self.localised_tenderness)
        .bind(&self.entire_leg_swollen)
        .bind(&self.calf_swelling_over_3cm)
        .bind(&self.pitting_oedema)
        .bind(&self.collateral_superficial_veins)
        .bind(&self.previously_documented_dvt)
        .bind(&self.alternative_diagnosis_as_likely)
        .bind(&self.clinical_notes)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE wells_score_for_deep_vein_thromboses SET status = $2, \
            patient_identifier = $3, assessed_at = $4, care_setting = $5, age_band = $6, \
            symptomatic_leg = $7, active_cancer = $8, paralysis_or_immobilisation = $9, \
            recently_bedridden_or_surgery = $10, localised_tenderness = $11, \
            entire_leg_swollen = $12, calf_swelling_over_3cm = $13, pitting_oedema = \
            $14, collateral_superficial_veins = $15, previously_documented_dvt = $16, \
            alternative_diagnosis_as_likely = $17, clinical_notes = $18, patient_id = \
            $19, clinician_id = $20, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.status)
        .bind(&self.patient_identifier)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.age_band)
        .bind(&self.symptomatic_leg)
        .bind(&self.active_cancer)
        .bind(&self.paralysis_or_immobilisation)
        .bind(&self.recently_bedridden_or_surgery)
        .bind(&self.localised_tenderness)
        .bind(&self.entire_leg_swollen)
        .bind(&self.calf_swelling_over_3cm)
        .bind(&self.pitting_oedema)
        .bind(&self.collateral_superficial_veins)
        .bind(&self.previously_documented_dvt)
        .bind(&self.alternative_diagnosis_as_likely)
        .bind(&self.clinical_notes)
        .bind(self.patient_id)
        .bind(self.clinician_id)
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
        .prefix("api/wells_score_for_deep_vein_thromboses/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
