import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./StatusLight.svelte";

describe("StatusLight", () => {
    test("renders as a span with the status-light class and role status", () => {
        const { container } = render(Subject, { props: {
            label: "Active",
        }});

        const root = container.querySelector("span.status-light") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("status");
    });

    test("default variant is neutral and exposed as data-variant", () => {
        const { container } = render(Subject, { props: {
            label: "Idle",
        }});

        const root = container.querySelector(".status-light") as HTMLElement;
        expect(root.getAttribute("data-variant")).toBe("neutral");
    });

    test("respects the variant prop", () => {
        const { container } = render(Subject, { props: {
            label: "Active",
            variant: "positive",
        }});

        const root = container.querySelector(".status-light") as HTMLElement;
        expect(root.getAttribute("data-variant")).toBe("positive");
    });

    test("renders an aria-hidden dot", () => {
        const { container } = render(Subject, { props: {
            label: "Active",
        }});

        const dot = container.querySelector(".status-light-dot") as HTMLElement;
        expect(dot).toBeTruthy();
        expect(dot.getAttribute("aria-hidden")).toBe("true");
    });

    test("renders the label text", () => {
        const { container } = render(Subject, { props: {
            label: "Offline",
        }});

        const labelEl = container.querySelector(
            ".status-light-label",
        ) as HTMLElement;
        expect(labelEl.textContent).toContain("Offline");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Active",
            class: "extra",
        }});

        const root = container.querySelector(".status-light") as HTMLElement;
        expect(root.className).toContain("status-light");
        expect(root.className).toContain("extra");
    });
});
