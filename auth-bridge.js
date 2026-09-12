const CREDENCE_AUTH={
  key:'credence_session',
  url:'https://tasoycsbzceohgjxizdp.supabase.co',
  publishableKey:'sb_publishable_ZLU-d0ZI-XT_IgabzmigkA_5vohKjLl',
  read(){try{const s=JSON.parse(localStorage.getItem(this.key)||'null');return s?.access_token&&s?.refresh_token&&s?.user?s:null}catch{return null}},
  write(s){if(s?.access_token&&s?.refresh_token&&s?.user)localStorage.setItem(this.key,JSON.stringify(s));else localStorage.removeItem(this.key)},
  clear(){localStorage.removeItem(this.key)},
  async signIn(email,password){
    const r=await fetch(`${this.url}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:this.publishableKey,'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(d.error_description||d.msg||d.message||'Login failed');
    this.write(d);return d;
  },
  async refresh(){
    const s=this.read();if(!s)return null;
    const r=await fetch(`${this.url}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:this.publishableKey,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:s.refresh_token})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok){this.clear();return null}this.write(d);return d;
  },
  async profile(session){
    const r=await fetch(`${this.url}/rest/v1/profiles?select=id,email,full_name,role,active,banned&id=eq.${encodeURIComponent(session.user.id)}&limit=1`,{headers:{apikey:this.publishableKey,Authorization:`Bearer ${session.access_token}`}});
    const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d?.message||'Profile check failed');return d[0]||null;
  },
  async ensureAdmin(){
    let s=this.read();if(!s)return null;
    let p=await this.profile(s).catch(()=>null);
    if(!p||p.active===false||p.banned===true||!['admin','master'].includes(String(p.role||'').toLowerCase()))return null;
    return {session:s,profile:p};
  }
};