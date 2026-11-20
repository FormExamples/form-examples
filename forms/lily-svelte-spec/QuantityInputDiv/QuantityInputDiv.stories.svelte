<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import QuantityInputDiv from "./QuantityInputDiv.svelte";
    const { Story } = defineMeta({
        title: "Headless/QuantityInputDiv",
        component: QuantityInputDiv,
    });
    const units = [
        { value: "kg", label: "kilograms", min: 0, max: 300, step: 0.1 },
        { value: "[lb_av]", label: "pounds", min: 0, max: 660, step: 0.1 },
    ];
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <QuantityInputDiv
        label="Weight"
        magnitudeLabel="Amount"
        unitLabel="Unit"
        name="weight"
        {units}
    />
</Story>

<Story
    name="One unit"
    tags={["autodocs", "!dev"]}
>
    <QuantityInputDiv
        label="Height"
        magnitudeLabel="Amount"
        units={[{ value: "cm", label: "centimetres", min: 30, max: 250 }]}
    />
</Story>
