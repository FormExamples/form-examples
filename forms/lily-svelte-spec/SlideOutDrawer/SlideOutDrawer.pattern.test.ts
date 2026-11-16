import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./SlideOutDrawer.svelte";

test("meets the dialog contract", async () => {
    const { container, rerender } = render(Subject, { props: { label: "Settings" } as never });
    await runPattern("dialog", {
        root: container as HTMLElement,
        hook: "slide-out-drawer",
        open: async () => {
            await rerender({ open: false });
            await rerender({ open: true });
        },
    });
});
