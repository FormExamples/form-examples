import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ToolBarButton.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("ToolBarButton", () => {
    test("renders a button", () => {
        render(Subject, { props: { children: textSnippet("Bold") } });
        expect(screen.getByRole("button")).toBeTruthy();
    });

    test("has type button", () => {
        render(Subject, { props: { children: textSnippet("Bold") } });
        expect((screen.getByRole("button") as HTMLButtonElement).type).toBe("button");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("Italic") } });
        expect(screen.getByText("Italic")).toBeTruthy();
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { children: textSnippet("Bold") } });
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(false);
    });

    test("supports disabled", () => {
        render(Subject, { props: { disabled: true, children: textSnippet("Redo") } });
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "tbb", children: textSnippet("X") } });
        expect(screen.getByTestId("tbb")).toBeTruthy();
    });
});
