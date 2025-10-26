// 色彩和谐交互工具
(function(){
  const hue = document.getElementById('hue');
  const sat = document.getElementById('sat');
  const light = document.getElementById('light');
  const harmony = document.getElementById('harmony');
  const palette = document.getElementById('palette');
  const hueVal = document.getElementById('hueVal');
  const satVal = document.getElementById('satVal');
  const lightVal = document.getElementById('lightVal');

  if(!palette) return; // 防止脚本在子页面报错

  const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));

  function hslToHex(h,s,l){
    h = (h%360+360)%360; s = clamp(s,0,100); l = clamp(l,0,100);
    s/=100; l/=100;
    const c = (1-Math.abs(2*l-1))*s;
    const x = c*(1-Math.abs((h/60)%2-1));
    const m = l-c/2;
    let r=0,g=0,b=0;
    if(h<60){r=c;g=x;b=0}else if(h<120){r=x;g=c;b=0}
    else if(h<180){r=0;g=c;b=x}else if(h<240){r=0;g=x;b=c}
    else if(h<300){r=x;g=0;b=c}else{r=c;g=0;b=x}
    const to255 = v=>Math.round((v+m)*255);
    const hex = n=>n.toString(16).padStart(2,'0');
    return `#${hex(to255(r))}${hex(to255(g))}${hex(to255(b))}`.toUpperCase();
  }

  function getHarmonyHues(h){
    const hs = {
      mono: [h, h+15, h-15, h+30, h-30],
      complement: [h, h+180, h+10, h+170],
      split: [h, h+150, h+210, h+180],
      analogous: [h-30, h-15, h, h+15, h+30],
      triad: [h, h+120, h+240, h+90, h+210],
      tetrad: [h, h+90, h+180, h+270]
    };
    return hs[harmony.value]||hs.mono;
  }

  function renderPalette(){
    const h = Number(hue.value), s = Number(sat.value), l = Number(light.value);
    hueVal.textContent = `${h}°`;
    satVal.textContent = `${s}%`;
    lightVal.textContent = `${l}%`;
    const hues = getHarmonyHues(h).map(x=> (x%360+360)%360);
    const colors = hues.map(H=>({hex:hslToHex(H,s,l), h:H, s, l}));
    palette.innerHTML = colors.map(c=>`
      <div class="swatch">
        <div class="color" style="background:${c.hex}"></div>
        <div class="meta">
          <span class="hex">${c.hex}</span>
          <button class="copy" data-hex="${c.hex}" aria-label="复制 ${c.hex}">复制</button>
        </div>
      </div>
    `).join('');
  }

  function onCopy(e){
    const btn = e.target.closest('.copy');
    if(!btn) return;
    const hex = btn.getAttribute('data-hex');
    if(!hex) return;
    navigator.clipboard?.writeText(hex).then(()=>{
      const old = btn.textContent;
      btn.textContent = '已复制';
      setTimeout(()=>btn.textContent=old, 900);
    });
  }

  hue.addEventListener('input', renderPalette);
  sat.addEventListener('input', renderPalette);
  light.addEventListener('input', renderPalette);
  harmony.addEventListener('change', renderPalette);
  document.addEventListener('click', onCopy);

  renderPalette();
})();