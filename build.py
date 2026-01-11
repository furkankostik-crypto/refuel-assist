#!/usr/bin/env python3
import os
import shutil
import re

ROOT = os.path.dirname(__file__)
DIST = os.path.join(ROOT, 'dist')

HTML_EXTS = ('.html',)

def minify_html(text: str) -> str:
    # remove HTML comments
    text = re.sub(r'<!--([\s\S]*?)-->', '', text)
    # collapse multiple whitespace
    text = re.sub(r'\s{2,}', ' ', text)
    # remove spaces between tags
    text = re.sub(r'>\s+<', '><', text)
    return text.strip()

def copy_file(src, dst, minify=False):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if minify and src.lower().endswith(HTML_EXTS):
        with open(src, 'r', encoding='utf-8') as f:
            txt = f.read()
        txt = minify_html(txt)
        with open(dst, 'w', encoding='utf-8') as f:
            f.write(txt)
    else:
        shutil.copy2(src, dst)

def build():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST, exist_ok=True)

    # copy root files
    for name in os.listdir(ROOT):
        src = os.path.join(ROOT, name)
        if os.path.isdir(src):
            if name == 'assets':
                shutil.copytree(src, os.path.join(DIST, name))
        else:
            if name.startswith('.') or name == os.path.basename(__file__):
                continue
            if name.lower().endswith(HTML_EXTS):
                copy_file(src, os.path.join(DIST, name), minify=True)
            else:
                copy_file(src, os.path.join(DIST, name))

    print('Build tamamlandı. Çıktı:', DIST)

if __name__ == '__main__':
    build()
