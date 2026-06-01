<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import DialGroup from "./DialGroup.svelte";
    const { Story } = defineMeta({
        title: "Headless/DialGroup",
        component: DialGroup,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <DialGroup label="DialGroup example">
        <span>DialGroup example</span>
    </DialGroup>
</Story>
