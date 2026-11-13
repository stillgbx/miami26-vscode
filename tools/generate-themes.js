// Generate the four Miami '26 color themes and the neon glow table.
//
//   node tools/generate-themes.js
//
// Two palettes, each in a dark and a light version, the same as the Visual Studio themes
// (github.com/stillgbx/miami26-vs):
// * Bay: a day on the bay. Sky blue, turquoise water, lavender palm trees, peach facades, warm sand.
// * Sunset: dusk on the ocean front. Magenta, peach, pale gold, periwinkle and lavender sky, plum palm trees.
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
  // The bay at nightfall: a lilac blue sky, deep water, lavender palm trees on the status bar,
  // peach facades in the selection and pastel tokens.
  ui: {
    frame: '0B1626', sidebar: '1C2747', editor: '102230', raised: '1F3448', border: '27405A',
    text: 'EAF4F2', muted: '93AFC2', faint: '5F7C9A',
    accent: '5FD6C6', accentStrong: '2FA394', onAccent: 'FFFFFF',
    status: '6763C2', statusText: 'FFFFFF',
    selection: '5A4048', inactiveSelection: '33333F', highlight: '33335E', currentLine: '17303C',
    warm: 'F5B095', secondary: 'A9A6F0', error: 'FF6B8B', warning: 'F5C98F', success: '7EDC9E',
    gradient: ['7FD8C8', 'A9A6F0'],
  },
  tokens: {
    keyword: '7FD8C8', type: 'A9A6F0', function: '8EC6EC', tag: 'F5B49C', variable: 'E2EEF2',
    operator: '9FE3D6', attribute: '9CCBEA', string: 'F3DDB0', constant: 'F2A0B4',
    comment: '64799C', escape: 'F0A0C8',
  },
  glow: {
    keyword: [dark(2, '041210'), neon(4, '2EE0C8'), neon(10, '2EE0C8')],
    type: [dark(2, '0E0A1F'), neon(4, '7C74FF'), neon(10, '7C74FF')],
    function: [dark(2, '04101F'), neon(3, '3AA6F0'), neon(8, '3AA6F0')],
    tag: [dark(2, '1A0E08'), neon(6, 'FF8A5C'), neon(18, '3A2420')],
    variable: [dark(2, '102230'), fixed(5, '33', '8EC6EC'), fixed(10, '22', 'FFFFFF')],
  },
};

const BAY_LIGHT = {
  id: 'miami26-bay-light',
  label: "Miami '26 Bay Light",
  type: 'light',
  // The bay in daylight: a sky blue frame, mint water panels and a sand editor; lavender palm trees
  // on the status bar and peach facades in the selection.
  ui: {
    frame: 'A6CBE8', sidebar: 'D3EEE8', editor: 'FBF3E6', raised: 'FEF9F0', border: '93B8DC',
    text: '1B3245', muted: '45627E', faint: '7A93AE',
    accent: '128079', accentStrong: '128079', onAccent: 'FFFFFF',
    status: '6B67C2', statusText: 'FFFFFF',
    selection: 'F7CDBB', inactiveSelection: 'F2DFD2', highlight: 'DCD9F6', currentLine: 'F2E6D3',
    warm: 'F4AE92', secondary: '5853B5', error: 'C62D58', warning: 'A3561A', success: '2A7F47',
    gradient: ['128079', '6B67C2'],
  },
  tokens: {
    keyword: '0E7A74', type: '5853B5', function: '23689E', tag: '9C3F8A', variable: '1F3A50',
    operator: '2A7579', attribute: '23689E', string: 'B04F2A', constant: 'C2386C',
    comment: '7380AA', escape: 'C2386C',
  },
};

const SUNSET = {
  id: 'miami26-sunset',
  label: "Miami '26 Sunset",
  type: 'dark',
  // Dusk on the ocean front: plum palm trees, a peach horizon on the status bar and a magenta accent.
  ui: {
    frame: '160E24', sidebar: '2A1A3E', editor: '231833', raised: '33244C', border: '3A2A58',
    text: 'F8EEF4', muted: 'B3A3C8', faint: '7E6A9C',
    accent: 'FF5FAA', accentStrong: 'D9408A', onAccent: 'FFFFFF',
    status: 'F5A872', statusText: '1E1430',
    selection: '5A2F62', inactiveSelection: '3A2A4E', highlight: '3E3470', currentLine: '2E2042',
    warm: 'FF7A8A', secondary: 'A9B4F5', error: 'FF5C6C', warning: 'FFD27F', success: '7EE0A8',
    gradient: ['FF5FAA', 'FFB27A'],
  },
  tokens: {
    keyword: 'FF5FAA', type: 'A9B4F5', function: 'FFB27A', tag: 'D6A2F2', variable: 'F6E2EE',
    operator: 'FF9CC8', attribute: 'FFBC8A', string: 'F6E2A2', constant: 'FF8A7A',
    comment: '8C72A8', escape: '9AA6FF',
  },
  glow: {
    keyword: [dark(2, '2A0A1A'), neon(4, 'FF2E93'), neon(10, 'FF2E93')],
    type: [dark(2, '0A0C24'), neon(4, '6F7BFF'), neon(10, '6F7BFF')],
    function: [dark(2, '1A0E00'), neon(3, 'FF7A1F'), neon(8, 'FF7A1F')],
    tag: [dark(2, '120A1C'), neon(8, 'A44CFF'), neon(24, '2A1A3A')],
    variable: [dark(2, '231833'), fixed(5, '33', 'FF5FAA'), fixed(10, '22', 'FFFFFF')],
  },
};

const SUNSET_LIGHT = {
  id: 'miami26-sunset-light',
  label: "Miami '26 Sunset Light",
  type: 'light',
  // The sky at dusk, from top to bottom: a lavender frame, pink panels and a peach editor;
  // plum palm trees on the status bar.
  ui: {
    frame: 'C9B9EA', sidebar: 'F8D8E1', editor: 'FDEBDB', raised: 'FEF4EC', border: 'AFA6E0',
    text: '2E1A3D', muted: '6C5277', faint: '9A82A6',
    accent: 'C8287A', accentStrong: 'C8287A', onAccent: 'FFFFFF',
    status: '7E4B87', statusText: 'FFFFFF',
    selection: 'F6C4D8', inactiveSelection: 'F2D9E2', highlight: 'DAD6F6', currentLine: 'F9DDD3',
    warm: 'F6A56E', secondary: '4A56B8', error: 'C42B3A', warning: '7F5E00', success: '2E7D4A',
    gradient: ['C8287A', 'A64F18'],
  },
  tokens: {
    keyword: 'BE1F70', type: '4A56B8', function: 'A64F18', tag: '7A3D8C', variable: '35203F',
    operator: 'A3306E', attribute: 'A9521C', string: '7F5E00', constant: 'B83A28',
    comment: '8E7299', escape: '4A56B8',
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
    'statusBar.debuggingForeground': isDark ? c(u.frame) : c(u.text),
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
