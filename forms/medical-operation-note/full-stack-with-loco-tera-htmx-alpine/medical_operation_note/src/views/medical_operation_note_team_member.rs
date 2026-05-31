use loco_rs::prelude::*;

use crate::models::_entities::medical_operation_note_team_members;

/// Render a list view of `medical_operation_note_team_members`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<medical_operation_note_team_members::Model>) -> Result<Response> {
    format::render().view(v, "medical_operation_note_team_member/list.html", data!({"items": items}))
}

/// Render a single `medical_operation_note_team_member` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &medical_operation_note_team_members::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_team_member/show.html", data!({"item": item}))
}

/// Render a `medical_operation_note_team_member` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "medical_operation_note_team_member/create.html", data!({}))
}

/// Render a `medical_operation_note_team_member` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &medical_operation_note_team_members::Model) -> Result<Response> {
    format::render().view(v, "medical_operation_note_team_member/edit.html", data!({"item": item}))
}
