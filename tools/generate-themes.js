// Generate the four Miami '26 color themes and the neon glow table.
//
//   node tools/generate-themes.js
//
// Two palettes, each in a dark and a light version, the same as the Visual Studio themes
// (github.com/stillgbx/miami26-vs):
// * Bay: a day on the bay. Turquoise water, sky blue, lavender towers, pink facades, warm sand.
// * Sunset: dusk on the ocean front. Magenta, sunset orange, gold, periwinkle buildings, violet sky.
//
// Each palette gives 'ui' colors (workbench), 'tokens' (syntax) and, for the dark ones, 'glow':
// the neon text-shadow drawn around a token color when the neon is enabled. Outputs:
// * themes/*.json: the color themes.
// * src/neon/themes.json: per theme, the glow by token color and the editor chrome styles,
//   read by the neon script (src/neon/template.js).
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Neon layers ('neon') take their opacity from the miami26.brightness setting; the other layers
// keep theirs. Each layer is a CSS "0 0 {blur}px {color}".
const dark = (blur, color) => ({ blur, color });
const neon = (blur, color) => ({ blur, color, neon: true });
const fixed = (blur, alpha, color) => ({ blur, color: color + alpha });

const BAY = {
  id: 'miami26-bay',
  label: "Miami '26 Bay",
  type: 'dark',
  ui: {
    frame: '07131D', sidebar: '10222F', editor: '0C1B26', raised: '163040', border: '1C3A4D',
    text: 'E8F4F6', muted: '8FB0C2', faint: '4E7186',
    accent: '2ED3C6', accentStrong: '17A398', onAccent: 'FFFFFF',
    status: '13897F', statusText: 'FFFFFF',
    selection: '1E4A5C', inactiveSelection: '17323F', highlight: '2E3A66', currentLine: '163040',
    warm: 'FF9E7A', secondary: 'B9A6FF', error: 'FF6B8B', warning: 'FFC98F', success: '7EDC9E',
    gradient: ['2ED3C6', 'B9A6FF'],
  },
  tokens: {
    keyword: '2ED3C6', type: 'B9A6FF', function: '7CC4FF', tag: '7EDC9E', variable: 'DCEBF5',
    operator: '8FE9E1', attribute: '8CCBFF', string: 'FFC98F', constant: 'FF9CC2',
    comment: '557489', escape: 'FF8FB8',
  },
  glow: {
    keyword: [dark(2, '041210'), neon(4, '00E5D4'), neon(10, '00E5D4')],
    type: [dark(2, '0E0A1F'), neon(4, '8C6CFF'), neon(10, '8C6CFF')],
    function: [dark(2, '04101F'), neon(3, '2E9BFF'), neon(8, '2E9BFF')],
    tag: [dark(2, '0C100C'), neon(8, '2FB86A'), neon(24, '1E3A2A')],
    variable: [dark(2, '0C1B26'), fixed(5, '33', '7CC4FF'), fixed(10, '22', 'FFFFFF')],
  },
};

const BAY_LIGHT = {
  id: 'miami26-bay-light',
  label: "Miami '26 Bay Light",
  type: 'light',
  ui: {
    frame: 'BBDBE9', sidebar: 'D8ECF0', editor: 'E3F2F2', raised: 'EBF6F6', border: 'A2CADB',
    text: '17323F', muted: '45697A', faint: '6E95A3',
    accent: '0B7F75', accentStrong: '0B7F75', onAccent: 'FFFFFF',
    status: '0B7F75', statusText: 'FFFFFF',
    selection: 'B2E0DA', inactiveSelection: 'CFE7E8', highlight: 'D6CDF0', currentLine: 'C9E4E6',
    warm: 'F08A5D', secondary: '5E45C4', error: 'C62D58', warning: 'A3561A', success: '2A7F47',
    gradient: ['0B7F75', '5E45C4'],
  },
  tokens: {
    keyword: '0A7A70', type: '5E45C4', function: '1C65AD', tag: '2A7F47', variable: '22394D',
    operator: '2F7F79', attribute: '1C65AD', string: 'A3561A', constant: 'BF2F68',
    comment: '5F7F8C', escape: 'BF2F68',
  },
};

