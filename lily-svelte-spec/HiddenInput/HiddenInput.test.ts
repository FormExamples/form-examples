import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./HiddenInput.svelte";

describe("HiddenInput", () => {
    test("renders a hidden input", () => {
        const { container } = render(Subject, { props: { name: "token", value: "abc" } });
        const input = container.querySelector("input[type='hidden']") as HTMLInputElement;
        expect(input).toBeTruthy();
    });

    test("has correct name", () => {
        const { container } = render(Subject, { props: { name: "csrf", value: "xyz" } });
        const input = container.querySelector("input") as HTMLInputElement;
        expect(input.name).toBe("csrf");
    });

    test("has correct value", () => {
        const { container } = render(Subject, { props: { name: "id", value: "123" } });
        const input = container.querySelector("input") as HTMLInputElement;
        expect(input.value).toBe("123");
    });

    test("passes through attributes", () => {
        const { container } = render(Subject, { props: { name: "x", "data-testid": "hi" } });
        expect(container.querySelector("[data-testid='hi']")).toBeTruthy();
    });
});
