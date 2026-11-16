import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./UnitedStatesSocialSecurityNumberView.svelte";

describe("UnitedStatesSocialSecurityNumberView", () => {
    test("renders a span element", () => {
        render(Subject, { props: { label: "SSN", value: "123-45-6789" } });

        const element = document.querySelector(
            ".united-states-social-security-number-view",
        ) as HTMLElement;
        expect(element.tagName).toBe("SPAN");
    });

    test("displays the SSN value", () => {
        render(Subject, { props: { label: "SSN", value: "123-45-6789" } });

        const element = document.querySelector(
            ".united-states-social-security-number-view",
        ) as HTMLElement;
        expect(
            element.textContent?.replace(
                element.querySelector(".screen-reader-span")?.textContent ?? "",
                "",
            ),
        ).toBe("123-45-6789");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Social Security Number", value: "999-88-7777" } });

        const element = document.querySelector(
            ".united-states-social-security-number-view",
        ) as HTMLElement;
        expect(element).toBeTruthy();
    });

    test("defaults to empty string when value not provided", () => {
        render(Subject, { props: { label: "SSN" } });

        const element = document.querySelector(
            ".united-states-social-security-number-view",
        ) as HTMLElement;
        expect(
            element.textContent?.replace(
                element.querySelector(".screen-reader-span")?.textContent ?? "",
                "",
            ),
        ).toBe("");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "SSN", value: "123-45-6789", "data-testid": "ssn-view" },
        });

        const element = screen.getByTestId("ssn-view");
        expect(element).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { label: "SSN", value: "123-45-6789", id: "ssn-display" } });

        const element = document.querySelector(
            ".united-states-social-security-number-view",
        ) as HTMLElement;
        expect(element.getAttribute("id")).toBe("ssn-display");
    });
});
