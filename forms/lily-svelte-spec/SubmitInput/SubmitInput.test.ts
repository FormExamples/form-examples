import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SubmitInput.svelte";

describe("SubmitInput", () => {
    test("renders a submit button", () => {
        render(Subject, { props: {} });
        const input = screen.getByDisplayValue("Submit") as HTMLInputElement;
        expect(input.type).toBe("submit");
    });

    test("has default value text", () => {
        render(Subject, { props: {} });
        expect(screen.getByDisplayValue("Submit")).toBeTruthy();
    });

    test("supports custom value text", () => {
        render(Subject, { props: { value: "Send" } });
        expect(screen.getByDisplayValue("Send")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(Subject, { props: { disabled: true } });
        expect((screen.getByDisplayValue("Submit") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "si" } });
        expect(screen.getByTestId("si")).toBeTruthy();
    });
});
