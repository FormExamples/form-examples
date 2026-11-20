<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RecordProvenanceView from "./RecordProvenanceView.svelte";
    const { Story } = defineMeta({
        title: "Headless/RecordProvenanceView",
        component: RecordProvenanceView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <RecordProvenanceView
        attestation="pending"
        attestationLabel="Awaiting signature"
        source="device"
        sourceLabel="From a blood pressure monitor"
        authorLabel="Dr A Patel"
        recorded="2026-11-03T09:00"
        recordedLabel="Recorded 09:00"
    />
</Story>

<Story
    name="Not sent"
    tags={["autodocs", "!dev"]}
>
    <RecordProvenanceView
        sync="pending"
        syncLabel="Saved on this device, not yet sent"
        authorLabel="Nurse B Okafor"
    />
</Story>
