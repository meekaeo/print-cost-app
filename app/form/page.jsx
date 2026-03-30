"use client";
import { useEffect, useState } from "react";

const MONTHS = [
  { value: "01", label: "มกราคม" },
  { value: "02", label: "กุมภาพันธ์" },
  { value: "03", label: "มีนาคม" },
  { value: "04", label: "เมษายน" },
  { value: "05", label: "พฤษภาคม" },
  { value: "06", label: "มิถุนายน" },
  { value: "07", label: "กรกฎาคม" },
  { value: "08", label: "สิงหาคม" },
  { value: "09", label: "กันยายน" },
  { value: "10", label: "ตุลาคม" },
  { value: "11", label: "พฤศจิกายน" },
  { value: "12", label: "ธันวาคม" },
];

export default function FormPage() {
  const [machines, setMachines] = useState([]);
  const [fetchingMachines, setFetchingMachines] = useState(true);
  const [refProject, setRefProject] = useState("");
  const [selected, setSelected] = useState(null);
  const [year, setYear] = useState("2568");
  const [month, setMonth] = useState("04");
  const [bwPages, setBwPages] = useState("");
  const [colorPages, setColorPages] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setFetchingMachines(true);
    fetch("/api/machines")
      .then((r) => r.json())
      .then((d) => { if (d.success) setMachines(d.rows); })
      .finally(() => setFetchingMachines(false));
  }, []);

  const refList = [...new Set(machines.map((m) => m["Ref.Project"]))].filter(Boolean).sort();
  const projectList = machines.filter((m) => m["Ref.Project"] === refProject);

  const bwRate = selected ? Number(selected["BW_Cost_per_Page"]) : 0;
  const colorRate = selected ? Number(selected["Color_Cost_per_Page"]) : 0;
  const rent = selected ? Number(selected["ราคาเช่าเครื่อง_ต่อเดือน"]) : 0;
  const bwTotal = (Number(bwPages) || 0) * bwRate;
  const colorTotal = (Number(colorPages) || 0) * colorRate;
  const printing = bwTotal + colorTotal;
  const grand = rent + printing;

  const fmt = (n) =>
    Number(n).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function handleRefChange(val) {
  setRefProject(val);
  setSelected(null);
  // ถ้ามีเครื่องเดียวใน Ref นี้ → auto select
  const filtered = machines.filter((m) => m["Ref.Project"] === val);
  if (filtered.length === 1) {
    setSelected(filtered[0]);
  }
}

  function handleProjectChange(machineId) {
    const m = machines.find((x) => x["Machine_ID"] === machineId);
    setSelected(m || null);
    setMsg(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return setMsg({ type: "error", text: "กรุณาเลือกเครื่อง" });
    setLoading(true);
    setMsg(null);
    const body = {
      เลขสัญญา: selected["เลขสัญญา"],
      "Ref.Project": selected["Ref.Project"],
      Project: selected["Project"],
      Model: selected["Model"],
      Machine_ID: selected["Machine_ID"],
      Month: `${year}-${month}`,
      BW_Pages: Number(bwPages) || 0,
      Color_Pages: Number(colorPages) || 0,
      ราคาเช่าเครื่อง_ต่อเดือน: rent,
      BW_Cost_per_Page: bwRate,
      Color_Cost_per_Page: colorRate,
      หมายเหตุ: note || selected["หมายเหตุ"] || "",
    };
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "บันทึกสำเร็จ! Grand Total: " + fmt(data.grand_total) + " บาท" });
        setBwPages("");
        setColorPages("");
        setNote("");
      } else {
        setMsg({ type: "error", text: data.error || "เกิดข้อผิดพลาด" });
      }
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">บันทึกข้อมูลการพิมพ์</h1>
            <p className="text-xs text-slate-400">Print Cost System</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100 space-y-3">
            <label className="block text-sm font-semibold text-slate-700">เลือกเครื่อง / สาขา</label>

            {fetchingMachines ? (
              <>
                <div className="w-full h-10 bg-slate-100 rounded-lg animate-pulse"/>
                <div className="w-full h-10 bg-slate-100 rounded-lg animate-pulse"/>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Ref.Project</label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    value={refProject}
                    onChange={(e) => handleRefChange(e.target.value)}
                    required
                  >
                    <option value="">— เลือก Ref.Project —</option>
                    {refList.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Project / สาขา</label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white disabled:bg-slate-50 disabled:text-slate-400"
                    value={selected ? selected["Machine_ID"] : ""}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    disabled={!refProject}
                    required
                  >
                    <option value="">— เลือก Project —</option>
                    {projectList.map((m) => (
                      <option key={m["Machine_ID"]} value={m["Machine_ID"]}>
                        {m["Project"]} ({m["Machine_ID"]})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {selected && (
              <div className="bg-blue-50 rounded-lg p-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600">
                <div><span className="font-medium text-slate-500">เลขสัญญา</span><br/>{selected["เลขสัญญา"]}</div>
                <div><span className="font-medium text-slate-500">Model</span><br/>{selected["Model"]}</div>
                <div><span className="font-medium text-slate-500">Machine ID</span><br/>{selected["Machine_ID"]}</div>
                <div><span className="font-medium text-slate-500">ค่าเช่า/เดือน</span><br/><span className="font-semibold text-blue-700">{fmt(rent)} บาท</span></div>
                <div><span className="font-medium text-slate-500">BW Rate</span><br/>{bwRate} บ./หน้า</div>
                <div><span className="font-medium text-slate-500">Color Rate</span><br/>{colorRate} บ./หน้า</div>
                {selected["หมายเหตุ"] && (
                  <div className="col-span-2"><span className="font-medium text-slate-500">หมายเหตุ</span><br/>{selected["หมายเหตุ"]}</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">ระยะเวลา</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">เดือน</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">ปี (พ.ศ.)</label>
                <input
                  type="number"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">จำนวนหน้าพิมพ์</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">BW Pages (ขาว-ดำ)</label>
                <input
                  type="number" min="0"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={bwPages}
                  onChange={(e) => setBwPages(e.target.value)}
                  placeholder="0"
                  inputMode="numeric"
                />
                {bwPages !== "" && Number(bwPages) > 0 && (
                  <p className="text-xs text-blue-500 mt-1 font-medium">= {fmt(bwTotal)} บาท</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Color Pages (สี)</label>
                <input
                  type="number" min="0"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={colorPages}
                  onChange={(e) => setColorPages(e.target.value)}
                  placeholder="0"
                  inputMode="numeric"
                />
                {colorPages !== "" && Number(colorPages) > 0 && (
                  <p className="text-xs text-blue-500 mt-1 font-medium">= {fmt(colorTotal)} บาท</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">หมายเหตุ (ถ้ามี)</label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={selected && selected["หมายเหตุ"] ? selected["หมายเหตุ"] : "หมายเหตุเพิ่มเติม..."}
            />
          </div>

          {selected && (
            <div className="bg-blue-600 rounded-xl p-4 text-white shadow-sm">
              <p className="text-xs font-medium text-blue-200 mb-3 uppercase tracking-wide">สรุปค่าใช้จ่าย</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-100">ค่าเช่าเครื่อง</span>
                  <span className="font-medium">{fmt(rent)} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">ค่าพิมพ์ BW</span>
                  <span className="font-medium">{fmt(bwTotal)} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">ค่าพิมพ์ Color</span>
                  <span className="font-medium">{fmt(colorTotal)} บาท</span>
                </div>
                <div className="border-t border-blue-400 pt-2 flex justify-between text-base font-bold">
                  <span>Grand Total</span>
                  <span>{fmt(grand)} บาท</span>
                </div>
              </div>
            </div>
          )}

          {msg && (
            <div className={"rounded-xl px-4 py-3 text-sm font-medium " + (msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200")}>
              {msg.type === "success" ? "✓ " : "✗ "}{msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selected}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition text-base shadow-sm"
          >
            {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>

          <p className="text-center text-xs text-slate-400 pb-4">ข้อมูลจะถูกบันทึกลง Google Sheet ทันที</p>
        </form>
      </div>
    </div>
  );
}
