import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Separator.svelte";

describe("Separator", () => {
    test("renders with separator role", () => {
        render(Subject, { props: {} });
        expect(screen.getByRole("separator")).toBeTruthy();
    });

    test("renders as hr element", () => {
        render(Subject, { props: { "data-testid": "sep" } });
        expect(screen.getByTestId("sep").tagName).toBe("HR");
    });

    test("supports optional label", () => {
        render(Subject, { props: { label: "Section break" } });
        expect(screen.getByRole("separator").getAttribute("aria-label")).toBe("Section break");
    });

    test("has no label by default", () => {
        render(Subject, { props: {} });
        expect(screen.getByRole("separator").getAttribute("aria-label")).toBeNull();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "sep" } });
        expect(screen.getByTestId("sep")).toBeTruthy();
    });
});
