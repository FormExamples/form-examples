<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import WarningText from "./WarningText.svelte";
    const { Story } = defineMeta({
        title: "Headless/WarningText",
        component: WarningText,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <WarningText>
        {#snippet icon()}!{/snippet}
        <span class="screen-reader-span">Warning</span>
        You can be fined up to £5,000 if you do not register.
    </WarningText>
</Story>
