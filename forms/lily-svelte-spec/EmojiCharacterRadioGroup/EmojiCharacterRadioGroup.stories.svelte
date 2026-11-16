<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import EmojiCharacterRadioGroup from "./EmojiCharacterRadioGroup.svelte";

    const { Story } = defineMeta({
        title: "Headless/EmojiCharacterRadioGroup",
        component: EmojiCharacterRadioGroup,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Group" }}
>
    <span>Group content</span>
</Story>
