<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AvatarGroup from "./AvatarGroup.svelte";
    const { Story } = defineMeta({
        title: "Headless/AvatarGroup",
        component: AvatarGroup,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <AvatarGroup label="AvatarGroup example">
        <span>AvatarGroup example</span>
    </AvatarGroup>
</Story>
