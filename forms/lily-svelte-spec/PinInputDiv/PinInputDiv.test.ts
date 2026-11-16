import { fireEvent, render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./PinInputDiv.svelte";

describe("PinInputDiv", () => {
    test("renders a group element with aria-label", () => {
        render(Subject, { props: { label: "Enter PIN" } });

        const group = screen.getByRole("group");
        expect(group.getAttribute("aria-label")).toBe("Enter PIN");
    });

    test("renders 4 digit inputs by default", () => {
        render(Subject, { props: { label: "Enter PIN" } });

        const inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBe(4);
    });

    test("renders custom number of digit inputs", () => {
        render(Subject, { props: { label: "Enter Code", length: 6 } });

        const inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBe(6);
    });

    test("each input has numeric inputmode", () => {
        render(Subject, { props: { label: "Enter PIN" } });

        const inputs = screen.getAllByRole("textbox");
        for (const input of inputs) {
            expect(input.getAttribute("inputmode")).toBe("numeric");
        }
    });

    test("each input has maxlength of 1", () => {
        render(Subject, { props: { label: "Enter PIN" } });

        const inputs = screen.getAllByRole("textbox");
        for (const input of inputs) {
            expect((input as HTMLInputElement).maxLength).toBe(1);
        }
    });

    test("each input has an accessible digit label", () => {
        render(Subject, {
            props: {
                label: "Enter PIN",
                digitLabel: (n: number, of: number) => `Digit ${n} of ${of}`,
            },
        });

        expect(screen.getByLabelText("Digit 1 of 4")).toBeTruthy();
        expect(screen.getByLabelText("Digit 2 of 4")).toBeTruthy();
        expect(screen.getByLabelText("Digit 3 of 4")).toBeTruthy();
        expect(screen.getByLabelText("Digit 4 of 4")).toBeTruthy();
    });

    test("digit labels reflect custom length", () => {
        render(Subject, {
            props: {
                label: "Enter Code",
                length: 6,
                digitLabel: (n: number, of: number) => `Digit ${n} of ${of}`,
            },
        });

        expect(screen.getByLabelText("Digit 1 of 6")).toBeTruthy();
        expect(screen.getByLabelText("Digit 6 of 6")).toBeTruthy();
    });

    test("all inputs are disabled when disabled prop is true", () => {
        render(Subject, { props: { label: "Enter PIN", disabled: true } });

        const inputs = screen.getAllByRole("textbox");
        for (const input of inputs) {
            expect((input as HTMLInputElement).disabled).toBe(true);
        }
    });

    test("all inputs are enabled by default", () => {
        render(Subject, { props: { label: "Enter PIN" } });

        const inputs = screen.getAllByRole("textbox");
        for (const input of inputs) {
            expect((input as HTMLInputElement).disabled).toBe(false);
        }
    });

    test("passes through additional HTML attributes to the group", () => {
        render(Subject, {
            props: { label: "Enter PIN", "data-testid": "pin-group" },
        });

        const group = screen.getByTestId("pin-group");
        expect(group).toBeTruthy();
    });

    test("passes through id attribute to the group", () => {
        render(Subject, { props: { label: "Enter PIN", id: "my-pin" } });

        const group = screen.getByRole("group");
        expect(group.getAttribute("id")).toBe("my-pin");
    });
});

/** Render inside a real <form>, so form.reset() reaches the component. */
function inForm(props: Record<string, unknown>): HTMLFormElement {
    const form = document.createElement("form");
    document.body.appendChild(form);
    render(Subject, { target: form, props: props as any });
    return form;
}

const afterReset = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("initial value and form reset", () => {
    test("the initial value fills the digit inputs instead of being cleared on mount", () => {
        const form = inForm({ label: "PIN", length: 4, value: "12" });
        const values = [...form.querySelectorAll<HTMLInputElement>("input")].map(
            (input) => input.value,
        );
        expect(values).toEqual(["1", "2", "", ""]);
    });

    test("a form reset restores the initial digits", async () => {
        const form = inForm({ label: "PIN", length: 2, value: "1" });
        const inputs = form.querySelectorAll<HTMLInputElement>("input");
        inputs[1].value = "7";
        await fireEvent.input(inputs[1]);
        form.reset();
        await afterReset();
        expect([...inputs].map((input) => input.value)).toEqual(["1", ""]);
    });
});

describe("no English default", () => {
    test("without digitLabel each input is named by the group's own label", () => {
        render(Subject, { props: { label: "Código", length: 2 } });
        expect(
            screen.getAllByLabelText("Código").filter((el) => el.tagName === "INPUT"),
        ).toHaveLength(2);
        expect(screen.queryByLabelText(/Digit/)).toBeNull();
    });

    test("ArrowRight and ArrowLeft move focus between the digit inputs", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "PIN" } });
        const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
        inputs[1].focus();
        await user.keyboard("{ArrowRight}");
        expect(document.activeElement).toBe(inputs[2]);
        await user.keyboard("{ArrowLeft}{ArrowLeft}");
        expect(document.activeElement).toBe(inputs[0]);
    });

    test("Backspace in an empty input moves to the previous one and clears it", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "PIN" } });
        const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
        inputs[0].focus();
        await user.keyboard("1");
        expect(document.activeElement).toBe(inputs[1]);
        await user.keyboard("{Backspace}");
        expect(document.activeElement).toBe(inputs[0]);
        expect(inputs[0].value).toBe("");
    });
});
