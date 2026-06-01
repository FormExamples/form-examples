import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Flair.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Flair", () => {
    test("renders children text", () => {
        render(Subject, { props: { "data-testid": "fl", children: textSnippet("New") } });
        expect(screen.getByTestId("fl").textContent).toBe("New");
    });

    test("decorative by default (aria-hidden)", () => {
        render(Subject, { props: { "data-testid": "fl", children: textSnippet("New") } });
        expect(screen.getByTestId("fl").getAttribute("aria-hidden")).toBe("true");
    });

    test("meaningful when label provided", () => {
        render(Subject, { props: { label: "Status: new", "data-testid": "fl", children: textSnippet("New") } });
        expect(screen.getByTestId("fl").getAttribute("aria-label")).toBe("Status: new");
        expect(screen.getByTestId("fl").getAttribute("aria-hidden")).toBeNull();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "fl", children: textSnippet("X") } });
        expect(screen.getByTestId("fl")).toBeTruthy();
    });
});
