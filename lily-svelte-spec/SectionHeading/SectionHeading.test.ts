import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SectionHeading.svelte";

describe("SectionHeading", () => {
    test("renders as a header with the section-heading class", () => {
        const { container } = render(Subject, { props: {
            heading: "Latest news",
        }});

        const root = container.querySelector("header.section-heading") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("renders the required heading at default level 2", () => {
        const { container } = render(Subject, { props: {
            heading: "Latest news",
        }});

        const h = container.querySelector("h2.section-heading-heading") as HTMLElement;
        expect(h).toBeTruthy();
        expect(h.textContent).toContain("Latest news");
    });

    test("renders heading at level 3 when level=3", () => {
        const { container } = render(Subject, { props: {
            heading: "Latest news",
            level: 3,
        }});

        const h = container.querySelector("h3.section-heading-heading") as HTMLElement;
        expect(h).toBeTruthy();
    });

    test("renders heading at level 6 when level=6", () => {
        const { container } = render(Subject, { props: {
            heading: "Latest news",
            level: 6,
        }});

        const h = container.querySelector("h6.section-heading-heading") as HTMLElement;
        expect(h).toBeTruthy();
    });

    test("renders eyebrow when provided", () => {
        const { container } = render(Subject, { props: {
            heading: "Latest news",
            eyebrow: "Updates",
        }});

        const p = container.querySelector("p.section-heading-eyebrow") as HTMLElement;
        expect(p).toBeTruthy();
        expect(p.textContent).toContain("Updates");
    });

    test("renders subtitle when provided", () => {
        const { container } = render(Subject, { props: {
            heading: "Latest news",
            subtitle: "What we shipped this week",
        }});

        const p = container.querySelector("p.section-heading-subtitle") as HTMLElement;
        expect(p).toBeTruthy();
        expect(p.textContent).toContain("What we shipped this week");
    });

    test("does not render eyebrow when omitted", () => {
        const { container } = render(Subject, { props: {
            heading: "Latest news",
        }});

        const p = container.querySelector("p.section-heading-eyebrow");
        expect(p).toBeNull();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            heading: "Latest news",
            class: "extra",
        }});

        const root = container.querySelector("header") as HTMLElement;
        expect(root.className).toContain("section-heading");
        expect(root.className).toContain("extra");
    });
});
