<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SouthAfricaIdentityNumberView from "./SouthAfricaIdentityNumberView.svelte";

    const { Story } = defineMeta({
        title: "Headless/SouthAfricaIdentityNumberView",
        component: SouthAfricaIdentityNumberView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "South African Identity Number View" }}
/>
