use loco_rs::prelude::*;

use crate::models::_entities::medical_operation_note_grade_rules;

/// Render a list view of `medical_operation_note_grade_rules`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<medical_operation_note_grade_rules::Model>) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade_rule/list.html", data!({"items": items}))
}

/// Render a single `medical_operation_note_grade_rule` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &medical_operation_note_grade_rules::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade_rule/show.html", data!({"item": item}))
}

/// Render a `medical_operation_note_grade_rule` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade_rule/create.html", data!({}))
}

/// Render a `medical_operation_note_grade_rule` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &medical_operation_note_grade_rules::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_grade_rule/edit.html", data!({"item": item}))
}
