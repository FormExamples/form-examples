<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import DeviceRecordList from "./DeviceRecordList.svelte";
    import DeviceRecordListItem from "../DeviceRecordListItem/DeviceRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/DeviceRecordList",
        component: DeviceRecordList,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <DeviceRecordList
        status="known"
        statusLabel="Medical devices"
    >
        <DeviceRecordListItem
            device="Cardiac pacemaker"
            status="active"
            statusLabel="In use"
            timing="2021-02-08"
            timingLabel="Since 8 Feb 2021"
        />
    </DeviceRecordList>
</Story>

<Story name="No known medical devices">
    <DeviceRecordList
        status="none-known"
        statusLabel="No known medical devices"
    />
</Story>
