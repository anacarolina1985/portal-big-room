/* ═══════════════════════════════════════════════════════════
   OKR VALIDATION ENGINE — Checklist Completo (compartilhado)
   Fonte única usada por okrs.html, estrutura.html, dashboard.html.
   Regras v1.2: OKR sem KRs = 0% crítico · alinhamento hierárquico
   squad→tribo · thresholds ≥80% verde / ≥60% âmbar / <60% vermelho.
   Depende dos globais: OKRS_DATA (opcional, para alinhamento) e das
   classes CSS .tag/.tok/.twrn/.terr/.kr-item da página hospedeira.
   ═══════════════════════════════════════════════════════════ */

// ── Listas de palavras ────────────────────────────────────────
const _VAL = {
  // O1: Aspiração estratégica
  aspiration: ['referência','reference','excelência','excellence','liderar',
    'liderança','leadership','transformar','transformação','transformation',
    'primeira escolha','first choice','be the reference','inspirar confiança',
    'tornar-se essencial','impulsionar relevância','ampliar impacto','relevância',
    'principalidade','consolidar liderança','posicionamento estratégico',
    'elevar maturidade','fortalecer posicionamento','melhorar a qualidade',
    'acelerar inovação','expandir impacto','melhorar jornadas','modernizar',
    'ser referência','ser a primeira','ampliar presença','consolidar canal',
    'evoluir a solução','evolução estratégica','elevar padrão'],
  // O1: Pilares de negócio
  pillars: ['experiência','experience','segurança','security','eficiência',
    'efficiency','escalabilidade','scalability','confiabilidade','reliability',
    'resiliência','resiliency','inovação','innovation','agilidade','agility',
    'qualidade','quality','crescimento','growth','receita','revenue',
    'lucratividade','profitability','transformação','transformation'],
  // O1: Operacional (negativo)
  operational: ['mapear ','organizar processos','implementar um','instalar ',
    'configurar sistema','levantar requisitos','criar documentação','elaborar mapeamento',
    'realizar levantamento','executar projeto','fazer levantamento'],
  // O5: Eixos estratégicos
  o5: {
    'Eficiência':  ['eficiência','produtividade','fluidez','eficiente','produtivo',
                    'otimizar','otimização','automatizar','automatização','agilizar'],
    'Inovação':    ['inovação','modernização','evolução','inovar','modernizar',
                    'evoluir','disruptiv','transformação digital','nova solução',
                    'novo produto','tecnologia emergente'],
    'Pessoas':     ['pessoas','cultura','colaboradores','formação',
                    'capacitação','engajamento','talento','diversidade','inclusão',
                    'bem-estar','funcionário','profissional','desenvolvimento humano'],
    'Clientes':    ['clientes','experiência','jornada','cliente','usuário',
                    'consumidor','satisfação','nps','csat','parceiro',
                    'relacionamento','fidelização','atendimento']
  },
  // KR: Tarefa vs Impacto
  taskWords: ['implantar ','implementar um','realizar estudo','elaborar ',
    'mapear ','levantar ','criar documentação','desenvolver plano ',
    'executar projeto','conduzir ','organizar '],
  // KR: Manutenção explícita
  maintWords: ['manter em','manutenção do','permanecer em','sustentar em',
    'garantir que se mantenha','manter o índice','manter o nível',
    'manter a taxa','manter o nps','manter o csat']
};

// ── O1: Reflete desejo de negócio ────────────────────────────
function checkO1(nome){
  const l = nome.toLowerCase();
  const isOp  = _VAL.operational.some(w=>l.includes(w));
  const hasAsp = _VAL.aspiration.some(w=>l.includes(w));
  const hasPil = _VAL.pillars.some(w=>l.includes(w));

  if(isOp && !hasAsp && !hasPil){
    const w = _VAL.operational.find(w=>l.includes(w));
    return {ok:false, reason:`O objetivo descreve ação operacional ("${w.trim()}") sem ambição estratégica ou pilar de negócio.`};
  }
  if(hasAsp || hasPil) return {ok:true};
  return {ok:false, reason:`Não contém expressão de desejo de negócio (aspiração estratégica, pilar de crescimento, experiência, inovação etc.).`};
}

