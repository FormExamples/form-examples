import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Field.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Field", () => {
    test("renders label", () => {
        render(Subject, { props: { label: "Name", children: textSnippet("input") } });
        expect(screen.getByText("Name")).toBeTruthy();
    });

    test("renders description", () => {
        render(Subject, { props: { label: "Name", description: "Full name", children: textSnippet("input") } });
        expect(screen.getByText("Full name")).toBeTruthy();
    });

    test("renders error with alert role", () => {
        render(Subject, { props: { label: "Name", error: "Required", children: textSnippet("input") } });
        expect(screen.getByRole("alert").textContent).toBe("Required");
    });

    test("shows required indicator", () => {
        render(Subject, { props: { label: "Name", required: true, children: textSnippet("input") } });
        expect(screen.getByText("*")).toBeTruthy();
    });

    test("required indicator is aria-hidden", () => {
        render(Subject, { props: { label: "Name", required: true, children: textSnippet("input") } });
        expect(screen.getByText("*").closest("[aria-hidden]")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "f", children: textSnippet("C") } });
        expect(screen.getByTestId("f")).toBeTruthy();
    });
});
