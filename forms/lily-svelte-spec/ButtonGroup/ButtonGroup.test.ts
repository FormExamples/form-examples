import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ButtonGroup.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

// Helper to render an HTML fragment as snippet content.
function htmlSnippet(html: string) {
    return (($$anchor: Comment) => {
        const template = document.createElement("template");
        template.innerHTML = html;
        $$anchor.before(template.content.cloneNode(true));
    }) as any;
}

describe("ButtonGroup", () => {
    test("renders as a div with the button-group class", () => {
        const { container } = render(Subject, { props: {
            label: "Edit actions",
            children: textSnippet("buttons"),
        }});

        const root = container.querySelector("div.button-group") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("applies role=group and aria-label", () => {
        render(Subject, { props: {
            label: "Pagination controls",
            children: textSnippet("buttons"),
        }});

        const group = screen.getByRole("group", { name: "Pagination controls" });
        expect(group).toBeTruthy();
        expect(group.getAttribute("aria-label")).toBe("Pagination controls");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {
            label: "Group",
            children: htmlSnippet("<button>One</button><button>Two</button>"),
        }});

        const buttons = container.querySelectorAll("button");
        expect(buttons.length).toBe(2);
        expect(buttons[0].textContent).toBe("One");
        expect(buttons[1].textContent).toBe("Two");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Group",
            class: "extra",
            children: textSnippet("x"),
        }});

        const root = container.querySelector("div") as HTMLElement;
        expect(root.className).toContain("button-group");
        expect(root.className).toContain("extra");
    });

    test("spreads rest props onto the root", () => {
        const { container } = render(Subject, { props: {
            label: "Group",
            "data-test": "foo",
            children: textSnippet("x"),
        }});

        const root = container.querySelector("div") as HTMLElement;
        expect(root.getAttribute("data-test")).toBe("foo");
    });
});
