<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MockupPhonePortrait from "./MockupPhonePortrait.svelte";
    const { Story } = defineMeta({
        title: "Headless/MockupPhonePortrait",
        component: MockupPhonePortrait,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <MockupPhonePortrait label="MockupPhonePortrait example">
        <span>MockupPhonePortrait example</span>
    </MockupPhonePortrait>
</Story>
