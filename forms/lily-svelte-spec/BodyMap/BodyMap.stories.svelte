<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import BodyMap from "./BodyMap.svelte";
    const { Story } = defineMeta({
        title: "Headless/BodyMap",
        component: BodyMap,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <BodyMap
        label="Where is the pain?"
        name="region"
        regions={[
            { id: "head", label: "Head" },
            { id: "chest", label: "Chest" },
            { id: "abdomen", label: "Abdomen" },
        ]}
        selected={["chest"]}
    >
        <svg
            viewBox="0 0 40 80"
            width="80"
            height="160"
        >
            <circle
                data-region="head"
                cx="20"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
            />
            <rect
                data-region="chest"
                x="10"
                y="20"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
            />
            <rect
                data-region="abdomen"
                x="10"
                y="42"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
            />
        </svg>
    </BodyMap>
</Story>
