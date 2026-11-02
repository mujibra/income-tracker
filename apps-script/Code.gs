const SPREADSHEET_ID = '1ubl1xEHiuoCG_MAIn2FYAG16NmQE1QQ_l_0bLM6Y9Ck';
const TAB_NAME = 'ArusTransactions';
// Replace with a long random secret. Never commit a real secret to a public repo.
const TOKEN = 'REPLACE_WITH_A_LONG_RANDOM_SECRET';

function sheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(TAB_NAME);
  if (!sh) sh = ss.insertSheet(TAB_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(['id','date','type','category','note','amount','updatedAt']);
  return sh;
}
function json_(obj, callback) {
  const payload = JSON.stringify(obj).replace(/</g, '\\u003c');
  const output = callback ? callback + '(' + payload + ');' : payload;
  return ContentService.createTextOutput(output).setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}
function doGet(e) {
  if (e.parameter.token !== TOKEN) return json_({ok:false,error:'Unauthorized'}, e.parameter.callback);
  const sh = sheet_(), rows = sh.getDataRange().getValues();
  const transactions = rows.slice(1).filter(r=>r[0]).map(r=>({
    id:String(r[0]),date:r[1] instanceof Date?Utilities.formatDate(r[1],Session.getScriptTimeZone(),'yyyy-MM-dd'):String(r[1]),
    type:String(r[2]),category:String(r[3]),note:String(r[4]||''),amount:Number(r[5]||0)
  }));
  return json_({ok:true,transactions}, e.parameter.callback);
}
function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');
  if (payload.token !== TOKEN) return json_({ok:false,error:'Unauthorized'});
  if (!Array.isArray(payload.transactions)) return json_({ok:false,error:'transactions must be an array'});
  const sh = sheet_(), rows = [['id','date','type','category','note','amount','updatedAt']], now = new Date();
  payload.transactions.forEach(t=>rows.push([String(t.id),String(t.date),String(t.type),String(t.category),String(t.note||''),Number(t.amount||0),now]));
  sh.clearContents();
  sh.getRange(1,1,rows.length,rows[0].length).setValues(rows);
  sh.setFrozenRows(1);
  return json_({ok:true,count:payload.transactions.length,savedAt:now.toISOString()});
}