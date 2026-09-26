import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render header and exactly 5 columns with dummy data', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Project Kanban');

    const expectedColumns = ['Backlog', 'Ready', 'In Progress', 'In Review', 'Done'];
    for (const title of expectedColumns) {
      await expect(page.getByText(title, { exact: true })).toBeVisible();
    }

    // Verify initial dummy cards are rendered
    await expect(page.getByText('Feedback Analysis')).toBeVisible();
    await expect(page.getByText('Query Optimization')).toBeVisible();
    await expect(page.getByText('API Rate Limiting')).toBeVisible();
    await expect(page.getByText('Kanban Board Interface')).toBeVisible();
  });

  test('should allow renaming a column inline', async ({ page }) => {
    const colTitle = page.getByTestId('column-title-column-1');
    await expect(colTitle).toHaveText('Backlog');

    // Click to start editing
    await colTitle.click();

    const input = page.getByTestId('column-title-input-column-1');
    await expect(input).toBeVisible();

    await input.fill('Sprint Backlog');
    await input.press('Enter');

    await expect(page.getByTestId('column-title-column-1')).toHaveText('Sprint Backlog');
  });

  test('should add a new card to a column', async ({ page }) => {
    const initialCount = await page.getByTestId('column-count-column-2').innerText();
    expect(initialCount).toBe('1');

    // Click Add Card on Ready column (column-2)
    await page.getByTestId('add-card-button-column-2').click();

    // Modal opens
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add Card to Ready' })).toBeVisible();

    // Fill form
    await page.locator('#card-title-input').fill('Deploy to Staging');
    await page.locator('#card-details-input').fill('Prepare container image and verify smoke tests.');

    // Submit
    await page.getByTestId('submit-card-button').click();

    // Modal closed
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Card exists in Ready column
    await expect(page.getByText('Deploy to Staging')).toBeVisible();
    await expect(page.getByText('Prepare container image and verify smoke tests.')).toBeVisible();

    // Count updated
    await expect(page.getByTestId('column-count-column-2')).toHaveText('2');
  });

  test('should delete a card from a column', async ({ page }) => {
    // Column 1 has 'Feedback Analysis' (card-1)
    await expect(page.getByText('Feedback Analysis')).toBeVisible();
    const countBefore = await page.getByTestId('column-count-column-1').innerText();
    expect(countBefore).toBe('2');

    // Delete card-1
    await page.getByTestId('delete-card-card-1').click();

    // Card should no longer be visible
    await expect(page.getByText('Feedback Analysis')).not.toBeVisible();

    // Count decremented
    await expect(page.getByTestId('column-count-column-1')).toHaveText('1');
  });

  test('should support keyboard drag and drop between columns', async ({ page }) => {
    // Hello-pangea/dnd supports full accessible keyboard drag and drop:
    // Focus draggable item -> Press Space to lift -> Arrow keys to move -> Space to drop
    const card = page.getByTestId('card-card-3'); // In Ready (column-2)
    await expect(card).toBeVisible();

    await card.focus();
    await page.keyboard.press('Space'); // lift card

    // Move left to Backlog (column-1)
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Space'); // drop card

    // Check card is now in Backlog
    const backlogCol = page.getByTestId('column-column-1');
    await expect(backlogCol.getByText('API Rate Limiting')).toBeVisible();
  });
});
