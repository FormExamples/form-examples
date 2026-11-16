<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TaiwanGuominShenfenzhengTongyiBianhaoView from "./TaiwanGuominShenfenzhengTongyiBianhaoView.svelte";

    const { Story } = defineMeta({
        title: "Headless/TaiwanGuominShenfenzhengTongyiBianhaoView",
        component: TaiwanGuominShenfenzhengTongyiBianhaoView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Identification Card Number View" }}
/>
