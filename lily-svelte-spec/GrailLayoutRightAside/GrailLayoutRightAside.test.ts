import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./GrailLayoutRightAside.svelte";

function childSnippet() {
    return (($anchor: Comment) => {
        const div = document.createElement("div");
        div.textContent = "Right";
        $anchor.before(div);
    }) as any;
}

describe("GrailLayoutRightAside", () => {
    test("renders an aside", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(document.querySelector("aside.grail-layout-right-aside")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(screen.getByText("Right")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "glra", children: childSnippet() } });
        expect(screen.getByTestId("glra")).toBeTruthy();
    });
});
