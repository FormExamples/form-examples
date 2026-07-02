<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RomaniaCodNumericPersonalView from './RomaniaCodNumericPersonalView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RomaniaCodNumericPersonalView',
    component: RomaniaCodNumericPersonalView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Romania Cod Numeric Personal View'}}
/>
