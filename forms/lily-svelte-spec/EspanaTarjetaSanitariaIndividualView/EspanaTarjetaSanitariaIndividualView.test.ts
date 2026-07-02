import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EspanaTarjetaSanitariaIndividualView from "./EspanaTarjetaSanitariaIndividualView.svelte";

describe("EspanaTarjetaSanitariaIndividualView", () => {
    test("renders with content", () => {
        render(EspanaTarjetaSanitariaIndividualView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("espana-tarjeta-sanitaria-individual-view");
    });
});
