use loco_rs::prelude::*;

use crate::models::_entities::organizations;

/// Render a list view of `organizations`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<organizations::Model>) -> Result<Response> {
    format::render().view(v, "organization/list.html", data!({"items": items}))
}

/// Render a single `organization` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &organizations::Model) -> Result<Response> {
    format::render().view(v, "organization/show.html", data!({"item": item}))
}

/// Render a `organization` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "organization/create.html", data!({}))
}

/// Render a `organization` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &organizations::Model) -> Result<Response> {
    format::render().view(v, "organization/edit.html", data!({"item": item}))
}
