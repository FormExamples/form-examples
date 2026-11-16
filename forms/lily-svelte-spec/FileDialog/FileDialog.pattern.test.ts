import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./FileDialog.svelte";

test("meets the dialog contract", async () => {
    const { container, rerender } = render(Subject, { props: { label: "Settings" } as never });
    await runPattern("dialog", {
        root: container as HTMLElement,
        hook: "file-dialog",
        open: async () => {
            await rerender({ open: false });
            await rerender({ open: true });
        },
    });
});
