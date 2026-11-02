const SPREADSHEET_ID = '1ubl1xEHiuoCG_MAIn2FYAG16NmQE1QQ_l_0bLM6Y9Ck';
const TAB_NAME = 'Transaksi';
// Store your NEW token in Script Properties (Project Settings), key: ARUS_TOKEN
function getToken_(){return PropertiesService.getScriptProperties().getProperty('ARUS_TOKEN');}
function json_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
function doGet(){return ContentService.createTextOutput('Arus endpoint active. Use the mobile transaction form to submit a transaction.');}
function doPost(e){
  try{
    const p=JSON.parse(e.postData.contents||'{}');
    if(!getToken_()||p.token!==getToken_())return json_({ok:false,error:'Unauthorized'});
    if(!p.date||!p.type||!p.category||!Number(p.amount)||Number(p.amount)<=0)return json_({ok:false,error:'Invalid transaction'});
    const ss=SpreadsheetApp.openById(SPREADSHEET_ID),sh=ss.getSheetByName(TAB_NAME);
    if(!sh)return json_({ok:false,error:'Tab Transaksi tidak ditemukan'});
    const row=sh.getLastRow()+1;
    sh.getRange(row,1).setValue(new Date(p.date+'T00:00:00'));
    sh.getRange(row,2).setFormula('=IF(A'+row+'="","",DATE(YEAR(A'+row+'),MONTH(A'+row+'),1))');
    sh.getRange(row,3,1,8).setValues([[p.type,p.category,p.note||'',p.account||'Kas',Number(p.amount),p.needWant||'Kebutuhan',p.recurring||'Tidak',p.extraNote||'']]);
    return json_({ok:true,row});
  }catch(err){return json_({ok:false,error:String(err)});}
}