#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::patients::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub name: String,
    pub birth_date: Option<Date>,
    pub sex: String,
    pub identifier_type: String,
    pub identifier_value: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub emergency_contact_name: String,
    pub emergency_contact_relationship: String,
    pub emergency_contact_phone: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO patients (deleted_at, name, birth_date, sex, identifier_type, \
            identifier_value, email, phone, emergency_contact_name, \
            emergency_contact_relationship, emergency_contact_phone) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(&self.name)
        .bind(self.birth_date)
        .bind(&self.sex)
        .bind(&self.identifier_type)
        .bind(&self.identifier_value)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.emergency_contact_name)
        .bind(&self.emergency_contact_relationship)
        .bind(&self.emergency_contact_phone)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE patients SET deleted_at = $2, name = $3, birth_date = $4, sex = $5, \
            identifier_type = $6, identifier_value = $7, email = $8, phone = $9, \
            emergency_contact_name = $10, emergency_contact_relationship = $11, \
            emergency_contact_phone = $12, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(&self.name)
        .bind(self.birth_date)
        .bind(&self.sex)
        .bind(&self.identifier_type)
        .bind(&self.identifier_value)
        .bind(&self.email)
        .bind(&self.phone)
        .bind(&self.emergency_contact_name)
        .bind(&self.emergency_contact_relationship)
        .bind(&self.emergency_contact_phone)
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
        .prefix("api/patients/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
