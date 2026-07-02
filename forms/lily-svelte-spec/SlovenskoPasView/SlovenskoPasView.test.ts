import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SlovenskoPasView.svelte";

describe("SlovenskoPasView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Slovak Passport", value: "test-value" } });

        const el = screen.getByLabelText("Slovak Passport");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("slovensko-pas-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Slovak Passport", value: "test-value" } });

        const el = screen.getByLabelText("Slovak Passport");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Slovak Passport" } });

        const el = screen.getByLabelText("Slovak Passport");
        expect(el.getAttribute("aria-label")).toBe("Slovak Passport");
    });
});
