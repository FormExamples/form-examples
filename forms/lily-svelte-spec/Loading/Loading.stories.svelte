<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Loading from "./Loading.svelte";
    const { Story } = defineMeta({
        title: "Headless/Loading",
        component: Loading,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Loading label="Loading example">
        <span>Loading example</span>
    </Loading>
</Story>
