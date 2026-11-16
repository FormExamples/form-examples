<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput from "./UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput",
        component: UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Реєстраційний номер облікової картки платника податків (РНОКПП) Input" }}
/>
