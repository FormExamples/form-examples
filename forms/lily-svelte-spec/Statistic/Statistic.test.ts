import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Statistic.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Statistic", () => {
    test("renders as a div with the statistic class and group role", () => {
        const { container } = render(Subject, { props: {
            title: "Users",
            value: "1,234",
        }});

        const root = container.querySelector("div.statistic") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("group");
    });

    test("renders title and value", () => {
        const { container } = render(Subject, { props: {
            title: "Active users",
            value: "1,234",
        }});

        const titleEl = container.querySelector(".statistic-title") as HTMLElement;
        const valueEl = container.querySelector(".statistic-value") as HTMLElement;
        expect(titleEl.textContent).toContain("Active users");
        expect(valueEl.textContent).toContain("1,234");
    });

    test("default aria-label combines title and value", () => {
        const { container } = render(Subject, { props: {
            title: "Active users",
            value: "1,234",
        }});

        const root = container.querySelector("div.statistic") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Active users: 1,234");
    });

    test("aria-label can be overridden via label prop", () => {
        const { container } = render(Subject, { props: {
            title: "Users",
            value: "1,234",
            label: "Total users count: one thousand two hundred thirty four",
        }});

        const root = container.querySelector("div.statistic") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Total users count: one thousand two hundred thirty four");
    });

    test("renders prefix snippet", () => {
        const { container } = render(Subject, { props: {
            title: "Revenue",
            value: "42",
            prefix: textSnippet("$"),
        }});

        const prefix = container.querySelector(".statistic-prefix") as HTMLElement;
        expect(prefix).toBeTruthy();
        expect(prefix.textContent).toContain("$");
    });

    test("renders suffix snippet", () => {
        const { container } = render(Subject, { props: {
            title: "Storage",
            value: "75",
            suffix: textSnippet("%"),
        }});

        const suffix = container.querySelector(".statistic-suffix") as HTMLElement;
        expect(suffix).toBeTruthy();
        expect(suffix.textContent).toContain("%");
    });

    test("omits prefix and suffix when not provided", () => {
        const { container } = render(Subject, { props: {
            title: "Users",
            value: "10",
        }});

        expect(container.querySelector(".statistic-prefix")).toBeNull();
        expect(container.querySelector(".statistic-suffix")).toBeNull();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            title: "Users",
            value: "10",
            class: "extra",
        }});

        const root = container.querySelector("div.statistic") as HTMLElement;
        expect(root.className).toContain("statistic");
        expect(root.className).toContain("extra");
    });
});
