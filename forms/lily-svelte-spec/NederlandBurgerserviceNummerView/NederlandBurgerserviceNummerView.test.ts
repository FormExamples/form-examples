import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NederlandBurgerserviceNummerView.svelte";

describe("NederlandBurgerserviceNummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Citizen Service Number", value: "test-value" } });

        const el = document.querySelector(".nederland-burgerservice-nummer-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nederland-burgerservice-nummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Citizen Service Number", value: "test-value" } });

        const el = document.querySelector(".nederland-burgerservice-nummer-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Citizen Service Number" } });

        const el = document.querySelector(".nederland-burgerservice-nummer-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Citizen Service Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
