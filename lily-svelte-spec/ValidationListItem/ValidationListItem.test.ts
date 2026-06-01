import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ValidationListItem.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ValidationListItem", () => {
    test("renders as an li with the validation-list-item class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Rule"),
        }});

        const root = container.querySelector("li.validation-list-item") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("defaults data-status to pending", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Rule"),
        }});

        const root = container.querySelector("li") as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("pending");
    });

    test("applies passed status", () => {
        const { container } = render(Subject, { props: {
            status: "passed",
            children: textSnippet("Rule"),
        }});

        const root = container.querySelector("li") as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("passed");
    });

    test("applies failed status", () => {
        const { container } = render(Subject, { props: {
            status: "failed",
            children: textSnippet("Rule"),
        }});

        const root = container.querySelector("li") as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("failed");
    });

    test("renders rule text from children", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("At least 8 characters"),
        }});

        const root = container.querySelector("li") as HTMLElement;
        expect(root.textContent).toContain("At least 8 characters");
    });

    test("applies aria-label override", () => {
        const { container } = render(Subject, { props: {
            label: "Custom label",
            children: textSnippet("Rule"),
        }});

        const root = container.querySelector("li") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Custom label");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: textSnippet("Rule"),
        }});

        const root = container.querySelector("li") as HTMLElement;
        expect(root.className).toContain("validation-list-item");
        expect(root.className).toContain("extra");
    });
});
