<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Autosuggest from "./Autosuggest.svelte";

    const { Story } = defineMeta({
        title: "Headless/Autosuggest",
        component: Autosuggest,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{
        label: "Fruit",
        suggestions: [
            { value: "apple", label: "Apple" },
            { value: "apricot", label: "Apricot" },
        ],
    }}
/>
