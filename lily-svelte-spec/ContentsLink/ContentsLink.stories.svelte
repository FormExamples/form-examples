<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ContentsLink from "./ContentsLink.svelte";
    const { Story } = defineMeta({
        title: "Headless/ContentsLink",
        component: ContentsLink,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ContentsLink label="ContentsLink example">
        <span>ContentsLink example</span>
    </ContentsLink>
</Story>
