import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AustraliaIndividualHealthcareIdentifierView.svelte";

describe("AustraliaIndividualHealthcareIdentifierView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Individual Healthcare Identifier", value: "test-value" },
        });

        const el = document.querySelector(
            ".australia-individual-healthcare-identifier-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "australia-individual-healthcare-identifier-view",
        );
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Individual Healthcare Identifier", value: "test-value" },
        });

        const el = document.querySelector(
            ".australia-individual-healthcare-identifier-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Individual Healthcare Identifier" } });

        const el = document.querySelector(
            ".australia-individual-healthcare-identifier-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Individual Healthcare Identifier"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
