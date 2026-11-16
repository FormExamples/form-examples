import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { autosuggestFixture, runPattern } from "../../../shared/pattern-tester";
import Subject from "./Autosuggest.svelte";

test("meets the autosuggest contract", async () => {
    const { container } = render(Subject, { props: { ...autosuggestFixture, label: "Fruit" } });
    await runPattern("autosuggest", {
        root: container.querySelector<HTMLElement>(".autosuggest")!,
        hook: "autosuggest",
    });
});
