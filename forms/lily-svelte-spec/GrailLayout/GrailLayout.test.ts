import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./GrailLayout.svelte";

function childSnippet() {
    return (($anchor: Comment) => {
        const div = document.createElement("div");
        div.textContent = "Content";
        $anchor.before(div);
    }) as any;
}

describe("GrailLayout", () => {
    test("renders a div", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(document.querySelector(".grail-layout")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(screen.getByText("Content")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "gl", children: childSnippet() } });
        expect(screen.getByTestId("gl")).toBeTruthy();
    });
});
