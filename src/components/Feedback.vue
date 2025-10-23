<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCommentAlertOutline } from "@mdi/js";

const assignees = "GeekMasher";

const props = withDefaults(
  defineProps<{
    title: string;
    info?: string;
    input?: string;
    issueTemplate?: string;
    labels?: string;
    variant?: "button" | "link";
    size?: "sm" | "md" | "lg";
  }>(),
  {
    variant: "button",
    size: "md",
    info: undefined,
    input: undefined,
    issueTemplate: undefined,
    labels: undefined,
  },
);

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

const buttonClasses = computed(() => {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500";

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs rounded",
    md: "px-3 py-2 text-sm rounded-md",
    lg: "px-4 py-2 text-base rounded-md",
  };

  const variantClasses = {
    button:
      "bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md",
    link: "text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 hover:underline",
  };

  return `${base} ${sizeClasses[props.size]} ${variantClasses[props.variant]}`;
});
</script>

<template>
  <div>
    <a
      v-if="props.variant === 'button'"
      :href="link"
      :class="buttonClasses"
      :title="props.info || props.title || 'Feedback'"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg-icon
        type="mdi"
        :path="mdiCommentAlertOutline"
        class="h-4 w-4 mr-1.5"
      ></svg-icon>
      <slot>
        {{ props.title || "Feedback" }}
      </slot>
    </a>
    <a
      v-else
      :href="link"
      :class="buttonClasses"
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
