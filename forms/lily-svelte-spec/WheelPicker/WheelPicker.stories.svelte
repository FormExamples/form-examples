<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import WheelPicker from "./WheelPicker.svelte";
    const { Story } = defineMeta({
        title: "Headless/WheelPicker",
        component: WheelPicker,
    });
    const options = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
    ];
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <WheelPicker
        label="Month"
        {options}
        value="2"
    />
</Story>
