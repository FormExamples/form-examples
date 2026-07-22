//! Patient reported outcome measures score module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::patient_reported_outcome_measures_scores::{ActiveModel, Entity, Model};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Deleted at.
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Patient reported outcome measures ID.
    pub patient_reported_outcome_measures_id: i32,
    /// Sf36 pf.
    pub sf36_pf: Option<f64>,
    /// Sf36 rp.
    pub sf36_rp: Option<f64>,
    /// Sf36 BP.
    pub sf36_bp: Option<f64>,
    /// Sf36 gh.
    pub sf36_gh: Option<f64>,
    /// Sf36 vt.
    pub sf36_vt: Option<f64>,
    /// Sf36 sf.
    pub sf36_sf: Option<f64>,
    /// Sf36 re.
    pub sf36_re: Option<f64>,
    /// Sf36 mh.
    pub sf36_mh: Option<f64>,
    /// Sf36 pcs approx.
    pub sf36_pcs_approx: Option<f64>,
    /// Sf36 mcs approx.
    pub sf36_mcs_approx: Option<f64>,
    /// Ndi raw score.
    pub ndi_raw_score: Option<i32>,
    /// Ndi answered sections.
    pub ndi_answered_sections: Option<i32>,
    /// Ndi percentage score.
    pub ndi_percentage_score: Option<f64>,
    /// Ndi band.
    pub ndi_band: String,
    /// Mjoa total score.
    pub mjoa_total_score: Option<i32>,
    /// Mjoa band.
    pub mjoa_band: String,
    /// Eq5d health state descriptor.
    pub eq5d_health_state_descriptor: String,
    /// Eq5d uk index value.
    pub eq5d_uk_index_value: Option<f64>,
    /// Eq5d vas score.
    pub eq5d_vas_score: Option<f64>,
    }

impl Params {
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.patient_reported_outcome_measures_id = Set(self.patient_reported_outcome_measures_id);
      item.sf36_pf = Set(self.sf36_pf);
      item.sf36_rp = Set(self.sf36_rp);
      item.sf36_bp = Set(self.sf36_bp);
      item.sf36_gh = Set(self.sf36_gh);
      item.sf36_vt = Set(self.sf36_vt);
      item.sf36_sf = Set(self.sf36_sf);
      item.sf36_re = Set(self.sf36_re);
      item.sf36_mh = Set(self.sf36_mh);
      item.sf36_pcs_approx = Set(self.sf36_pcs_approx);
      item.sf36_mcs_approx = Set(self.sf36_mcs_approx);
      item.ndi_raw_score = Set(self.ndi_raw_score);
      item.ndi_answered_sections = Set(self.ndi_answered_sections);
      item.ndi_percentage_score = Set(self.ndi_percentage_score);
      item.ndi_band = Set(self.ndi_band.clone());
      item.mjoa_total_score = Set(self.mjoa_total_score);
      item.mjoa_band = Set(self.mjoa_band.clone());
      item.eq5d_health_state_descriptor = Set(self.eq5d_health_state_descriptor.clone());
      item.eq5d_uk_index_value = Set(self.eq5d_uk_index_value);
      item.eq5d_vas_score = Set(self.eq5d_vas_score);
      }
}

async fn load_item(ctx: &AppContext, id: i32) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    format::json(Entity::find().all(&ctx.db).await?)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

/// Update.
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

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/patient_reported_outcome_measures_scores/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
