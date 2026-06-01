<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Person from "./Person.svelte";
    const { Story } = defineMeta({
        title: "Headless/Person",
        component: Person,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Person label="Person example">
        <span>Person example</span>
    </Person>
</Story>
