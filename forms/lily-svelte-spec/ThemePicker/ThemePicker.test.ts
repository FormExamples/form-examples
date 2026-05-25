import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ThemePicker.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("ThemePicker", () => {
    test("renders a radiogroup", () => {
        render(Subject, { props: { label: "Theme", children: textSnippet("options") } });
        expect(screen.getByRole("radiogroup")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Choose theme", children: textSnippet("options") } });
        expect(screen.getByLabelText("Choose theme")).toBeTruthy();
    });

    test("uses fieldset element", () => {
        render(Subject, { props: { label: "Theme", children: textSnippet("options") } });
        expect(screen.getByRole("radiogroup").tagName).toBe("FIELDSET");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "tp", children: textSnippet("x") } });
        expect(screen.getByTestId("tp")).toBeTruthy();
    });
});
