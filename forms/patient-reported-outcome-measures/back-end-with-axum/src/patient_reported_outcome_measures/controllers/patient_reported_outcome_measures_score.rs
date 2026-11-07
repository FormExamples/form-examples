//! Patient reported outcome measures score module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::patient_reported_outcome_measures_scores::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Patient reported outcome measures ID.
    pub patient_reported_outcome_measures_id: Uuid,
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
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO patient_reported_outcome_measures_scores \
            (patient_reported_outcome_measures_id, sf36_pf, sf36_rp, sf36_bp, sf36_gh, \
            sf36_vt, sf36_sf, sf36_re, sf36_mh, sf36_pcs_approx, sf36_mcs_approx, \
            ndi_raw_score, ndi_answered_sections, ndi_percentage_score, ndi_band, \
            mjoa_total_score, mjoa_band, eq5d_health_state_descriptor, \
            eq5d_uk_index_value, eq5d_vas_score) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *",
        )
        .bind(self.patient_reported_outcome_measures_id)
        .bind(self.sf36_pf)
        .bind(self.sf36_rp)
        .bind(self.sf36_bp)
        .bind(self.sf36_gh)
        .bind(self.sf36_vt)
        .bind(self.sf36_sf)
        .bind(self.sf36_re)
        .bind(self.sf36_mh)
        .bind(self.sf36_pcs_approx)
        .bind(self.sf36_mcs_approx)
        .bind(self.ndi_raw_score)
        .bind(self.ndi_answered_sections)
        .bind(self.ndi_percentage_score)
        .bind(&self.ndi_band)
        .bind(self.mjoa_total_score)
        .bind(&self.mjoa_band)
        .bind(&self.eq5d_health_state_descriptor)
        .bind(self.eq5d_uk_index_value)
        .bind(self.eq5d_vas_score)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE patient_reported_outcome_measures_scores SET \
            patient_reported_outcome_measures_id = $2, sf36_pf = $3, sf36_rp = $4, \
            sf36_bp = $5, sf36_gh = $6, sf36_vt = $7, sf36_sf = $8, sf36_re = $9, \
            sf36_mh = $10, sf36_pcs_approx = $11, sf36_mcs_approx = $12, ndi_raw_score = \
            $13, ndi_answered_sections = $14, ndi_percentage_score = $15, ndi_band = \
            $16, mjoa_total_score = $17, mjoa_band = $18, eq5d_health_state_descriptor = \
            $19, eq5d_uk_index_value = $20, eq5d_vas_score = $21, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_reported_outcome_measures_id)
        .bind(self.sf36_pf)
        .bind(self.sf36_rp)
        .bind(self.sf36_bp)
        .bind(self.sf36_gh)
        .bind(self.sf36_vt)
        .bind(self.sf36_sf)
        .bind(self.sf36_re)
        .bind(self.sf36_mh)
        .bind(self.sf36_pcs_approx)
        .bind(self.sf36_mcs_approx)
        .bind(self.ndi_raw_score)
        .bind(self.ndi_answered_sections)
        .bind(self.ndi_percentage_score)
        .bind(&self.ndi_band)
        .bind(self.mjoa_total_score)
        .bind(&self.mjoa_band)
        .bind(&self.eq5d_health_state_descriptor)
        .bind(self.eq5d_uk_index_value)
        .bind(self.eq5d_vas_score)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
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
