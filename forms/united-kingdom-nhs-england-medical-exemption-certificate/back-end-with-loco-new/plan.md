# Plan — `-new` Scaffold Placeholder (FP92A)

This directory is a **placeholder** for the regenerated Loco scaffold. No
source files live here yet.

## Steps

1. Inside this directory, run:
   ```sh
   cargo loco new united-kingdom-nhs-england-medical-exemption-certificate \
       --db postgres --bg async --asset clientside
   ```
2. From inside the generated crate, execute the sibling shell script:
   ```sh
   ../back-end-with-loco-setup
   ```
   This runs `cargo loco generate scaffold` for the 8 FP92A tables in the
   order defined by `../sql/`.
3. Port the engine (`src/engine/`), controllers, views, and Tera templates
   from `../back-end-with-loco/`.
4. Confirm `cargo build` succeeds.
5. Promote: rename the original crate to `*-old` and rename this directory
   to take its place.

## Why a placeholder?

Generating a Loco scaffold mutates the project root and would otherwise
clobber the working crate. Staging the regeneration here keeps the working
crate intact while the new tree is iterated on.
