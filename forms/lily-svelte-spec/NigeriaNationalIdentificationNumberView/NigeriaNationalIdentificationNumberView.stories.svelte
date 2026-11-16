<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NigeriaNationalIdentificationNumberView from "./NigeriaNationalIdentificationNumberView.svelte";

    const { Story } = defineMeta({
        title: "Headless/NigeriaNationalIdentificationNumberView",
        component: NigeriaNationalIdentificationNumberView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Identification Number (NIN) View" }}
/>
