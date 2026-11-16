<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NigeriaNationalIdentificationNumberInput from "./NigeriaNationalIdentificationNumberInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/NigeriaNationalIdentificationNumberInput",
        component: NigeriaNationalIdentificationNumberInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Identification Number (NIN) Input" }}
/>
