import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

import Subject from "./RadioGroup.svelte";

const children = (html: string) =>
    createRawSnippet(() => ({ render: () => `<span>${html}</span>` }));

describe("RadioGroup keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        render(Subject, {
            props: {
                ...{ label: "Size" },
                children: children(
                    '<input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" />',
                ),
            },
        });
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest(".radio-group")?.getAttribute("aria-label")).toBe("Size");
        expect(first.closest(".radio-group")?.getAttribute("role")).toBe("radiogroup");
        await user.keyboard("{ArrowDown}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("M");
        expect(next.checked).toBe(true);
    });
});
