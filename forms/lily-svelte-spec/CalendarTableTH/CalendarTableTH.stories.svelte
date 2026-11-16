<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CalendarTableTH from "./CalendarTableTH.svelte";

    const { Story } = defineMeta({
        title: "Headless/CalendarTableTH",
        component: CalendarTableTH,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
/>
