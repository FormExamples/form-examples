import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./TaskBar.svelte";

test("meets the toolbar contract", async () => {
    const { container } = render(Subject, {
        props: { label: "Actions", selectedCount: 0, selectedCountLabel: "None" } as never,
    });
    await runPattern("toolbar", {
        root: container.querySelector<HTMLElement>(".task-bar")!,
        hook: "task-bar",
    });
});
