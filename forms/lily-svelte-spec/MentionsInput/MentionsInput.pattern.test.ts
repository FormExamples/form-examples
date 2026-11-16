import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./MentionsInput.svelte";

test("meets the mentions contract", async () => {
    const { container } = render(Subject, { props: { label: "Choose" } as never });
    await runPattern("mentions", {
        root: container.querySelector<HTMLElement>(".mentions-input")!,
        hook: "mentions-input",
    });
});
