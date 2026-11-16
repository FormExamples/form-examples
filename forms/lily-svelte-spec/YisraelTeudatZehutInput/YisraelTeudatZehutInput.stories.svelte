<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import YisraelTeudatZehutInput from "./YisraelTeudatZehutInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/YisraelTeudatZehutInput",
        component: YisraelTeudatZehutInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Teudat Zehut (תעודת זהות) Input" }}
/>
