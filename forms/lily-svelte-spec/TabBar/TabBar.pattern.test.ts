import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./TabBar.svelte";

test("meets the tabs contract", async () => {
    const { container } = render(Subject, { props: { label: "Sections" } as never });
    await runPattern("tabs", {
        root: container.querySelector<HTMLElement>(".tab-bar")!,
        hook: "tab-bar",
    });
});
