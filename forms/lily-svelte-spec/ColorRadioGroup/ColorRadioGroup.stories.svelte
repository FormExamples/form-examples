<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ColorRadioGroup from "./ColorRadioGroup.svelte";

    const { Story } = defineMeta({
        title: "Headless/ColorRadioGroup",
        component: ColorRadioGroup,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Group" }}
>
    <span>Group content</span>
</Story>
