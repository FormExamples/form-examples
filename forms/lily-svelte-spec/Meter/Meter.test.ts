import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Meter.svelte";

describe("Meter", () => {
    test("renders as a meter", () => {
        render(Subject, { props: { label: "Disk", value: 50 } });
        expect(screen.getByRole("meter")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Memory", value: 60 } });
        expect(screen.getByRole("meter").getAttribute("aria-label")).toBe("Memory");
    });

    test("has correct value", () => {
        render(Subject, { props: { label: "M", value: 42, "data-testid": "m" } });
        expect((screen.getByTestId("m") as HTMLMeterElement).value).toBe(42);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "M", value: 10, "data-testid": "m" } });
        expect(screen.getByTestId("m")).toBeTruthy();
    });
});
