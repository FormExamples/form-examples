import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./UrlInput.svelte";

describe("UrlInput", () => {
    test("renders a url input", () => {
        render(Subject, { props: { label: "Website" } });
        const input = screen.getByLabelText("Website") as HTMLInputElement;
        expect(input.type).toBe("url");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Website URL" } });
        expect(screen.getByLabelText("Website URL")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "URL", required: true } });
        expect((screen.getByLabelText("URL") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "URL", disabled: true } });
        expect((screen.getByLabelText("URL") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "URL", "data-testid": "ui" } });
        expect(screen.getByTestId("ui")).toBeTruthy();
    });
});
