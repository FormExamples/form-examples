import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MenuBarButton.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("MenuBarButton", () => {
    test("renders a menuitem", () => {
        render(Subject, { props: { children: textSnippet("File") } });
        expect(screen.getByRole("menuitem")).toBeTruthy();
    });

    test("renders as a button element", () => {
        render(Subject, { props: { children: textSnippet("File") } });
        expect(screen.getByRole("menuitem").tagName).toBe("BUTTON");
    });

    test("has type button", () => {
        render(Subject, { props: { children: textSnippet("File") } });
        expect((screen.getByRole("menuitem") as HTMLButtonElement).type).toBe("button");
    });

    test("has tabindex -1", () => {
        render(Subject, { props: { children: textSnippet("File") } });
        expect(screen.getByRole("menuitem").getAttribute("tabindex")).toBe("-1");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("Edit") } });
        expect(screen.getByText("Edit")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "mbb", children: textSnippet("X") } });
        expect(screen.getByTestId("mbb")).toBeTruthy();
    });
});
