<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NumericRatingScalePicker from "./NumericRatingScalePicker.svelte";
    const { Story } = defineMeta({
        title: "Headless/NumericRatingScalePicker",
        component: NumericRatingScalePicker,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <NumericRatingScalePicker
        label="How bad is the pain right now?"
        minLabel="0: no pain"
        maxLabel="10: worst pain imaginable"
        name="pain"
    />
</Story>
