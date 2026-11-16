<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import EarlyWarningScoreView from "./EarlyWarningScoreView.svelte";

    const { Story } = defineMeta({
        title: "Headless/EarlyWarningScoreView",
        component: EarlyWarningScoreView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <EarlyWarningScoreView
        system="NEWS2"
        score={7}
        band="high"
        bandLabel="High"
        escalation="Urgent response"
    />
</Story>
