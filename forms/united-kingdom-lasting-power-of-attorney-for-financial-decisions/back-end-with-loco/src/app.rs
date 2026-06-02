// Placeholder. The form's Loco crate is not yet fully scaffolded —
// the `migration/` sub-crate is missing and `cargo loco generate scaffold`
// has not been run. Run the form's `back-end-with-loco-setup` script
// inside a freshly-initialised Loco app to wire this up.

pub fn app_name() -> &'static str {
    env!("CARGO_CRATE_NAME")
}
