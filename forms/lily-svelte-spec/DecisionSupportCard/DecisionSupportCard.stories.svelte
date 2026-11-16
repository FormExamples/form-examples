<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import DecisionSupportCard from "./DecisionSupportCard.svelte";

    const { Story } = defineMeta({
        title: "Headless/DecisionSupportCard",
        component: DecisionSupportCard,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <DecisionSupportCard
        summary="Penicillin allergy recorded"
        indicator="critical"
        indicatorLabel="Critical"
        sourceLabel="Local formulary"
        suggestions={[{ id: "cancel", label: "Cancel amoxicillin", isRecommended: true }]}
        dismissLabel="Dismiss"
        overrideReasons={[{ code: "aware", display: "Patient tolerated before" }]}
        overrideReasonLabel="Reason for dismissing"
        overrideReasonPlaceholder="Choose a reason"
    >
        <p>Amoxicillin is a penicillin.</p>
    </DecisionSupportCard>
</Story>
