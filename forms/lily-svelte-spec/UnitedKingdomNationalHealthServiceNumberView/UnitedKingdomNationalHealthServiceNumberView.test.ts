import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./UnitedKingdomNationalHealthServiceNumberView.svelte";

describe("UnitedKingdomNationalHealthServiceNumberView", () => {
    test("renders a span element", () => {
        render(Subject, { props: { label: "NHS Number", value: "123 456 7890" } });

        const element = document.querySelector(
            ".united-kingdom-national-health-service-number-view",
        ) as HTMLElement;
        expect(element.tagName).toBe("SPAN");
    });

    test("displays the NHS number value", () => {
        render(Subject, { props: { label: "NHS Number", value: "123 456 7890" } });

        const element = document.querySelector(
            ".united-kingdom-national-health-service-number-view",
        ) as HTMLElement;
        expect(
            element.textContent?.replace(
                element.querySelector(".screen-reader-span")?.textContent ?? "",
                "",
            ),
        ).toBe("123 456 7890");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Patient NHS Number", value: "999 888 7777" } });

        const element = document.querySelector(
            ".united-kingdom-national-health-service-number-view",
        ) as HTMLElement;
        expect(element).toBeTruthy();
    });

    test("defaults to empty string when value not provided", () => {
        render(Subject, { props: { label: "NHS Number" } });

        const element = document.querySelector(
            ".united-kingdom-national-health-service-number-view",
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
            props: { label: "NHS Number", value: "123 456 7890", "data-testid": "nhs-view" },
        });

        const element = screen.getByTestId("nhs-view");
        expect(element).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, {
            props: { label: "NHS Number", value: "123 456 7890", id: "nhs-display" },
        });

        const element = document.querySelector(
            ".united-kingdom-national-health-service-number-view",
        ) as HTMLElement;
        expect(element.getAttribute("id")).toBe("nhs-display");
    });
});