const SUNSET = {
  id: 'miami26-sunset',
  label: "Miami '26 Sunset",
  type: 'dark',
  ui: {
    frame: '0D0A1C', sidebar: '1B1634', editor: '15112A', raised: '241D42', border: '2E2652',
    text: 'F6EEF6', muted: 'A99FC8', faint: '62598F',
    accent: 'FF4FA3', accentStrong: 'D93A86', onAccent: 'FFFFFF',
    status: 'D6337F', statusText: 'FFFFFF',
    selection: '4A2A6A', inactiveSelection: '2E2850', highlight: '3A3270', currentLine: '241D42',
    warm: 'FF7A5C', secondary: 'A9B4F5', error: 'FF5C6C', warning: 'FFD27F', success: '7EE0A8',
    gradient: ['FF4FA3', 'FFA45C'],
  },
  tokens: {
    keyword: 'FF4FA3', type: 'A9B4F5', function: 'FFA45C', tag: 'D39BFF', variable: 'F3DDF0',
    operator: 'FF8FC4', attribute: 'FFB070', string: 'FFD27F', constant: 'FF7A6B',
    comment: '7C6FA3', escape: '8E9BFF',
  },
  glow: {
    keyword: [dark(2, '2A0A1A'), neon(4, 'FF2E93'), neon(10, 'FF2E93')],
    type: [dark(2, '0A0C24'), neon(4, '6F7BFF'), neon(10, '6F7BFF')],
    function: [dark(2, '1A0E00'), neon(3, 'FF7A1F'), neon(8, 'FF7A1F')],
    tag: [dark(2, '120A1C'), neon(8, 'A44CFF'), neon(24, '2A1A3A')],
    variable: [dark(2, '15112A'), fixed(5, '33', 'FF4FA3'), fixed(10, '22', 'FFFFFF')],
  },
};

const SUNSET_LIGHT = {
  id: 'miami26-sunset-light',
  label: "Miami '26 Sunset Light",
  type: 'light',
  ui: {
    frame: 'E3C5DE', sidebar: 'F4DEE4', editor: 'FBECE4', raised: 'FCF3EE', border: 'D3AFD0',
    text: '2E1A3D', muted: '74566F', faint: '9C7C96',
    accent: 'C2186A', accentStrong: 'C2186A', onAccent: 'FFFFFF',
    status: 'C2186A', statusText: 'FFFFFF',
    selection: 'F2C3D6', inactiveSelection: 'EED9E3', highlight: 'DDD7F5', currentLine: 'EFD6D8',
    warm: 'F2994A', secondary: '434BB5', error: 'C9392A', warning: '845A00', success: '2E7D4A',
    gradient: ['C2186A', 'B5561A'],
  },
  tokens: {
    keyword: 'BD1766', type: '434BB5', function: 'B5561A', tag: '7235AD', variable: '35203F',
    operator: 'A62A66', attribute: 'A94E17', string: '845A00', constant: 'C9392A',
    comment: '87718F', escape: '434BB5',
  },
};

const THEMES = [BAY, BAY_LIGHT, SUNSET, SUNSET_LIGHT];

// TextMate scopes of each token role. Later rules win over earlier ones for the same scope depth.
const SCOPES = [
  ['comment', ['comment', 'punctuation.definition.comment', 'string.quoted.docstring'], 'italic'],
  ['string', ['string', 'punctuation.definition.string', 'string.template', 'markup.inline.raw']],
  ['escape', ['constant.character.escape', 'string.regexp', 'punctuation.definition.tag',
    'punctuation.definition.template-expression', 'punctuation.section.embedded']],
  ['constant', ['constant', 'constant.numeric', 'constant.language', 'constant.other', 'support.constant',
    'variable.other.enummember', 'keyword.other.unit', 'constant.other.color']],
  ['variable', ['variable', 'variable.other', 'variable.parameter', 'entity.name.variable', 'support.variable',
    'meta.object-literal.key', 'variable.other.property', 'variable.other.object.property']],
  ['keyword', ['keyword', 'keyword.control', 'storage', 'storage.type', 'storage.modifier', 'variable.language',
    'keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.logical.python', 'markup.heading']],
  ['operator', ['keyword.operator', 'punctuation.separator.key-value', 'punctuation.accessor.optional']],
  ['type', ['entity.name.type', 'entity.name.class', 'entity.other.inherited-class', 'support.class', 'support.type',
    'entity.name.namespace', 'entity.name.type.namespace', 'storage.type.java', 'storage.type.generic']],
  ['function', ['entity.name.function', 'support.function', 'variable.function', 'meta.function-call.generic',
    'markup.underline.link', 'string.other.link']],
  ['attribute', ['entity.other.attribute-name', 'meta.attribute']],
  ['tag', ['entity.name.tag', 'meta.preprocessor', 'keyword.control.directive', 'entity.name.function.preprocessor',
    'support.type.property-name', 'entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css',
    'entity.other.attribute-name.pseudo-class', 'entity.other.attribute-name.pseudo-element']],
];

