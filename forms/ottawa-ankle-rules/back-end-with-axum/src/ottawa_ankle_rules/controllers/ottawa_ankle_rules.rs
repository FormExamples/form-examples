#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::ottawa_ankle_rules::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub status: String,
    pub patient_identifier: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub injured_side: String,
    pub hours_since_injury: Option<f64>,
    pub age_years: Option<i32>,
    pub sex: String,
    pub assessment_reliable: String,
    pub malleolar_zone_pain: String,
    pub lateral_malleolus_tenderness: String,
    pub medial_malleolus_tenderness: String,
    pub midfoot_zone_pain: String,
    pub fifth_metatarsal_base_tenderness: String,
    pub navicular_tenderness: String,
    pub able_to_bear_weight_immediately: String,
    pub able_to_bear_weight_now: String,
    pub clinical_notes: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO ottawa_ankle_rules (status, patient_identifier, assessed_at, \
            care_setting, injured_side, hours_since_injury, age_years, sex, \
            assessment_reliable, malleolar_zone_pain, lateral_malleolus_tenderness, \
            medial_malleolus_tenderness, midfoot_zone_pain, fifth_metatarsal_base_tenderness, \
            navicular_tenderness, able_to_bear_weight_immediately, able_to_bear_weight_now, \
            clinical_notes, patient_id, clinician_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *",
        )
        .bind(&self.status)
        .bind(&self.patient_identifier)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.injured_side)
        .bind(self.hours_since_injury)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.assessment_reliable)
        .bind(&self.malleolar_zone_pain)
        .bind(&self.lateral_malleolus_tenderness)
        .bind(&self.medial_malleolus_tenderness)
        .bind(&self.midfoot_zone_pain)
        .bind(&self.fifth_metatarsal_base_tenderness)
        .bind(&self.navicular_tenderness)
        .bind(&self.able_to_bear_weight_immediately)
        .bind(&self.able_to_bear_weight_now)
        .bind(&self.clinical_notes)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE ottawa_ankle_rules SET status = $2, patient_identifier = $3, \
            assessed_at = $4, care_setting = $5, injured_side = $6, hours_since_injury = \
            $7, age_years = $8, sex = $9, assessment_reliable = $10, malleolar_zone_pain \
            = $11, lateral_malleolus_tenderness = $12, medial_malleolus_tenderness = \
            $13, midfoot_zone_pain = $14, fifth_metatarsal_base_tenderness = $15, \
            navicular_tenderness = $16, able_to_bear_weight_immediately = $17, \
            able_to_bear_weight_now = $18, clinical_notes = $19, patient_id = $20, \
            clinician_id = $21, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(&self.status)
        .bind(&self.patient_identifier)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.injured_side)
        .bind(self.hours_since_injury)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.assessment_reliable)
        .bind(&self.malleolar_zone_pain)
        .bind(&self.lateral_malleolus_tenderness)
        .bind(&self.medial_malleolus_tenderness)
        .bind(&self.midfoot_zone_pain)
        .bind(&self.fifth_metatarsal_base_tenderness)
        .bind(&self.navicular_tenderness)
        .bind(&self.able_to_bear_weight_immediately)
        .bind(&self.able_to_bear_weight_now)
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
        .prefix("api/ottawa_ankle_rules/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
