export function useTheme() {
  const isDark = useState('theme-dark', () => false)

  onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })

  function toggle() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    try {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    } catch {
      // localStorage unavailable (private mode) — theme still toggles for the session
    }
  }

  return { isDark, toggle }
}
