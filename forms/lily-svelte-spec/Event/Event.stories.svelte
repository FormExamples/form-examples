<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Event from "./Event.svelte";
    const { Story } = defineMeta({
        title: "Headless/Event",
        component: Event,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Event label="Event example">
        <span>Event example</span>
    </Event>
</Story>
