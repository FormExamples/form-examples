#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::travel_vaccinations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub assessment_id: Uuid,
    pub travel_planned: String,
    pub travel_destination: String,
    pub hepatitis_a: Option<i32>,
    pub hepatitis_b: Option<i32>,
    pub typhoid: Option<i32>,
    pub yellow_fever: Option<i32>,
    pub rabies: Option<i32>,
    pub japanese_encephalitis: Option<i32>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO travel_vaccinations (deleted_at, assessment_id, travel_planned, \
            travel_destination, hepatitis_a, hepatitis_b, typhoid, yellow_fever, rabies, \
            japanese_encephalitis) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING \
            *",
        )
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(&self.travel_planned)
        .bind(&self.travel_destination)
        .bind(self.hepatitis_a)
        .bind(self.hepatitis_b)
        .bind(self.typhoid)
        .bind(self.yellow_fever)
        .bind(self.rabies)
        .bind(self.japanese_encephalitis)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE travel_vaccinations SET deleted_at = $2, assessment_id = $3, \
            travel_planned = $4, travel_destination = $5, hepatitis_a = $6, hepatitis_b = $7, \
            typhoid = $8, yellow_fever = $9, rabies = $10, japanese_encephalitis = $11, \
            updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(&self.travel_planned)
        .bind(&self.travel_destination)
        .bind(self.hepatitis_a)
        .bind(self.hepatitis_b)
        .bind(self.typhoid)
        .bind(self.yellow_fever)
        .bind(self.rabies)
        .bind(self.japanese_encephalitis)
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
        .prefix("api/travel_vaccinations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
