<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SlovenskoPasView from './SlovenskoPasView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SlovenskoPasView',
    component: SlovenskoPasView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Slovensko Pas View'}}
/>
