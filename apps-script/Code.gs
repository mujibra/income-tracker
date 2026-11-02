const SPREADSHEET_ID = '1ubl1xEHiuoCG_MAIn2FYAG16NmQE1QQ_l_0bLM6Y9Ck';
const TAB_NAME = 'ArusTransactions'; // Set this to your existing transaction tab name if applicable.
const TOKEN = 'REPLACE_WITH_A_LONG_RANDOM_SECRET';

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents || '{}');
    if (p.token !== TOKEN) return json_({ok:false,error:'Unauthorized'});
    if (!p.date || !p.type || !p.category || !Number(p.amount) || Number(p.amount)<=0) return json_({ok:false,error:'Invalid transaction'});
    const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
    let sh=ss.getSheetByName(TAB_NAME);
    if(!sh) {
      sh=ss.insertSheet(TAB_NAME);
      sh.appendRow(['Tanggal','Jenis','Kategori','Nominal','Keterangan','Dibuat']);
    }
    sh.appendRow([p.date,p.type==='income'?'Pemasukan':'Pengeluaran',p.category,Number(p.amount),p.note||'',new Date()]);
    return json_({ok:true});
  } catch(err) { return json_({ok:false,error:String(err)}); }
}