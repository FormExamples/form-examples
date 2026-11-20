#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::registrants::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    #[validate(length(max = TEXT_MAX))]
    pub name: String,
    #[validate(custom(function = "plausible_date"))]
    pub birth_date: Option<Date>,
    pub sex: String,
    #[validate(length(max = TEXT_MAX))]
    pub place_of_birth: String,
    #[validate(length(max = TEXT_MAX))]
    pub county_of_birth: String,
    pub birth_state: Option<String>,
    #[validate(length(max = TEXT_MAX))]
    pub birth_facility: String,
    #[validate(length(max = TEXT_MAX))]
    pub mother_name_before_first_marriage: String,
    #[validate(length(max = TEXT_MAX))]
    pub father_name: String,
    pub is_deceased: String,
    pub is_adopted: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO registrants (name, birth_date, sex, place_of_birth, county_of_birth, birth_state, birth_facility, mother_name_before_first_marriage, father_name, is_deceased, is_adopted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(&self.name)
        .bind(self.birth_date)
        .bind(&self.sex)
        .bind(&self.place_of_birth)
        .bind(&self.county_of_birth)
        .bind(&self.birth_state)
        .bind(&self.birth_facility)
        .bind(&self.mother_name_before_first_marriage)
        .bind(&self.father_name)
        .bind(&self.is_deceased)
        .bind(&self.is_adopted)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE registrants SET name = $2, birth_date = $3, sex = $4, place_of_birth = $5, county_of_birth = $6, birth_state = $7, birth_facility = $8, mother_name_before_first_marriage = $9, father_name = $10, is_deceased = $11, is_adopted = $12, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.name)
        .bind(self.birth_date)
        .bind(&self.sex)
        .bind(&self.place_of_birth)
        .bind(&self.county_of_birth)
        .bind(&self.birth_state)
        .bind(&self.birth_facility)
        .bind(&self.mother_name_before_first_marriage)
        .bind(&self.father_name)
        .bind(&self.is_deceased)
        .bind(&self.is_adopted)
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
        .prefix("api/united-states-birth-certificate-application/registrants/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
