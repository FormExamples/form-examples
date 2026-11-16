<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TaiwanGuominShenfenzhengTongyiBianhaoInput from "./TaiwanGuominShenfenzhengTongyiBianhaoInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/TaiwanGuominShenfenzhengTongyiBianhaoInput",
        component: TaiwanGuominShenfenzhengTongyiBianhaoInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Identification Card Number Input" }}
/>
