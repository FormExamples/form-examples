use loco_rs::prelude::*;

use crate::models::_entities::clinicians;

/// Render a list view of `clinicians`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<clinicians::Model>) -> Result<Response> {
    format::render().view(v, "clinician/list.html", data!({"items": items}))
}

/// Render a single `clinician` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &clinicians::Model) -> Result<Response> {
    format::render().view(v, "clinician/show.html", data!({"item": item}))
}

/// Render a `clinician` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "clinician/create.html", data!({}))
}

/// Render a `clinician` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &clinicians::Model) -> Result<Response> {
    format::render().view(v, "clinician/edit.html", data!({"item": item}))
}
