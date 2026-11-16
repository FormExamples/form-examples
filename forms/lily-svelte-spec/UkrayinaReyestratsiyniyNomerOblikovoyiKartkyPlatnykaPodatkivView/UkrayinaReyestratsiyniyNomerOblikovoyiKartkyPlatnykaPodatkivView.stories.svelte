<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView from "./UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView.svelte";

    const { Story } = defineMeta({
        title: "Headless/UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView",
        component: UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Реєстраційний номер облікової картки платника податків (РНОКПП) View" }}
/>