const SEMANTIC = {
  namespace: 'type', class: 'type', interface: 'type', enum: 'type', struct: 'type', type: 'type',
  typeParameter: 'type', function: 'function', method: 'function', macro: 'tag', variable: 'variable',
  parameter: 'variable', property: 'variable', event: 'variable', enumMember: 'constant', keyword: 'keyword',
  comment: 'comment', string: 'string', number: 'constant', regexp: 'escape', operator: 'operator',
  label: 'tag', decorator: 'attribute',
};

const hex = (color, alpha = '') => `#${color}${alpha}`.toLowerCase();

function workbench(t) {
  const u = t.ui;
  const k = t.tokens;
  const c = (color, alpha) => hex(color, alpha);
  const isDark = t.type === 'dark';
  return {
    // Base
    'focusBorder': c(u.accent, '99'),
    'foreground': c(u.text),
    'descriptionForeground': c(u.muted),
    'errorForeground': c(u.error),
    'icon.foreground': c(u.muted),
    'selection.background': c(u.selection),
    'widget.shadow': isDark ? '#00000080' : c(u.text, '30'),
    'textLink.foreground': c(u.accent),
    'textLink.activeForeground': c(k.function),
    'textPreformat.foreground': c(k.string),
    'textBlockQuote.background': c(u.sidebar),
    'textBlockQuote.border': c(u.accent),
    'textCodeBlock.background': c(u.raised),
    'sash.hoverBorder': c(u.accent),

    // Buttons, inputs, dropdowns
    'button.background': c(u.accentStrong),
    'button.foreground': c(u.onAccent),
    'button.hoverBackground': c(u.accent),
    'button.secondaryBackground': c(u.raised),
    'button.secondaryForeground': c(u.text),
    'checkbox.background': c(u.raised),
    'checkbox.border': c(u.border),
    'dropdown.background': c(u.raised),
    'dropdown.border': c(u.border),
    'dropdown.foreground': c(u.text),
    'input.background': c(u.raised),
    'input.border': c(u.border),
    'input.foreground': c(u.text),
    'input.placeholderForeground': c(u.faint),
    'inputOption.activeBorder': c(u.accent),
    'inputOption.activeBackground': c(u.accent, '33'),
    'inputValidation.errorBackground': c(u.editor),
    'inputValidation.errorBorder': c(u.error),
    'inputValidation.warningBackground': c(u.editor),
    'inputValidation.warningBorder': c(u.warning),
    'inputValidation.infoBackground': c(u.editor),
    'inputValidation.infoBorder': c(u.accent),
    'badge.background': c(u.accentStrong),
    'badge.foreground': c(u.onAccent),
    'progressBar.background': c(u.accent),
    'scrollbar.shadow': isDark ? '#00000066' : c(u.text, '22'),
    'scrollbarSlider.background': c(u.faint, '55'),
    'scrollbarSlider.hoverBackground': c(u.faint, '88'),
    'scrollbarSlider.activeBackground': c(u.accent, '88'),

    // Lists and trees
    'list.activeSelectionBackground': c(u.selection),
    'list.activeSelectionForeground': c(u.text),
    'list.inactiveSelectionBackground': c(u.inactiveSelection),
    'list.inactiveSelectionForeground': c(u.text),
    'list.hoverBackground': c(u.raised, '99'),
    'list.hoverForeground': c(u.text),
    'list.focusOutline': c(u.accent, '99'),
    'list.highlightForeground': c(u.accent),
    'list.dropBackground': c(u.accent, '33'),
    'list.errorForeground': c(u.error),
    'list.warningForeground': c(u.warning),
    'tree.indentGuidesStroke': c(u.faint, '88'),

    // Activity bar, side bar, panels
    'activityBar.background': c(u.frame),
    'activityBar.foreground': c(u.text),
    'activityBar.inactiveForeground': c(u.muted, 'aa'),
    'activityBar.activeBorder': c(u.accent),
    'activityBar.border': c(u.frame),
    'activityBarBadge.background': c(u.accentStrong),
    'activityBarBadge.foreground': c(u.onAccent),
    'sideBar.background': c(u.sidebar),
    'sideBar.foreground': c(u.text),
    'sideBar.border': c(u.sidebar),
    'sideBarTitle.foreground': c(u.muted),
    'sideBarSectionHeader.background': c(u.sidebar),
    'sideBarSectionHeader.foreground': c(u.text),
    'sideBarSectionHeader.border': c(u.border, '66'),
    'panel.background': c(u.editor),
    'panel.border': c(u.border),
    'panelTitle.activeBorder': c(u.accent),
    'panelTitle.activeForeground': c(u.text),
    'panelTitle.inactiveForeground': c(u.muted),
    'titleBar.activeBackground': c(u.frame),
    'titleBar.activeForeground': c(u.text),
    'titleBar.inactiveBackground': c(u.frame),
    'titleBar.inactiveForeground': c(u.muted),
    'titleBar.border': c(u.frame),
    'menu.background': c(u.raised),
    'menu.foreground': c(u.text),
    'menu.selectionBackground': c(u.selection),
    'menu.selectionForeground': c(u.text),
    'menu.separatorBackground': c(u.border),
    'menubar.selectionBackground': c(u.raised),
    'commandCenter.background': c(u.sidebar),
    'commandCenter.border': c(u.border),
    'commandCenter.foreground': c(u.text),
    'commandCenter.activeBackground': c(u.raised),
    'quickInput.background': c(u.sidebar),
    'quickInput.foreground': c(u.text),
    'quickInputList.focusBackground': c(u.selection),
    'pickerGroup.foreground': c(u.accent),
    'pickerGroup.border': c(u.border),

    // Status bar
    'statusBar.background': c(u.status),
    'statusBar.foreground': c(u.statusText),
    'statusBar.border': c(u.status),
    'statusBar.noFolderBackground': c(u.secondary),
    'statusBar.noFolderForeground': isDark ? c(u.frame) : c(u.onAccent),
    'statusBar.debuggingBackground': c(u.warm),
    'statusBar.debuggingForeground': c(u.frame),
    'statusBarItem.remoteBackground': c(u.accentStrong),
    'statusBarItem.remoteForeground': c(u.onAccent),
    'statusBarItem.hoverBackground': '#ffffff22',
    'statusBarItem.prominentBackground': '#00000033',

    // Tabs and editor groups
    'editorGroup.border': c(u.border),
    'editorGroup.dropBackground': c(u.accent, '22'),
    'editorGroupHeader.tabsBackground': c(u.frame),
    'editorGroupHeader.noTabsBackground': c(u.editor),
    'tab.activeBackground': c(u.editor),
    'tab.activeForeground': c(u.text),
    'tab.activeBorderTop': c(u.accent),
    'tab.inactiveBackground': c(u.frame),
    'tab.inactiveForeground': c(u.muted),
    'tab.hoverBackground': c(u.sidebar),
    'tab.border': c(u.frame),
    'tab.unfocusedActiveBorderTop': c(u.faint),
    'tab.unfocusedActiveForeground': c(u.muted),
    'breadcrumb.foreground': c(u.muted),
    'breadcrumb.focusForeground': c(u.text),
    'breadcrumb.activeSelectionForeground': c(u.accent),
    'breadcrumbPicker.background': c(u.raised),

    // Editor
    'editor.background': c(u.editor),
    'editor.foreground': c(u.text),
    'editorCursor.foreground': c(u.accent),
    'editorLineNumber.foreground': c(u.faint),
    'editorLineNumber.activeForeground': c(u.text),
    'editor.lineHighlightBackground': c(u.currentLine, '66'),
    'editor.lineHighlightBorder': c(u.currentLine),
    'editor.selectionBackground': c(u.selection),
    'editor.inactiveSelectionBackground': c(u.inactiveSelection),
    'editor.selectionHighlightBackground': c(u.highlight, '99'),
    'editor.wordHighlightBackground': c(u.highlight, '88'),
    'editor.wordHighlightStrongBackground': c(u.highlight),
    'editor.findMatchBackground': c(u.accent, '55'),
    'editor.findMatchBorder': c(u.accent),
    'editor.findMatchHighlightBackground': c(u.accent, '26'),
    'editor.findRangeHighlightBackground': c(u.highlight, '55'),
    'editor.hoverHighlightBackground': c(u.highlight, '66'),
    'editor.rangeHighlightBackground': c(u.highlight, '44'),
    'editorBracketMatch.background': c(u.highlight),
    'editorBracketMatch.border': c(u.accent, '88'),
    'editorBracketHighlight.foreground1': c(k.keyword),
    'editorBracketHighlight.foreground2': c(k.type),
    'editorBracketHighlight.foreground3': c(k.function),
    'editorIndentGuide.background1': c(u.faint, '44'),
    'editorIndentGuide.activeBackground1': c(u.faint, 'aa'),
    'editorWhitespace.foreground': c(u.faint, '66'),
    'editorRuler.foreground': c(u.faint, '44'),
    'editorCodeLens.foreground': c(u.faint),
    'editorLink.activeForeground': c(u.accent),
    'editorInlayHint.background': c(u.raised, '99'),
    'editorInlayHint.foreground': c(u.muted),
    'editorError.foreground': c(u.error),
    'editorWarning.foreground': c(u.warning),
    'editorInfo.foreground': c(u.accent),
    'editorGutter.addedBackground': c(u.success, 'bb'),
    'editorGutter.modifiedBackground': c(u.secondary, 'bb'),
    'editorGutter.deletedBackground': c(u.error, 'bb'),
    'editorOverviewRuler.border': c(u.border, '00'),
    'editorOverviewRuler.findMatchForeground': c(u.accent, 'aa'),
    'editorOverviewRuler.addedForeground': c(u.success, '99'),
    'editorOverviewRuler.modifiedForeground': c(u.secondary, '99'),
    'editorOverviewRuler.deletedForeground': c(u.error, '99'),
    'editorOverviewRuler.errorForeground': c(u.error),
    'editorOverviewRuler.warningForeground': c(u.warning),
    'diffEditor.insertedTextBackground': c(u.success, '22'),
    'diffEditor.removedTextBackground': c(u.error, '22'),
    'editorWidget.background': c(u.sidebar),
    'editorWidget.border': c(u.border),
    'editorWidget.resizeBorder': c(u.accent),
    'editorHoverWidget.background': c(u.sidebar),
    'editorHoverWidget.border': c(u.border),
    'editorSuggestWidget.background': c(u.sidebar),
    'editorSuggestWidget.border': c(u.border),
    'editorSuggestWidget.highlightForeground': c(u.accent),
    'editorSuggestWidget.selectedBackground': c(u.selection),
    'peekView.border': c(u.accent),
    'peekViewEditor.background': c(u.sidebar),
    'peekViewEditor.matchHighlightBackground': c(u.accent, '44'),
    'peekViewResult.background': c(u.frame),
    'peekViewResult.matchHighlightBackground': c(u.accent, '44'),
    'peekViewResult.selectionBackground': c(u.selection),
    'peekViewTitle.background': c(u.frame),
    'minimap.selectionHighlight': c(u.selection),
    'minimapGutter.addedBackground': c(u.success),
    'minimapGutter.modifiedBackground': c(u.secondary),
    'minimapGutter.deletedBackground': c(u.error),

    // Notifications, debug, git, terminal
    'notifications.background': c(u.sidebar),
    'notifications.border': c(u.border),
    'notificationLink.foreground': c(u.accent),
    'debugToolBar.background': c(u.raised),
    'gitDecoration.addedResourceForeground': c(u.success),
    'gitDecoration.modifiedResourceForeground': c(u.secondary),
    'gitDecoration.deletedResourceForeground': c(u.error),
    'gitDecoration.untrackedResourceForeground': c(k.string),
    'gitDecoration.ignoredResourceForeground': c(u.faint),
    'gitDecoration.conflictingResourceForeground': c(u.warm),
    'terminal.background': c(u.editor),
    'terminal.foreground': c(u.text),
    'terminal.selectionBackground': c(u.selection),
    'terminalCursor.foreground': c(u.accent),
    'terminal.ansiBlack': c(isDark ? u.frame : u.text),
    'terminal.ansiRed': c(u.error),
    'terminal.ansiGreen': c(u.success),
    'terminal.ansiYellow': c(k.string),
    'terminal.ansiBlue': c(k.function),
    'terminal.ansiMagenta': c(k.constant),
    'terminal.ansiCyan': c(isDark ? k.keyword : k.operator),
    'terminal.ansiWhite': c(isDark ? u.text : u.frame),
    'terminal.ansiBrightBlack': c(u.faint),
    'terminal.ansiBrightRed': c(u.error),
    'terminal.ansiBrightGreen': c(u.success),
    'terminal.ansiBrightYellow': c(u.warning),
    'terminal.ansiBrightBlue': c(k.type),
    'terminal.ansiBrightMagenta': c(u.accent),
    'terminal.ansiBrightCyan': c(u.accent),
    'terminal.ansiBrightWhite': c(isDark ? 'FFFFFF' : u.text),
    'walkThrough.embeddedEditorBackground': c(u.frame),
  };
}

