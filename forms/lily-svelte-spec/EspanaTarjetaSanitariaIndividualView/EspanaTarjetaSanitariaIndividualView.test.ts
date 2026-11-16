import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EspanaTarjetaSanitariaIndividualView from "./EspanaTarjetaSanitariaIndividualView.svelte";

describe("EspanaTarjetaSanitariaIndividualView", () => {
    test("renders with content", () => {
        render(EspanaTarjetaSanitariaIndividualView, { props: { label: "Test" } });
        const el = document.querySelector(
            ".espana-tarjeta-sanitaria-individual-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("espana-tarjeta-sanitaria-individual-view");
    });
});
