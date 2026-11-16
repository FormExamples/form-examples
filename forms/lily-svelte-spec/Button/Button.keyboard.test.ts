import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

import Subject from "./Button.svelte";

const children = (html: string) =>
    createRawSnippet(() => ({ render: () => `<span>${html}</span>` }));

describe("Button keyboard", () => {
    test("Tab reaches it, and Enter and Space activate it", async () => {
        render(Subject, { props: { ...{ label: "Save" }, children: children("Save") } });
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        expect((document.activeElement as HTMLElement).matches("button.button")).toBe(true);
        expect(document.activeElement?.getAttribute("aria-label")).toBe("Save");
        await user.keyboard("{Enter}");
        await user.keyboard(" ");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(2);
    });
});
