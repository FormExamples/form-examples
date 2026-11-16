import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

import Subject from "./ErrorSummary.svelte";

const children = (html: string) =>
    createRawSnippet(() => ({ render: () => `<span>${html}</span>` }));

describe("ErrorSummary keyboard", () => {
    test("Tab reaches its links, and it can take focus itself", async () => {
        render(Subject, {
            props: {
                ...{ title: "There is a problem" },
                children: children('<a href="#name">Enter your name</a>'),
            },
        });
        const user = userEvent.setup();
        await user.tab();
        const link = document.activeElement as HTMLElement;
        expect(link.textContent).toBe("Enter your name");
        const root = link.closest(".error-summary") as HTMLElement;
        expect(root.getAttribute("role")).toBe("alert");
        expect(root.getAttribute("aria-labelledby")).toBe(root.querySelector("h2")?.id);
        expect(root.getAttribute("tabindex")).toBe("-1");
        root.focus();
        expect(document.activeElement).toBe(root);
    });
});
