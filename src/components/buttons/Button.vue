<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  variant: {
    type: String,
    default: 'solid',
    validator: (value) => ['solid', 'outline', 'ghost', 'soft', 'white', 'link'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value),
  },
  color: {
    type: String,
    default: 'lightning-yellow',
    validator: (value) =>
      [
        'blue-charcoal',
        'firefly',
        'buttered-rum',
        'lightning-yellow',
        'blue',
        'red',
        'green',
        'yellow',
        'purple',
        'pink',
        'indigo',
        'gray',
      ].includes(value),
  },
  textColor: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const sizeClasses = {
  xs: 'px-2 py-1 text-sm',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-2.5 text-base',
};

const colorMap = computed(() => {
  const colors = {
    'blue-charcoal': {
      bg: 'bg-blue-charcoal-500',
      hoverBg: 'hover:bg-blue-charcoal-600',
      focusBg: 'focus:bg-blue-charcoal-600',
      text: 'text-blue-charcoal-500',
      hoverText: 'hover:text-blue-charcoal-700',
      focusText: 'focus:text-blue-charcoal-700',
      border: 'border-blue-charcoal-500',
      softBg: 'bg-blue-charcoal-100',
      softText: 'text-blue-charcoal-700',
      softHoverBg: 'hover:bg-blue-charcoal-200',
      softFocusBg: 'focus:bg-blue-charcoal-200',
      darkText: 'dark:text-blue-charcoal-400',
      darkHoverText: 'dark:hover:text-blue-charcoal-300',
      darkFocusText: 'dark:focus:text-blue-charcoal-300',
      ghostHoverBg: 'hover:bg-blue-charcoal-100',
      ghostFocusBg: 'focus:bg-blue-charcoal-100',
      darkGhostHoverBg: 'dark:hover:bg-blue-charcoal-700/30',
    },
    firefly: {
      bg: 'bg-firefly-500',
      hoverBg: 'hover:bg-firefly-600',
      focusBg: 'focus:bg-firefly-600',
      text: 'text-firefly-500',
      hoverText: 'hover:text-firefly-700',
      focusText: 'focus:text-firefly-700',
      border: 'border-firefly-500',
      softBg: 'bg-firefly-100',
      softText: 'text-firefly-700',
      softHoverBg: 'hover:bg-firefly-200',
      softFocusBg: 'focus:bg-firefly-200',
      darkText: 'dark:text-firefly-400',
      darkHoverText: 'dark:hover:text-firefly-300',
      darkFocusText: 'dark:focus:text-firefly-300',
      ghostHoverBg: 'hover:bg-firefly-100',
      ghostFocusBg: 'focus:bg-firefly-100',
      darkGhostHoverBg: 'dark:hover:bg-firefly-700/30',
    },
    'buttered-rum': {
      bg: 'bg-buttered-rum-500',
      hoverBg: 'hover:bg-buttered-rum-600',
      focusBg: 'focus:bg-buttered-rum-600',
      text: 'text-buttered-rum-500',
      hoverText: 'hover:text-buttered-rum-700',
      focusText: 'focus:text-buttered-rum-700',
      border: 'border-buttered-rum-500',
      softBg: 'bg-buttered-rum-100',
      softText: 'text-buttered-rum-700',
      softHoverBg: 'hover:bg-buttered-rum-200',
      softFocusBg: 'focus:bg-buttered-rum-200',
      darkText: 'dark:text-buttered-rum-400',
      darkHoverText: 'dark:hover:text-buttered-rum-300',
      darkFocusText: 'dark:focus:text-buttered-rum-300',
      ghostHoverBg: 'hover:bg-buttered-rum-100',
      ghostFocusBg: 'focus:bg-buttered-rum-100',
      darkGhostHoverBg: 'dark:hover:bg-buttered-rum-700/30',
    },
    'lightning-yellow': {
      bg: 'bg-lightning-yellow-500',
      hoverBg: 'hover:bg-lightning-yellow-600',
      focusBg: 'focus:bg-lightning-yellow-600',
      text: 'text-lightning-yellow-500',
      hoverText: 'hover:text-lightning-yellow-700',
      focusText: 'focus:text-lightning-yellow-700',
      border: 'border-lightning-yellow-500',
      softBg: 'bg-lightning-yellow-100',
      softText: 'text-lightning-yellow-700',
      softHoverBg: 'hover:bg-lightning-yellow-200',
      softFocusBg: 'focus:bg-lightning-yellow-200',
      darkText: 'dark:text-lightning-yellow-400',
      darkHoverText: 'dark:hover:text-lightning-yellow-300',
      darkFocusText: 'dark:focus:text-lightning-yellow-300',
      ghostHoverBg: 'hover:bg-lightning-yellow-100',
      ghostFocusBg: 'focus:bg-lightning-yellow-100',
      darkGhostHoverBg: 'dark:hover:bg-lightning-yellow-700/30',
    },
    blue: {
      bg: 'bg-blue-500',
      hoverBg: 'hover:bg-blue-600',
      focusBg: 'focus:bg-blue-600',
      text: 'text-blue-500',
      hoverText: 'hover:text-blue-700',
      focusText: 'focus:text-blue-700',
      border: 'border-blue-500',
      softBg: 'bg-blue-100',
      softText: 'text-blue-700',
      softHoverBg: 'hover:bg-blue-200',
      softFocusBg: 'focus:bg-blue-200',
      darkText: 'dark:text-blue-400',
      darkHoverText: 'dark:hover:text-blue-300',
      darkFocusText: 'dark:focus:text-blue-300',
      ghostHoverBg: 'hover:bg-blue-100',
      ghostFocusBg: 'focus:bg-blue-100',
      darkGhostHoverBg: 'dark:hover:bg-blue-700/30',
    },
    red: {
      bg: 'bg-red-500',
      hoverBg: 'hover:bg-red-600',
      focusBg: 'focus:bg-red-600',
      text: 'text-red-500',
      hoverText: 'hover:text-red-700',
      focusText: 'focus:text-red-700',
      border: 'border-red-500',
      softBg: 'bg-red-100',
      softText: 'text-red-700',
      softHoverBg: 'hover:bg-red-200',
      softFocusBg: 'focus:bg-red-200',
      darkText: 'dark:text-red-400',
      darkHoverText: 'dark:hover:text-red-300',
      darkFocusText: 'dark:focus:text-red-300',
      ghostHoverBg: 'hover:bg-red-100',
      ghostFocusBg: 'focus:bg-red-100',
      darkGhostHoverBg: 'dark:hover:bg-red-700/30',
    },
    green: {
      bg: 'bg-green-500',
      hoverBg: 'hover:bg-green-600',
      focusBg: 'focus:bg-green-600',
      text: 'text-green-500',
      hoverText: 'hover:text-green-700',
      focusText: 'focus:text-green-700',
      border: 'border-green-500',
      softBg: 'bg-green-100',
      softText: 'text-green-700',
      softHoverBg: 'hover:bg-green-200',
      softFocusBg: 'focus:bg-green-200',
      darkText: 'dark:text-green-400',
      darkHoverText: 'dark:hover:text-green-300',
      darkFocusText: 'dark:focus:text-green-300',
      ghostHoverBg: 'hover:bg-green-100',
      ghostFocusBg: 'focus:bg-green-100',
      darkGhostHoverBg: 'dark:hover:bg-green-700/30',
    },
    yellow: {
      bg: 'bg-yellow-500',
      hoverBg: 'hover:bg-yellow-600',
      focusBg: 'focus:bg-yellow-600',
      text: 'text-yellow-500',
      hoverText: 'hover:text-yellow-700',
      focusText: 'focus:text-yellow-700',
      border: 'border-yellow-500',
      softBg: 'bg-yellow-100',
      softText: 'text-yellow-700',
      softHoverBg: 'hover:bg-yellow-200',
      softFocusBg: 'focus:bg-yellow-200',
      darkText: 'dark:text-yellow-400',
      darkHoverText: 'dark:hover:text-yellow-300',
      darkFocusText: 'dark:focus:text-yellow-300',
      ghostHoverBg: 'hover:bg-yellow-100',
      ghostFocusBg: 'focus:bg-yellow-100',
      darkGhostHoverBg: 'dark:hover:bg-yellow-700/30',
    },
    purple: {
      bg: 'bg-purple-500',
      hoverBg: 'hover:bg-purple-600',
      focusBg: 'focus:bg-purple-600',
      text: 'text-purple-500',
      hoverText: 'hover:text-purple-700',
      focusText: 'focus:text-purple-700',
      border: 'border-purple-500',
      softBg: 'bg-purple-100',
      softText: 'text-purple-700',
      softHoverBg: 'hover:bg-purple-200',
      softFocusBg: 'focus:bg-purple-200',
      darkText: 'dark:text-purple-400',
      darkHoverText: 'dark:hover:text-purple-300',
      darkFocusText: 'dark:focus:text-purple-300',
      ghostHoverBg: 'hover:bg-purple-100',
      ghostFocusBg: 'focus:bg-purple-100',
      darkGhostHoverBg: 'dark:hover:bg-purple-700/30',
    },
    gray: {
      bg: 'bg-gray-500',
      hoverBg: 'hover:bg-gray-600',
      focusBg: 'focus:bg-gray-600',
      text: 'text-gray-500',
      hoverText: 'hover:text-gray-700',
      focusText: 'focus:text-gray-700',
      border: 'border-gray-500',
      softBg: 'bg-gray-100',
      softText: 'text-gray-700',
      softHoverBg: 'hover:bg-gray-200',
      softFocusBg: 'focus:bg-gray-200',
      darkText: 'dark:text-gray-400',
      darkHoverText: 'dark:hover:text-gray-300',
      darkFocusText: 'dark:focus:text-gray-300',
      ghostHoverBg: 'hover:bg-gray-100',
      ghostFocusBg: 'focus:bg-gray-100',
      darkGhostHoverBg: 'dark:hover:bg-gray-700/30',
    },
  };

  return colors[props.color] || colors.blue;
});

