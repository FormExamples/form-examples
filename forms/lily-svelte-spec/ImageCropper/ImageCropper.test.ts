import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./ImageCropper.svelte";
function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }
describe("ImageCropper", () => {
    test("renders application role", () => { render(Subject, { props: { label: "Image cropper", children: textSnippet("image") } }); expect(screen.getByRole("application")).toBeTruthy(); });
    test("has class image-cropper", () => { render(Subject, { props: { label: "Crop", "data-testid": "ic", children: textSnippet("image") } }); expect(screen.getByTestId("ic").classList.contains("image-cropper")).toBe(true); });
    test("has aria-label reflecting label prop", () => { render(Subject, { props: { label: "Crop your photo", children: textSnippet("image") } }); expect(screen.getByLabelText("Crop your photo")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { label: "C", "data-testid": "ic2", children: textSnippet("x") } }); expect(screen.getByTestId("ic2")).toBeTruthy(); });
});
