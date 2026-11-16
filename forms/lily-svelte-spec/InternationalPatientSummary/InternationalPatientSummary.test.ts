import { render, screen, within } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./InternationalPatientSummary.svelte";

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));

const requiredHeadings = {
    medications: "Medication summary",
    allergies: "Allergies and intolerances",
    problems: "Problem list",
};

const base = {
    label: "Patient summary",
    requiredHeadings,
    omittedLabel: "Section missing from document",
};

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("InternationalPatientSummary", () => {
    test("is an article named by its label, with the consumer's sections inside", () => {
        render(Subject, {
            props: {
                ...base,
                sections: [
                    { key: "medications", heading: "Medication summary" },
                    { key: "allergies", heading: "Allergies and intolerances" },
                    { key: "problems", heading: "Problem list" },
                ],
                children: html(
                    '<section class="international-patient-summary-section" id="x">Entries</section>',
                ),
            },
        });
        const article = screen.getByRole("article", { name: "Patient summary" });
        expect(article.getAttribute("class")).toContain("international-patient-summary");
        expect(
            article.querySelector(".international-patient-summary-sections")!.textContent,
        ).toContain("Entries");
        expect(article.querySelectorAll('[data-status="omitted"]')).toHaveLength(0);
    });

    test("adds each missing required section, in words, after the given sections", () => {
        const { container } = render(Subject, {
            props: {
                ...base,
                sections: [{ key: "problems", heading: "Problem list", status: "none-known" }],
            },
        });
        const added = [
            ...container.querySelectorAll(".international-patient-summary-sections > section"),
        ];
        expect(added.map((s) => s.getAttribute("data-section"))).toEqual([
            "medications",
            "allergies",
        ]);
        for (const s of added) {
            expect(s.getAttribute("data-status")).toBe("omitted");
            expect(s.getAttribute("data-required")).toBe("true");
            expect(s.textContent).toContain("Section missing from document");
        }
        expect(
            screen
                .getByRole("region", { name: "Allergies and intolerances" })
                .getAttribute("data-code"),
        ).toBe("48765-2");
    });

    test("with no sections at all, all three required sections are shown as missing", () => {
        const { container } = render(Subject, { props: base });
        expect(container.querySelectorAll('section[data-status="omitted"]')).toHaveLength(3);
    });

    test("the contents navigation follows the list, then the missing required sections, and links to their ids", () => {
        render(Subject, {
            props: {
                ...base,
                contentsLabel: "Contents",
                sections: [
                    { key: "allergies", heading: "Allergies and intolerances" },
                    { key: "results", heading: "Results", status: "not-recorded" },
                ],
            },
        });
        const nav = screen.getByRole("navigation", { name: "Contents" });
        const links = within(nav).getAllByRole("link");
        expect(links.map((a) => a.textContent)).toEqual([
            "Allergies and intolerances",
            "Results",
            "Medication summary",
            "Problem list",
        ]);
        expect(links[1].getAttribute("href")).toBe("#international-patient-summary-results");
        expect(links[1].closest("li")!.getAttribute("data-status")).toBe("not-recorded");
        expect(links[2].closest("li")!.getAttribute("data-status")).toBe("omitted");
        expect(document.getElementById("international-patient-summary-medications")).toBeTruthy();
    });

    test("without contentsLabel there is no navigation", () => {
        render(Subject, { props: base });
        expect(screen.queryByRole("navigation")).toBeNull();
    });

    test("renders the banner first and the document details last", () => {
        const { container } = render(Subject, {
            props: {
                ...base,
                banner: html("<p>Banner</p>"),
                details: html("<p>Details</p>"),
            },
        });
        const parts = [...container.querySelector("article")!.children].map((c) =>
            c.getAttribute("class"),
        );
        expect(parts[0]).toBe("international-patient-summary-banner");
        expect(parts[parts.length - 1]).toBe("international-patient-summary-details");
    });

    test("passes other attributes to the article", () => {
        render(Subject, { props: { ...base, "data-testid": "ips" } });
        expect(screen.getByTestId("ips").tagName).toBe("ARTICLE");
    });

    test("warns in development when the label or the omitted words are missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { ...base, label: "", omittedLabel: "" } });
        expect(warn).toHaveBeenCalled();
    });

    test("idPrefix gives the added sections and the contents links their own ids", () => {
        render(Subject, { props: { ...base, contentsLabel: "Contents", idPrefix: "second" } });
        expect(document.getElementById("second-medications")!.getAttribute("data-status")).toBe(
            "omitted",
        );
        expect(document.getElementById("international-patient-summary-medications")).toBeNull();
        const first = within(screen.getByRole("navigation", { name: "Contents" })).getAllByRole(
            "link",
        )[0];
        expect(first.getAttribute("href")).toBe("#second-medications");
    });
});
