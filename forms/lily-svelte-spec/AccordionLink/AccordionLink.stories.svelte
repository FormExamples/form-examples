<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AccordionLink from "./AccordionLink.svelte";
    const { Story } = defineMeta({
        title: "Headless/AccordionLink",
        component: AccordionLink,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <AccordionLink label="AccordionLink example">
        <span>AccordionLink example</span>
    </AccordionLink>
</Story>
