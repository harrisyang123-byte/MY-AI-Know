# AI-Atom

Personal modular AI workflow system with agents, skills, and knowledge management.

## 📁 Project Structure

```
AI-Atom/
├── .claude/                    # Trae AI configuration
│   ├── commands/              # Custom commands
│   └── skills/                # Trae skills
├── .kiro/                     # Kiro AI configuration
│   ├── hooks/                 # Automation triggers
│   ├── skills/                # Kiro skills
│   └── steering/              # AI behavior rules
├── .obsidian/                 # Obsidian vault config
├── .vscode/                   # VS Code settings
├── knowledge-atom/            # Obsidian plugin (Knowledge Gravity Model)
│   ├── plugin/                # Plugin source code
│   └── openspec/              # Design documents
└── knowledge-vault/           # Obsidian vault with sample notes
```

## 🚀 Quick Start

### Knowledge Atom Plugin

```bash
cd knowledge-atom/plugin
npm install
npm run build
```

Then copy `main.js` and `styles.css` to your Obsidian plugins folder.

### AI Tools Setup

The `.claude/` and `.kiro/` directories contain AI agent and skill configurations for Trae and Kiro IDEs.

## 📄 License

MIT License - see individual directories for details.
