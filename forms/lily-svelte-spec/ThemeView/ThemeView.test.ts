import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ThemeView.svelte";

describe("ThemeView", () => {
    test("renders a span", () => {
        render(Subject, { props: { label: "Theme", value: "dark", "data-testid": "tv" } });
        expect(screen.getByTestId("tv").tagName).toBe("SPAN");
    });

    test("displays the theme value", () => {
        render(Subject, { props: { label: "Theme", value: "dark" } });
        expect(screen.getByText("dark")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Current theme", value: "light" } });
        expect(screen.getByLabelText("Current theme")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", value: "x", "data-testid": "tv" } });
        expect(screen.getByTestId("tv")).toBeTruthy();
    });
});
