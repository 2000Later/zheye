<template>
    <li class="dropdown-option" :class="{'is-disabled': disabled}">
        <slot></slot>
    </li>
</template>

<script>
export default {
  name: 'DropdownItem',
  props: {
    disabled: {
      required: false,
      type: Boolean
    }
  }
}
</script>

<style>
.dropdown-option.is-disabled * {
    color: #6c757d;
    pointer-events: none;
    background-color: transparent;
}
</style>
