import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TextInput.svelte";

describe("TextInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Name" } });
        const input = screen.getByLabelText("Name") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Full name" } });
        expect(screen.getByLabelText("Full name")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Name", required: true } });
        expect((screen.getByLabelText("Name") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Name", disabled: true } });
        expect((screen.getByLabelText("Name") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Name", "data-testid": "ti" } });
        expect(screen.getByTestId("ti")).toBeTruthy();
    });
});
