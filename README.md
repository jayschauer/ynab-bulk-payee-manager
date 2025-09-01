# YNAB Payee Cleanup

🧹 Automatically select all zero-transaction payees in YNAB for bulk operations

## What it does

This browser script helps you clean up your YNAB payee list by automatically selecting all payees that have zero transactions. Perfect for when you want to bulk delete or manage unused payees that are cluttering your list.

### Features

- ✅ Automatically identifies and selects payees with 0 transactions
- 🔄 Handles YNAB's virtual scrolling (processes all payees, even those not initially visible)
- 🚫 Intelligently skips transfer payees that can't be selected
- 📊 Provides a summary of selected and skipped payees
- 🛡️ Safe to run - only checks/unchecks boxes, doesn't delete anything

## How to use

### Method 1: Browser Console

1. **Open YNAB** in your web browser and navigate to your budget
2. **Open the Payee Modal**:
   - Click on any transaction's payee field
   - Click "Manage Payees" at the bottom of the dropdown
3. **Open Browser Console**:
   - Chrome/Edge: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
   - Firefox: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
   - Safari: Enable Developer menu in Preferences, then `Cmd+Option+C`

Note: YNAB will warn you about the dangers of pasting in code here, that is good advice. You are welcome to paste code into your AI d'jour to verify its safety and read-only nature. 

4. **Copy the entire script** from [ynab-payee-selector.js](ynab-payee-selector.js)
5. **Paste it into the console** and press `Enter`
6. **Watch the magic happen!** The script will:
   - Process each payee one by one
   - Show progress in the console
   - Select payees with 0 transactions
   - Skip payees with transactions
   - Scroll automatically to load more payees

### Method 2: Extension (Coming Soon)

I may make this a simple browser extension or add it to something like the YNAB toolkit in the future. 

## What happens next?

After the script runs, all payees with zero transactions will be selected. You can then:

- Click "Delete" to remove them all at once
- Click "Merge" to combine them with other payees
- Or simply uncheck the ones you want to keep

## Example Output

```
YNAB Payee Selector

Selecting all payees with zero transactions...

[1] Starbucks
  ✗ Has 23 transaction(s) - unchecking
[2] Old Restaurant Name
  ✓ No transactions - keeping checked
[3] Transfer : Savings Account
  ⊘ Skipping transfer payee
[4] Random Store #1234
  ✓ No transactions - keeping checked

Scrolling for more items...

==================================================
✅ COMPLETE
==================================================
📊 Total processed: 156 payees
✓  Selected: 47 payees with no transactions
✗  Skipped: 109 payees with transactions

All zero-transaction payees are now selected!
```

## Troubleshooting

**"Payee modal not found!"**
- Make sure you have the Manage Payees modal open before running the script

**Script seems to hang**
- Large payee lists may take a while to process
- Check the console for progress updates
- The script processes payees one at a time to ensure accuracy

**Some payees aren't being processed**
- The script only processes payees visible in the list
- It automatically scrolls to load more, but may miss some if YNAB's virtual scrolling behaves unexpectedly
- Try running the script again if needed

## How it works

1. The script finds all payees in the currently visible list
2. For each unprocessed payee:
   - Checks if it's already selected (assumes these are from a previous run)
   - Skips transfer payees (they can't be bulk managed)
   - Clicks the checkbox to select it
   - Checks if the transaction count increased
   - If yes, unselects it (has transactions)
   - If no, keeps it selected (zero transactions)
3. Scrolls down to load more payees
4. Repeats until no new payees are found

## Safety

This script is read-only in nature - it only:
- Reads payee names and transaction counts
- Clicks checkboxes to select/deselect
- Scrolls the list

It does NOT:
- Delete any data
- Modify any transactions
- Change any payee information
- Make any permanent changes

You maintain full control over what happens after the selection is made.

## Requirements

- A modern web browser (Chrome, Firefox, Edge, Safari)
- YNAB web app (not the mobile app)
- Access to browser developer tools

## Contributing

Found a bug or have a suggestion? Please open an issue or submit a pull request!

## License

MIT License - see [LICENSE](LICENSE) file for details

## Disclaimer

This script is not affiliated with or endorsed by YNAB (You Need A Budget). Use at your own discretion.
