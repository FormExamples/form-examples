import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./GrailLayoutCenterMain.svelte";

function childSnippet() {
    return (($anchor: Comment) => {
        const div = document.createElement("div");
        div.textContent = "Main";
        $anchor.before(div);
    }) as any;
}

describe("GrailLayoutCenterMain", () => {
    test("renders a main", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(document.querySelector("main.grail-layout-center-main")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(screen.getByText("Main")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "glcm", children: childSnippet() } });
        expect(screen.getByTestId("glcm")).toBeTruthy();
    });
});
