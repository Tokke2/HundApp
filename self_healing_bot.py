#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
🐾 HundApp - Self-Healing Bot Engine (self_healing_bot.py)
===============================================================================
Automated diagnostic, linting, and self-repair robot for GitHub CI/CD workflows.
Detects broken links, missing PWA tags, missing icons, or unlinked files, and
repairs them automatically.
"""

import os
import sys
import re
import json
from pathlib import Path

class BotColor:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    GREEN = "\033[32m"
    CYAN = "\033[36m"
    YELLOW = "\033[33m"
    RED = "\033[31m"
    PURPLE = "\033[35m"

def print_banner():
    print(f"{BotColor.BOLD}{BotColor.PURPLE}")
    print("┌─────────────────────────────────────────────────────────────┐")
    print("│   🤖  HundApp Self-Healing GitHub Robot v1.0.0              │")
    print("│   Auto-Diagnostic, Self-Repair & Repository Guardian        │")
    print("└─────────────────────────────────────────────────────────────┘")
    print(f"{BotColor.RESET}")

def heal_pwa_icons():
    """Generates any missing PWA icons automatically using Pillow."""
    os.makedirs('icons', exist_ok=True)
    required_icons = {
        'icons/icon-512.png': (512, False),
        'icons/icon-maskable-512.png': (512, True),
        'icons/icon-192.png': (192, False),
        'icons/apple-touch-icon.png': (180, False),
        'icons/favicon-32.png': (32, False),
    }

    healed_count = 0
    try:
        from PIL import Image, ImageDraw

        for path, (size, maskable) in required_icons.items():
            if not os.path.exists(path):
                print(f"  {BotColor.YELLOW}⚡ [Heal] Missing icon detected: {path}. Auto-generating...{BotColor.RESET}")
                img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
                draw = ImageDraw.Draw(img)
                
                margin = int(size * 0.1) if maskable else int(size * 0.04)
                r = int(size * 0.22) if maskable else int(size * 0.28)
                bg_color = (45, 106, 79, 255) # Pine green
                accent_color = (244, 211, 94, 255) # Gold
                white = (255, 255, 255, 255)
                
                if maskable:
                    draw.rectangle([0, 0, size, size], fill=bg_color)
                else:
                    draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=r, fill=bg_color)
                
                # Draw stylized dog paw
                cx, cy = size / 2, size / 2 + size * 0.06
                pad_w, pad_h = size * 0.22, size * 0.18
                draw.ellipse([cx - pad_w, cy - pad_h, cx + pad_w, cy + pad_h], fill=white)
                
                toes = [
                    (-size * 0.20, -size * 0.14, size * 0.08, size * 0.11),
                    (-size * 0.07, -size * 0.24, size * 0.08, size * 0.12),
                    ( size * 0.07, -size * 0.24, size * 0.08, size * 0.12),
                    ( size * 0.20, -size * 0.14, size * 0.08, size * 0.11),
                ]
                for tx, ty, tw, th in toes:
                    draw.ellipse([cx + tx - tw, cy + ty - th, cx + tx + tw, cy + ty + th], fill=white)
                    
                star_x, star_y = cx, cy + size * 0.22
                draw.ellipse([star_x - size*0.04, star_y - size*0.04, star_x + size*0.04, star_y + size*0.04], fill=accent_color)
                
                img.save(path, 'PNG')
                healed_count += 1
                print(f"  {BotColor.GREEN}✓ [Healed] Successfully created {path}{BotColor.RESET}")
    except ImportError:
        print(f"  {BotColor.YELLOW}⚠ Pillow not installed, skipping icon auto-generation.{BotColor.RESET}")

    return healed_count

def heal_html_views():
    """Validates and heals all HTML files (PWA meta tags, viewport, styles/app links)."""
    import glob
    html_files = sorted(glob.glob('*.html'))
    healed_files = 0

    pwa_tags = """  <!-- PWA & Mobile Web App Meta -->
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#2D6A4F">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="HundApp">
  <link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">"""

    for path in html_files:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False

        # 1. Check viewport
        if '<meta name="viewport"' not in content and '<head>' in content:
            content = content.replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1">', 1)
            modified = True
            print(f"  {BotColor.YELLOW}⚡ [Heal] Added missing viewport meta to {path}{BotColor.RESET}")

        # 2. Check PWA manifest
        if 'manifest.json' not in content and '</head>' in content:
            content = content.replace('</head>', pwa_tags + '\n</head>', 1)
            modified = True
            print(f"  {BotColor.YELLOW}⚡ [Heal] Injected missing PWA meta tags into {path}{BotColor.RESET}")

        # 3. Check stylesheet
        if 'styles.css' not in content and '</head>' in content:
            content = content.replace('</head>', '  <link rel="stylesheet" href="styles.css">\n</head>', 1)
            modified = True
            print(f"  {BotColor.YELLOW}⚡ [Heal] Linked missing styles.css in {path}{BotColor.RESET}")

        # 4. Check app.js (except standalone preview if any)
        if 'app.js' not in content and '</body>' in content:
            content = content.replace('</body>', '  <script src="app.js"></script>\n</body>', 1)
            modified = True
            print(f"  {BotColor.YELLOW}⚡ [Heal] Linked missing app.js in {path}{BotColor.RESET}")

        if modified:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            healed_files += 1

    return healed_files

