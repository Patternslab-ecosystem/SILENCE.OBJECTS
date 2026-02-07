// Test utilities — PatternLens v5.0
import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement } from 'react'

/**
 * Custom render with providers.
 * Extend this when adding providers (e.g., theme, auth context).
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { customRender as render }
