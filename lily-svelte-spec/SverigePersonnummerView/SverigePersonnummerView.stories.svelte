<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SverigePersonnummerView from './SverigePersonnummerView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SverigePersonnummerView',
    component: SverigePersonnummerView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Sverige Personnummer View'}}
/>
