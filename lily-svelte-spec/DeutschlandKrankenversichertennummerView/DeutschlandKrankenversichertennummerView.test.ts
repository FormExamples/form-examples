import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DeutschlandKrankenversichertennummerView.svelte";

describe("DeutschlandKrankenversichertennummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Health Insurance Number", value: "test-value" } });

        const el = screen.getByLabelText("Health Insurance Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("deutschland-krankenversichertennummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Health Insurance Number", value: "test-value" } });

        const el = screen.getByLabelText("Health Insurance Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Health Insurance Number" } });

        const el = screen.getByLabelText("Health Insurance Number");
        expect(el.getAttribute("aria-label")).toBe("Health Insurance Number");
    });
});
