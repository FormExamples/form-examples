import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./AlertDialog.svelte";

test("meets the dialog contract, as an alert dialog", async () => {
    const { container, rerender } = render(Subject, { props: { title: "Are you sure?" } as never });
    await runPattern("dialog", {
        root: container as HTMLElement,
        hook: "alert-dialog",
        open: async () => {
            await rerender({ open: false });
            await rerender({ open: true });
        },
    });
});
