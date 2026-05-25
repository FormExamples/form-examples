import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ColorInput.svelte";

describe("ColorInput", () => {
    test("renders as a color input", () => {
        render(Subject, { props: { label: "Color" } });
        const input = screen.getByLabelText("Color") as HTMLInputElement;
        expect(input.type).toBe("color");
    });

    test("defaults to #000000", () => {
        render(Subject, { props: { label: "Color" } });
        expect((screen.getByLabelText("Color") as HTMLInputElement).value).toBe("#000000");
    });

    test("accepts initial value", () => {
        render(Subject, { props: { label: "Color", value: "#ff0000" } });
        expect((screen.getByLabelText("Color") as HTMLInputElement).value).toBe("#ff0000");
    });

    test("can be disabled", () => {
        render(Subject, { props: { label: "Color", disabled: true } });
        expect((screen.getByLabelText("Color") as HTMLInputElement).disabled).toBe(true);
    });

    test("applies name and id", () => {
        render(Subject, { props: { label: "Color", name: "bg-color", id: "color-1" } });
        const input = screen.getByLabelText("Color");
        expect(input.getAttribute("name")).toBe("bg-color");
        expect(input.getAttribute("id")).toBe("color-1");
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Color" } });
        await user.tab();
        expect(document.activeElement).toBe(screen.getByLabelText("Color"));
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Color", "data-testid": "ci" } });
        expect(screen.getByTestId("ci")).toBeTruthy();
    });
});
