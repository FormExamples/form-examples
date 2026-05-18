#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};
use sea_orm::{sea_query::Order, QueryOrder};

use crate::{
    models::_entities::authors::{ActiveModel, Column, Entity, Model},
    views,
};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Params {
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub role: Option<String>,
    pub organization_name: Option<String>,
    pub team_name: Option<String>,
    }

impl Params {
    fn update(&self, item: &mut ActiveModel) {
      item.name = Set(self.name.clone());
      item.email = Set(self.email.clone());
      item.phone = Set(self.phone.clone());
      item.role = Set(self.role.clone());
      item.organization_name = Set(self.organization_name.clone());
      item.team_name = Set(self.team_name.clone());
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
    views::author::list(&v, &item)
}

#[debug_handler]
pub async fn new(
    ViewEngine(v): ViewEngine<TeraView>,
    State(_ctx): State<AppContext>,
) -> Result<Response> {
    views::author::create(&v)
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
    format::render().redirect_with_header_key("HX-Redirect", "/authors")
}

#[debug_handler]
pub async fn edit(
    Path(id): Path<i32>,
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    views::author::edit(&v, &item)
}

#[debug_handler]
pub async fn show(
    Path(id): Path<i32>,
    ViewEngine(v): ViewEngine<TeraView>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    views::author::show(&v, &item)
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
    format::render().redirect_with_header_key("HX-Redirect", "/authors")
}

#[debug_handler]
pub async fn remove(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("authors/")
        .add("/", get(list))
        .add("/", post(add))
        .add("new", get(new))
        .add("{id}", get(show))
        .add("{id}/edit", get(edit))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