// ── O2: É qualitativo ─────────────────────────────────────────
function checkO2(nome){
  // Meta embutida: "aumentar X%", "reduzir de A para B", "atingir N"
  // Meta embutida: verbo + número próximo (com ou sem palavras entre eles)
  const metaRe = /(aumentar|reduzir|elevar|atingir|chegar a|de\s+\d)[\w\s,]{0,20}[\d,.]+\s*(%|pontos|pp|unidades)?|(de\s+[\d,.]+\s+para\s+[\d,.]+)/i;
  const match = nome.match(metaRe);
  if(match) return {ok:false, reason:`Meta embutida detectada: "${match[0].trim()}" — objetivo se torna quantitativo.`};
  return {ok:true};
}

// ── O3: Clareza ───────────────────────────────────────────────
function checkO3(nome){
  if(nome.length > 220) return {ok:false, reason:`${nome.length} caracteres (limite 220). Trecho excedente: "…${nome.slice(200)}".`};
  return {ok:true};
}

// ── O5: Pautado em eficiência/inovação/pessoas/clientes ───────
function checkO5(nome){
  const l = nome.toLowerCase();
  const found = Object.entries(_VAL.o5)
    .filter(([,ws])=>ws.some(w=>l.includes(w)))
    .map(([k])=>k);
  if(!found.length) return {ok:false, reason:`Não cita nenhum dos 4 eixos estratégicos: Eficiência, Inovação, Pessoas ou Clientes.`};
  return {ok:true, eixos:found};
}

// ── Helpers numéricos ────────────────────────────────────────
function _n(s){ const v=parseFloat(String(s||'').replace(',','.')); return isNaN(v)?null:v; }

// ── KR: Meta concreta ─────────────────────────────────────────
function checkKRMeta(kr){
  const m = _n(kr.meta);
  if(m===null || kr.meta==='' || kr.meta==='0' && kr.base==='0')
    return {ok:false, reason:`Sem meta numérica definida (target_value: "${kr.meta||'vazio'}").`};
  return {ok:true};
}

// ── KR: É quantitativo ───────────────────────────────────────
function checkKRQuantitative(kr){
  const m = _n(kr.meta), b = _n(kr.base), r = _n(kr.real);
  if(m===null && b===null && r===null)
    return {ok:false, reason:`Nenhum valor numérico em meta, base ou realizado — impossível medir progresso.`};
  return {ok:true};
}

// ── KR: Mede progresso (base + meta) ─────────────────────────
function checkKRProgress(kr){
  const m = _n(kr.meta), b = _n(kr.base);
  if(m===null) return {ok:false, reason:`Sem meta definida — impossível calcular evolução.`};
  if(b===null) return {ok:false, reason:`Sem baseline definido (base_value: "${kr.base||'vazio'}") — evolução não pode ser medida.`};
  return {ok:true};
}

// ── KR: Orientado a impacto (não tarefa) ─────────────────────
function checkKRImpact(kr){
  const l = kr.nome.toLowerCase();
  const taskWord = _VAL.taskWords.find(w=>l.includes(w));
  if(taskWord) return {ok:false, reason:`KR descreve tarefa/entrega ("${taskWord.trim()}") sem resultado mensurável de impacto.`};
  return {ok:true};
}

// ── KR: Coerência nome × tipo ────────────────────────────────
function checkKRTypeCoherence(kr){
  const m = _n(kr.meta), b = _n(kr.base);
  if(!kr.tipo || m===null || b===null || b===m) return {ok:true};
  const tipo = kr.tipo.toLowerCase();
  if(tipo==='aumentar' && m<b)
    return {ok:false, reason:`Tipo "Aumentar" mas meta (${m}) < base (${b}).`};
  if(tipo==='reduzir' && m>b)
    return {ok:false, reason:`Tipo "Reduzir" mas meta (${m}) > base (${b}).`};
  return {ok:true};
}

// ── KR: Não é manutenção ─────────────────────────────────────
function checkKRMaintenance(kr){
  const l = kr.nome.toLowerCase();
  // Explícita
  const mw = _VAL.maintWords.find(w=>l.includes(w));
  if(mw) return {ok:false, reason:`Uso explícito de linguagem de manutenção: "${mw}".`};
  // Implícita: base ≈ meta ± 2% (exceto escalas CSAT 0-10 com dif ≤ 0.3)
  const m = _n(kr.meta), b = _n(kr.base);
  if(m!==null && b!==null && b!==0){
    const diff = Math.abs((m-b)/b);
    const absDiff = Math.abs(m-b);
    const isCsatLike = b>=0 && b<=10 && absDiff<=0.3;
    if(!isCsatLike && diff<=0.02)
      return {ok:false, reason:`Base (${b}) e meta (${m}) muito próximas (dif. ${(diff*100).toFixed(1)}%) — caracteriza manutenção.`};
  }
  return {ok:true};
}

