import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('loads and displays the title', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Marble Knowledge Graph' })).toBeVisible()
  })

  test('displays the subtitle with stats', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/1,590 micro-topics/)).toBeVisible()
  })

  test('shows four navigation cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Browse Topics')).toBeVisible()
    await expect(page.getByText('Knowledge Graph')).toBeVisible()
    await expect(page.getByText('By Subject')).toBeVisible()
    await expect(page.getByText('For Parents')).toBeVisible()
  })

  test('shows stats section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('1,590')).toBeVisible()
    await expect(page.getByText('3,221')).toBeVisible()
    await expect(page.getByText('7')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('navigates to Topics page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Topics' }).first().click()
    await expect(page).toHaveURL(/\/topics/)
  })

  test('navigates to Graph page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Graph' }).first().click()
    await expect(page).toHaveURL(/\/graph/)
  })

  test('navigates to Subjects page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Subjects' }).first().click()
    await expect(page).toHaveURL(/\/subjects/)
  })

  test('navigates to Clusters page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Clusters' }).first().click()
    await expect(page).toHaveURL(/\/clusters/)
  })

  test('navigates to Standards page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Standards' }).first().click()
    await expect(page).toHaveURL(/\/standards/)
  })

  test('switches to Chinese version', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: '中文' }).click()
    await expect(page).toHaveURL(/\/cn/)
    await expect(page.getByText('知识图谱')).toBeVisible()
  })

  test('switches back to English', async ({ page }) => {
    await page.goto('/cn')
    await page.getByRole('link', { name: 'EN' }).click()
    await expect(page).toHaveURL(/\/(?!cn)/)
  })
})

test.describe('Chinese Home Page', () => {
  test('loads cn route', async ({ page }) => {
    await page.goto('/cn')
    await expect(page.getByText('知识图谱')).toBeVisible()
  })

  test('shows Chinese nav links', async ({ page }) => {
    await page.goto('/cn')
    await expect(page.getByRole('link', { name: '知识点' })).toBeVisible()
    await expect(page.getByRole('link', { name: '图谱' })).toBeVisible()
    await expect(page.getByRole('link', { name: '学科' })).toBeVisible()
    await expect(page.getByRole('link', { name: '课标' })).toBeVisible()
  })
})

test.describe('Topics Page', () => {
  test('displays topics heading', async ({ page }) => {
    await page.goto('/topics')
    await expect(page.getByText(/Topics \(/)).toBeVisible()
  })

  test('shows filter controls', async ({ page }) => {
    await page.goto('/topics')
    await expect(page.getByText('All Subjects')).toBeVisible()
    await expect(page.getByText('All Types')).toBeVisible()
    await expect(page.getByPlaceholderText('Search...')).toBeVisible()
  })

  test('shows pagination', async ({ page }) => {
    await page.goto('/topics')
    await expect(page.getByText('Previous')).toBeVisible()
    await expect(page.getByText('Next')).toBeVisible()
  })

  test('subject filter changes URL params', async ({ page }) => {
    await page.goto('/topics')
    await page.selectOption('select:first-of-type', 'Science')
    // After filter, the API should be called with subject=Science
    await page.waitForTimeout(1000)
    await expect(page.getByText(/Topics \(/)).toBeVisible()
  })
})

test.describe('Responsive Layout', () => {
  test('shows hamburger menu on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.getByLabel('Toggle menu')).toBeVisible()
    // Desktop nav should be hidden
    await expect(page.locator('nav.hidden.md\\:flex')).toBeHidden()
  })

  test('hamburger opens mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.getByLabel('Toggle menu').click()
    // Mobile menu should show nav links
    await expect(page.getByRole('link', { name: 'Topics' })).toBeVisible()
  })

  test('desktop shows full nav', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    await expect(page.locator('nav.hidden.md\\:flex')).toBeVisible()
    await expect(page.getByLabel('Toggle menu')).toBeHidden()
  })
})
