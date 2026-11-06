#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::patient_room_readiness_checklists::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub building_name_or_number: String,
    pub room_name_or_number: String,
    pub patient_cot_mattress_side_railings: bool,
    pub attendant_cot_mattress: bool,
    pub call_bell: bool,
    pub cardiac_table_iv_stand: bool,
    pub hot_kettle_glasses: bool,
    pub linen_patient_dress: bool,
    pub landline_numbers: bool,
    pub refrigerator_fan: bool,
    pub television_remote: bool,
    pub dustbin: bool,
    pub bath_towel_handtowels: bool,
    pub wc_dustbins: bool,
    pub washbasin_and_fittings: bool,
    pub bucket_and_mug: bool,
    pub geyser: bool,
    pub soap_dispenser: bool,
    pub toilet_kit: bool,
    pub window_glass_grooves: bool,
    pub sidewalls: bool,
    pub curtain_blind: bool,
    pub chair_sofa: bool,
    pub wall_seepage_water_leakage: bool,
    pub electricity_points_lights: bool,
    pub ceiling_tiles: bool,
    pub door_knobs_stopper: bool,
    pub inspector_name: String,
    pub inspector_email: String,
    pub inspection_date: Option<Date>,
    pub inspection_time: Option<String>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO patient_room_readiness_checklists (deleted_at, \
            building_name_or_number, room_name_or_number, patient_cot_mattress_side_railings, \
            attendant_cot_mattress, call_bell, cardiac_table_iv_stand, hot_kettle_glasses, \
            linen_patient_dress, landline_numbers, refrigerator_fan, television_remote, \
            dustbin, bath_towel_handtowels, wc_dustbins, washbasin_and_fittings, \
            bucket_and_mug, geyser, soap_dispenser, toilet_kit, window_glass_grooves, \
            sidewalls, curtain_blind, chair_sofa, wall_seepage_water_leakage, \
            electricity_points_lights, ceiling_tiles, door_knobs_stopper, inspector_name, \
            inspector_email, inspection_date, inspection_time) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27, $28, $29, $30, $31, $32) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(&self.building_name_or_number)
        .bind(&self.room_name_or_number)
        .bind(self.patient_cot_mattress_side_railings)
        .bind(self.attendant_cot_mattress)
        .bind(self.call_bell)
        .bind(self.cardiac_table_iv_stand)
        .bind(self.hot_kettle_glasses)
        .bind(self.linen_patient_dress)
        .bind(self.landline_numbers)
        .bind(self.refrigerator_fan)
        .bind(self.television_remote)
        .bind(self.dustbin)
        .bind(self.bath_towel_handtowels)
        .bind(self.wc_dustbins)
        .bind(self.washbasin_and_fittings)
        .bind(self.bucket_and_mug)
        .bind(self.geyser)
        .bind(self.soap_dispenser)
        .bind(self.toilet_kit)
        .bind(self.window_glass_grooves)
        .bind(self.sidewalls)
        .bind(self.curtain_blind)
        .bind(self.chair_sofa)
        .bind(self.wall_seepage_water_leakage)
        .bind(self.electricity_points_lights)
        .bind(self.ceiling_tiles)
        .bind(self.door_knobs_stopper)
        .bind(&self.inspector_name)
        .bind(&self.inspector_email)
        .bind(self.inspection_date)
        .bind(&self.inspection_time)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE patient_room_readiness_checklists SET deleted_at = $2, \
            building_name_or_number = $3, room_name_or_number = $4, \
            patient_cot_mattress_side_railings = $5, attendant_cot_mattress = $6, call_bell = \
            $7, cardiac_table_iv_stand = $8, hot_kettle_glasses = $9, linen_patient_dress = \
            $10, landline_numbers = $11, refrigerator_fan = $12, television_remote = $13, \
            dustbin = $14, bath_towel_handtowels = $15, wc_dustbins = $16, \
            washbasin_and_fittings = $17, bucket_and_mug = $18, geyser = $19, soap_dispenser \
            = $20, toilet_kit = $21, window_glass_grooves = $22, sidewalls = $23, \
            curtain_blind = $24, chair_sofa = $25, wall_seepage_water_leakage = $26, \
            electricity_points_lights = $27, ceiling_tiles = $28, door_knobs_stopper = $29, \
            inspector_name = $30, inspector_email = $31, inspection_date = $32, \
            inspection_time = $33, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(&self.building_name_or_number)
        .bind(&self.room_name_or_number)
        .bind(self.patient_cot_mattress_side_railings)
        .bind(self.attendant_cot_mattress)
        .bind(self.call_bell)
        .bind(self.cardiac_table_iv_stand)
        .bind(self.hot_kettle_glasses)
        .bind(self.linen_patient_dress)
        .bind(self.landline_numbers)
        .bind(self.refrigerator_fan)
        .bind(self.television_remote)
        .bind(self.dustbin)
        .bind(self.bath_towel_handtowels)
        .bind(self.wc_dustbins)
        .bind(self.washbasin_and_fittings)
        .bind(self.bucket_and_mug)
        .bind(self.geyser)
        .bind(self.soap_dispenser)
        .bind(self.toilet_kit)
        .bind(self.window_glass_grooves)
        .bind(self.sidewalls)
        .bind(self.curtain_blind)
        .bind(self.chair_sofa)
        .bind(self.wall_seepage_water_leakage)
        .bind(self.electricity_points_lights)
        .bind(self.ceiling_tiles)
        .bind(self.door_knobs_stopper)
        .bind(&self.inspector_name)
        .bind(&self.inspector_email)
        .bind(self.inspection_date)
        .bind(&self.inspection_time)
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
        .prefix("api/patient_room_readiness_checklists/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
