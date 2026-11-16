import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./DataTable.svelte";

const ROWS =
    "<tbody><tr><th>Alpha</th><th>Beta</th><th>Gamma</th></tr><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr><tr><td>A3</td><td>B3</td><td>C3</td></tr></tbody>";

test("meets the grid contract", async () => {
    const { container } = render(Subject, {
        props: {
            label: "Grid",
            children: createRawSnippet(() => ({ render: () => ROWS })),
        } as never,
    });
    await runPattern("grid", {
        root: container.querySelector<HTMLElement>(".data-table")!,
        hook: "data-table",
    });
});
