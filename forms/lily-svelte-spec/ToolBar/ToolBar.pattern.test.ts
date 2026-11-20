import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./ToolBar.svelte";

test("meets the toolbar contract", async () => {
    const { container } = render(Subject, {
        props: { label: "Tools", children: (() => {}) as never },
    });
    await runPattern("toolbar", {
        root: container.querySelector<HTMLElement>(".tool-bar")!,
        hook: "tool-bar",
    });
});
