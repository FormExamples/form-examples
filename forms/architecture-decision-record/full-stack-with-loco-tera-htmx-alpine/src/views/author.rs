use loco_rs::prelude::*;

use crate::models::_entities::authors;

/// Render a list view of `authors`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<authors::Model>) -> Result<Response> {
    format::render().view(v, "author/list.html", data!({"items": items}))
}

/// Render a single `author` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &authors::Model) -> Result<Response> {
    format::render().view(v, "author/show.html", data!({"item": item}))
}

/// Render a `author` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "author/create.html", data!({}))
}

/// Render a `author` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &authors::Model) -> Result<Response> {
    format::render().view(v, "author/edit.html", data!({"item": item}))
}
