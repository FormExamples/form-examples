<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Organization from "./Organization.svelte";
    const { Story } = defineMeta({
        title: "Headless/Organization",
        component: Organization,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Organization label="Organization example">
        <span>Organization example</span>
    </Organization>
</Story>
