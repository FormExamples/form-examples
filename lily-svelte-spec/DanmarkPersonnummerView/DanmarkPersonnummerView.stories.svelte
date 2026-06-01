<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DanmarkPersonnummerView from './DanmarkPersonnummerView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DanmarkPersonnummerView',
    component: DanmarkPersonnummerView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Danmark Personnummer View'}}
/>
