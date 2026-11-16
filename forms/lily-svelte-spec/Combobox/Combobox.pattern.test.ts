import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./Combobox.svelte";

test("meets the combobox contract", async () => {
    const { container, rerender } = render(Subject, { props: { label: "Fruit" } as never });
    await runPattern("combobox", {
        root: container.querySelector<HTMLElement>(".combobox")!,
        hook: "combobox",
        open: () => rerender({ open: true }),
    });
});
