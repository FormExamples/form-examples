<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BelgiqueNumeroDeRegistreNationalInput from './BelgiqueNumeroDeRegistreNationalInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BelgiqueNumeroDeRegistreNationalInput',
    component: BelgiqueNumeroDeRegistreNationalInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Belgique Numero De Registre National Input'}}
/>
