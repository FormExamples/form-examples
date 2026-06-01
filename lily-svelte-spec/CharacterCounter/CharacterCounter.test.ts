import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./CharacterCounter.svelte";

describe("CharacterCounter", () => {
    test("renders with status role", () => {
        render(Subject, { props: {} });
        expect(screen.getByRole("status")).toBeTruthy();
    });

    test("displays count only when no max", () => {
        render(Subject, { props: { count: 42 } });
        expect(screen.getByRole("status").textContent).toContain("42");
    });

    test("displays count / max when max provided", () => {
        render(Subject, { props: { count: 50, max: 280 } });
        expect(screen.getByRole("status").textContent).toContain("50 / 280");
    });

    test("has aria-live polite", () => {
        render(Subject, { props: {} });
        expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
    });

    test("exposes data-count attribute", () => {
        render(Subject, { props: { count: 10 } });
        expect(screen.getByRole("status").getAttribute("data-count")).toBe("10");
    });

    test("exposes data-remaining attribute", () => {
        render(Subject, { props: { count: 50, max: 280 } });
        expect(screen.getByRole("status").getAttribute("data-remaining")).toBe("230");
    });

    test("exposes data-over-limit when over max", () => {
        render(Subject, { props: { count: 300, max: 280 } });
        expect(screen.getByRole("status").getAttribute("data-over-limit")).toBe("true");
    });

    test("does not have data-over-limit when under max", () => {
        render(Subject, { props: { count: 100, max: 280 } });
        expect(screen.getByRole("status").getAttribute("data-over-limit")).toBeNull();
    });

    test("applies aria-label", () => {
        render(Subject, { props: { label: "Character count" } });
        expect(screen.getByRole("status").getAttribute("aria-label")).toBe("Character count");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "counter" } });
        expect(screen.getByTestId("counter")).toBeTruthy();
    });
});
