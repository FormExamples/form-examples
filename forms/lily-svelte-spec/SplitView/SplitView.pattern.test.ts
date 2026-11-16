import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./SplitView.svelte";

test("meets the splitter contract", async () => {
    const { container } = render(Subject, {
        props: { label: "Panes", primary: () => {}, secondary: () => {} } as never,
    });
    await runPattern("splitter", {
        root: container.querySelector<HTMLElement>(".split-view")!,
        hook: "split-view",
    });
});
