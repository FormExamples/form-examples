<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Flair from './Flair.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Flair',
    component: Flair,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Flair'}}
>
  <span>Flair</span>
</Story>
