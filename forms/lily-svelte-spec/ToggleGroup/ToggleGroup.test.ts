import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ToggleGroup.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("ToggleGroup", () => {
    test("renders a group", () => {
        render(Subject, { props: { label: "Format", children: textSnippet("content") } });
        expect(screen.getByRole("group")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Format", children: textSnippet("content") } });
        expect(screen.getByLabelText("Format")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Format", children: textSnippet("Bold") } });
        expect(screen.getByText("Bold")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "tg", children: textSnippet("x") } });
        expect(screen.getByTestId("tg")).toBeTruthy();
    });
});
