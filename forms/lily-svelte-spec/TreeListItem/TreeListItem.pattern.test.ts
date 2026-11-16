import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./TreeListItem.svelte";

test("meets the tree-expand contract", async () => {
    const parent = document.createElement("li");
    parent.setAttribute("role", "treeitem");
    parent.tabIndex = -1;
    document.body.append(parent);
    render(Subject, { target: parent, props: { label: "Branch", expanded: false } as never });
    await runPattern("tree-expand", {
        root: parent.querySelector<HTMLElement>(".tree-list-item")!,
        hook: "tree-list-item",
    });
    parent.remove();
});
