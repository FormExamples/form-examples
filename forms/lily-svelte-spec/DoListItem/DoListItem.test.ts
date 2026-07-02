import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DoListItem.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("DoListItem", () => {
    test("renders a list item", () => {
        render(Subject, { props: { children: textSnippet("Use semantic HTML") } });
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders children content", () => {
        render(Subject, { props: { children: textSnippet("Provide alt text") } });
        expect(screen.getByText("Provide alt text")).toBeTruthy();
    });

    test("sets data-recommendation to do", () => {
        render(Subject, { props: { children: textSnippet("Use labels") } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-recommendation")).toBe("do");
    });

    test("passes through data-testid attribute", () => {
        render(Subject, { props: { "data-testid": "do-item", children: textSnippet("Tip") } });
        expect(screen.getByTestId("do-item")).toBeTruthy();
        expect(screen.getByTestId("do-item").tagName).toBe("LI");
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { id: "do-1", children: textSnippet("Tip") } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("do-1");
    });

    test("passes through aria-label attribute", () => {
        render(Subject, { props: { "aria-label": "recommended", children: textSnippet("Tip") } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("aria-label")).toBe("recommended");
    });
});
