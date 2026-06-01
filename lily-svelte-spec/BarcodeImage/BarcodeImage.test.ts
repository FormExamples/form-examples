import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BarcodeImage from "./BarcodeImage.svelte";

describe("BarcodeImage", () => {
    test("renders with src and alt", () => {
        render(BarcodeImage, {
            props: { src: "/barcode-images/order-12345.svg", alt: "Order number 12345" },
        });
        const el = screen.getByAltText("Order number 12345") as HTMLImageElement;
        expect(el).toBeTruthy();
        expect(el.tagName).toBe("IMG");
        expect(el.getAttribute("class")).toContain("barcode-image");
        expect(el.getAttribute("src")).toBe("/barcode-images/order-12345.svg");
    });
});
