<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PilipinasPhilhealthIdentificationNumberInput from "./PilipinasPhilhealthIdentificationNumberInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/PilipinasPhilhealthIdentificationNumberInput",
        component: PilipinasPhilhealthIdentificationNumberInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "PhilHealth Identification Number (PIN) Input" }}
/>
