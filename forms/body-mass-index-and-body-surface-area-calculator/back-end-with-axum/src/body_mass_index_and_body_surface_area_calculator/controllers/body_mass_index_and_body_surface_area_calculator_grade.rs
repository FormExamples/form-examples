#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::body_mass_index_and_body_surface_area_calculator_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub body_mass_index_and_body_surface_area_calculator_id: Uuid,
    pub bmi: Option<f64>,
    pub bmi_category: String,
    pub bsa_mosteller: Option<f64>,
    pub bsa_du_bois: Option<f64>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO body_mass_index_and_body_surface_area_calculator_grades \
            (body_mass_index_and_body_surface_area_calculator_id, bmi, bmi_category, \
            bsa_mosteller, bsa_du_bois, graded_at) VALUES ($1, $2, $3, $4, $5, $6) \
            RETURNING *",
        )
        .bind(self.body_mass_index_and_body_surface_area_calculator_id)
        .bind(self.bmi)
        .bind(&self.bmi_category)
        .bind(self.bsa_mosteller)
        .bind(self.bsa_du_bois)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE body_mass_index_and_body_surface_area_calculator_grades SET \
            body_mass_index_and_body_surface_area_calculator_id = $2, bmi = $3, \
            bmi_category = $4, bsa_mosteller = $5, bsa_du_bois = $6, graded_at = $7, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.body_mass_index_and_body_surface_area_calculator_id)
        .bind(self.bmi)
        .bind(&self.bmi_category)
        .bind(self.bsa_mosteller)
        .bind(self.bsa_du_bois)
        .bind(self.graded_at)
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
        .prefix("api/body_mass_index_and_body_surface_area_calculator_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
