import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./Command.svelte";

test("meets the command contract", async () => {
    const { container } = render(Subject, { props: { label: "Actions" } as never });
    await runPattern("command", {
        root: container.querySelector<HTMLElement>(".command")!,
        hook: "command",
    });
});
