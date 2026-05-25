import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./FileUpload.svelte";

describe("FileUpload", () => {
    test("renders upload button", () => {
        render(Subject, { props: { label: "Upload" } });
        expect(screen.getByRole("button", { name: "Upload" })).toBeTruthy();
    });

    test("has hidden file input", () => {
        render(Subject, { props: { label: "Upload", "data-testid": "fu" } });
        const hidden = screen.getByTestId("fu").querySelector("input[type='file']") as HTMLInputElement;
        expect(hidden).toBeTruthy();
        expect(hidden.hidden).toBe(true);
    });

    test("has live region for status", () => {
        render(Subject, { props: { label: "Upload", "data-testid": "fu" } });
        const live = screen.getByTestId("fu").querySelector("[aria-live='polite']");
        expect(live).toBeTruthy();
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Upload", disabled: true } });
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Upload", "data-testid": "fu" } });
        expect(screen.getByTestId("fu")).toBeTruthy();
    });
});
