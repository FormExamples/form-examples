import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./GovernmentIdentifier.svelte";

function htmlSnippet(html: string) {
    return (($$anchor: Comment) => {
        const template = document.createElement("template");
        template.innerHTML = html;
        $$anchor.before(template.content.cloneNode(true));
    }) as any;
}

const baseProps = {
    label: "Agency identifier",
    agencyName: "U.S. Department of Example",
};

describe("GovernmentIdentifier", () => {
    test("renders as a section with the government-identifier class", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const root = container.querySelector("section.government-identifier") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("applies aria-label on the section", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const section = container.querySelector("section") as HTMLElement;
        expect(section.getAttribute("aria-label")).toBe("Agency identifier");
    });

    test("renders the agency name in a span when no agencyHref", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const span = container.querySelector("p.government-identifier-agency span") as HTMLElement;
        expect(span).toBeTruthy();
        expect(span.textContent).toBe("U.S. Department of Example");
    });

    test("renders the agency name in an anchor when agencyHref provided", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            agencyHref: "https://example.gov",
        }});

        const link = container.querySelector("p.government-identifier-agency a") as HTMLAnchorElement;
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("https://example.gov");
        expect(link.textContent).toBe("U.S. Department of Example");
    });

    test("renders the logo image when logoUrl provided", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            logoUrl: "/logo.svg",
            logoAlt: "Agency logo",
        }});

        const img = container.querySelector("img.government-identifier-logo") as HTMLImageElement;
        expect(img.getAttribute("src")).toBe("/logo.svg");
        expect(img.getAttribute("alt")).toBe("Agency logo");
    });

    test("renders description when provided", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            description: "An official agency",
        }});

        const desc = container.querySelector("p.government-identifier-description") as HTMLElement;
        expect(desc.textContent).toBe("An official agency");
    });

    test("renders nested nav with aria-label when children provided", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            children: htmlSnippet("<a href='/about'>About</a>"),
        }});

        const nav = container.querySelector("nav.government-identifier-links") as HTMLElement;
        expect(nav).toBeTruthy();
        expect(nav.getAttribute("aria-label")).toBe("Agency identifier");
        expect(nav.querySelector("a")?.getAttribute("href")).toBe("/about");
    });

    test("omits nav when no children", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        expect(container.querySelector("nav")).toBeNull();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: { ...baseProps, class: "extra" } });

        const root = container.querySelector("section") as HTMLElement;
        expect(root.className).toContain("government-identifier");
        expect(root.className).toContain("extra");
    });
});
