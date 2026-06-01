import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Splitter.svelte";

describe("Splitter", () => {
    test("renders a separator", () => {
        render(Subject, { props: { label: "Resize" } });
        expect(screen.getByRole("separator")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Resize panels" } });
        expect(screen.getByLabelText("Resize panels")).toBeTruthy();
    });

    test("defaults to vertical orientation", () => {
        render(Subject, { props: { label: "Resize" } });
        expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical");
    });

    test("supports horizontal orientation", () => {
        render(Subject, { props: { label: "Resize", orientation: "horizontal" } });
        expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("horizontal");
    });

    test("is keyboard focusable", () => {
        render(Subject, { props: { label: "Resize" } });
        expect(screen.getByRole("separator").getAttribute("tabindex")).toBe("0");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "R", "data-testid": "sp" } });
        expect(screen.getByTestId("sp")).toBeTruthy();
    });
});
