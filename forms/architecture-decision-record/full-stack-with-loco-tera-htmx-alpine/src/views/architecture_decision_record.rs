use loco_rs::prelude::*;

use crate::models::_entities::{
    architecture_decision_record_notes, architecture_decision_record_positions,
    architecture_decision_records,
};

/// Render the inline positions partial for the edit wizard's Step 8.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn positions_partial(
    v: &impl ViewRenderer,
    adr_id: i32,
    positions: &Vec<architecture_decision_record_positions::Model>,
) -> Result<Response> {
    format::render().view(
        v,
        "architecture_decision_record/_partials/positions.html",
        data!({ "adr_id": adr_id, "positions": positions }),
    )
}

/// Render the inline notes partial for the edit wizard's Step 15.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn notes_partial(
    v: &impl ViewRenderer,
    adr_id: i32,
    notes: &Vec<architecture_decision_record_notes::Model>,
) -> Result<Response> {
    format::render().view(
        v,
        "architecture_decision_record/_partials/notes.html",
        data!({ "adr_id": adr_id, "notes": notes }),
    )
}

/// Render a list view of `architecture_decision_records`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<architecture_decision_records::Model>) -> Result<Response> {
    format::render().view(v, "architecture_decision_record/list.html", data!({"items": items}))
}

/// Render a single `architecture_decision_record` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &architecture_decision_records::Model) -> Result<Response> {
    format::render().view(v, "architecture_decision_record/show.html", data!({"item": item}))
}

/// Render a `architecture_decision_record` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "architecture_decision_record/create.html", data!({}))
}

/// Render a `architecture_decision_record` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &architecture_decision_records::Model) -> Result<Response> {
    format::render().view(v, "architecture_decision_record/edit.html", data!({"item": item}))
}
