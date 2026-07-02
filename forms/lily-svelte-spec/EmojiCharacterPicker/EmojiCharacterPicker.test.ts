import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./EmojiCharacterPicker.svelte";
function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }
describe("EmojiCharacterPicker", () => {
    test("renders a grid", () => { render(Subject, { props: { label: "Emoji", children: textSnippet("emojis") } }); expect(screen.getByRole("grid")).toBeTruthy(); });
    test("has aria-label", () => { render(Subject, { props: { label: "Pick emoji", children: textSnippet("emojis") } }); expect(screen.getByLabelText("Pick emoji")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { label: "E", "data-testid": "ep", children: textSnippet("x") } }); expect(screen.getByTestId("ep")).toBeTruthy(); });
});
