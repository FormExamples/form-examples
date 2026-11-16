import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./ActionGroup.svelte";

test("meets the action-group contract", async () => {
    const { container } = render(Subject, {
        props: { label: "Actions", selectedCount: 0, selectedCountLabel: "None" } as never,
    });
    await runPattern("action-group", {
        root: container.querySelector<HTMLElement>(".action-group")!,
        hook: "action-group",
    });
});
