import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

import Subject from "./TreeNav.svelte";

const children = (html: string) =>
    createRawSnippet(() => ({ render: () => `<span>${html}</span>` }));

describe("TreeNav keyboard", () => {
    test("Tab walks its links, inside the named landmark", async () => {
        render(Subject, {
            props: {
                ...{ label: "Trail" },
                children: children('<a href="#first">First</a> <a href="#second">Second</a>'),
            },
        });
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLElement;
        expect(first.textContent).toBe("First");
        expect(first.closest("nav")?.getAttribute("aria-label")).toBe("Trail");
        await user.tab();
        expect(document.activeElement?.textContent).toBe("Second");
    });

    test("Enter activates the focused link", async () => {
        render(Subject, {
            props: {
                ...{ label: "Trail" },
                children: children('<a href="#first">First</a> <a href="#second">Second</a>'),
            },
        });
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        await user.keyboard("{Enter}");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(1);
    });
});
