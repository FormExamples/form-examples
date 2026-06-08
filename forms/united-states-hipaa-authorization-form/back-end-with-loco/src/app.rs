//! Loco application hooks: route registration, workers, tasks, and lifecycle.

// Loco application wiring. Placeholder — the production wiring is
// emitted by `cargo loco generate scaffold` per
// `../full-stack-with-loco-tera-htmx-alpine-setup`.

/// App name.
pub fn app_name() -> &'static str {
    "united-states-hipaa-authorization-form"
}
