import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

import Subject from "./Select.svelte";

const children = (html: string) =>
    createRawSnippet(() => ({ render: () => `<span>${html}</span>` }));

describe("Select keyboard", () => {
    test("Tab reaches it, by name", async () => {
        render(Subject, {
            props: {
                ...{ label: "Colour" },
                children: children('<option value="a">A</option><option value="b">B</option>'),
            },
        });
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("select.select")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Colour");
    });

    test("Tab skips it when disabled", async () => {
        render(Subject, {
            props: {
                ...{ label: "Colour", disabled: true },
                children: children('<option value="a">A</option><option value="b">B</option>'),
            },
        });
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