// ── KR: Coerência base × meta × realizado ────────────────────
function checkKRCoherence(kr){
  const m=_n(kr.meta), b=_n(kr.base), r=_n(kr.real);
  if(m===null||b===null) return {ok:true}; // sem dados suficientes
  const tipo=(kr.tipo||'').toLowerCase();
  // Se realizado existir, deve estar na direção esperada
  if(r!==null && tipo==='aumentar' && r<b && kr.est!=='Cancelado')
    return {ok:false, reason:`Realizado (${r}) < base (${b}) com tipo "Aumentar" e estado "${kr.est}".`};
  if(r!==null && tipo==='reduzir' && r>b && kr.est!=='Cancelado')
    return {ok:false, reason:`Realizado (${r}) > base (${b}) com tipo "Reduzir" e estado "${kr.est}".`};
  return {ok:true};
}

// ── Validação completa de 1 OKR ──────────────────────────────
function validateFullOKR(okr, krs){
  const v = {
    o1: checkO1(okr.nome),
    o2: checkO2(okr.nome),
    o3: checkO3(okr.nome),
    o5: checkO5(okr.nome),
    krCount: krs.length,
    krCountOk: krs.length>=2 && krs.length<=5,
    krMissing: krs.length===0,  /* OKR sem KRs = erro crítico */
    krs: krs.map(kr=>({
      n:    kr.n,
      nome: kr.nome,
      _prog:kr.prog, _base:kr.base, _meta:kr.meta, _real:kr.real, _tipo:kr.tipo, _est:kr.est,
      _last_update: kr._last_update,
      meta:        checkKRMeta(kr),
      quant:       checkKRQuantitative(kr),
      progress:    checkKRProgress(kr),
      impact:      checkKRImpact(kr),
      typeCoher:   checkKRTypeCoherence(kr),
      maintenance: checkKRMaintenance(kr),
      coherence:   checkKRCoherence(kr),
    }))
  };
  // Score geral — OKR sem KRs = 0% independente dos critérios do objetivo
  if(v.krMissing){
    v.score = 0;
    v.scoreColor = 'var(--errC)';
    v.criticalError = 'OKR sem KRs: não é possível medir progresso. Adicione 2 a 5 Key Results.';
    return v;
  }
  /* I8: verificar alinhamento hierárquico squad → tribo */
  const _okrsAll = (typeof OKRS_DATA!=='undefined' && Array.isArray(OKRS_DATA)) ? OKRS_DATA : [];
  if(okr.cat==='Squad' && okr.tribe){
    const tribeOkrs = _okrsAll.filter(o=>o.cat==='Tribo' && o.tribe===okr.tribe && o.trim===okr.trim);
    v.hierAlignOk = tribeOkrs.length === 0 ? null  /* sem OKRs de tribo cadastrados — não penaliza */
      : tribeOkrs.length > 0;  /* tribo tem OKRs: squad deve estar alinhado (informativo) */
    v.tribeOkrCount = tribeOkrs.length;
  } else {
    v.hierAlignOk = null;
    v.tribeOkrCount = 0;
  }
  const objChecks = [v.o1.ok, v.o2.ok, v.o3.ok, v.o5.ok, v.krCountOk];
  const krChecks  = v.krs.flatMap(kr=>[kr.meta.ok,kr.quant.ok,kr.progress.ok,kr.impact.ok,kr.typeCoher.ok,kr.maintenance.ok,kr.coherence.ok]);
  const total = objChecks.length + krChecks.length;
  const passed= objChecks.filter(Boolean).length + krChecks.filter(Boolean).length;
  v.score = total>0 ? Math.round((passed/total)*100) : 0;
  v.scoreColor = v.score>=80 ? 'var(--green)' : v.score>=60 ? 'var(--amber)' : 'var(--errC)';
  return v;
}

