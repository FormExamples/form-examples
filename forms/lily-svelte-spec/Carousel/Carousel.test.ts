import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Carousel.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("Carousel", () => {
    test("renders a region", () => {
        render(Subject, { props: { label: "Gallery", children: textSnippet("slide") } });
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Photo gallery", children: textSnippet("slide") } });
        expect(screen.getByLabelText("Photo gallery")).toBeTruthy();
    });

    test("has carousel roledescription", () => {
        render(Subject, { props: { label: "Gallery", children: textSnippet("slide") } });
        expect(screen.getByRole("region").getAttribute("aria-roledescription")).toBe("carousel");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Gallery", children: textSnippet("Slide 1") } });
        expect(screen.getByText("Slide 1")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "G", "data-testid": "car", children: textSnippet("x") } });
        expect(screen.getByTestId("car")).toBeTruthy();
    });
});
