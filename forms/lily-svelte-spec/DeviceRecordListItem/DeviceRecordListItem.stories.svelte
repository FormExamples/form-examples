<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import DeviceRecordListItem from "./DeviceRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/DeviceRecordListItem",
        component: DeviceRecordListItem,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ul>
        <DeviceRecordListItem
            device="Cardiac pacemaker"
            status="active"
            statusLabel="In use"
            timing="2021-02-08"
            timingLabel="Since 8 Feb 2021"
        />
    </ul>
</Story>