// ── Render da validation card ─────────────────────────────────
function renderValidation(val, collapsed=true){
  const id = 'val_'+Math.random().toString(36).slice(2,8);
  const badgeClass = val.score>=80?'tok':val.score>=60?'twrn':'terr';

  /* OKR sem KRs: erro crítico — exibe apenas o bloco de erro */
  if(val.krMissing){
    return `<div style="border-top:1px dashed var(--border);margin-top:6px;padding-top:6px">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:8px;font-weight:700;color:var(--muted);text-transform:uppercase">Validação OKR</span>
        <span class="tag terr" style="font-size:8px">0% — CRÍTICO</span>
        <span style="font-size:9px;color:var(--errC);font-weight:700">⛔ ${val.criticalError}</span>
      </div>
    </div>`;
  }

  const objRows = [
    ['O1','Desejo de negócio', val.o1],
    ['O2','Qualitativo',       val.o2],
    ['O3','Clareza',           val.o3],
    ['O5','Eixo estratégico',  val.o5],
    ['O4',`Qtd. KRs (${val.krCount})`, {ok:val.krCountOk, reason:!val.krCountOk?`${val.krCount} KRs (esperado: 2 a 5)`:null}],
  ];

  const objBadges = objRows.map(([code,label,res])=>
    `<span class="tag ${res.ok?'tok':'terr'}" title="${res.ok?'OK':res.reason||'Não atende'}" style="cursor:default">${code}${res.ok?'✓':'✗'}</span>`
  ).join('');

  // KR rows com timestamp (I7) e alinhamento (I8)
  const krCols = ['Meta','Quant.','Progresso','Impacto','Tipo','Manutenção','Coerência'];
  const krRows = val.krs.slice(0,10).map(kr=>{
    const checks = [kr.meta,kr.quant,kr.progress,kr.impact,kr.typeCoher,kr.maintenance,kr.coherence];
    const badges = checks.map((c,i)=>
      `<span class="tag ${c.ok?'tok':'terr'}" title="${c.ok?'OK':c.reason||''}" style="cursor:default;padding:1px 4px">${c.ok?'✓':'✗'}</span>`
    ).join('');
    /* timestamp da última aferição */
    let tsBadge='';
    if(kr._last_update){
      const d=new Date(kr._last_update);
      const diffDays=Math.round((Date.now()-d.getTime())/86400000);
      const tsLbl=diffDays===0?'hoje':diffDays===1?'ontem':diffDays+' dias atrás';
      const tsCol=diffDays>30?'var(--errC)':diffDays>14?'var(--amber)':'var(--muted)';
      tsBadge=`<span style="font-size:7.5px;color:${tsCol};margin-left:4px" title="Último update: ${d.toLocaleDateString('pt-BR')}">🕐 ${tsLbl}</span>`;
    }
    return `<div class="kr-item" style="flex-wrap:wrap;gap:4px">
      <div class="kr-num">${kr.n}</div>
      <div class="kr-name" style="flex:1;min-width:0">${kr.nome.substring(0,80)}${kr.nome.length>80?'…':''}${tsBadge}</div>
      <div style="display:flex;gap:3px;flex-shrink:0">${badges}</div>
    </div>`;
  }).join('');
  /* badge de alinhamento hierárquico (I8) */
  const hierBadge = val.hierAlignOk===null ? ''
    : val.tribeOkrCount > 0
      ? `<span class="tag tok" title="Tribo possui ${val.tribeOkrCount} OKR(s) — alinhamento verificável. Confirme que esta squad contribui para pelo menos 1 OKR de Tribo." style="cursor:default;font-size:7.5px">H✓ Alinhado</span>`
      : `<span class="tag twrn" title="Sem OKRs de Tribo cadastrados para este quarter — alinhamento não pode ser verificado." style="cursor:default;font-size:7.5px">H⚠ Sem tribo</span>`;

  return `
<div style="border-top:1px dashed var(--border);margin-top:6px;padding-top:6px">
  <div style="display:flex;align-items:center;gap:6px;cursor:pointer" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
    <span style="font-size:8px;font-weight:700;color:var(--muted);text-transform:uppercase">Validação OKR</span>
    <span class="tag ${badgeClass}" style="font-size:8px">${val.score}%</span>
    <div style="display:flex;gap:3px">${objBadges}</div>
    ${hierBadge}
    <span style="font-size:9px;color:var(--muted);margin-left:auto">▼</span>
  </div>
  <div style="display:none;margin-top:8px">
    <div style="font-size:8px;font-weight:700;color:var(--muted);margin-bottom:4px">CRITÉRIOS DO OBJETIVO</div>
    <table style="width:100%;font-size:8px;border-collapse:collapse;margin-bottom:8px">
      ${objRows.map(([code,label,res])=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:3px 6px;font-weight:700;width:28px">${code}</td>
        <td style="padding:3px 6px;color:var(--muted)">${label}</td>
        <td style="padding:3px 6px"><span class="tag ${res.ok?'tok':'terr'}">${res.ok?'✅ OK':'❌ NC'}</span></td>
        <td style="padding:3px 6px;color:var(--${res.ok?'muted':'errC'})">${res.ok?'':(res.reason||'')}</td>
      </tr>`).join('')}
    </table>
    ${val.krs.length>0?`
    <div style="font-size:8px;font-weight:700;color:var(--muted);margin-bottom:4px">KRs (${val.krs.length})</div>
    <div style="font-size:7.5px;display:flex;gap:3px;flex-wrap:wrap;margin-bottom:4px;padding:3px 0;border-bottom:1px solid var(--border)">
      <span style="min-width:72px;color:var(--muted)">KR</span>
      <span style="flex:1;color:var(--muted)">Nome</span>
      ${krCols.map(c=>`<span style="min-width:38px;text-align:center;color:var(--muted)">${c}</span>`).join('')}
    </div>
    ${krRows}
    ${val.krs.length>10?`<div style="font-size:7.5px;color:var(--muted);padding:4px">+${val.krs.length-10} KRs</div>`:''}
    `:'<div style="font-size:8px;color:var(--amber)">⚠️ Sem KRs vinculados</div>'}
  </div>
