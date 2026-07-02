import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./InputGroup.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

function htmlSnippet(html: string) {
    return (($$anchor: Comment) => {
        const template = document.createElement("template");
        template.innerHTML = html;
        $$anchor.before(template.content.cloneNode(true));
    }) as any;
}

describe("InputGroup", () => {
    test("renders with the input-group class", () => {
        const { container } = render(Subject, { props: {
            children: htmlSnippet('<input type="text" />'),
        }});

        const root = container.querySelector(".input-group") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("has role group", () => {
        const { container } = render(Subject, { props: {
            children: htmlSnippet('<input type="text" />'),
        }});

        const root = container.querySelector(".input-group") as HTMLElement;
        expect(root.getAttribute("role")).toBe("group");
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, { props: {
            label: "Amount",
            children: htmlSnippet('<input type="number" />'),
        }});

        const root = container.querySelector(".input-group") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Amount");
    });

    test("renders prefix snippet inside .input-group-prefix", () => {
        const { container } = render(Subject, { props: {
            prefix: textSnippet("$"),
            children: htmlSnippet('<input type="number" />'),
        }});

        const prefix = container.querySelector(".input-group-prefix") as HTMLElement;
        expect(prefix).toBeTruthy();
        expect(prefix.textContent).toContain("$");
    });

    test("renders suffix snippet inside .input-group-suffix", () => {
        const { container } = render(Subject, { props: {
            suffix: textSnippet("USD"),
            children: htmlSnippet('<input type="number" />'),
        }});

        const suffix = container.querySelector(".input-group-suffix") as HTMLElement;
        expect(suffix).toBeTruthy();
        expect(suffix.textContent).toContain("USD");
    });

    test("does not render prefix span when prefix is missing", () => {
        const { container } = render(Subject, { props: {
            children: htmlSnippet('<input type="text" />'),
        }});

        expect(container.querySelector(".input-group-prefix")).toBeNull();
    });

    test("does not render suffix span when suffix is missing", () => {
        const { container } = render(Subject, { props: {
            children: htmlSnippet('<input type="text" />'),
        }});

        expect(container.querySelector(".input-group-suffix")).toBeNull();
    });

    test("renders the inner children (input)", () => {
        const { container } = render(Subject, { props: {
            children: htmlSnippet('<input type="text" data-testid="inner" />'),
        }});

        const input = container.querySelector("input") as HTMLInputElement;
        expect(input).toBeTruthy();
        expect(input.getAttribute("type")).toBe("text");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: htmlSnippet('<input />'),
        }});

        const root = container.querySelector(".input-group") as HTMLElement;
        expect(root.className).toContain("input-group");
        expect(root.className).toContain("extra");
    });
});
