import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TaskBarButton.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("TaskBarButton", () => {
    test("renders a button", () => {
        render(Subject, { props: { children: textSnippet("New") } });
        expect(screen.getByRole("button")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("Open") } });
        expect(screen.getByText("Open")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(Subject, { props: { disabled: true, children: textSnippet("X") } });
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "tbi", children: textSnippet("X") } });
        expect(screen.getByTestId("tbi")).toBeTruthy();
    });
});
