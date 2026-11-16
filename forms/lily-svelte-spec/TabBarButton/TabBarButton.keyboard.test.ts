import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

import Subject from "./TabBarButton.svelte";

const children = (html: string) =>
    createRawSnippet(() => ({ render: () => `<span>${html}</span>` }));

describe("TabBarButton keyboard", () => {
    test("Tab reaches the selected tab, and Enter activates it", async () => {
        render(Subject, {
            props: {
                ...{ label: "One", selected: true, controls: "panel-1" },
                children: children("One"),
            },
        });
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        const el = document.activeElement as HTMLElement;
        expect(el.matches("button.tab-bar-button")).toBe(true);
        expect(el.getAttribute("aria-selected")).toBe("true");
        expect(el.getAttribute("aria-controls")).toBe("panel-1");
        await user.keyboard("{Enter}");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(1);
    });

    test("Tab skips a tab that is not selected", async () => {
        render(Subject, {
            props: {
                ...{ label: "Two", selected: false, controls: "panel-2" },
                children: children("One"),
            },
        });
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
        expect(document.querySelector(".tab-bar-button")?.getAttribute("aria-selected")).toBe(
            "false",
        );
    });
});