</div>`;
}


/* ═══ SUGGESTION ENGINE ════════════════════════════════════ */
function getSuggestion(criterion, okr, krs){
  const nome = okr ? okr.nome : '';
  const krsLen = krs ? krs.length : 0;
  const s = {
    o1: 'Reformule com ambição estratégica. Use: "Ser referência em [pilar]", "Elevar a excelência em [área]", "Consolidar liderança em [domínio]". Verbos: elevar, fortalecer, liderar, transformar. Evite verbos operacionais (mapear, implementar, organizar).',
    o2: 'Mova o número para um Key Result. O objetivo descreve direção estratégica; a meta vai no KR. Ex: objetivo → "Elevar a maturidade técnica da tribo"; KR → "Aumentar índice de maturidade de 60 para 80".',
    o3: `Reduza para menos de 220 caracteres (atual: ${nome.length}). Remova detalhes técnicos e mantenha a essência estratégica. Divida em objetivo + KRs se necessário.`,
    o5: 'Inclua referência a um eixo estratégico: Eficiência (otimizar, reduzir custos, automatizar), Inovação (modernizar, transformar, digitalizar), Pessoas (desenvolver, capacitar, engajar) ou Clientes (experiência, jornada, NPS/CSAT).',
    o4: krsLen < 2
      ? `Adicione pelo menos ${2 - krsLen} Key Result(s) mensurável(is) com baseline, meta numérica e tipo (Aumentar/Reduzir). Cada KR mede um aspecto distinto do objetivo.`
      : `Reduza para no máximo 5 KRs. Priorize os mais relevantes e agrupe métricas relacionadas em um único KR.`
  };
  return s[criterion] || '';
}

function getSuggestionKR(criterion, kr){
  const base = kr ? kr.base : '';
  const meta = kr ? kr.meta : '';
  const tipo = kr ? kr.tipo : '';
  const real = kr ? kr.real : '';
  const nbm  = meta !== '' ? Math.round((_n(meta)||0) * 1.05 * 10)/10 : '';
  const s = {
    meta:        'Defina um valor numérico como meta (target_value). Exemplo: se é sobre disponibilidade, meta = 99 (%). Sem meta numérica não há como medir progresso.',
    quant:       'Adicione valores numéricos: baseline (ponto de partida), meta (valor alvo) e unidade de medida (%, minutos, NPS, R$). O KR precisa ser mensurável.',
    progress:    `Defina o baseline (base_value = ponto de partida atual). Se base=${base||'?'}, informe o valor real de hoje. Sem baseline não dá para medir evolução.`,
    impact:      'Reescreva focando no resultado, não na atividade. Em vez de "Implantar X", use "Aumentar Y de A para B" ou "Reduzir Z de C para D". Pergunte: o que muda para o negócio?',
    maintenance: `Aumente a ambição: diferencie meta da base em mais de 2%. Base=${base||'?'} → meta=${meta||'?'} está muito próximo. Sugestão: eleve para ${nbm||'meta+5%'} (≥5% de evolução).`,
    typeCoher:   `Tipo "${tipo}" incompatível com os valores. Tipo "Aumentar" exige meta > base; "Reduzir" exige meta < base. Ajuste a meta ou o tipo do KR.`,
    coherence:   `Realizado (${real}) vai na direção oposta ao tipo "${tipo}". Revise o valor realizado ou reconsidere o tipo do KR.`
  };
  return s[criterion] || '';
}
