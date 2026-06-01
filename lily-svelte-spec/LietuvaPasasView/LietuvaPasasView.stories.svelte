<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LietuvaPasasView from './LietuvaPasasView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LietuvaPasasView',
    component: LietuvaPasasView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Lietuva Pasas View'}}
/>