def heal_manifest():
    """Validates manifest.json and manifest.webmanifest."""
    manifest_path = "manifest.json"
    webmanifest_path = "manifest.webmanifest"
    healed = 0

    if not os.path.exists(manifest_path):
        default_manifest = {
            "name": "HundApp – Hundens Vardagsguide & Hälsoplattform",
            "short_name": "HundApp",
            "description": "Sveriges modernaste plattform för hundhälsa, promenader och rutiner. 100% offline.",
            "id": "/?source=pwa",
            "start_url": "portal.html",
            "scope": "./",
            "display": "standalone",
            "orientation": "portrait-primary",
            "background_color": "#FAF7F2",
            "theme_color": "#2D6A4F",
            "lang": "sv"
        }
        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(default_manifest, f, indent=2, ensure_ascii=False)
        print(f"  {BotColor.GREEN}✓ [Healed] Created missing {manifest_path}{BotColor.RESET}")
        healed += 1

    if not os.path.exists(webmanifest_path) and os.path.exists(manifest_path):
        with open(manifest_path, 'r', encoding='utf-8') as f:
            content = f.read()
        with open(webmanifest_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  {BotColor.GREEN}✓ [Healed] Created missing {webmanifest_path}{BotColor.RESET}")
        healed += 1

    return healed

def main():
    print_banner()
    print(f"{BotColor.BOLD}{BotColor.CYAN}▶ 1. Inspecting & Auto-Healing PWA Icons...{BotColor.RESET}")
    healed_icons = heal_pwa_icons()
    
    print(f"{BotColor.BOLD}{BotColor.CYAN}▶ 2. Inspecting & Auto-Healing Web Manifests...{BotColor.RESET}")
    healed_manifests = heal_manifest()
    
    print(f"{BotColor.BOLD}{BotColor.CYAN}▶ 3. Inspecting & Auto-Healing HTML Views & Linkings...{BotColor.RESET}")
    healed_views = heal_html_views()

    total_heals = healed_icons + healed_manifests + healed_views

    print(f"\n{BotColor.BOLD}{BotColor.PURPLE}═══════════════════════════════════════════════════════════════{BotColor.RESET}")
    if total_heals > 0:
        print(f"{BotColor.BOLD}{BotColor.GREEN}  🎉 BOT STATUS: Self-healing complete! Repaired {total_heals} issues.{BotColor.RESET}")
    else:
        print(f"{BotColor.BOLD}{BotColor.GREEN}  ✨ BOT STATUS: Perfectly healthy! 0 repairs needed.{BotColor.RESET}")
    print(f"{BotColor.BOLD}{BotColor.PURPLE}═══════════════════════════════════════════════════════════════{BotColor.RESET}\n")

    return 0

if __name__ == '__main__':
    sys.exit(main())