function tokenColors(t) {
  return SCOPES.map(([role, scope, fontStyle]) => ({
    name: role,
    scope,
    settings: Object.assign({ foreground: hex(t.tokens[role]) }, fontStyle ? { fontStyle } : {}),
  })).concat([
    { name: 'bold', scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
    { name: 'italic', scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
    { name: 'heading', scope: ['markup.heading', 'entity.name.section'], settings: { fontStyle: 'bold' } },
    { name: 'quote', scope: ['markup.quote'], settings: { foreground: hex(t.tokens.comment), fontStyle: 'italic' } },
    { name: 'invalid', scope: ['invalid', 'invalid.illegal'], settings: { foreground: hex(t.ui.error) } },
  ]);
}

function theme(t) {
  const semanticTokenColors = {};
  for (const [token, role] of Object.entries(SEMANTIC)) {
    semanticTokenColors[token] = hex(t.tokens[role]);
  }
  return {
    $schema: 'vscode://schemas/color-theme',
    name: t.label,
    type: t.type,
    semanticHighlighting: true,
    colors: workbench(t),
    tokenColors: tokenColors(t),
    semanticTokenColors,
  };
}

// The workbench adds this class to its root element for the active theme: <publisher>-<name>-themes-<file>.
function themeClass(t) {
  return `stillgbx-miami26-vscode-themes-${t.id}-color-theme-json`;
}

function neonTable() {
  return THEMES.map((t) => {
    const glow = {};
    for (const [role, layers] of Object.entries(t.glow || {})) {
      glow[t.tokens[role].toLowerCase()] = layers
        .map((l) => `0 0 ${l.blur}px #${l.color.toLowerCase()}${l.neon ? '[NEON_BRIGHTNESS]' : ''}`)
        .join(', ');
    }
    const [from, to] = t.ui.gradient.map((g) => hex(g));
    const tabs = '.monaco-workbench .part.editor>.content .editor-group-container>.title .tabs-container>.tab';
    const chrome = [
      `${tabs}.active{box-shadow:inset 0 -5px 25px ${from}22}`,
      `${tabs}.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;` +
        `background:linear-gradient(to right,${from},${to});z-index:6;pointer-events:none}`,
      '.monaco-workbench .activitybar>.content .monaco-action-bar .action-item.checked .active-item-indicator:before' +
        `{border-image:linear-gradient(to bottom,${from},${to}) 1 !important}`,
      '.monaco-workbench .activitybar>.content .monaco-action-bar .badge .badge-content' +
        `{background:linear-gradient(to bottom,${from},${to}) !important}`,
    ].join('');
    return { label: t.label, className: themeClass(t), glow, chrome };
  });
}

function check() {
  // The glow is keyed by token color: in a glowing theme, no other token may share a glowing color.
  for (const t of THEMES.filter((th) => th.glow)) {
    const glowing = new Set(Object.keys(t.glow).map((role) => t.tokens[role].toUpperCase()));
    for (const [role, color] of Object.entries(t.tokens)) {
      if (!(role in t.glow) && glowing.has(color.toUpperCase())) {
        throw new Error(`${t.label}: ${role} ${color} would glow like a glowing token`);
      }
    }
  }
}

function write(file, data) {
  const full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`${file} generated`);
}

check();
for (const t of THEMES) {
  write(`themes/${t.id}-color-theme.json`, theme(t));
}
write('src/neon/themes.json', neonTable());
