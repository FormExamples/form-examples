<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import IranKodEMelliInput from "./IranKodEMelliInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/IranKodEMelliInput",
        component: IranKodEMelliInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Code (Kod-e Melli) Input" }}
/>
