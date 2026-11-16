import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./TreeList.svelte";

test("meets the tree contract", async () => {
    const { container } = render(Subject, { props: { label: "Sections" } as never });
    await runPattern("tree", {
        root: container.querySelector<HTMLElement>(".tree-list")!,
        hook: "tree-list",
    });
});
