import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./SegmentGroup.svelte";

test("meets the radio-group contract", async () => {
    const { container } = render(Subject, {
        props: { label: "Actions", selectedCount: 0, selectedCountLabel: "None" } as never,
    });
    await runPattern("radio-group", {
        root: container.querySelector<HTMLElement>(".segment-group")!,
        hook: "segment-group",
    });
});
