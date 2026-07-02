import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EspanaTarjetaSanitariaIndividualInput from "./EspanaTarjetaSanitariaIndividualInput.svelte";

describe("EspanaTarjetaSanitariaIndividualInput", () => {
    test("renders with content", () => {
        render(EspanaTarjetaSanitariaIndividualInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("espana-tarjeta-sanitaria-individual-input");
    });
});
