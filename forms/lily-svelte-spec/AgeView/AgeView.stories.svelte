<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AgeView from "./AgeView.svelte";

    const { Story } = defineMeta({
        title: "Headless/AgeView",
        component: AgeView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <AgeView
        label="Age"
        value="3 weeks 2 days"
        duration="P23D"
    />
</Story>
