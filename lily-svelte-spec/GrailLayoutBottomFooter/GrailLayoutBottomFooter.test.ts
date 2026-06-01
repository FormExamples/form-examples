import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./GrailLayoutBottomFooter.svelte";

function childSnippet() {
    return (($anchor: Comment) => {
        const div = document.createElement("div");
        div.textContent = "Footer";
        $anchor.before(div);
    }) as any;
}

describe("GrailLayoutBottomFooter", () => {
    test("renders a footer", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(document.querySelector("footer.grail-layout-bottom-footer")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(screen.getByText("Footer")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "glbf", children: childSnippet() } });
        expect(screen.getByTestId("glbf")).toBeTruthy();
    });
});
