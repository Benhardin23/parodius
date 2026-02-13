# PARODIUS

A Gradius-style horizontal scrolling shooter built in Phaser 3.
Seven stages, four ship loadouts, full power-up bar, multi-phase bosses, NG+ loops, and everything (graphics + audio) generated at runtime.

**Play now: https://benhardin23.github.io/parodius/**

## What's in the game

- **7 stages**: Liquid Metal, Magma, Cell, Crystal, Factory, Void, Fortress
- **4 selectable ship types** with different weapon configs
- **Gradius-style power-up bar**: Speed Up, Missile, Double, Laser, Option, Shield
- **3-phase boss fights** with barrier systems
- **28 enemy types** with unique movement patterns
- **New Game+ loop** with difficulty scaling

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move |
| Z | Shoot |
| X | Activate Power-Up |
| C | Missile |
| ESC / P | Pause |

## How to play locally

No build step required.

```bash
python -m http.server
```

Then open `http://localhost:8000` in your browser.

## Tech stack

- **Phaser 3** (CDN)
- Custom WebGL bloom shader
- Web Audio API for fully procedural audio
- Procedural graphics (no sprite sheets, no image assets)
- Zero dependencies beyond Phaser 3

## Credits

Built by Ben Hardin.
Inspired by classic horizontal shooters, especially the Gradius/Parodius lineage.
