import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Label.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Label", () => {
    test("renders label text", () => {
        render(Subject, { props: { children: textSnippet("Email") } });
        expect(screen.getByText("Email")).toBeTruthy();
    });

    test("has for attribute", () => {
        render(Subject, { props: { for: "email-input", "data-testid": "lbl", children: textSnippet("Email") } });
        expect(screen.getByTestId("lbl").getAttribute("for")).toBe("email-input");
    });

    test("renders as label element", () => {
        render(Subject, { props: { "data-testid": "lbl", children: textSnippet("Name") } });
        expect(screen.getByTestId("lbl").tagName).toBe("LABEL");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "lbl", children: textSnippet("X") } });
        expect(screen.getByTestId("lbl")).toBeTruthy();
    });
});
