from pypdf import PdfReader
p='d:/Refuelkopya/assets/fuel-slip-blank-u.pdf'
try:
    r=PdfReader(p)
    f=r.get_fields() or {}
    if not f:
        print('NO_FIELDS')
    else:
        for k in f.keys():
            print(k)
except Exception as e:
    print('ERROR',e)

# Archived: original script moved to archive/list_fields.py
# To restore, see archive/list_fields.py

