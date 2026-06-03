const SHEET_NAME = 'Requests';
const SPREADSHEET_ID = '1OCYrc2V3IM1HqL3jadGNBk65GcPZclYKNXPMkWpHMyI';

function doPost(e) {
  const sheet = getSheet_();
  const payload = parsePayload_(e);
  sheet.appendRow([
    new Date(),
    payload.name || '',
    payload.phone || '',
    payload.email || '',
    payload.interest || '',
    payload.message || '',
    payload.source || 'gally_bakery_site',
    payload.createdAt || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'Gally Bakery requests' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Received At', 'Name', 'Phone', 'Email', 'Interest', 'Message', 'Source', 'Client Created At']);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return e.parameter || {};
  }
}