const buttonClasses = computed(() => {
  const color = colorMap.value;

  // Handle custom text color
  const customText = props.textColor ? `text-${props.textColor}` : '';

  const variantClasses = {
    solid: `border border-transparent ${color.bg} ${props.textColor ? customText : 'text-white'} ${color.hoverBg} focus:outline-hidden ${color.focusBg}`,

    outline: `border border-gray-200 ${props.textColor ? customText : 'text-gray-500'} hover:border-${props.color}-600 hover:${color.text} focus:outline-hidden focus:border-${props.color}-600 focus:${color.text} dark:border-neutral-700 dark:text-neutral-400 dark:hover:${color.darkText} dark:hover:border-${props.color}-600 dark:focus:${color.darkText} dark:focus:border-${props.color}-600`,

    ghost: `border border-transparent ${props.textColor ? customText : color.text} ${color.ghostHoverBg} ${color.hoverText} focus:outline-hidden ${color.ghostFocusBg} ${color.focusText} ${color.darkText} ${color.darkGhostHoverBg} ${color.darkHoverText} dark:focus:bg-${props.color}-800/30 ${color.darkFocusText}`,

    soft: `border border-transparent ${color.softBg} ${props.textColor ? customText : color.softText} ${color.softHoverBg} focus:outline-hidden ${color.softFocusBg} ${color.darkText} dark:hover:bg-${props.color}-900 dark:focus:bg-${props.color}-900`,

    white: `border border-gray-200 bg-white ${props.textColor ? customText : 'text-gray-800'} shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700`,

    link: `border border-transparent ${props.textColor ? customText : color.text} ${color.hoverText} focus:outline-hidden ${color.focusText} ${color.darkText} ${color.darkHoverText} ${color.darkFocusText}`,
  };

  return `${variantClasses[props.variant]} ${sizeClasses[props.size]}`;
});
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-x-2 rounded-lg font-medium transition-all hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50"
    :class="buttonClasses"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>
