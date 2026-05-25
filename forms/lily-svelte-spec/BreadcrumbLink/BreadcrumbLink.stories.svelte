<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import BreadcrumbLink from "./BreadcrumbLink.svelte";
    const { Story } = defineMeta({
        title: "Headless/BreadcrumbLink",
        component: BreadcrumbLink,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <BreadcrumbLink label="BreadcrumbLink example">
        <span>BreadcrumbLink example</span>
    </BreadcrumbLink>
</Story>
