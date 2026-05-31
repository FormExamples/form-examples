#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};
use sea_orm::{sea_query::Order, QueryOrder};

use crate::{
    models::_entities::medical_operation_note_complications::{ActiveModel, Column, Entity, Model},
    views,
};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub medical_operation_note_id: i32,
    pub category: String,
    pub description: String,
    pub clavien_dindo_grade: String,
    pub onset_at: Option<DateTimeWithTimeZone>,
    pub action_taken: String,
    pub resolved_in_theatre: String,
    pub reported_to_governance: String,
    }

impl Params {
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.medical_operation_note_id = Set(self.medical_operation_note_id);
      item.category = Set(self.category.clone());
      item.description = Set(self.description.clone());
      item.clavien_dindo_grade = Set(self.clavien_dindo_grade.clone());
      item.onset_at = Set(self.onset_at);
      item.action_taken = Set(self.action_taken.clone());
      item.resolved_in_theatre = Set(self.resolved_in_theatre.clone());
      item.reported_to_governance = Set(self.reported_to_governance.clone());
      }
}

async fn load_item(ctx: &AppContext, id: i32) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = Entity::find()
        .order_by(Column::Id, Order::Desc)
        .all(&ctx.db)
        .await?;
    views::medical_operation_note_complication::list(&v, &item)
}

#[debug_handler]
pub async fn new(
    ViewEngine(v): ViewEngine<TeraView>,
    State(_ctx): State<AppContext>,
) -> Result<Response> {
    views::medical_operation_note_complication::create(&v)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let _ = item.update(&ctx.db).await?;
    format::render().redirect_with_header_key("HX-Redirect", "/medical_operation_note_complications")
}

#[debug_handler]
pub async fn edit(
    Path(id): Path<i32>,
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    views::medical_operation_note_complication::edit(&v, &item)
}

#[debug_handler]
pub async fn show(
    Path(id): Path<i32>,
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    views::medical_operation_note_complication::show(&v, &item)
}

#[debug_handler]
pub async fn add(
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let _ = item.insert(&ctx.db).await?;
    format::render().redirect_with_header_key("HX-Redirect", "/medical_operation_note_complications")
}

#[debug_handler]
pub async fn remove(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("medical_operation_note_complications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("new", get(new))
        .add("{id}", get(show))
        .add("{id}/edit", get(edit))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
