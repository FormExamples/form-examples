import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ErrorMessage.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ErrorMessage", () => {
    test("renders with alert role", () => {
        render(Subject, { props: { children: textSnippet("Error occurred") } });
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("displays error text", () => {
        render(Subject, { props: { children: textSnippet("Field is required") } });
        expect(screen.getByRole("alert").textContent).toContain("Field is required");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "err", children: textSnippet("E") } });
        expect(screen.getByTestId("err")).toBeTruthy();
    });
});
