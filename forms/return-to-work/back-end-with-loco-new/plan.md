# Plan: Loco scaffold generator

## Build order

1. [x] `bin/create-form return-to-work` emits `00-new.sh` from the
       monorepo template.
2. [ ] Run `./00-new.sh` on a clean machine to confirm the
       scaffolding completes.
3. [ ] After scaffolding, commit the generated
       `../back-end-with-loco/` project.

## Notes

- The script is regenerated every time `bin/create-form` is run for
  *any* form (because the template loops over every form slug). Be
  careful not to edit it manually — the next `bin/create-form`
  invocation will overwrite it.
