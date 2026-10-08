const fs = require('fs');

const css = `
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',system-ui,sans-serif;background:#f8fafc;color:#0f172a;}
.nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid #e2e8f0;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;}
.nav-logo{display:flex;align-items:center;gap:8px;font-weight:900;font-size:18px;color:#0f172a;text-decoration:none;}
.nav-links{display:flex;align-items:center;gap:20px;}
.nav-links a{font-size:14px;font-weight:600;color:#64748b;text-decoration:none;}
.nav-links a:hover{color:#4f46e5;}
.main-layout{display:grid;grid-template-columns:1fr 440px;gap:0;min-height:calc(100vh - 64px);}
.form-panel{padding:32px;overflow-y:auto;max-height:calc(100vh - 64px);}
.preview-panel{background:#f1f5f9;border-left:1px solid #e2e8f0;padding:24px;overflow-y:auto;max-height:calc(100vh - 64px);display:flex;flex-direction:column;gap:16px;}
.section-card{background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:24px;margin-bottom:20px;}
.section-title{font-size:15px;font-weight:800;color:#0f172a;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.form-row.full{grid-template-columns:1fr;}
.form-group{display:flex;flex-direction:column;gap:5px;}
.form-group label{font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.04em;}
.form-group input,.form-group select,.form-group textarea{border:1.5px solid #e2e8f0;border-radius:10px;padding:10px 12px;font-size:14px;color:#0f172a;background:#f8fafc;outline:none;transition:border .2s;}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#4f46e5;background:#fff;}
.form-group textarea{resize:vertical;min-height:72px;}
.items-table{width:100%;border-collapse:collapse;margin-bottom:12px;}
.items-table th{font-size:11px;font-weight:700;color:#94a3b8;text-align:left;padding:6px 8px;border-bottom:1px solid #f1f5f9;text-transform:uppercase;}
.items-table td{padding:6px 4px;}
.items-table input{border:1.5px solid #e2e8f0;border-radius:8px;padding:7px 8px;font-size:13px;width:100%;background:#f8fafc;outline:none;}
.items-table input:focus{border-color:#4f46e5;background:#fff;}
.btn-add-item{background:#eef2ff;color:#4f46e5;border:none;border-radius:10px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;}
.btn-add-item:hover{background:#4f46e5;color:#fff;}
.btn-remove{background:none;border:none;color:#f87171;font-size:16px;cursor:pointer;padding:4px;border-radius:6px;}
.btn-remove:hover{background:#fef2f2;}
.totals-box{background:#f8fafc;border-radius:12px;padding:16px;border:1px solid #f1f5f9;}
.total-row{display:flex;justify-content:space-between;font-size:13px;color:#64748b;font-weight:600;padding:4px 0;}
.total-row.grand{font-size:16px;color:#0f172a;font-weight:900;border-top:2px solid #e2e8f0;padding-top:10px;margin-top:6px;}
.btn-preview{width:100%;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;border-radius:14px;padding:16px;font-size:16px;font-weight:800;cursor:pointer;transition:all .2s;margin-top:8px;box-shadow:0 8px 24px rgba(79,70,229,.3);}
.btn-preview:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(79,70,229,.4);}
.preview-title{font-size:13px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;}
.receipt-wrapper{background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.08);overflow:hidden;}
/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:1000;display:none;align-items:center;justify-content:center;padding:20px;}
.modal-overlay.open{display:flex;}
.modal-box{background:#fff;border-radius:20px;width:100%;max-width:560px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;}
.modal-header{padding:20px 24px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;}
.modal-header h2{font-size:18px;font-weight:800;color:#0f172a;}
.modal-close{background:none;border:none;font-size:24px;color:#94a3b8;cursor:pointer;}
.modal-body{padding:24px;overflow-y:auto;flex:1;}
.modal-actions{padding:20px 24px;border-top:1px solid #f1f5f9;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.action-btn{border:none;border-radius:12px;padding:13px;font-size:13px;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;transition:all .2s;}
.action-btn .icon{font-size:22px;}
.action-btn.pdf{background:#eef2ff;color:#4f46e5;}
.action-btn.pdf:hover{background:#4f46e5;color:#fff;}
.action-btn.share{background:#f0fdf4;color:#16a34a;}
.action-btn.share:hover{background:#16a34a;color:#fff;}
.action-btn.save{background:#fffbeb;color:#d97706;}
.action-btn.save:hover{background:#d97706;color:#fff;}
/* Template badge */
.tpl-badge{display:inline-flex;align-items:center;gap:6px;background:#eef2ff;border:1.5px solid #c7d2fe;color:#4f46e5;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:700;margin-bottom:20px;}
.tpl-badge a{color:#94a3b8;text-decoration:none;margin-left:4px;font-size:14px;}
/* RECEIPT STYLES */
.receipt-thermal{font-family:'Courier New',monospace;font-size:12px;padding:24px 20px;color:#111;background:#fff;line-height:1.7;}
.receipt-thermal .r-header{text-align:center;margin-bottom:12px;}
.receipt-thermal .r-biz{font-weight:900;font-size:16px;}
.receipt-thermal .r-sub{font-size:10px;color:#555;}
.receipt-thermal .r-divider{border:none;border-top:1px dashed #999;margin:10px 0;}
.receipt-thermal .r-row{display:flex;justify-content:space-between;}
.receipt-thermal .r-total{display:flex;justify-content:space-between;font-weight:900;font-size:15px;border-top:2px solid #111;padding-top:8px;margin-top:6px;}
.receipt-thermal .r-footer{text-align:center;margin-top:12px;font-size:10px;color:#888;}
.receipt-modern{padding:28px;background:#fff;}
.receipt-modern .rm-top{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:20px;border-radius:12px;margin-bottom:20px;}
.receipt-modern .rm-biz{font-size:20px;font-weight:900;}
.receipt-modern .rm-sub{font-size:12px;opacity:.8;margin-top:2px;}
.receipt-modern .rm-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:14px;}
.receipt-modern .rm-total{display:flex;justify-content:space-between;font-weight:900;font-size:18px;color:#4f46e5;padding-top:12px;margin-top:8px;}
.receipt-elegant{padding:28px;background:#fffbf5;border-left:4px solid #b45309;}
.receipt-elegant .re-top{border-bottom:2px solid #b45309;padding-bottom:14px;margin-bottom:14px;}
.receipt-elegant .re-biz{font-size:22px;font-weight:900;color:#92400e;font-family:Georgia,serif;}
.receipt-elegant .re-sub{font-size:12px;color:#a16207;margin-top:3px;}
.receipt-elegant .re-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #fed7aa;font-size:14px;color:#78350f;}
.receipt-elegant .re-total{display:flex;justify-content:space-between;font-weight:900;font-size:18px;color:#92400e;border-top:2px solid #b45309;padding-top:10px;margin-top:10px;}
.receipt-dark{padding:28px;background:#0f172a;color:#fff;}
.receipt-dark .rd-top{border-bottom:1px solid #334155;padding-bottom:14px;margin-bottom:14px;}
.receipt-dark .rd-biz{font-size:20px;font-weight:900;color:#e2e8f0;}
.receipt-dark .rd-sub{font-size:12px;color:#64748b;margin-top:3px;}
.receipt-dark .rd-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1e293b;font-size:14px;color:#94a3b8;}
.receipt-dark .rd-total{display:flex;justify-content:space-between;font-weight:900;font-size:18px;color:#818cf8;border-top:1px solid #334155;padding-top:10px;margin-top:10px;}
.logo-preview{max-width:80px;max-height:60px;object-fit:contain;margin-bottom:8px;}
@media(max-width:768px){.main-layout{grid-template-columns:1fr;}.preview-panel{display:none;}.form-panel{max-height:none;padding:20px 16px;}}
`;

fs.writeFileSync('receipt-maker/receipt-maker.css', css);
console.log('CSS written');
