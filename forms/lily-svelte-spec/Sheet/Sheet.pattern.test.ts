import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./Sheet.svelte";

test("meets the dialog contract", async () => {
    const { container, rerender } = render(Subject, { props: { label: "Settings" } as never });
    await runPattern("dialog", {
        root: container as HTMLElement,
        hook: "sheet",
        open: async () => {
            await rerender({ open: false });
            await rerender({ open: true });
        },
    });
});
