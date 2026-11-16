import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PrathetThaiLekPrajamTuaPrachachonView.svelte";

describe("PrathetThaiLekPrajamTuaPrachachonView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)", value: "test-value" },
        });

        const el = document.querySelector(
            ".prathet-thai-lek-prajam-tua-prachachon-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("prathet-thai-lek-prajam-tua-prachachon-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)", value: "test-value" },
        });

        const el = document.querySelector(
            ".prathet-thai-lek-prajam-tua-prachachon-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)" } });

        const el = document.querySelector(
            ".prathet-thai-lek-prajam-tua-prachachon-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
