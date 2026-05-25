import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TextAreaInput.svelte";

describe("TextAreaInput", () => {
    test("renders a text-area-input", () => {
        render(Subject, { props: { label: "Comments" } });
        expect(screen.getByRole("textbox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Your comments" } });
        expect(screen.getByLabelText("Your comments")).toBeTruthy();
    });

    test("sets rows attribute", () => {
        render(Subject, { props: { label: "C", rows: 5, "data-testid": "ta" } });
        expect((screen.getByTestId("ta") as HTMLTextAreaElement).rows).toBe(5);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "C", required: true } });
        expect((screen.getByRole("textbox") as HTMLTextAreaElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "C", disabled: true } });
        expect((screen.getByRole("textbox") as HTMLTextAreaElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "C", "data-testid": "ta" } });
        expect(screen.getByTestId("ta")).toBeTruthy();
    });
});
