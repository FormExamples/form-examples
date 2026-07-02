<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NorgeFodselsnummerView from './NorgeFodselsnummerView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NorgeFodselsnummerView',
    component: NorgeFodselsnummerView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Norge Fodselsnummer View'}}
/>
