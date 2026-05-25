import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./GrailLayoutLeftAside.svelte";

function childSnippet() {
    return (($anchor: Comment) => {
        const div = document.createElement("div");
        div.textContent = "Left";
        $anchor.before(div);
    }) as any;
}

describe("GrailLayoutLeftAside", () => {
    test("renders an aside", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(document.querySelector("aside.grail-layout-left-aside")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { children: childSnippet() } });
        expect(screen.getByText("Left")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "glla", children: childSnippet() } });
        expect(screen.getByTestId("glla")).toBeTruthy();
    });
});
