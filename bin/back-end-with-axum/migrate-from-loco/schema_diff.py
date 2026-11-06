#!/usr/bin/env python3
import subprocess,sys,glob,os,re,concurrent.futures as cf
SP=sys.argv[1]; ROOT=sys.argv[2]
PG=os.path.expanduser('~/.local/share/mise/installs/postgres/18/bin')
A=['-h','127.0.0.1','-p','55432','-U','postgres']
def run(c,**k): return subprocess.run(c,capture_output=True,text=True,**k)
def dump(db):
    o=run([f'{PG}/pg_dump',*A,'--schema-only','--no-owner','--no-privileges','-T','seaql_migrations','-d',db]).stdout
    o=re.sub(r'^(--.*|SET .*|SELECT pg_catalog.*|\\(un)?restrict .*)$','',o,flags=re.M)
    return re.sub(r'\n+','\n',o).strip()
def one(i_f):
    i,f=i_f
    a,b=f'a{i}',f'b{i}'
    for d in (a,b):
        run([f'{PG}/dropdb',*A,'--if-exists',d]); run([f'{PG}/createdb',*A,d])
    r=run([SP+'/target-h/debug/harness',f,f'postgres://loco:loco@127.0.0.1:55432/{a}'])
    if r.returncode: return f,'BASELINE '+r.stderr[-200:]
    ups=sorted(glob.glob(f'{ROOT}/{f}/*/migrations/*.up.sql'))
    if not ups: return f,'NOSQL'
    for u in ups:
        r=run([f'{PG}/psql',*A,'-d',b,'-v','ON_ERROR_STOP=1','-q','-f',u])
        if r.returncode: return f,'UP '+os.path.basename(u)+' '+r.stderr[-300:]
    da,db=dump(a),dump(b)
    res='same'
    if da!=db:
        al=set(da.splitlines()); bl=set(db.splitlines())
        res='DIFF '+str(sorted(al-bl)[:5])+' || '+str(sorted(bl-al)[:5])
    else:
        for u in sorted(glob.glob(f'{ROOT}/{f}/*/migrations/*.down.sql'),reverse=True):
            r=run([f'{PG}/psql',*A,'-d',b,'-v','ON_ERROR_STOP=1','-q','-f',u])
            if r.returncode: res='DOWN '+os.path.basename(u)+' '+r.stderr[-300:]; break
        else:
            t=run([f'{PG}/psql',*A,'-d',b,'-Atc',"select count(*) from pg_tables where schemaname='public'"]).stdout.strip()
            if t!='0': res='DOWN-LEFT '+t
    for d in (a,b): run([f'{PG}/dropdb',*A,d])
    return f,res
forms=sorted(os.path.basename(p) for p in glob.glob(SP+'/harness/m/*'))
with cf.ThreadPoolExecutor(10) as ex: rs=list(ex.map(one,enumerate(forms)))
bad=[r for r in rs if r[1]!='same']
print(len(rs),'forms;',len(rs)-len(bad),'identical;',len(bad),'different')
for f,r in bad[:40]: print(f,r[:420])
