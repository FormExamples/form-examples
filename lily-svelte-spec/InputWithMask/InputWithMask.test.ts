import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./InputWithMask.svelte";

describe("InputWithMask", () => {
    test("renders as a div with the input-with-mask class", () => {
        const { container } = render(Subject, { props: {
            label: "Phone",
            mask: "(___) ___-____",
        }});

        const root = container.querySelector("div.input-with-mask") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("exposes data-mask on the wrapper", () => {
        const { container } = render(Subject, { props: {
            label: "Phone",
            mask: "(___) ___-____",
        }});

        const root = container.querySelector("div.input-with-mask") as HTMLElement;
        expect(root.getAttribute("data-mask")).toBe("(___) ___-____");
    });

    test("renders the mask display as aria-hidden span", () => {
        const { container } = render(Subject, { props: {
            label: "Phone",
            mask: "(___) ___-____",
        }});

        const display = container.querySelector("span.input-with-mask-display") as HTMLElement;
        expect(display).toBeTruthy();
        expect(display.getAttribute("aria-hidden")).toBe("true");
        expect(display.textContent).toBe("(___) ___-____");
    });

    test("renders the input with type text and aria-label", () => {
        const { container } = render(Subject, { props: {
            label: "Phone number",
            mask: "(___) ___-____",
        }});

        const input = container.querySelector("input.input-with-mask-control") as HTMLInputElement;
        expect(input.getAttribute("type")).toBe("text");
        expect(input.getAttribute("aria-label")).toBe("Phone number");
    });

    test("applies value", () => {
        render(Subject, { props: {
            label: "Phone",
            mask: "(___) ___-____",
            value: "(555) 123-4567",
        }});

        const input = screen.getByLabelText("Phone") as HTMLInputElement;
        expect(input.value).toBe("(555) 123-4567");
    });

    test("can be disabled", () => {
        render(Subject, { props: {
            label: "Phone",
            mask: "(___) ___-____",
            disabled: true,
        }});

        const input = screen.getByLabelText("Phone") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("calls oninput on input", async () => {
        const user: UserEvent = userEvent.setup();
        const handleInput = vi.fn();
        render(Subject, { props: {
            label: "Phone",
            mask: "(___) ___-____",
            oninput: handleInput,
        }});

        const input = screen.getByLabelText("Phone");
        await user.type(input, "5");
        expect(handleInput).toHaveBeenCalled();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Phone",
            mask: "(___) ___-____",
            class: "extra",
        }});

        const root = container.querySelector("div") as HTMLElement;
        expect(root.className).toContain("input-with-mask");
        expect(root.className).toContain("extra");
    });
});
