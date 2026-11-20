#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_primary_surveys::Model;
use crate::support::validation::{TEXT_MAX, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub casualty_card_id: Uuid,
    #[validate(length(max = TEXT_MAX))]
    pub airway_status: String,
    #[validate(length(max = TEXT_MAX))]
    pub airway_adjuncts: String,
    #[validate(length(max = TEXT_MAX))]
    pub c_spine_immobilised: String,
    #[validate(length(max = TEXT_MAX))]
    pub breathing_effort: String,
    #[validate(length(max = TEXT_MAX))]
    pub chest_movement: String,
    #[validate(length(max = TEXT_MAX))]
    pub breath_sounds: String,
    #[validate(length(max = TEXT_MAX))]
    pub trachea_position: String,
    #[validate(length(max = TEXT_MAX))]
    pub pulse_character: String,
    #[validate(length(max = TEXT_MAX))]
    pub skin_colour: String,
    #[validate(length(max = TEXT_MAX))]
    pub skin_temperature: String,
    #[validate(length(max = TEXT_MAX))]
    pub capillary_refill: String,
    #[validate(length(max = TEXT_MAX))]
    pub haemorrhage: String,
    #[validate(length(max = TEXT_MAX))]
    pub iv_access: String,
    pub gcs_eye: Option<i32>,
    pub gcs_verbal: Option<i32>,
    pub gcs_motor: Option<i32>,
    pub gcs_total: Option<i32>,
    #[validate(length(max = TEXT_MAX))]
    pub pupils: String,
    #[validate(length(max = TEXT_MAX))]
    pub blood_glucose_disability: String,
    #[validate(length(max = TEXT_MAX))]
    pub limb_movements: String,
    #[validate(length(max = TEXT_MAX))]
    pub skin_examination: String,
    #[validate(length(max = TEXT_MAX))]
    pub injuries_identified: String,
    #[validate(length(max = TEXT_MAX))]
    pub log_roll_findings: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO casualty_card_primary_surveys (casualty_card_id, airway_status, \
            airway_adjuncts, c_spine_immobilised, breathing_effort, chest_movement, \
            breath_sounds, trachea_position, pulse_character, skin_colour, \
            skin_temperature, capillary_refill, haemorrhage, iv_access, gcs_eye, \
            gcs_verbal, gcs_motor, gcs_total, pupils, blood_glucose_disability, \
            limb_movements, skin_examination, injuries_identified, log_roll_findings) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *",
        )
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
            "UPDATE casualty_card_primary_surveys SET casualty_card_id = $2, \
            airway_status = $3, airway_adjuncts = $4, c_spine_immobilised = $5, \
            breathing_effort = $6, chest_movement = $7, breath_sounds = $8, \
            trachea_position = $9, pulse_character = $10, skin_colour = $11, \
            skin_temperature = $12, capillary_refill = $13, haemorrhage = $14, iv_access \
            = $15, gcs_eye = $16, gcs_verbal = $17, gcs_motor = $18, gcs_total = $19, \
            pupils = $20, blood_glucose_disability = $21, limb_movements = $22, \
            skin_examination = $23, injuries_identified = $24, log_roll_findings = $25, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
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
        .prefix("api/casualty-card-form/casualty_card_primary_surveys/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
