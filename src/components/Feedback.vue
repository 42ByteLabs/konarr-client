<script setup lang="ts">
import { computed } from "vue";

const assignees = "GeekMasher";

const props = defineProps<{
  title: string;
  info?: string;

  input?: string;
  issueTemplate?: string;
  labels?: string;
}>();

const link = computed(() => {
  var input = props.input || "";
  input.replace(" ", "%20");

  if (props.issueTemplate) {
    var url = `https://github.com/42ByteLabs/konarr/issues/new?assignees=${assignees}&template=${props.issueTemplate}.yml`;
    if (props.input) {
      url += `&title=${props.input}`;
    }
    if (props.labels) {
      url += `&labels=${props.labels}`;
    }
    return url;
  } else {
    return `https://github.com/42ByteLabs/konarr/issues/new/choose`;
  }
});
</script>

<template>
  <div class="text-center">
    <a
      :href="link"
      class="text-accent-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="tooltip">
        <slot>
          {{ props.title || "Feedback" }}
        </slot>
        <span class="tooltiptext">{{
          props.info || props.title || "Feedback"
        }}</span>
      </span>
    </a>
  </div>
</template>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 20rem;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -10rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
