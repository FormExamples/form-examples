<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import KbdShortcut from "./KbdShortcut.svelte";

    const { Story } = defineMeta({
        title: "Headless/KbdShortcut",
        component: KbdShortcut,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ keys: ["Ctrl", "K"], label: "Control K" }}
/>
