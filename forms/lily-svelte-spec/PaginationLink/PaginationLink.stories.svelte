<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PaginationLink from "./PaginationLink.svelte";
    const { Story } = defineMeta({
        title: "Headless/PaginationLink",
        component: PaginationLink,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <PaginationLink label="PaginationLink example">
        <span>PaginationLink example</span>
    </PaginationLink>
</Story>
