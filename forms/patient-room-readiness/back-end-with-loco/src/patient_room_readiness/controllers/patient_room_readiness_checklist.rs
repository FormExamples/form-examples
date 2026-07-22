#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::patient_room_readiness_checklists::{ActiveModel, Entity, Model};

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
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.building_name_or_number = Set(self.building_name_or_number.clone());
      item.room_name_or_number = Set(self.room_name_or_number.clone());
      item.patient_cot_mattress_side_railings = Set(self.patient_cot_mattress_side_railings);
      item.attendant_cot_mattress = Set(self.attendant_cot_mattress);
      item.call_bell = Set(self.call_bell);
      item.cardiac_table_iv_stand = Set(self.cardiac_table_iv_stand);
      item.hot_kettle_glasses = Set(self.hot_kettle_glasses);
      item.linen_patient_dress = Set(self.linen_patient_dress);
      item.landline_numbers = Set(self.landline_numbers);
      item.refrigerator_fan = Set(self.refrigerator_fan);
      item.television_remote = Set(self.television_remote);
      item.dustbin = Set(self.dustbin);
      item.bath_towel_handtowels = Set(self.bath_towel_handtowels);
      item.wc_dustbins = Set(self.wc_dustbins);
      item.washbasin_and_fittings = Set(self.washbasin_and_fittings);
      item.bucket_and_mug = Set(self.bucket_and_mug);
      item.geyser = Set(self.geyser);
      item.soap_dispenser = Set(self.soap_dispenser);
      item.toilet_kit = Set(self.toilet_kit);
      item.window_glass_grooves = Set(self.window_glass_grooves);
      item.sidewalls = Set(self.sidewalls);
      item.curtain_blind = Set(self.curtain_blind);
      item.chair_sofa = Set(self.chair_sofa);
      item.wall_seepage_water_leakage = Set(self.wall_seepage_water_leakage);
      item.electricity_points_lights = Set(self.electricity_points_lights);
      item.ceiling_tiles = Set(self.ceiling_tiles);
      item.door_knobs_stopper = Set(self.door_knobs_stopper);
      item.inspector_name = Set(self.inspector_name.clone());
      item.inspector_email = Set(self.inspector_email.clone());
      item.inspection_date = Set(self.inspection_date);
      item.inspection_time = Set(self.inspection_time.clone());
      }
}

async fn load_item(ctx: &AppContext, id: i32) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    format::json(Entity::find().all(&ctx.db).await?)
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
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
