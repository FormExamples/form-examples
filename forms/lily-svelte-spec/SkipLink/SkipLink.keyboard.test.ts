import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./SkipLink.svelte";

describe("SkipLink keyboard", () => {
    test("Tab reaches it first, and Enter activates it", async () => {
        render(Subject, { props: { href: "#main", label: "Skip to content" } });
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        const el = document.activeElement as HTMLAnchorElement;
        expect(el.matches("a.skip-link")).toBe(true);
        expect(el.getAttribute("href")).toBe("#main");
        await user.keyboard("{Enter}");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(1);
    });
});
