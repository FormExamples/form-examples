import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./QrCode.svelte";
function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }
describe("QrCode", () => {
    test("renders an img role", () => { render(Subject, { props: { label: "QR code", children: textSnippet("qr") } }); expect(screen.getByRole("img")).toBeTruthy(); });
    test("has aria-label", () => { render(Subject, { props: { label: "Scan to visit", children: textSnippet("qr") } }); expect(screen.getByLabelText("Scan to visit")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { label: "Q", "data-testid": "qr", children: textSnippet("x") } }); expect(screen.getByTestId("qr")).toBeTruthy(); });
});
