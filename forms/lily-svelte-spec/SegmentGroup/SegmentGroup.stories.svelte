<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SegmentGroup from './SegmentGroup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SegmentGroup',
    component: SegmentGroup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Segment Group'}}
>
  <span>Segment</span>
</Story>
