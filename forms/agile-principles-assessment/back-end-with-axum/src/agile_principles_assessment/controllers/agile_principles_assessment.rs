#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::agile_principles_assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub respondent_id: Uuid,
    pub status: String,
    pub is_anonymous: bool,
    pub assessment_date: Option<Date>,
    pub assessment_period: String,
    pub p01_customer_satisfaction: Option<i32>,
    pub p01_comment: String,
    pub p01_weight: f64,
    pub p02_welcome_change: Option<i32>,
    pub p02_comment: String,
    pub p02_weight: f64,
    pub p03_deliver_frequently: Option<i32>,
    pub p03_comment: String,
    pub p03_weight: f64,
    pub p04_collaboration: Option<i32>,
    pub p04_comment: String,
    pub p04_weight: f64,
    pub p05_motivated_individuals: Option<i32>,
    pub p05_comment: String,
    pub p05_weight: f64,
    pub p06_face_to_face: Option<i32>,
    pub p06_comment: String,
    pub p06_weight: f64,
    pub p07_working_software: Option<i32>,
    pub p07_comment: String,
    pub p07_weight: f64,
    pub p08_sustainable_development: Option<i32>,
    pub p08_comment: String,
    pub p08_weight: f64,
    pub p09_technical_excellence: Option<i32>,
    pub p09_comment: String,
    pub p09_weight: f64,
    pub p10_simplicity: Option<i32>,
    pub p10_comment: String,
    pub p10_weight: f64,
    pub p11_self_organising_teams: Option<i32>,
    pub p11_comment: String,
    pub p11_weight: f64,
    pub p12_regular_reflection: Option<i32>,
    pub p12_comment: String,
    pub p12_weight: f64,
    pub overall_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO agile_principles_assessments (deleted_at, respondent_id, status, \
            is_anonymous, assessment_date, assessment_period, p01_customer_satisfaction, \
            p01_comment, p01_weight, p02_welcome_change, p02_comment, p02_weight, \
            p03_deliver_frequently, p03_comment, p03_weight, p04_collaboration, p04_comment, \
            p04_weight, p05_motivated_individuals, p05_comment, p05_weight, p06_face_to_face, \
            p06_comment, p06_weight, p07_working_software, p07_comment, p07_weight, \
            p08_sustainable_development, p08_comment, p08_weight, p09_technical_excellence, \
            p09_comment, p09_weight, p10_simplicity, p10_comment, p10_weight, \
            p11_self_organising_teams, p11_comment, p11_weight, p12_regular_reflection, \
            p12_comment, p12_weight, overall_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, \
            $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, \
            $41, $42, $43) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.respondent_id)
        .bind(&self.status)
        .bind(self.is_anonymous)
        .bind(self.assessment_date)
        .bind(&self.assessment_period)
        .bind(self.p01_customer_satisfaction)
        .bind(&self.p01_comment)
        .bind(self.p01_weight)
        .bind(self.p02_welcome_change)
        .bind(&self.p02_comment)
        .bind(self.p02_weight)
        .bind(self.p03_deliver_frequently)
        .bind(&self.p03_comment)
        .bind(self.p03_weight)
        .bind(self.p04_collaboration)
        .bind(&self.p04_comment)
        .bind(self.p04_weight)
        .bind(self.p05_motivated_individuals)
        .bind(&self.p05_comment)
        .bind(self.p05_weight)
        .bind(self.p06_face_to_face)
        .bind(&self.p06_comment)
        .bind(self.p06_weight)
        .bind(self.p07_working_software)
        .bind(&self.p07_comment)
        .bind(self.p07_weight)
        .bind(self.p08_sustainable_development)
        .bind(&self.p08_comment)
        .bind(self.p08_weight)
        .bind(self.p09_technical_excellence)
        .bind(&self.p09_comment)
        .bind(self.p09_weight)
        .bind(self.p10_simplicity)
        .bind(&self.p10_comment)
        .bind(self.p10_weight)
        .bind(self.p11_self_organising_teams)
        .bind(&self.p11_comment)
        .bind(self.p11_weight)
        .bind(self.p12_regular_reflection)
        .bind(&self.p12_comment)
        .bind(self.p12_weight)
        .bind(&self.overall_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE agile_principles_assessments SET deleted_at = $2, respondent_id = $3, \
            status = $4, is_anonymous = $5, assessment_date = $6, assessment_period = $7, \
            p01_customer_satisfaction = $8, p01_comment = $9, p01_weight = $10, \
            p02_welcome_change = $11, p02_comment = $12, p02_weight = $13, \
            p03_deliver_frequently = $14, p03_comment = $15, p03_weight = $16, \
            p04_collaboration = $17, p04_comment = $18, p04_weight = $19, \
            p05_motivated_individuals = $20, p05_comment = $21, p05_weight = $22, \
            p06_face_to_face = $23, p06_comment = $24, p06_weight = $25, p07_working_software \
            = $26, p07_comment = $27, p07_weight = $28, p08_sustainable_development = $29, \
            p08_comment = $30, p08_weight = $31, p09_technical_excellence = $32, p09_comment \
            = $33, p09_weight = $34, p10_simplicity = $35, p10_comment = $36, p10_weight = \
            $37, p11_self_organising_teams = $38, p11_comment = $39, p11_weight = $40, \
            p12_regular_reflection = $41, p12_comment = $42, p12_weight = $43, overall_notes \
            = $44, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.respondent_id)
        .bind(&self.status)
        .bind(self.is_anonymous)
        .bind(self.assessment_date)
        .bind(&self.assessment_period)
        .bind(self.p01_customer_satisfaction)
        .bind(&self.p01_comment)
        .bind(self.p01_weight)
        .bind(self.p02_welcome_change)
        .bind(&self.p02_comment)
        .bind(self.p02_weight)
        .bind(self.p03_deliver_frequently)
        .bind(&self.p03_comment)
        .bind(self.p03_weight)
        .bind(self.p04_collaboration)
        .bind(&self.p04_comment)
        .bind(self.p04_weight)
        .bind(self.p05_motivated_individuals)
        .bind(&self.p05_comment)
        .bind(self.p05_weight)
        .bind(self.p06_face_to_face)
        .bind(&self.p06_comment)
        .bind(self.p06_weight)
        .bind(self.p07_working_software)
        .bind(&self.p07_comment)
        .bind(self.p07_weight)
        .bind(self.p08_sustainable_development)
        .bind(&self.p08_comment)
        .bind(self.p08_weight)
        .bind(self.p09_technical_excellence)
        .bind(&self.p09_comment)
        .bind(self.p09_weight)
        .bind(self.p10_simplicity)
        .bind(&self.p10_comment)
        .bind(self.p10_weight)
        .bind(self.p11_self_organising_teams)
        .bind(&self.p11_comment)
        .bind(self.p11_weight)
        .bind(self.p12_regular_reflection)
        .bind(&self.p12_comment)
        .bind(self.p12_weight)
        .bind(&self.overall_notes)
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
        .prefix("api/agile_principles_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
