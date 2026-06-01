import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DontListItem.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("DontListItem", () => {
    test("renders a list item", () => {
        render(Subject, { props: { children: textSnippet("Use color alone") } });
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders children content", () => {
        render(Subject, { props: { children: textSnippet("Remove focus outlines") } });
        expect(screen.getByText("Remove focus outlines")).toBeTruthy();
    });

    test("sets data-recommendation to dont", () => {
        render(Subject, { props: { children: textSnippet("Skip labels") } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-recommendation")).toBe("dont");
    });

    test("passes through data-testid attribute", () => {
        render(Subject, { props: { "data-testid": "dont-item", children: textSnippet("Bad practice") } });
        expect(screen.getByTestId("dont-item")).toBeTruthy();
        expect(screen.getByTestId("dont-item").tagName).toBe("LI");
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { id: "dont-1", children: textSnippet("Avoid") } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("dont-1");
    });

    test("passes through aria-label attribute", () => {
        render(Subject, { props: { "aria-label": "discouraged", children: textSnippet("Avoid") } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("aria-label")).toBe("discouraged");
    });
});
