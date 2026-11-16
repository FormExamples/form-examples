<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import YisraelTeudatZehutView from "./YisraelTeudatZehutView.svelte";

    const { Story } = defineMeta({
        title: "Headless/YisraelTeudatZehutView",
        component: YisraelTeudatZehutView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Teudat Zehut (תעודת זהות) View" }}
/>
