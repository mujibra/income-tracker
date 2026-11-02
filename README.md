# Arus Finance PWA + Google Sheets sync

Live app: https://mujibra.github.io/income-tracker/

## Connect your spreadsheet (one-time setup)

The app cannot deploy a script into your Google account automatically. Complete these steps once:

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1ubl1xEHiuoCG_MAIn2FYAG16NmQE1QQ_l_0bLM6Y9Ck/edit
2. Open **Extensions → Apps Script**.
3. Replace the editor contents with `apps-script/Code.gs` from this repo.
4. In the code, replace `REPLACE_WITH_A_LONG_RANDOM_SECRET` with a long random secret (at least 32 characters). Keep it private. Do not commit your real token to GitHub.
5. Click **Deploy → New deployment → Web app**.
6. Execute as **Me**. Set access to **Anyone** (required for this static PWA to call it). This makes the endpoint publicly reachable; the secret token is its gate. Anyone who obtains the token can read and overwrite this data. Do not use this setup for highly sensitive records.
7. Authorize Google permissions and deploy. Copy the Web app URL ending in `/exec`.
8. Open the live PWA. In **Google Sheets Sync**, paste the Apps Script URL and the same secret token, then click **Simpan koneksi**.

## Sync buttons

- **Muat dari Sheets**: replaces local browser transactions with the sheet's transactions.
- **Simpan lokal ke Sheets**: overwrites the `ArusTransactions` tab with local transactions. It asks for confirmation.
- The script creates `ArusTransactions` automatically. Existing spreadsheet tabs are not modified.
- Data is not continuously synced. Choose the direction explicitly; back up first.

## Important security & data notes

- The spreadsheet ID is configured in Apps Script. The token is stored in browser localStorage only, not in this public repository.
- Apps Script's Web App endpoint is public when deployed as Anyone. A token is not strong access control if it leaks; avoid sharing it or putting it in screenshots.
- Keep backups using the PWA's JSON backup and Google Sheets version history.
- This integration is a basic personal single-user sync, not a multi-user merge engine. Avoid editing the same data concurrently from multiple browsers.
