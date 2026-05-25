import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Hint.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Hint", () => {
    test("renders hint text", () => {
        render(Subject, { props: { children: textSnippet("Enter email") } });
        expect(screen.getByText("Enter email")).toBeTruthy();
    });

    test("has id for linking", () => {
        render(Subject, { props: { id: "hint-1", children: textSnippet("Help") } });
        expect(document.getElementById("hint-1")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "h", children: textSnippet("H") } });
        expect(screen.getByTestId("h")).toBeTruthy();
    });
});
