//! MEDIF CLI binary.
//!
//! Minimal CLI entrypoint. Migrates to `loco_rs::cli` in Phase 1 of the plan.

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    if args.is_empty() {
        eprintln!("medical_information_form_for_air_travel-cli");
        eprintln!();
        eprintln!("Subcommands (planned):");
        eprintln!("  start     run the HTTP server");
        eprintln!("  migrate   apply database migrations");
        eprintln!("  scheduler run scheduled tasks");
        return;
    }
    match args[0].as_str() {
        "start" => {
            eprintln!("`start` is not wired up yet; run the `main` binary directly.");
        }
        other => {
            eprintln!("unknown subcommand: {other}");
        }
    }
}
