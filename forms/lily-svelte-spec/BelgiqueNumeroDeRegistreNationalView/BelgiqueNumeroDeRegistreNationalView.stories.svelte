<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BelgiqueNumeroDeRegistreNationalView from './BelgiqueNumeroDeRegistreNationalView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BelgiqueNumeroDeRegistreNationalView',
    component: BelgiqueNumeroDeRegistreNationalView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Belgique Numero De Registre National View'}}
/>
