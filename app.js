(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const icons = {
    dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/>',
    layers:'<path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    book:'<path d="M3 5c4-1 6-1 9 1 3-2 5-2 9-1v14c-4-1-6-1-9 1-3-2-5-2-9-1zM12 6v14"/>',
    globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    reset:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
    switch:'<path d="M3 8h16l-4-4m6 12H5l4 4"/>',
    sliders:'<path d="M4 6h8m5 0h3M4 12h3m5 0h8M4 18h10m5 0h1"/><circle cx="14.5" cy="6" r="2.5"/><circle cx="9.5" cy="12" r="2.5"/><circle cx="16.5" cy="18" r="2.5"/>',
    trend:'<path d="M3 18l6-7 4 4 8-10m-6 0h6v6"/>',
    down:'<path d="m6 9 6 6 6-6"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9v.1"/>',
    play:'<path d="M6 4l14 8-14 8z"/>',
    activity:'<path d="M2 12h5l3-8 4 16 3-8h5"/>',
    history:'<path d="M3.5 11a8.5 8.5 0 1 1 1.5 6M3 5v6h6m3-4v5l3 2"/>',
    investment:'<path d="m2 8 10-5 10 5H2zm1 12h18M5 17v-6m5 6v-6m4 6v-6m5 6v-6"/>',
    welfare:'<path d="M12 20s-9-5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 11-9 11Z"/>',
    tax:'<path d="m5 19 14-14"/><circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/>',
    transparency:'<path d="m12 3 8 3v6c0 5-3 7-8 10-5-3-8-5-8-10V6zM8.5 12l2.5 2.5 4.5-5"/>',
    skills:'<path d="m2 9 10-5 10 5-10 5zm4 2v6c3 3 9 3 12 0v-6m4-2v7"/>',
    consultation:'<path d="M3 4h14v10h-7l-4 4v-4H3zM18 8h3v11h-3v3l-4-3h-3"/>',
    neutral:'<path d="M4 8h16M4 16h16"/><circle cx="8" cy="8" r="1.4"/><circle cx="16" cy="16" r="1.4"/>',
    coins:'<ellipse cx="9" cy="6" rx="6" ry="3"/><path d="M3 6v8c0 2 3 3 6 3m6-11v3M3 10c0 2 3 3 6 3"/><ellipse cx="16" cy="13" rx="5" ry="2.5"/><path d="M11 13v5c0 3 10 3 10 0v-5"/>',
    price:'<path d="M4 19h17M6 16v-4m5 4V8m5 8V5"/>',
    users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20v-3c0-5 12-5 12 0v3m1-15a3.2 3.2 0 0 1 0 6m2 3c3 0 4 2 4 4v2"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    check:'<path d="m4 12 5 5L20 6"/>'
  };
  const icon = (name) => '<svg class="ico" aria-hidden="true" viewBox="0 0 24 24">' + (icons[name] || '') + '</svg>';
  function paintIcons(root = document) {
    root.querySelectorAll('i[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  }
  const english = {us:'UNITED STATES',de:'GERMANY',se:'SWEDEN',jp:'JAPAN',fr:'FRANCE',cn:'CHINA',in:'INDIA',sg:'SINGAPORE',br:'BRAZIL',sa:'SAUDI ARABIA'};
  const allPolicies = ['investment','welfare','tax','transparency','skills','consultation','neutral'];
  const strengths = ['温和','适中','强力'];
  const envNames = {base:'基准外需',strong:'外需走强',weak:'外需走弱'};
  const series = [
    {key:'gdp',name:'实际产出',color:'#77e5c0',get:s=>s.gdp},
    {key:'cpi',name:'消费价格',color:'#81aaff',get:s=>s.cpi},
    {key:'trust',name:'公众信任',color:'#edb773',get:s=>s.t / Sim.initial().t * 100},
    {key:'accountability',name:'公共问责',color:'#b8a4ea',get:s=>s.a / Sim.initial().a * 100}
  ];
  const metrics = [
    {k:'g',name:'实际 GDP 增速',unit:'%',diff:'个百分点',abbr:'pp',color:'#77e5c0',icon:'trend'},
    {k:'p',name:'通胀率',unit:'%',diff:'个百分点',abbr:'pp',color:'#81aaff',icon:'price'},
    {k:'d',name:'债务 / GDP',unit:'%',diff:'个百分点',abbr:'pp',color:'#edb773',icon:'coins'},
    {k:'t',name:'公众信任',unit:'分',diff:'分',abbr:'分',color:'#b8a4ea',icon:'users'},
    {k:'u',name:'失业率',unit:'%',diff:'个百分点',abbr:'pp'},
    {k:'a',name:'公共问责',unit:'分',diff:'分',abbr:'分'}
  ];
  const signed = x => (Math.abs(x) < 0.005 ? '0.00' : (x > 0 ? '+' : '−') + Math.abs(x).toFixed(2));
  const isModel = id => MODELS.some(m => m.id === id);
  const validAction = a => a && allPolicies.includes(a.p) && [1,2,3].includes(a.i) && Object.hasOwn(envNames,a.e);
  const defaultChoice = () => ({p:'investment',i:2,e:'base'});
  const fresh = () => ({actions:[],choice:defaultChoice()});
  const storageKey = 'poliscope-lab-v1';
  let saved = {model:'us',runs:{},horizon:5};
  let storageOK = true;
  try {
    const raw=JSON.parse(localStorage.getItem(storageKey) || 'null');
    if(raw && isModel(raw.model)){
      saved.model=raw.model;
      if([3,5,10].includes(raw.horizon)) saved.horizon=raw.horizon;
      for(const m of MODELS){
        const v=raw.runs?.[m.id];
        if(v && Array.isArray(v.actions) && v.actions.every(validAction)){
          saved.runs[m.id]={actions:v.actions,choice:validAction(v.choice)?v.choice:defaultChoice()};
        }
      }
    }
  } catch(e) {if(e.name!=='SyntaxError') storageOK=false;}
  let report='effect', detailOpen=false, reportYear=null, pathData=[], observed=[], advanceTimer, resizeTimer, chartGeometry, focusModel=null;
  const visible = new Set(series.slice(0,3).map(x=>x.key));
  const getModel = () => MODELS.find(m=>m.id===saved.model);
  const run = () => saved.runs[saved.model] || (saved.runs[saved.model]=fresh());
  const next = (s,c) => Sim.step(s,saved.model,c.p,c.i,c.e);
  const reference = (s,c) => Sim.step(s,saved.model,'neutral',1,c.e);
  function store(){
    try {localStorage.setItem(storageKey,JSON.stringify(saved));storageOK=true;}catch{storageOK=false;}
    $('#save-state').textContent=storageOK?'进度已保存在本机':'仅本次会话';
    $('#save-state').classList.toggle('unsaved',!storageOK);
  }
  function calculate(){
    const r=run();
    observed=[Sim.initial()];
    for(const c of r.actions) observed.push(next(observed.at(-1),c));
    const state=observed.at(-1);
    pathData=[state,next(state,r.choice)];
    while(pathData.length<=saved.horizon) pathData.push(reference(pathData.at(-1),r.choice));
  }
  function renderWorkbench(){
    calculate();
    const r=run(),model=getModel(),year=r.actions.length;
    $('#year-badge').innerHTML=icon('clock')+'模拟年 <b>'+String(year).padStart(2,'0')+'</b>';
    $('#model-card').style.backgroundImage='url("'+(window.PHOTO_URLS?.[model.id]||'photos/'+model.id+'.webp')+'")';
    $('#country-code').textContent=english[model.id];
    $('#model-name').textContent=model.name;
    $('#model-sub').textContent=model.country+' · '+model.politics;
    $('#environment').value=r.choice.e;$('#horizon').value=saved.horizon;
    for(const el of document.querySelectorAll('[data-policy]')){
      const active=el.dataset.policy===r.choice.p;
      el.classList.toggle('on',active);el.setAttribute('aria-pressed',active);
    }
    for(const el of $('#intensities').children){
      const active=Number(el.dataset.i)===r.choice.i;
      el.classList.toggle('on',active&&r.choice.p!=='neutral');el.disabled=r.choice.p==='neutral';el.setAttribute('aria-pressed',active&&r.choice.p!=='neutral');
    }
    $('#intensity-value').textContent=r.choice.p==='neutral'?'无新增措施':'强度 '+r.choice.i+' / 3';
    $('#projection-sub').textContent='第 '+(year+1)+' 年实施'+Sim.policies[r.choice.p].name+'，随后维持现状。';
    $('#indicator-period').textContent='第 '+year+' 年 → 第 '+(year+1)+' 年';
    $('#history-count').textContent=year;
    const s=pathData[0],n=pathData[1];
    $('#kpis').innerHTML=metrics.slice(0,4).map(m=>'<article class="kpi" style="--accent:'+m.color+'"><div class="kpi-head"><span class="kpi-icon">'+icon(m.icon)+'</span>'+m.name+'</div><div class="kpi-val">'+n[m.k].toFixed(2)+'<small>'+m.unit+'</small></div><div class="kpi-bottom">较上年 <b>'+signed(n[m.k]-s[m.k])+'</b> '+m.diff+'</div></article>').join('');
    drawChart();renderReport();
  }
  function effectsTable(before,after,baseline){
    return '<div class="table-wrap"><table class="results"><thead><tr><th>指标</th><th>上年</th><th>政策结果</th><th>维持现状</th><th>政策净影响</th></tr></thead><tbody>'+metrics.map(m=>'<tr><td>'+m.name+'</td><td>'+before[m.k].toFixed(2)+m.unit+'</td><td>'+after[m.k].toFixed(2)+m.unit+'</td><td>'+baseline[m.k].toFixed(2)+m.unit+'</td><td>'+signed(after[m.k]-baseline[m.k])+' '+m.diff+'</td></tr>').join('')+'</tbody></table></div>';
  }
  function changeText(v,unit){
    if(Math.abs(v)<.005)return '持平';
    return (v>0?'增加 ':'减少 ')+Math.abs(v).toFixed(2)+' '+unit;
  }
  function renderReport(){
    const r=run(),c=r.choice,s=pathData[0],n=pathData[1],policy=Sim.policies[c.p],body=$('#report-body');
    document.querySelectorAll('[data-report]').forEach(b=>{const on=b.dataset.report===report;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
    if(report==='history'){
      if(!r.actions.length){body.innerHTML='<p class="empty">当前处于第 0 年。执行第一项政策后，这里会保留当年的选择、指标结果和对照情景。</p>';return;}
      body.innerHTML=r.actions.map((act,index)=>({act,index})).reverse().map(({act,index})=>{
        const pol=Sim.policies[act.p],last=observed[index],end=observed[index+1],match=reference(last,act);
        return '<details class="hist-item" data-year="'+(index+1)+'" '+(reportYear===index+1?'open':'')+'><summary>第 '+(index+1)+' 年　'+pol.name+' · '+(act.p==='neutral'?'无新增措施':strengths[act.i-1])+' · '+envNames[act.e]+'</summary><p>'+pol.now+' 与同环境下维持现状相比，实际 GDP 增速'+changeText(end.g-match.g,'个百分点')+'，公共问责'+changeText(end.a-match.a,'分')+'。</p>'+effectsTable(last,end,match)+'</details>';
      }).join('');return;
    }
    const against=reference(s,c);
    const k=['transparency','consultation'].includes(c.p)?'a':c.p==='welfare'?'t':c.p==='skills'?'u':'d';
    const m=metrics.find(m=>m.k===k);
    const reading=c.p==='neutral'?'前期承诺的项目与本年外需仍会影响结果。两条对照路径采用相同政策。':'与同环境维持现状相比，实际 GDP 增速'+changeText(n.g-against.g,'个百分点')+'，'+m.name+changeText(n[k]-against[k],m.diff)+'。';
    body.innerHTML='<div class="effect-heading"><span class="mint-pill">第 '+(s.year+1)+' 年预演</span><strong>'+policy.name+' · '+(c.p==='neutral'?'无新增措施':strengths[c.i-1]+'力度')+'</strong></div><p class="effect-desc">'+reading+'</p><p class="effect-desc"><b>后续影响　</b>'+policy.later+'</p><details class="effect-details" '+(detailOpen?'open':'')+'><summary>查看六项指标与维持现状的对照</summary>'+effectsTable(s,n,against)+'</details>';
    body.querySelector('details').ontoggle=e=>{if(e.target.isConnected)detailOpen=e.target.open;};
  }
  function drawChart(){
    if(!pathData.length || $('#bench').hidden)return;
    const svg=$('#plot'),area=$('#chart-area'),width=area.clientWidth,height=area.clientHeight;
    if(!width||!height)return;
    const active=series.filter(q=>visible.has(q.key)), values=pathData.flatMap(s=>active.map(q=>q.get(s)));
    const lo=Math.min(...values),hi=Math.max(...values),range=Math.max(hi-lo,2);
    const raw=range/3.7,power=10**Math.floor(Math.log10(raw));
    const nice=[1,2,2.5,5,10].find(v=>v>=raw/power)*power;
    const lower=Math.floor((lo-range*.1)/nice)*nice,upper=Math.ceil((hi+range*.06)/nice)*nice;
    const left=width<420?38:45,right=width<420?20:25,top=15,bottom=height-31,inner=width-left-right;
    const X=i=>left+inner*i/(pathData.length-1),Y=v=>bottom-(v-lower)/(upper-lower)*(bottom-top);
    const label=v=>nice>=1 ? Number(v.toFixed(1)).toString() : v.toFixed(1);
    const grid=[];
    for(let v=lower;v<=upper+nice*.001;v+=nice){
      const y=Y(v);grid.push('<path d="M'+left+' '+y+'H'+(width-right)+'" stroke="#34424d" stroke-dasharray="3 5" stroke-width=".8"/><text x="'+(left-10)+'" y="'+(y+4)+'" text-anchor="end">'+label(v)+'</text>');
    }
    const axisLabels=[];
    for(let i=0;i<pathData.length;i++){
      if(width<450&&saved.horizon===10&&i%2===1)continue;
      axisLabels.push('<text x="'+X(i)+'" y="'+(height-7)+'" text-anchor="middle">'+(i===0?'当前':'第 '+pathData[i].year+' 年')+'</text>');
    }
    const shapes=active.map(q=>{
      const line=pathData.map((s,i)=>(i?'L':'M')+X(i).toFixed(2)+' '+Y(q.get(s)).toFixed(2)).join(' ');
      const shade=q.key===active[0].key?'<path d="'+line+'L'+X(pathData.length-1)+' '+bottom+'H'+left+'Z" fill="url(#area-fill)"/>':'';
      return shade+'<path d="'+line+'" fill="none" stroke="'+q.color+'" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'+pathData.map((s,i)=>'<circle cx="'+X(i)+'" cy="'+Y(q.get(s))+'" r="'+(i===pathData.length-1?4.3:3.2)+'" stroke="'+q.color+'" stroke-width="1.8" fill="'+(i===pathData.length-1?q.color:'#16232f')+'"/>').join('');
    });
    svg.setAttribute('viewBox','0 0 '+width+' '+height);
    svg.setAttribute('aria-label',active.map(q=>q.name).join('、')+'的模拟趋势');
    svg.innerHTML='<title>未来 '+saved.horizon+' 年的条件趋势，模拟起点为 100</title><desc>'+active.map(q=>q.name+'：'+pathData.map(s=>q.get(s).toFixed(2)).join('、')).join('。')+'</desc><defs><linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+active[0].color+'" stop-opacity=".18"/><stop offset="1" stop-color="'+active[0].color+'" stop-opacity="0"/></linearGradient></defs><g fill="#94a6b5" font-size="12" font-family="var(--mono),var(--sans)">'+grid.join('')+axisLabels.join('')+'</g>'+shapes.join('')+'<path id="crosshair" d="" stroke="#a7b7c6" stroke-width="1" stroke-dasharray="2 4"/>';
    const current=pathData[0].year;
    chartGeometry={left,inner,top,bottom,current,width,X};
    $('#plot-tip').hidden=true;
  }
  function showTip(i){
    if(!chartGeometry)return;
    const {X,top,bottom,width}=chartGeometry,x=X(i),s=pathData[i],tip=$('#plot-tip');
    $('#crosshair').setAttribute('d','M'+x+' '+top+'V'+bottom);
    tip.innerHTML='<strong>第 '+s.year+' 年'+(i?' · 预演':' · 当前')+'</strong>'+series.filter(q=>visible.has(q.key)).map(q=>'<div><span style="color:'+q.color+'">'+q.name+'</span><b>'+q.get(s).toFixed(2)+'</b></div>').join('');
    tip.hidden=false;tip.style.left=Math.max(0,Math.min(x+12,width-tip.offsetWidth-3))+'px';tip.style.top='10px';
  }
  function hideTip(){ $('#plot-tip').hidden=true;$('#crosshair')?.setAttribute('d',''); }
  function selectModel(id){
    if(!isModel(id))return;
    saved.model=id;report='effect';reportYear=null;detailOpen=false;store();
    if(location.hash==='#workbench')route();else location.hash='workbench';
  }
  function route(){
    const page=location.hash==='#atlas'?'atlas':location.hash==='#methods'?'methods':'workbench';
    document.querySelectorAll('[data-page]').forEach(item=>{const on=item.dataset.page===page;item.classList.toggle('active',on);if(on)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current');});
    $('#bench').hidden=page!=='workbench';$('#other-page').hidden=page==='workbench';
    if(page==='workbench'){renderWorkbench();}
    else if(page==='atlas'){Atlas.library($('#other-page'),saved.model,selectModel,focusModel);focusModel=null;}
    else Atlas.methods($('#other-page'));
    window.scrollTo({top:0,behavior:'instant'});
  }
  $('#policy-options').innerHTML=allPolicies.filter(id=>id!=='neutral').map(id=>'<button class="policy-choice" data-policy="'+id+'">'+icon(id)+Sim.policies[id].name+'</button>').join('');
  $('#neutral-policy').onclick=()=>{run().choice.p='neutral';report='effect';store();renderWorkbench();};
  $('#policy-options').onclick=e=>{const b=e.target.closest('[data-policy]');if(!b)return;run().choice.p=b.dataset.policy;report='effect';store();renderWorkbench();};
  $('#intensities').innerHTML=strengths.map((name,i)=>'<button data-i="'+(i+1)+'">'+name+'</button>').join('');
  $('#intensities').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;run().choice.i=Number(b.dataset.i);report='effect';store();renderWorkbench();};
  $('#environment').onchange=e=>{run().choice.e=e.target.value;report='effect';store();renderWorkbench();};
  $('#horizon').onchange=e=>{saved.horizon=Number(e.target.value);store();renderWorkbench();};
  $('#change-model').onclick=()=>{location.hash='atlas';};
  $('#model-detail').onclick=()=>{focusModel=saved.model;location.hash='atlas';};
  $('#legend').innerHTML=series.map(q=>'<button data-series="'+q.key+'" aria-pressed="'+visible.has(q.key)+'" title="显示或隐藏'+q.name+'"><span class="legend-swatch" style="--swatch:'+q.color+'"></span>'+q.name+'</button>').join('');
  $('#legend').onclick=e=>{const b=e.target.closest('[data-series]');if(!b)return;const k=b.dataset.series;if(visible.has(k)&&visible.size===1)return;if(visible.has(k))visible.delete(k);else visible.add(k);b.setAttribute('aria-pressed',visible.has(k));drawChart();};
  const area=$('#chart-area');
  area.tabIndex=0;area.setAttribute('aria-label','趋势图，可使用左右方向键逐年查看数据');
  let focusTick=0;
  area.addEventListener('pointermove',e=>{if(!chartGeometry)return;const {inner,left}=chartGeometry;const x=e.clientX-area.getBoundingClientRect().left;focusTick=Math.max(0,Math.min(pathData.length-1,Math.round((x-left)/inner*(pathData.length-1))));showTip(focusTick);});
  area.addEventListener('pointerleave',hideTip);area.addEventListener('blur',hideTip);
  area.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Escape'].includes(e.key))return;e.preventDefault();if(e.key==='Escape'){hideTip();return;}focusTick=Math.max(0,Math.min(pathData.length-1,focusTick+(e.key==='ArrowLeft'?-1:1)));showTip(focusTick);$('#announce').textContent=$('#plot-tip').textContent;});
  document.querySelectorAll('[data-report]').forEach(b=>b.onclick=()=>{report=b.dataset.report;if(report==='history')reportYear=run().actions.length;renderReport();});
  $('#advance').onclick=()=>{
    const r=run();r.actions.push({...r.choice});report='history';reportYear=r.actions.length;store();renderWorkbench();
    const text='已推进至第 '+r.actions.length+' 年';
    $('#announce').textContent=text+'，已生成决策记录。';$('#advance').innerHTML=icon('check')+text;
    clearTimeout(advanceTimer);advanceTimer=setTimeout(()=>{$('#advance').innerHTML=icon('play')+'执行政策并推进一年';},1200);
  };
  $('#reset').onclick=()=>{$('#reset-copy').textContent='将「'+getModel().name+'」恢复至第 0 年，并清除这个模式的决策记录。其他制度的记录会保留。';$('#reset-dialog').showModal();};
  $('#reset-dialog').onclose=()=>{if($('#reset-dialog').returnValue==='reset'){saved.runs[saved.model]=fresh();report='effect';detailOpen=false;reportYear=null;store();renderWorkbench();$('#announce').textContent='已恢复至第 0 年。';}$('#reset-dialog').returnValue='';};
  window.addEventListener('hashchange',route);
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(drawChart,90);});
  paintIcons();store();route();
})();
