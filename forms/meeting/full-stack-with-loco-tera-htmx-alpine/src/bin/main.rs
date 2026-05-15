//! Minimal CLI for the meeting validation engine.
//!
//! Reads a JSON meeting from stdin and writes the ValidationResult to stdout.
//! Used by `bin/test-form meeting` and by editor / CI checks. The full Loco
//! HTTP server is added by the form's
//! `full-stack-with-loco-tera-htmx-alpine-setup` script when the crate is
//! promoted from engine-only to a full Loco application.

use std::io::{self, Read};

use meeting::{validate_meeting, Meeting};

fn main() {
    let mut buf = String::new();
    if io::stdin().read_to_string(&mut buf).is_err() {
        eprintln!("Could not read meeting JSON from stdin.");
        std::process::exit(2);
    }

    let meeting: Meeting = match serde_json::from_str(buf.trim()) {
        Ok(m) => m,
        Err(_) if buf.trim().is_empty() => Meeting::default(),
        Err(err) => {
            eprintln!("JSON parse error: {err}");
            std::process::exit(2);
        }
    };

    let result = validate_meeting(&meeting);
    match serde_json::to_string_pretty(&result) {
        Ok(s) => println!("{s}"),
        Err(err) => {
            eprintln!("JSON encode error: {err}");
            std::process::exit(2);
        }
    }
}
