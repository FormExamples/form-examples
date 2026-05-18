use loco_rs::prelude::*;

use crate::models::_entities::architecture_decision_record_notes;

/// Render a list view of `architecture_decision_record_notes`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<architecture_decision_record_notes::Model>) -> Result<Response> {
    format::render().view(v, "architecture_decision_record_note/list.html", data!({"items": items}))
}

/// Render a single `architecture_decision_record_note` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &architecture_decision_record_notes::Model) -> Result<Response> {
    format::render().view(v, "architecture_decision_record_note/show.html", data!({"item": item}))
}

/// Render a `architecture_decision_record_note` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "architecture_decision_record_note/create.html", data!({}))
}

/// Render a `architecture_decision_record_note` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &architecture_decision_record_notes::Model) -> Result<Response> {
    format::render().view(v, "architecture_decision_record_note/edit.html", data!({"item": item}))
}
