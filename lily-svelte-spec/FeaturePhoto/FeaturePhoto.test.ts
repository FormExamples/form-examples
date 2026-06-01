import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./FeaturePhoto.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("FeaturePhoto", () => {
    test("renders a figure with class feature-photo", () => {
        const { container } = render(Subject, { src: "/p.jpg", alt: "A" });
        const fig = container.querySelector(".feature-photo");
        expect(fig).toBeTruthy();
        expect(fig?.tagName).toBe("FIGURE");
    });

    test("renders an img with src and alt", () => {
        const { container } = render(Subject, { src: "/p.jpg", alt: "A photo" });
        const img = container.querySelector("img.feature-photo-image");
        expect(img?.getAttribute("src")).toBe("/p.jpg");
        expect(img?.getAttribute("alt")).toBe("A photo");
    });

    test("defaults loading to lazy", () => {
        const { container } = render(Subject, { src: "/p.jpg", alt: "A" });
        expect(container.querySelector("img")?.getAttribute("loading")).toBe("lazy");
    });

    test("supports loading=eager", () => {
        const { container } = render(Subject, { src: "/p.jpg", alt: "A", loading: "eager" });
        expect(container.querySelector("img")?.getAttribute("loading")).toBe("eager");
    });

    test("omits figcaption when neither caption nor credit", () => {
        const { container } = render(Subject, { src: "/p.jpg", alt: "A" });
        expect(container.querySelector("figcaption")).toBeNull();
    });

    test("renders caption snippet when provided", () => {
        const { container } = render(Subject, {
            src: "/p.jpg", alt: "A", caption: snippet("Sunset"),
        });
        expect(container.querySelector(".feature-photo-caption-text")?.textContent).toBe("Sunset");
    });

    test("renders credit snippet when provided", () => {
        const { container } = render(Subject, {
            src: "/p.jpg", alt: "A", credit: snippet("Jane"),
        });
        expect(container.querySelector(".feature-photo-credit")?.textContent).toBe("Jane");
    });
});
