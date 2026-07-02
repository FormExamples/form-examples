<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AddressographBox from "./AddressographBox.svelte";
    const { Story } = defineMeta({
        title: "Headless/AddressographBox",
        component: AddressographBox,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <AddressographBox label="Patient identification">
        <span>Jane Doe</span>
    </AddressographBox>
</Story>
