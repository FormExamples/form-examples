import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DownloadButton.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("DownloadButton", () => {
    test("renders as an anchor with the download-button class", () => {
        const { container } = render(Subject, { props: {
            href: "/file.pdf",
            label: "Download brochure",
        }});

        const root = container.querySelector("a.download-button") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("requires and applies href", () => {
        const { container } = render(Subject, { props: {
            href: "/file.pdf",
            label: "Download brochure",
        }});

        const link = container.querySelector("a") as HTMLAnchorElement;
        expect(link.getAttribute("href")).toBe("/file.pdf");
    });

    test("requires and applies aria-label", () => {
        render(Subject, { props: {
            href: "/file.pdf",
            label: "Download brochure",
        }});

        const link = screen.getByRole("link", { name: "Download brochure" });
        expect(link.getAttribute("aria-label")).toBe("Download brochure");
    });

    test("uses label as default text when no children provided", () => {
        const { container } = render(Subject, { props: {
            href: "/file.pdf",
            label: "Download brochure",
        }});

        const link = container.querySelector("a") as HTMLElement;
        expect(link.textContent).toContain("Download brochure");
    });

    test("renders custom children when provided", () => {
        const { container } = render(Subject, { props: {
            href: "/file.pdf",
            label: "Download brochure",
            children: textSnippet("Custom text"),
        }});

        const link = container.querySelector("a") as HTMLElement;
        expect(link.textContent).toContain("Custom text");
    });

    test("applies data-file-size and data-file-format", () => {
        const { container } = render(Subject, { props: {
            href: "/file.pdf",
            label: "Download brochure",
            fileSize: "2.4 MB",
            fileFormat: "PDF",
        }});

        const link = container.querySelector("a") as HTMLElement;
        expect(link.getAttribute("data-file-size")).toBe("2.4 MB");
        expect(link.getAttribute("data-file-format")).toBe("PDF");
    });

    test("applies download attribute as boolean true", () => {
        const { container } = render(Subject, { props: {
            href: "/file.pdf",
            label: "Download brochure",
            download: true,
        }});

        const link = container.querySelector("a") as HTMLElement;
        expect(link.hasAttribute("download")).toBe(true);
    });

    test("applies download attribute as filename string", () => {
        const { container } = render(Subject, { props: {
            href: "/file.pdf",
            label: "Download brochure",
            download: "brochure.pdf",
        }});

        const link = container.querySelector("a") as HTMLElement;
        expect(link.getAttribute("download")).toBe("brochure.pdf");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            href: "/file.pdf",
            label: "Download",
            class: "extra",
        }});

        const root = container.querySelector("a") as HTMLElement;
        expect(root.className).toContain("download-button");
        expect(root.className).toContain("extra");
    });
});
