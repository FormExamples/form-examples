import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PrathetThaiLekPrajamTuaPrachachonInput.svelte";

describe("PrathetThaiLekPrajamTuaPrachachonInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)" } });

        const input = screen.getByLabelText(
            "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)",
        ) as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)" } });

        const input = screen.getByLabelText("เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)");
        expect(input.getAttribute("class")).toContain(
            "prathet-thai-lek-prajam-tua-prachachon-input",
        );
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)" } });

        const input = screen.getByLabelText("เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)" } });

        const input = screen.getByLabelText(
            "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)",
        ) as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, {
            props: { label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)", required: true },
        });

        const input = screen.getByLabelText(
            "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)",
        ) as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)" } });

        const input = screen.getByLabelText(
            "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, {
            props: { label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)", disabled: true },
        });

        const input = screen.getByLabelText(
            "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: {
                label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)",
                "data-testid": "subject",
            },
        });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
