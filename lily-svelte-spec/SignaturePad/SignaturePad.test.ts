import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./SignaturePad.svelte";
function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }
describe("SignaturePad", () => {
    test("renders application role", () => { render(Subject, { props: { label: "Signature", children: textSnippet("canvas") } }); expect(screen.getByRole("application")).toBeTruthy(); });
    test("has aria-label", () => { render(Subject, { props: { label: "Sign here", children: textSnippet("canvas") } }); expect(screen.getByLabelText("Sign here")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { label: "S", "data-testid": "sp", children: textSnippet("x") } }); expect(screen.getByTestId("sp")).toBeTruthy(); });
});
