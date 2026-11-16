<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import IranKodEMelliView from "./IranKodEMelliView.svelte";

    const { Story } = defineMeta({
        title: "Headless/IranKodEMelliView",
        component: IranKodEMelliView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Code (Kod-e Melli) View" }}
/>
