#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::agile_consulting_scorecard_for_hiring_helps::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub organization_id: Uuid,
    pub respondent_id: Uuid,
    pub status: String,
    pub assessment_date: Date,
    pub submitted_at: Option<DateTimeWithTimeZone>,
    pub finalized_at: Option<DateTimeWithTimeZone>,
    pub m1_done: Option<bool>,
    pub m1_evidence: String,
    pub m2_done: Option<bool>,
    pub m2_evidence: String,
    pub m3_done: Option<bool>,
    pub m3_evidence: String,
    pub m4_done: Option<bool>,
    pub m4_evidence: String,
    pub p1_done: Option<bool>,
    pub p1_evidence: String,
    pub p2_done: Option<bool>,
    pub p2_evidence: String,
    pub p3_done: Option<bool>,
    pub p3_evidence: String,
    pub p4_done: Option<bool>,
    pub p4_evidence: String,
    pub p5_done: Option<bool>,
    pub p5_evidence: String,
    pub p6_done: Option<bool>,
    pub p6_evidence: String,
    pub p7_done: Option<bool>,
    pub p7_evidence: String,
    pub p8_done: Option<bool>,
    pub p8_evidence: String,
    pub p9_done: Option<bool>,
    pub p9_evidence: String,
    pub p10_done: Option<bool>,
    pub p10_evidence: String,
    pub p11_done: Option<bool>,
    pub p11_evidence: String,
    pub p12_done: Option<bool>,
    pub p12_evidence: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO agile_consulting_scorecard_for_hiring_helps (organization_id, \
            respondent_id, status, assessment_date, submitted_at, finalized_at, m1_done, \
            m1_evidence, m2_done, m2_evidence, m3_done, m3_evidence, m4_done, \
            m4_evidence, p1_done, p1_evidence, p2_done, p2_evidence, p3_done, \
            p3_evidence, p4_done, p4_evidence, p5_done, p5_evidence, p6_done, \
            p6_evidence, p7_done, p7_evidence, p8_done, p8_evidence, p9_done, \
            p9_evidence, p10_done, p10_evidence, p11_done, p11_evidence, p12_done, \
            p12_evidence) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, \
            $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, \
            $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38) RETURNING *",
        )
        .bind(self.organization_id)
        .bind(self.respondent_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(self.submitted_at)
        .bind(self.finalized_at)
        .bind(self.m1_done)
        .bind(&self.m1_evidence)
        .bind(self.m2_done)
        .bind(&self.m2_evidence)
        .bind(self.m3_done)
        .bind(&self.m3_evidence)
        .bind(self.m4_done)
        .bind(&self.m4_evidence)
        .bind(self.p1_done)
        .bind(&self.p1_evidence)
        .bind(self.p2_done)
        .bind(&self.p2_evidence)
        .bind(self.p3_done)
        .bind(&self.p3_evidence)
        .bind(self.p4_done)
        .bind(&self.p4_evidence)
        .bind(self.p5_done)
        .bind(&self.p5_evidence)
        .bind(self.p6_done)
        .bind(&self.p6_evidence)
        .bind(self.p7_done)
        .bind(&self.p7_evidence)
        .bind(self.p8_done)
        .bind(&self.p8_evidence)
        .bind(self.p9_done)
        .bind(&self.p9_evidence)
        .bind(self.p10_done)
        .bind(&self.p10_evidence)
        .bind(self.p11_done)
        .bind(&self.p11_evidence)
        .bind(self.p12_done)
        .bind(&self.p12_evidence)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE agile_consulting_scorecard_for_hiring_helps SET organization_id = $2, \
            respondent_id = $3, status = $4, assessment_date = $5, submitted_at = $6, \
            finalized_at = $7, m1_done = $8, m1_evidence = $9, m2_done = $10, \
            m2_evidence = $11, m3_done = $12, m3_evidence = $13, m4_done = $14, \
            m4_evidence = $15, p1_done = $16, p1_evidence = $17, p2_done = $18, \
            p2_evidence = $19, p3_done = $20, p3_evidence = $21, p4_done = $22, \
            p4_evidence = $23, p5_done = $24, p5_evidence = $25, p6_done = $26, \
            p6_evidence = $27, p7_done = $28, p7_evidence = $29, p8_done = $30, \
            p8_evidence = $31, p9_done = $32, p9_evidence = $33, p10_done = $34, \
            p10_evidence = $35, p11_done = $36, p11_evidence = $37, p12_done = $38, \
            p12_evidence = $39, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.organization_id)
        .bind(self.respondent_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(self.submitted_at)
        .bind(self.finalized_at)
        .bind(self.m1_done)
        .bind(&self.m1_evidence)
        .bind(self.m2_done)
        .bind(&self.m2_evidence)
        .bind(self.m3_done)
        .bind(&self.m3_evidence)
        .bind(self.m4_done)
        .bind(&self.m4_evidence)
        .bind(self.p1_done)
        .bind(&self.p1_evidence)
        .bind(self.p2_done)
        .bind(&self.p2_evidence)
        .bind(self.p3_done)
        .bind(&self.p3_evidence)
        .bind(self.p4_done)
        .bind(&self.p4_evidence)
        .bind(self.p5_done)
        .bind(&self.p5_evidence)
        .bind(self.p6_done)
        .bind(&self.p6_evidence)
        .bind(self.p7_done)
        .bind(&self.p7_evidence)
        .bind(self.p8_done)
        .bind(&self.p8_evidence)
        .bind(self.p9_done)
        .bind(&self.p9_evidence)
        .bind(self.p10_done)
        .bind(&self.p10_evidence)
        .bind(self.p11_done)
        .bind(&self.p11_evidence)
        .bind(self.p12_done)
        .bind(&self.p12_evidence)
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
        .prefix("api/agile_consulting_scorecard_for_hiring_helps/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
