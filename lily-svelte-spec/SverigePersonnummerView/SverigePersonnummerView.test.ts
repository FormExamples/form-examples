import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SverigePersonnummerView.svelte";

describe("SverigePersonnummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Personal Identity Number", value: "test-value" } });

        const el = screen.getByLabelText("Personal Identity Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("sverige-personnummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Personal Identity Number", value: "test-value" } });

        const el = screen.getByLabelText("Personal Identity Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Personal Identity Number" } });

        const el = screen.getByLabelText("Personal Identity Number");
        expect(el.getAttribute("aria-label")).toBe("Personal Identity Number");
    });
});
