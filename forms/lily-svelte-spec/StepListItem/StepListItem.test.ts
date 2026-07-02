import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./StepListItem.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("StepListItem", () => {
    test("renders as an li with the step-list-item class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Step"),
        }});

        const root = container.querySelector("li.step-list-item") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.tagName).toBe("LI");
    });

    test("default status is waiting", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Step"),
        }});

        const root = container.querySelector("li.step-list-item") as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("waiting");
    });

    test("supports in-progress status", () => {
        const { container } = render(Subject, { props: {
            status: "in-progress",
            children: textSnippet("Step"),
        }});

        const root = container.querySelector("li.step-list-item") as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("in-progress");
    });

    test("supports finished status", () => {
        const { container } = render(Subject, { props: {
            status: "finished",
            children: textSnippet("Step"),
        }});

        const root = container.querySelector("li.step-list-item") as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("finished");
    });

    test("supports error status", () => {
        const { container } = render(Subject, { props: {
            status: "error",
            children: textSnippet("Step"),
        }});

        const root = container.querySelector("li.step-list-item") as HTMLElement;
        expect(root.getAttribute("data-status")).toBe("error");
    });

    test("renders aria-current=step when current=true", () => {
        const { container } = render(Subject, { props: {
            current: true,
            children: textSnippet("Step"),
        }});

        const root = container.querySelector("li.step-list-item") as HTMLElement;
        expect(root.getAttribute("aria-current")).toBe("step");
    });

    test("omits aria-current when current=false", () => {
        const { container } = render(Subject, { props: {
            current: false,
            children: textSnippet("Step"),
        }});

        const root = container.querySelector("li.step-list-item") as HTMLElement;
        expect(root.getAttribute("aria-current")).toBeNull();
    });

    test("applies aria-label override when provided", () => {
        const { container } = render(Subject, { props: {
            label: "Step 2 of 3: Shipping",
            children: textSnippet("Shipping"),
        }});

        const root = container.querySelector("li.step-list-item") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Step 2 of 3: Shipping");
    });

    test("renders children", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Cart"),
        }});

        const root = container.querySelector("li.step-list-item") as HTMLElement;
        expect(root.textContent).toContain("Cart");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: textSnippet("Step"),
        }});

        const root = container.querySelector("li.step-list-item") as HTMLElement;
        expect(root.className).toContain("step-list-item");
        expect(root.className).toContain("extra");
    });
});
