<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import HangukJuminDeungnokBeonhoInput from "./HangukJuminDeungnokBeonhoInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/HangukJuminDeungnokBeonhoInput",
        component: HangukJuminDeungnokBeonhoInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Resident Registration Number (주민등록번호) Input" }}
/>
