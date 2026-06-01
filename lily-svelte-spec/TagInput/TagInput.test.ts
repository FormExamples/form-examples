import { render, screen } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TagInput.svelte";

describe("TagInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Add tag" } });
        expect((screen.getByLabelText("Add tag") as HTMLInputElement).type).toBe("text");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "New tag" } });
        expect(screen.getByLabelText("New tag")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Add tag", disabled: true } });
        expect((screen.getByLabelText("Add tag") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "ti" } });
        expect(screen.getByTestId("ti")).toBeTruthy();
    });
});
