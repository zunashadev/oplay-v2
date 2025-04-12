import { onMounted, onBeforeUnmount } from 'vue';
import emitter from '@/utils/eventBus';

export function useNavbarPadding(navbarRef) {
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function addPaddingToNavbar() {
    const scrollbarWidth = getScrollbarWidth();
    if (navbarRef.value && scrollbarWidth > 0) {
      navbarRef.value.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  function removePaddingFromNavbar() {
    if (navbarRef.value) {
      navbarRef.value.style.paddingRight = '';
    }
  }

  onMounted(() => {
    emitter.on('modal:open', addPaddingToNavbar);
    emitter.on('modal:close', removePaddingFromNavbar);
  });

  onBeforeUnmount(() => {
    emitter.off('modal:open', addPaddingToNavbar);
    emitter.off('modal:close', removePaddingFromNavbar);
  });
}
