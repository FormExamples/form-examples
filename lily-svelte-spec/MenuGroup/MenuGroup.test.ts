import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MenuGroup.svelte";

describe("MenuGroup", () => {
    test("renders as a group with the menu-group class", () => {
        const { container } = render(Subject, { props: {
            label: "File",
        }});

        const root = container.querySelector("div.menu-group") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("group");
    });

    test("applies aria-label", () => {
        render(Subject, { props: {
            label: "File actions",
        }});

        const group = screen.getByRole("group", { name: "File actions" });
        expect(group).toBeTruthy();
    });

    test("renders a visible heading marked aria-hidden", () => {
        const { container } = render(Subject, { props: {
            label: "File",
        }});

        const heading = container.querySelector(
            ".menu-group-heading",
        ) as HTMLElement;
        expect(heading.textContent).toContain("File");
        expect(heading.getAttribute("aria-hidden")).toBe("true");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "File",
            class: "extra",
        }});

        const root = container.querySelector(".menu-group") as HTMLElement;
        expect(root.className).toContain("menu-group");
        expect(root.className).toContain("extra");
    });
});
