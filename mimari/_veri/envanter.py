"""DocType envanteri ve bağımlılık grafiği üretir. Repo yalnız okunur."""
import json, os, re, sys, collections
ROOT = sys.argv[1]; OUT = sys.argv[2]
PKG = os.path.join(ROOT, "tradehub_core")
docs = {}
for dp, dn, fn in os.walk(PKG):
    if "/worktrees" in dp or "/node_modules" in dp: continue
    if os.path.basename(os.path.dirname(dp)) != "doctype": continue
    base = os.path.basename(dp); j = os.path.join(dp, base + ".json")
    if not os.path.exists(j): continue
    try: d = json.load(open(j, encoding="utf-8"))
    except Exception: continue
    if d.get("doctype") != "DocType": continue
    py = os.path.join(dp, base + ".py")
    lines = sum(1 for _ in open(py, encoding="utf-8")) if os.path.exists(py) else 0
    links = collections.Counter(); tables = []
    for f in d.get("fields", []):
        if f.get("fieldtype") == "Link" and f.get("options"): links[f["options"]] += 1
        if f.get("fieldtype") in ("Table", "Table MultiSelect") and f.get("options"): tables.append(f["options"])
    docs[d["name"]] = dict(name=d["name"], folder=os.path.relpath(dp, ROOT), module=d.get("module"),
        istable=d.get("istable", 0), issingle=d.get("issingle", 0), is_submittable=d.get("is_submittable", 0),
        fields=len(d.get("fields", [])), controller_lines=lines, links=dict(links), tables=tables,
        roles=sorted({p.get("role") for p in d.get("permissions", []) if p.get("role")}))
# who references each doctype name (python files outside its folder)
pyfiles = []
for dp, dn, fn in os.walk(PKG):
    if "/worktrees" in dp or "/tests" in dp or "/node_modules" in dp: continue
    pyfiles += [os.path.join(dp, f) for f in fn if f.endswith(".py") and not f.startswith("test_")]
src = {p: open(p, encoding="utf-8", errors="ignore").read() for p in pyfiles}
for name, d in docs.items():
    pat = re.compile(r'["\']' + re.escape(name) + r'["\']')
    refs = collections.Counter()
    for p, s in src.items():
        if p.startswith(os.path.join(ROOT, d["folder"])): continue
        c = len(pat.findall(s))
        if c: refs[os.path.relpath(p, ROOT)] = c
    d["referenced_in"] = dict(refs.most_common()); d["ref_files"] = len(refs)
hooks = src.get(os.path.join(PKG, "hooks.py"), "")
for name, d in docs.items():
    d["in_hooks"] = len(re.findall(r'["\']' + re.escape(name) + r'["\']', hooks))
json.dump(docs, open(os.path.join(OUT, "envanter.json"), "w"), ensure_ascii=False, indent=1)
print(len(docs), "doctype")
