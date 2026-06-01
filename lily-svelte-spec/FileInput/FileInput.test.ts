import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./FileInput.svelte";

describe("FileInput", () => {
    test("renders a file input", () => {
        render(Subject, { props: { label: "Upload" } });
        const input = screen.getByLabelText("Upload") as HTMLInputElement;
        expect(input.type).toBe("file");
    });

    test("supports accept attribute", () => {
        render(Subject, { props: { label: "Upload", accept: "image/*" } });
        expect((screen.getByLabelText("Upload") as HTMLInputElement).accept).toBe("image/*");
    });

    test("supports multiple", () => {
        render(Subject, { props: { label: "Upload", multiple: true } });
        expect((screen.getByLabelText("Upload") as HTMLInputElement).multiple).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Upload", required: true } });
        expect((screen.getByLabelText("Upload") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Upload", disabled: true } });
        expect((screen.getByLabelText("Upload") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Upload", "data-testid": "fi" } });
        expect(screen.getByTestId("fi")).toBeTruthy();
    });
});
