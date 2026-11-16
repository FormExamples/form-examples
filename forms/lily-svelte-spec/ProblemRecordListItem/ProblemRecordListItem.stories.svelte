<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ProblemRecordListItem from "./ProblemRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/ProblemRecordListItem",
        component: ProblemRecordListItem,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ul>
        <ProblemRecordListItem
            condition="Type 2 diabetes"
            clinicalStatus="active"
            clinicalStatusLabel="Active"
            verificationStatus="confirmed"
            verificationStatusLabel="Confirmed"
            severityLabel="Moderate"
            onset="2019-06-01"
            onsetLabel="Since June 2019"
            abatement="2024-01-15"
            abatementLabel="Resolved 15 Jan 2024"
        />
    </ul>
</Story>
