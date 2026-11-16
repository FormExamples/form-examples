<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RossiyaSnilsView from "./RossiyaSnilsView.svelte";

    const { Story } = defineMeta({
        title: "Headless/RossiyaSnilsView",
        component: RossiyaSnilsView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta) View" }}
/>
