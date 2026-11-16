<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MultiSelect from "./MultiSelect.svelte";

    const { Story } = defineMeta({
        title: "Headless/MultiSelect",
        component: MultiSelect,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Multi Select", size: 3 }}
>
    <option value="1">Option 1</option><option value="2">Option 2</option><option value="3"
        >Option 3</option
    >
</Story>
