#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_primary_surveys::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub casualty_card_id: Uuid,
    pub airway_status: String,
    pub airway_adjuncts: String,
    pub c_spine_immobilised: String,
    pub breathing_effort: String,
    pub chest_movement: String,
    pub breath_sounds: String,
    pub trachea_position: String,
    pub pulse_character: String,
    pub skin_colour: String,
    pub skin_temperature: String,
    pub capillary_refill: String,
    pub haemorrhage: String,
    pub iv_access: String,
    pub gcs_eye: Option<i32>,
    pub gcs_verbal: Option<i32>,
    pub gcs_motor: Option<i32>,
    pub gcs_total: Option<i32>,
    pub pupils: String,
    pub blood_glucose_disability: String,
    pub limb_movements: String,
    pub skin_examination: String,
    pub injuries_identified: String,
    pub log_roll_findings: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO casualty_card_primary_surveys (deleted_at, casualty_card_id, \
            airway_status, airway_adjuncts, c_spine_immobilised, breathing_effort, \
            chest_movement, breath_sounds, trachea_position, pulse_character, skin_colour, \
            skin_temperature, capillary_refill, haemorrhage, iv_access, gcs_eye, gcs_verbal, \
            gcs_motor, gcs_total, pupils, blood_glucose_disability, limb_movements, \
            skin_examination, injuries_identified, log_roll_findings) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, \
            $22, $23, $24, $25) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.casualty_card_id)
        .bind(&self.airway_status)
        .bind(&self.airway_adjuncts)
        .bind(&self.c_spine_immobilised)
        .bind(&self.breathing_effort)
        .bind(&self.chest_movement)
        .bind(&self.breath_sounds)
        .bind(&self.trachea_position)
        .bind(&self.pulse_character)
        .bind(&self.skin_colour)
        .bind(&self.skin_temperature)
        .bind(&self.capillary_refill)
        .bind(&self.haemorrhage)
        .bind(&self.iv_access)
        .bind(self.gcs_eye)
        .bind(self.gcs_verbal)
        .bind(self.gcs_motor)
        .bind(self.gcs_total)
        .bind(&self.pupils)
        .bind(&self.blood_glucose_disability)
        .bind(&self.limb_movements)
        .bind(&self.skin_examination)
        .bind(&self.injuries_identified)
        .bind(&self.log_roll_findings)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE casualty_card_primary_surveys SET deleted_at = $2, casualty_card_id = $3, \
            airway_status = $4, airway_adjuncts = $5, c_spine_immobilised = $6, \
            breathing_effort = $7, chest_movement = $8, breath_sounds = $9, trachea_position \
            = $10, pulse_character = $11, skin_colour = $12, skin_temperature = $13, \
            capillary_refill = $14, haemorrhage = $15, iv_access = $16, gcs_eye = $17, \
            gcs_verbal = $18, gcs_motor = $19, gcs_total = $20, pupils = $21, \
            blood_glucose_disability = $22, limb_movements = $23, skin_examination = $24, \
            injuries_identified = $25, log_roll_findings = $26, updated_at = now() WHERE id = \
            $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.casualty_card_id)
        .bind(&self.airway_status)
        .bind(&self.airway_adjuncts)
        .bind(&self.c_spine_immobilised)
        .bind(&self.breathing_effort)
        .bind(&self.chest_movement)
        .bind(&self.breath_sounds)
        .bind(&self.trachea_position)
        .bind(&self.pulse_character)
        .bind(&self.skin_colour)
        .bind(&self.skin_temperature)
        .bind(&self.capillary_refill)
        .bind(&self.haemorrhage)
        .bind(&self.iv_access)
        .bind(self.gcs_eye)
        .bind(self.gcs_verbal)
        .bind(self.gcs_motor)
        .bind(self.gcs_total)
        .bind(&self.pupils)
        .bind(&self.blood_glucose_disability)
        .bind(&self.limb_movements)
        .bind(&self.skin_examination)
        .bind(&self.injuries_identified)
        .bind(&self.log_roll_findings)
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
        .prefix("api/casualty_card_primary_surveys/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
