import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

import Subject from "./Hint.svelte";

const children = (html: string) =>
    createRawSnippet(() => ({ render: () => `<span>${html}</span>` }));

describe("Hint keyboard", () => {
    test("aria-describedby can point a control at it", async () => {
        render(Subject, {
            props: {
                ...{ id: "name-hint", label: "Hint" },
                children: children("Use your full name"),
            },
        });

        document.body.insertAdjacentHTML("beforeend", '<input aria-describedby="name-hint" />');
        const input = document.querySelector("[aria-describedby]");
        const target = document.getElementById(input?.getAttribute("aria-describedby") ?? "");
        expect(target?.textContent).toContain("Use your full name");
    });
});
