<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PortugalPassaporteView from './PortugalPassaporteView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PortugalPassaporteView',
    component: PortugalPassaporteView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Portugal Passaporte View'}}
/>
