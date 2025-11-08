/**
 * YNAB Zero-Transaction Payee Selector
 * 
 * This script automatically selects all payees with zero transactions
 * in YNAB's payee management modal. It handles virtual scrolling to
 * process all payees, even those not initially visible.
 * 
 * Usage: Open the YNAB payee modal and run this script in the console
 */

(async () => {
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  
  console.log('YNAB Payee Selector\n');
  console.log('Selecting all payees with zero transactions...\n');
  
  // Check for payee modal
  const payeeModal = document.querySelector('.modal-payees');
  if (!payeeModal) {
    console.log('❌ Payee modal not found! Please open the payee management modal first.');
    return;
  }
  
  // Setup selectors and collections
  const listContainer = document.querySelector('div.ynab-list-in-time');
  const getPayeeItems = () => payeeModal.querySelectorAll('li.modal-payee-list-item:not(.modal-payee-list-title)');
  
  const selected = [];
  const skipped = [];
  const processedNames = new Set();
  
  /**
   * Extract transaction count from the modal UI
   * Returns the total count for all currently selected payees
   */
  const getTransactionCount = () => {
    // Use the "Show X Transactions" button
    const usedInButton = payeeModal.querySelector('button.used-in-transactions');
    if (usedInButton) {
      const match = usedInButton.textContent.trim().match(/Show\s+(\d+)\s+Transaction/i);
      if (match) return parseInt(match[1]);
    }
    
    return null;
  };
  
  /**
   * Process the next unprocessed payee in the visible list
   * Returns true if a payee was processed, false if no unprocessed payees found
   */
  const processNextUnprocessedItem = async () => {
    const items = getPayeeItems();
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) continue;
      
      const checkbox = item.querySelector('button.ynab-checkbox');
      const nameBtn = item.querySelector('button.modal-payee-list-button');
      
      if (!checkbox || !nameBtn) continue;
      
      const name = nameBtn.textContent.trim();
      
      // Skip already processed payees
      if (processedNames.has(name)) continue;
      
      // Skip transfer payees (they can't be selected)
      if (name.startsWith('Transfer :')) {
        processedNames.add(name);
        console.log(`[${processedNames.size}] ${name}`);
        console.log('  ⊘ Skipping transfer payee');
        skipped.push({name, count: 'Transfer'});
        return true;
      }
      
      // Process this payee
      processedNames.add(name);
      console.log(`[${processedNames.size}] ${name}`);
      
      // If already checked, assume it's a zero-transaction payee
      if (checkbox.classList.contains('is-checked')) {
        console.log('  ✓ Already selected (keeping)');
        selected.push(name);
        return true;
      }
      
      // Check the payee and measure transaction count change
      const countBefore = getTransactionCount() || 0;
      checkbox.click();
      await wait(300);
      
      const countAfter = getTransactionCount() || 0;
      const itemTransactions = countAfter - countBefore;
      
      if (itemTransactions === 0) {
        console.log('  ✓ No transactions - keeping checked');
        selected.push(name);
      } else {
        console.log(`  ✗ Has ${itemTransactions} transaction(s) - unchecking`);
        skipped.push({name, count: itemTransactions});
        
        // Uncheck the payee (find it again in case DOM changed)
        await wait(100);
        const freshItems = getPayeeItems();
        let found = false;
        
        for (let j = 0; j < freshItems.length; j++) {
          const freshNameBtn = freshItems[j].querySelector('button.modal-payee-list-button');
          if (freshNameBtn && freshNameBtn.textContent.trim() === name) {
            const freshCheckbox = freshItems[j].querySelector('button.ynab-checkbox');
            if (freshCheckbox && freshCheckbox.classList.contains('is-checked')) {
              freshCheckbox.click();
              found = true;
              break;
            }
          }
        }
        
        if (!found) {
          console.log('  ⚠️  Warning: Could not find checkbox to uncheck');
        }
        await wait(100);
      }
      
      return true;
    }
    
    return false;
  };
  
  // Main processing loop
  let scrollsSinceLastProcess = 0;
  const MAX_EMPTY_SCROLLS = 3;
  
  while (scrollsSinceLastProcess < MAX_EMPTY_SCROLLS) {
    const processed = await processNextUnprocessedItem();
    
    if (!processed) {
      // No unprocessed items visible, scroll to load more
      console.log('\nScrolling for more items...');
      listContainer.scrollTop = listContainer.scrollTop + 500;
      await wait(500);
      scrollsSinceLastProcess++;
    } else {
      scrollsSinceLastProcess = 0;
    }
  }
  
  // Final report
  console.log('\n' + '='.repeat(50));
  console.log('✅ COMPLETE');
  console.log('='.repeat(50));
  console.log(`📊 Total processed: ${processedNames.size} payees`);
  console.log(`✓  Selected: ${selected.length} payees with no transactions`);
  console.log(`✗  Skipped: ${skipped.length} payees with transactions`);
  console.log('\nAll zero-transaction payees are now selected!');
})();
