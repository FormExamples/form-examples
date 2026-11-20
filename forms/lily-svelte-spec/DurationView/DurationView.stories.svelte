<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import DurationView from "./DurationView.svelte";
    const { Story } = defineMeta({
        title: "Headless/DurationView",
        component: DurationView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <DurationView
        label="Length of stay"
        value="3 days 4 hours"
        duration="P3DT4H"
    />
</Story>

<Story
    name="Negative"
    tags={["autodocs", "!dev"]}
>
    <DurationView
        value="3 days early"
        duration="-P3D"
    />
</Story>
