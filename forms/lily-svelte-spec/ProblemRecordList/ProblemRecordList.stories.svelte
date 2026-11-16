<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ProblemRecordList from "./ProblemRecordList.svelte";
    import ProblemRecordListItem from "../ProblemRecordListItem/ProblemRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/ProblemRecordList",
        component: ProblemRecordList,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ProblemRecordList
        status="known"
        statusLabel="Problems"
    >
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
    </ProblemRecordList>
</Story>

<Story name="No known problems">
    <ProblemRecordList
        status="none-known"
        statusLabel="No known problems"
    />
</Story>
