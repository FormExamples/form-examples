<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DeutschlandKrankenversichertennummerView from './DeutschlandKrankenversichertennummerView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DeutschlandKrankenversichertennummerView',
    component: DeutschlandKrankenversichertennummerView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Deutschland Krankenversichertennummer View'}}
/>
