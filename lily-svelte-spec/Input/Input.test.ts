import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Input.svelte";

describe("Input", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Name" } });
        expect(screen.getByLabelText("Name")).toBeTruthy();
    });

    test("defaults to text type", () => {
        render(Subject, { props: { label: "Name" } });
        expect((screen.getByLabelText("Name") as HTMLInputElement).type).toBe("text");
    });

    test("supports custom type", () => {
        render(Subject, { props: { label: "Search", type: "search" } });
        expect((screen.getByLabelText("Search") as HTMLInputElement).type).toBe("search");
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
        render(Subject, { props: { label: "N", "data-testid": "inp" } });
        expect(screen.getByTestId("inp")).toBeTruthy();
    });
});
