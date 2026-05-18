use loco_rs::prelude::*;

use crate::models::_entities::architecture_decision_record_positions;

/// Render a list view of `architecture_decision_record_positions`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<architecture_decision_record_positions::Model>) -> Result<Response> {
    format::render().view(v, "architecture_decision_record_position/list.html", data!({"items": items}))
}

/// Render a single `architecture_decision_record_position` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &architecture_decision_record_positions::Model) -> Result<Response> {
    format::render().view(v, "architecture_decision_record_position/show.html", data!({"item": item}))
}

/// Render a `architecture_decision_record_position` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "architecture_decision_record_position/create.html", data!({}))
}

/// Render a `architecture_decision_record_position` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &architecture_decision_record_positions::Model) -> Result<Response> {
    format::render().view(v, "architecture_decision_record_position/edit.html", data!({"item": item}))
}
