import { render, screen } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./OneTimePasswordInput.svelte";

function input() {
    return screen.getByLabelText("Code") as HTMLInputElement;
}

describe("OneTimePasswordInput", () => {
    test("renders ONE native text input with the base class", () => {
        render(Subject, { props: { label: "Code", length: 6 } });
        expect(screen.getAllByRole("textbox")).toHaveLength(1);
        expect(input().tagName).toBe("INPUT");
        expect(input().type).toBe("text");
        expect(input().getAttribute("class")).toContain("one-time-password-input");
    });

    test("has aria-label from label", () => {
        render(Subject, { props: { label: "Code", length: 6 } });
        expect(input().getAttribute("aria-label")).toBe("Code");
    });

    test("is autofill-ready: one-time-code, numeric keypad", () => {
        render(Subject, { props: { label: "Code", length: 6 } });
        expect(input().getAttribute("autocomplete")).toBe("one-time-code");
        expect(input().getAttribute("inputmode")).toBe("numeric");
    });

    test("maxlength and data-length follow length", () => {
        render(Subject, { props: { label: "Code", length: 8 } });
        expect(input().getAttribute("maxlength")).toBe("8");
        expect(input().getAttribute("data-length")).toBe("8");
    });

    test("typing is limited to length characters", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Code", length: 4 } });
        await user.type(input(), "123456");
        expect(input().value).toBe("1234");
    });

    test("default pattern is digits, overridable", () => {
        const { unmount } = render(Subject, { props: { label: "Code", length: 6 } });
        expect(input().getAttribute("pattern")).toBe("[0-9]*");
        unmount();
        render(Subject, {
            props: { label: "Code", length: 6, pattern: "[A-Z0-9]*", inputMode: "text" },
        });
        expect(input().getAttribute("pattern")).toBe("[A-Z0-9]*");
        expect(input().getAttribute("inputmode")).toBe("text");
    });

    test("disables spellcheck and autocapitalize", () => {
        render(Subject, { props: { label: "Code", length: 6 } });
        expect(input().getAttribute("spellcheck")).toBe("false");
        expect(input().getAttribute("autocapitalize")).toBe("off");
    });

    test("initial value is shown", () => {
        render(Subject, { props: { label: "Code", length: 6, value: "123" } });
        expect(input().value).toBe("123");
    });

    test("supports name, required and disabled", () => {
        render(Subject, {
            props: { label: "Code", length: 6, name: "otp", required: true, disabled: true },
        });
        expect(input().name).toBe("otp");
        expect(input().required).toBe(true);
        expect(input().disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Code", length: 6, "data-testid": "otp" } });
        expect(screen.getByTestId("otp")).toBeTruthy();
    });
});
