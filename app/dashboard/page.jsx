"use client";
import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      :root{--bg-page:#f0f4f8;--bg-card:#ffffff;--bg-header:#1a2e4a;--accent:#3b82f6;--accent-soft:#dbeafe;--accent-dark:#1d4ed8;--text-primary:#1e293b;--text-secondary:#64748b;--text-muted:#94a3b8;--border:#e2e8f0;--shadow-sm:0 1px 3px rgba(0,0,0,.06);--shadow-md:0 4px 12px rgba(0,0,0,.08);--radius:10px;--font-main:'IBM Plex Sans Thai',sans-serif;--font-mono:'IBM Plex Mono',monospace;}
      .metric-bar{background:var(--bg-card);border-bottom:1px solid var(--border);padding:5px 16px;display:flex;align-items:stretch;gap:6px;flex-wrap:nowrap;flex-shrink:0;box-shadow:var(--shadow-sm);overflow-x:auto;}
      .metric-btn{background:var(--bg-page);border:1px solid var(--border);color:var(--text-primary);font-family:var(--font-main);font-size:13px;font-weight:500;padding:5px 10px;border-radius:7px;cursor:pointer;transition:all .18s;white-space:nowrap;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;flex:1 1 auto;min-width:110px;}
      .metric-btn .btn-label{font-size:13px;font-weight:700;color:var(--text-primary);}
      .metric-btn .btn-value{font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--text-primary);line-height:1.15;}
      .metric-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-soft);}
      .metric-btn:hover .btn-value{color:var(--accent-dark);}
      .metric-btn.active{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 3px 10px rgba(59,130,246,.35);}
      .metric-btn.active .btn-label,.metric-btn.active .btn-value{color:#fff;}
      .filter-bar{background:var(--bg-card);border-bottom:1px solid var(--border);padding:5px 16px;display:flex;align-items:center;gap:8px;flex-wrap:nowrap;justify-content:flex-end;flex-shrink:0;}
      .filter-group{display:flex;align-items:center;gap:5px;}
      .filter-label{font-size:13px;color:var(--text-muted);font-weight:500;white-space:nowrap;}
      .filter-select{font-family:var(--font-main);font-size:13px;padding:5px 28px 5px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg-page);color:var(--text-primary);cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;min-width:110px;}
      .filter-select:focus{outline:none;border-color:var(--accent);}
      .btn-refresh{background:var(--accent);color:#fff;border:none;font-family:var(--font-main);font-size:13px;font-weight:600;padding:6px 16px;border-radius:6px;cursor:pointer;transition:background .15s;display:flex;align-items:center;gap:5px;white-space:nowrap;}
      .btn-refresh:hover{background:var(--accent-dark);}
      .chart-view-toggle{display:flex;gap:6px;margin-left:auto;}
      .view-btn{background:var(--bg-page);border:1px solid var(--border);color:var(--text-primary);font-family:var(--font-main);font-size:12px;font-weight:600;padding:6px 14px;border-radius:6px;cursor:pointer;transition:all .15s;white-space:nowrap;}
      .view-btn:hover{border-color:var(--accent);background:var(--accent-soft);}
      .view-btn.active{background:var(--accent);border-color:var(--accent);color:#fff;}
      .main-wrap{flex:1 1 0;overflow:hidden;padding:10px 16px;display:flex;flex-direction:column;gap:10px;min-height:0;}
      .summary-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;flex-shrink:0;}
      .s-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-width:0;overflow:hidden;}
      .s-card .s-label{font-size:clamp(10px,1.2vw,13px);color:var(--text-secondary);font-weight:700;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;}
      .s-card .s-value{font-size:clamp(16px,2.2vw,26px);font-weight:700;color:var(--text-primary);font-family:var(--font-mono);margin-top:4px;word-break:break-all;line-height:1.15;}
      .s-card .s-sub{font-size:clamp(10px,1.1vw,13px);color:var(--text-secondary);font-weight:500;margin-top:2px;}
      .chart-wrap{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow-sm);padding:10px 16px;flex:1 1 0;min-height:0;display:flex;flex-direction:column;}
      .chart-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-shrink:0;}
      .chart-wrap h2{font-size:15px;font-weight:700;margin:0;color:var(--text-primary);}
      .chart-container{position:relative;flex:1 1 0;min-height:0;width:100%;overflow-y:auto;overflow-x:hidden;}
      .toast-box{position:fixed;bottom:20px;right:20px;background:var(--bg-header);color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;box-shadow:var(--shadow-md);display:none;z-index:9999;}
      @media(max-width:1100px){.summary-cards{grid-template-columns:repeat(2,1fr);}}
      @media(max-width:768px){.main-wrap{overflow:auto;}.metric-bar{flex-wrap:wrap;}.filter-bar{flex-wrap:wrap;justify-content:flex-start;}.summary-cards{grid-template-columns:repeat(2,1fr);}.chart-wrap{flex:none;min-height:400px;}.chart-header{flex-direction:column;align-items:flex-start;gap:8px;}}
    `;
    document.head.appendChild(style);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js";
    script.onload = initDashboard;
    document.head.appendChild(script);

    return () => { document.head.removeChild(style); };
  }, []);

  const metrics = [
    { metric:"Grand_Total", label:"Grand Total", id:"mbv_Grand_Total" },
    { metric:"Printing_Cost", label:"Printing Cost", id:"mbv_Printing_Cost" },
    { metric:"Color_Total", label:"Color Cost", id:"mbv_Color_Total" },
    { metric:"BW_Total", label:"BW Cost", id:"mbv_BW_Total" },
    { metric:"Color_Pages", label:"Color Pages", id:"mbv_Color_Pages" },
    { metric:"BW_Pages", label:"BW Pages", id:"mbv_BW_Pages" },
    { metric:"ราคาเช่าเครื่อง_ต่อเดือน", label:"รวมค่าเช่า", id:"mbv_rental" },
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#f0f4f8",fontFamily:"'IBM Plex Sans Thai',sans-serif"}}>

      <div className="metric-bar">
        {metrics.map((b,i)=>(
          <button key={b.metric} className={`metric-btn${i===0?" active":""}`} data-metric={b.metric}
            onClick={e=>{
              document.querySelectorAll(".metric-btn").forEach(x=>x.classList.remove("active"));
              e.currentTarget.classList.add("active");
              if(window._setMetric) window._setMetric(b.metric);
            }}>
            <span className="btn-label">{b.label}</span>
            <span className="btn-value" id={b.id}>—</span>
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">โครงการ</span>
          <select className="filter-select" id="filterProject" onChange={()=>window._applyFilters&&window._applyFilters()}>
            <option value="all">ทั้งหมด</option>
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">เดือน</span>
          <select className="filter-select" id="filterMonthFrom" onChange={()=>window._applyFilters&&window._applyFilters()}>
            <option value="all">ทั้งหมด</option>
          </select>
          <span className="filter-label" style={{padding:"0 2px"}}>—</span>
          <select className="filter-select" id="filterMonthTo" onChange={()=>window._applyFilters&&window._applyFilters()}>
            <option value="all">ทั้งหมด</option>
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">ปี</span>
          <select className="filter-select" id="filterYear" onChange={()=>window._applyFilters&&window._applyFilters()}>
            <option value="all">ทุกปี</option>
          </select>
        </div>
        <button className="btn-refresh" onClick={()=>window._loadData&&window._loadData()}>↻ โหลดข้อมูล</button>
      </div>

      <div className="main-wrap">
        <div className="summary-cards">
          <div className="s-card"><div className="s-label">Color Pages</div><div className="s-value" id="sc_color">—</div><div className="s-sub">หน้า</div></div>
          <div className="s-card"><div className="s-label">BW Pages</div><div className="s-value" id="sc_bw">—</div><div className="s-sub">หน้า</div></div>
          <div className="s-card"><div className="s-label">Ref.Project</div><div className="s-value" id="sc_proj">—</div><div className="s-sub">โครงการ</div></div>
        </div>
        <div className="chart-wrap">
          <div className="chart-header">
            <h2 id="chartTitle">รวมค่าใช้จ่ายต่อ Ref.Project</h2>
            <div className="chart-view-toggle">
              <button className="view-btn active" id="vbtn-bar" onClick={()=>window._setChartView&&window._setChartView("bar")}>แท่งแนวนอน</button>
              <button className="view-btn" id="vbtn-line" onClick={()=>window._setChartView&&window._setChartView("line")}>แนวโน้มรายเดือน</button>
            </div>
          </div>
          <div className="chart-container"><canvas id="trendChart"></canvas></div>
        </div>
      </div>

      <div className="toast-box" id="toast"></div>
    </div>
  );
}

function initDashboard() {
  let rawRows=[], filtered=[], metric="Grand_Total", chart=null, chartView="bar";
  const MONTHS_TH=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const MONTHS_FULL=["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const METRIC_LABELS={Grand_Total:"Grand Total (บาท)",Printing_Cost:"Printing Cost (บาท)",Color_Total:"Color Cost (บาท)",BW_Total:"BW Cost (บาท)",Color_Pages:"Color Pages (หน้า)",BW_Pages:"BW Pages (หน้า)","ราคาเช่าเครื่อง_ต่อเดือน":"ค่าเช่าเครื่อง (บาท)"};
  const COLORS=["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899","#0ea5e9","#84cc16","#f43f5e","#14b8a6","#f97316","#6366f1","#22c55e","#eab308","#06b6d4"];

  const toNum=v=>{if(typeof v==="number")return v;const n=parseFloat(String(v).replace(/,/g,""));return isNaN(n)?0:n;};
  const fmt=n=>n===0?"0":n.toLocaleString("th-TH",{minimumFractionDigits:0,maximumFractionDigits:2});
  const fmtNum=n=>n===0?"0":Math.round(n).toLocaleString("th-TH");
  const isPage=()=>metric==="Color_Pages"||metric==="BW_Pages";
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  const parseM=val=>{if(!val)return null;const s=String(val).trim();const m=s.match(/^(\d{4})-(\d{1,2})$/);if(m)return{year:parseInt(m[1]),month:parseInt(m[2])};const d=new Date(val);if(!isNaN(d))return{year:d.getFullYear(),month:d.getMonth()+1};return null;};
  const showToast=msg=>{const t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.style.display="block";setTimeout(()=>{t.style.display="none";},3000);};

  function populateFilters() {
    const projects=[...new Set(rawRows.map(r=>r["Project"]||"").filter(Boolean))].sort();
    const years=[...new Set(rawRows.map(r=>parseM(r["Month"])?.year).filter(Boolean))].sort();
    const ms=new Set();rawRows.forEach(r=>{const m=parseM(r["Month"]);if(m)ms.add(String(m.month).padStart(2,"0"));});
    const months=[...ms].sort();
    const fp=document.getElementById("filterProject");
    fp.innerHTML=`<option value="all">ทั้งหมด</option>`;
    projects.forEach(v=>{fp.innerHTML+=`<option value="${v}">${v}</option>`;});
    ["filterMonthFrom","filterMonthTo"].forEach(id=>{
      const sel=document.getElementById(id);
      sel.innerHTML=`<option value="all">ทั้งหมด</option>`;
      months.forEach(mo=>{sel.innerHTML+=`<option value="${mo}">${MONTHS_FULL[parseInt(mo)-1]||mo}</option>`;});
    });
    const fy=document.getElementById("filterYear");
    fy.innerHTML=`<option value="all">ทุกปี</option>`;
    years.forEach(y=>{fy.innerHTML+=`<option value="${y}">${y}</option>`;});
  }

  function applyFilters() {
    const proj=document.getElementById("filterProject")?.value||"all";
    const mf=document.getElementById("filterMonthFrom")?.value||"all";
    const mt=document.getElementById("filterMonthTo")?.value||"all";
    const yr=document.getElementById("filterYear")?.value||"all";
    filtered=rawRows.filter(r=>{
      if(proj!=="all"&&r["Project"]!=proj)return false;
      const m=parseM(r["Month"]);
      if(!m&&(yr!=="all"||mf!=="all"||mt!=="all"))return false;
      if(m){if(yr!=="all"&&String(m.year)!==String(yr))return false;const mo=String(m.month).padStart(2,"0");if(mf!=="all"&&mo<mf)return false;if(mt!=="all"&&mo>mt)return false;}
      return true;
    });
    renderAll();
  }

  function renderAll() {
    const sum=f=>filtered.reduce((a,r)=>a+toNum(r[f]),0);
    const colorPages=sum("Color_Pages"),bwPages=sum("BW_Pages"),grandTotal=sum("Grand_Total"),printCost=sum("Printing_Cost"),colorTotal=sum("Color_Total"),bwTotal=sum("BW_Total");
    let rental=0;const seen=new Set();
    filtered.forEach(r=>{const m=parseM(r["Month"]);const mk=m?`${m.year}-${String(m.month).padStart(2,"0")}`:"x";const k=`${mk}__${r["Machine_ID"]||r["Ref.Project"]||"?"}`;if(!seen.has(k)){seen.add(k);rental+=toNum(r["ราคาเช่าเครื่อง_ต่อเดือน"]);}});
    set("sc_color",fmtNum(colorPages));set("sc_bw",fmtNum(bwPages));
    set("sc_proj",[...new Set(filtered.map(r=>r["Ref.Project"]).filter(Boolean))].length);
    set("mbv_Grand_Total",fmt(grandTotal));set("mbv_Printing_Cost",fmt(printCost));
    set("mbv_Color_Total",fmt(colorTotal));set("mbv_BW_Total",fmt(bwTotal));
    set("mbv_Color_Pages",fmtNum(colorPages));set("mbv_BW_Pages",fmtNum(bwPages));
    set("mbv_rental",fmt(rental));
    renderChart();
  }

  function renderChart() {
    const canvas=document.getElementById("trendChart");if(!canvas)return;
    const isMobile=window.innerWidth<=768;

    if(chartView==="bar") {
      // Horizontal bar chart - รวมต่อ Ref.Project เรียงจากมากไปน้อย
      const pd={};
      filtered.forEach(r=>{
        const proj=r["Ref.Project"]||"(ไม่ระบุ)";
        if(!pd[proj])pd[proj]=0;
        pd[proj]+=toNum(r[metric]);
      });
      const projData=Object.entries(pd).map(([proj,val])=>({proj,val})).sort((a,b)=>b.val-a.val);
      const labels=projData.map(d=>d.proj);
      const data=projData.map(d=>d.val);
      const bgColors=projData.map((_,i)=>{const hue=(i*137.5)%360;return `hsla(${hue},70%,60%,0.85)`;});
      const borderColors=projData.map((_,i)=>{const hue=(i*137.5)%360;return `hsla(${hue},70%,45%,1)`;});

      // ปรับความสูง canvas ตามจำนวน project
      const barH=32;const minH=300;
      canvas.parentElement.style.height=Math.max(minH,labels.length*barH+80)+"px";

      if(chart)chart.destroy();
      chart=new window.Chart(canvas,{
        type:"bar",
        data:{labels,datasets:[{
          label:METRIC_LABELS[metric]||metric,
          data,
          backgroundColor:bgColors,
          borderColor:borderColors,
          borderWidth:2,
          borderRadius:5,
        }]},
        options:{
          indexAxis:"y",
          responsive:true,
          maintainAspectRatio:false,
          plugins:{
            legend:{display:false},
            tooltip:{callbacks:{label:ctx=>`${ctx.label}: `+(isPage()?fmtNum(ctx.parsed.x)+" หน้า":fmt(ctx.parsed.x)+" บาท")}}
          },
          scales:{
            x:{
              beginAtZero:true,
              grid:{color:"#f1f5f9"},
              ticks:{font:{family:"'IBM Plex Mono'",size:11},color:"#1e293b",callback:v=>v>=1000&&!isPage()?(v/1000)+"k":isPage()?fmtNum(v):fmt(v)},
              title:{display:true,text:METRIC_LABELS[metric]||metric,color:"#1e293b",font:{family:"'IBM Plex Sans Thai'",size:12,weight:"600"}}
            },
            y:{
              grid:{display:false},
              ticks:{font:{family:"'IBM Plex Sans Thai'",size:11},color:"#1e293b"},
              title:{display:true,text:"Ref.Project",color:"#1e293b",font:{family:"'IBM Plex Sans Thai'",size:12,weight:"600"}}
            }
          }
        }
      });
      set("chartTitle","รวมค่าใช้จ่ายต่อ Ref.Project — "+( METRIC_LABELS[metric]||metric));

    } else {
      // Line chart - แนวโน้มรายเดือน
      canvas.parentElement.style.height="";
      const ms=new Set();filtered.forEach(r=>{const m=parseM(r["Month"]);if(m)ms.add(`${m.year}-${String(m.month).padStart(2,"0")}`);});
      const monthKeys=[...ms].sort();
      const labels=monthKeys.map(k=>{const[y,mo]=k.split("-");const yr=parseInt(y);const th=yr<2400?yr+543:yr;return MONTHS_TH[parseInt(mo)-1]+" "+th;});
      const pd={};
      filtered.forEach(r=>{const proj=r["Ref.Project"]||"(ไม่ระบุ)";const m=parseM(r["Month"]);if(!m)return;const mk=`${m.year}-${String(m.month).padStart(2,"0")}`;if(!pd[proj])pd[proj]={};if(!pd[proj][mk])pd[proj][mk]=0;pd[proj][mk]+=toNum(r[metric]);});
      const projNames=Object.keys(pd).sort();
      const datasets=projNames.map((proj,i)=>({label:proj,data:monthKeys.map(mk=>pd[proj][mk]||0),borderColor:COLORS[i%COLORS.length],backgroundColor:COLORS[i%COLORS.length],borderWidth:2,pointRadius:4,tension:0.4,fill:false}));
      if(chart)chart.destroy();
      chart=new window.Chart(canvas,{type:"line",data:{labels,datasets},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:"index",intersect:false},plugins:{legend:{display:true,position:isMobile?"bottom":"left",labels:{usePointStyle:true,boxWidth:10,font:{family:"'IBM Plex Sans Thai'",size:12},color:"#1e293b"}},tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: `+(isPage()?fmtNum(ctx.parsed.y)+" หน้า":fmt(ctx.parsed.y)+" บาท")}}},scales:{x:{grid:{color:"#f1f5f9"},ticks:{font:{family:"'IBM Plex Sans Thai'",size:12},color:"#1e293b",maxRotation:isMobile?45:0}},y:{beginAtZero:true,position:"right",grid:{color:"#f1f5f9"},title:{display:!isMobile,text:METRIC_LABELS[metric]||metric,color:"#1e293b",font:{family:"'IBM Plex Sans Thai'",size:12,weight:"600"}},ticks:{font:{family:"'IBM Plex Mono'",size:12},color:"#1e293b",callback:v=>v>=1000&&!isPage()?(v/1000)+"k":isPage()?fmtNum(v):fmt(v)}}}}});
      set("chartTitle","แนวโน้มค่าใช้จ่ายรายเดือน — แยกตาม Ref.Project");
    }
  }

  async function loadData() {
    try {
      showToast("กำลังโหลดข้อมูล...");
      const res=await fetch("/api/data");
      const data=await res.json();
      if(data.success){rawRows=data.rows||[];populateFilters();applyFilters();showToast("โหลดสำเร็จ "+rawRows.length+" แถว");}
      else showToast("โหลดไม่สำเร็จ: "+(data.error||"unknown"));
    } catch(e){showToast("Error: "+e.message);}
  }

  window._loadData=loadData;
  window._applyFilters=applyFilters;
  window._setMetric=m=>{metric=m;renderAll();};
  window._setChartView=v=>{
    chartView=v;
    document.querySelectorAll(".view-btn").forEach(b=>b.classList.remove("active"));
    const btn=document.getElementById("vbtn-"+v);if(btn)btn.classList.add("active");
    renderChart();
  };
  window.addEventListener("resize",()=>{if(chart)renderChart();});
  loadData();
}
