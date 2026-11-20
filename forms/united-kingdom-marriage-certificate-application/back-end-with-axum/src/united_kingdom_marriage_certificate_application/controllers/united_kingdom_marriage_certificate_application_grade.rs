#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_marriage_certificate_application_grades::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub united_kingdom_marriage_certificate_application_id: Uuid,
    pub validity_class: String,
    #[validate(custom(function = "plausible_date"))]
    pub earliest_ceremony_date: Option<Date>,
    #[validate(custom(function = "plausible_date"))]
    pub latest_ceremony_date: Option<Date>,
    pub immigration_referral_indicated: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_marriage_certificate_application_grades \
            (united_kingdom_marriage_certificate_application_id, validity_class, \
            earliest_ceremony_date, latest_ceremony_date, \
            immigration_referral_indicated, graded_at) VALUES ($1, $2, $3, $4, $5, $6) \
            RETURNING *",
        )
        .bind(self.united_kingdom_marriage_certificate_application_id)
        .bind(&self.validity_class)
        .bind(self.earliest_ceremony_date)
        .bind(self.latest_ceremony_date)
        .bind(&self.immigration_referral_indicated)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_marriage_certificate_application_grades SET \
            united_kingdom_marriage_certificate_application_id = $2, validity_class = \
            $3, earliest_ceremony_date = $4, latest_ceremony_date = $5, \
            immigration_referral_indicated = $6, graded_at = $7, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.united_kingdom_marriage_certificate_application_id)
        .bind(&self.validity_class)
        .bind(self.earliest_ceremony_date)
        .bind(self.latest_ceremony_date)
        .bind(&self.immigration_referral_indicated)
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
        .prefix("api/united_kingdom_marriage_certificate_application_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
