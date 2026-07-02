import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./GrailLayoutTopHeader.svelte";

function childSnippet() {
    return (($anchor: Comment) => {
        const div = document.createElement("div");
        div.textContent = "Header";
        $anchor.before(div);
    }) as any;
}

describe("GrailLayoutTopHeader", () => {
    test("renders a header", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(document.querySelector("header.grail-layout-top-header")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(screen.getByText("Header")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "glth", children: childSnippet() } });
        expect(screen.getByTestId("glth")).toBeTruthy();
    });
});
