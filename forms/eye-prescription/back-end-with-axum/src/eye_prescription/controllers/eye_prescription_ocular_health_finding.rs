//! Eye prescription ocular health finding module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::eye_prescription_ocular_health_findings::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Eye prescription id.
    pub eye_prescription_id: Uuid,
    /// Slit lamp right.
    pub slit_lamp_right: String,
    /// Slit lamp left.
    pub slit_lamp_left: String,
    /// Fundus right.
    pub fundus_right: String,
    /// Fundus left.
    pub fundus_left: String,
    /// Intraocular pressure right mmhg.
    pub intraocular_pressure_right_mmhg: Option<f64>,
    /// Intraocular pressure left mmhg.
    pub intraocular_pressure_left_mmhg: Option<f64>,
    /// Cup to disc ratio right.
    pub cup_to_disc_ratio_right: Option<f64>,
    /// Cup to disc ratio left.
    pub cup_to_disc_ratio_left: Option<f64>,
    /// Oct performed.
    pub oct_performed: bool,
    /// Oct findings.
    pub oct_findings: String,
    /// Fields performed.
    pub fields_performed: bool,
    /// Fields findings.
    pub fields_findings: String,
    /// Pathology flag.
    pub pathology_flag: bool,
    /// Refer ophthalmology.
    pub refer_ophthalmology: bool,
    /// Referral reason.
    pub referral_reason: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO eye_prescription_ocular_health_findings (eye_prescription_id, \
            slit_lamp_right, slit_lamp_left, fundus_right, fundus_left, \
            intraocular_pressure_right_mmhg, intraocular_pressure_left_mmhg, \
            cup_to_disc_ratio_right, cup_to_disc_ratio_left, oct_performed, \
            oct_findings, fields_performed, fields_findings, pathology_flag, \
            refer_ophthalmology, referral_reason) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.eye_prescription_id)
        .bind(&self.slit_lamp_right)
        .bind(&self.slit_lamp_left)
        .bind(&self.fundus_right)
        .bind(&self.fundus_left)
        .bind(self.intraocular_pressure_right_mmhg)
        .bind(self.intraocular_pressure_left_mmhg)
        .bind(self.cup_to_disc_ratio_right)
        .bind(self.cup_to_disc_ratio_left)
        .bind(self.oct_performed)
        .bind(&self.oct_findings)
        .bind(self.fields_performed)
        .bind(&self.fields_findings)
        .bind(self.pathology_flag)
        .bind(self.refer_ophthalmology)
        .bind(&self.referral_reason)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE eye_prescription_ocular_health_findings SET eye_prescription_id = $2, \
            slit_lamp_right = $3, slit_lamp_left = $4, fundus_right = $5, fundus_left = \
            $6, intraocular_pressure_right_mmhg = $7, intraocular_pressure_left_mmhg = \
            $8, cup_to_disc_ratio_right = $9, cup_to_disc_ratio_left = $10, \
            oct_performed = $11, oct_findings = $12, fields_performed = $13, \
            fields_findings = $14, pathology_flag = $15, refer_ophthalmology = $16, \
            referral_reason = $17, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.eye_prescription_id)
        .bind(&self.slit_lamp_right)
        .bind(&self.slit_lamp_left)
        .bind(&self.fundus_right)
        .bind(&self.fundus_left)
        .bind(self.intraocular_pressure_right_mmhg)
        .bind(self.intraocular_pressure_left_mmhg)
        .bind(self.cup_to_disc_ratio_right)
        .bind(self.cup_to_disc_ratio_left)
        .bind(self.oct_performed)
        .bind(&self.oct_findings)
        .bind(self.fields_performed)
        .bind(&self.fields_findings)
        .bind(self.pathology_flag)
        .bind(self.refer_ophthalmology)
        .bind(&self.referral_reason)
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
        .prefix("api/eye_prescription_ocular_health_findings/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
