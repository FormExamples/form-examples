#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::confusion_assessment_method_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub confusion_assessment_method_id: Uuid,
    pub classification: String,
    pub delirium_present: Option<bool>,
    pub feature_1_positive: Option<bool>,
    pub feature_2_positive: Option<bool>,
    pub feature_3_positive: Option<bool>,
    pub feature_4_positive: Option<bool>,
    pub positive_features: String,
    pub motoric_subtype: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO confusion_assessment_method_grades (confusion_assessment_method_id, \
            classification, delirium_present, feature_1_positive, feature_2_positive, \
            feature_3_positive, feature_4_positive, positive_features, motoric_subtype, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.confusion_assessment_method_id)
        .bind(&self.classification)
        .bind(self.delirium_present)
        .bind(self.feature_1_positive)
        .bind(self.feature_2_positive)
        .bind(self.feature_3_positive)
        .bind(self.feature_4_positive)
        .bind(&self.positive_features)
        .bind(&self.motoric_subtype)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE confusion_assessment_method_grades SET confusion_assessment_method_id \
            = $2, classification = $3, delirium_present = $4, feature_1_positive = $5, \
            feature_2_positive = $6, feature_3_positive = $7, feature_4_positive = $8, \
            positive_features = $9, motoric_subtype = $10, graded_at = $11, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.confusion_assessment_method_id)
        .bind(&self.classification)
        .bind(self.delirium_present)
        .bind(self.feature_1_positive)
        .bind(self.feature_2_positive)
        .bind(self.feature_3_positive)
        .bind(self.feature_4_positive)
        .bind(&self.positive_features)
        .bind(&self.motoric_subtype)
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
        .prefix("api/confusion_assessment_method_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
