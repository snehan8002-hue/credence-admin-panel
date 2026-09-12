const VERIFY_URL='https://tasoycsbzceohgjxizdp.supabase.co/functions/v1/credence-certificate-verify';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function show(html,ok){const box=$('result');box.className=`result ${ok?'ok':'bad'}`;box.innerHTML=html;box.style.display='block'}
async function verify(id){
 id=String(id||'').trim();
 if(!/^[A-Za-z0-9_-]{1,100}$/.test(id)){show('<div class="status">Invalid certificate ID</div><p>Please enter the certificate ID exactly as shown on the certificate.</p>',false);return}
 $('btn').disabled=true;$('btn').textContent='Checking…';
 try{const r=await fetch(`${VERIFY_URL}?id=${encodeURIComponent(id)}`,{headers:{Accept:'application/json'}});const d=await r.json().catch(()=>({}));
  if(r.ok&&d.valid){show(`<div class="status">✓ Certificate verified</div><div class="grid"><div><div class="label">Student</div><div class="value">${esc(d.student_name)}</div></div><div><div class="label">Course</div><div class="value">${esc(d.course_title)}</div></div><div><div class="label">Certificate ID</div><div class="value">${esc(d.certificate_id)}</div></div><div><div class="label">Issue date</div><div class="value">${d.issue_date?new Date(d.issue_date).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}):'—'}</div></div></div>`,true)}
  else show(`<div class="status">Certificate not valid</div><p>${esc(d.reason||d.error||'No valid certificate was found for this ID.')}</p>`,false);
 }catch(e){show('<div class="status">Verification unavailable</div><p>Please try again in a moment.</p>',false)}finally{$('btn').disabled=false;$('btn').textContent='Verify'}
}
$('form').addEventListener('submit',e=>{e.preventDefault();verify($('id').value)});
const initial=new URLSearchParams(location.search).get('id');if(initial){$('id').value=initial;verify(initial)}