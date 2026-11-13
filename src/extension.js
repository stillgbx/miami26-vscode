// Miami '26 neon: injects src/neon/template.js into the VS Code workbench.
// Adapted from the "Neon Dreams" of SynthWave '84 by Robb Owen (MIT License).
'use strict';

const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

const SCRIPT_NAME = 'miami26-neon.js';
const SCRIPT_TAG = `<!-- MIAMI 26 NEON --><script src="${SCRIPT_NAME}"></script><!-- /MIAMI 26 NEON -->`;
const SCRIPT_LINE = /^.*<!-- MIAMI 26 NEON -->.*<!-- \/MIAMI 26 NEON -->.*\r?\n?/gm;

const messages = {
  enabled: "Miami '26 neon enabled. Reload VS Code to see it. VS Code will then say that its installation is " +
    'corrupt, as the neon modifies its files: to remove this warning, run "Fix Checksums: Apply" from the ' +
    'Fix VSCode Checksums Next extension, or choose "Don\'t Show Again".',
  refreshed: "Miami '26 neon settings updated. Reload VS Code to apply them.",
  disabled: "Miami '26 neon disabled. Reload VS Code to complete.",
  notEnabled: "Miami '26 neon is not enabled.",
  accessDenied: "Miami '26 could not modify the VS Code files needed by the neon. If VS Code is installed for all " +
    'users, run it as administrator once to enable or disable the neon.',
  workbenchNotFound: "Miami '26 could not find the VS Code workbench file. Please open an issue on " +
    'https://github.com/stillgbx/miami26-vscode with your VS Code version.',
  failed: "Miami '26 could not enable the neon: ",
};

// The workbench HTML file and its folder, depending on the VS Code version.
function workbenchFile() {
  const base = path.join(path.dirname(vscode.env.appRoot), 'app', 'out', 'vs', 'code');
  for (const folder of ['electron-browser', 'electron-sandbox']) {
    for (const file of ['workbench.esm.html', 'workbench.html']) {
      const html = path.join(base, folder, 'workbench', file);
      if (fs.existsSync(html)) {
        return html;
      }
    }
  }
  return null;
}

function neonScript() {
  const config = vscode.workspace.getConfiguration('miami26');
  let brightness = parseFloat(config.get('brightness'));
  brightness = isNaN(brightness) ? 0.6 : Math.min(1, Math.max(0, brightness));
  const alpha = Math.round(brightness * 255).toString(16).padStart(2, '0');

  const themes = fs.readFileSync(path.join(__dirname, 'neon', 'themes.json'), 'utf8');
  return fs.readFileSync(path.join(__dirname, 'neon', 'template.js'), 'utf8')
    .replace('/*THEMES*/[]', themes.trim())
    .replace('/*NEON_BRIGHTNESS*/', alpha)
    .replace('/*DISABLE_GLOW*/false', String(!!config.get('disableGlow')));
}

function reload(message) {
  vscode.window.showInformationMessage(message, 'Reload').then((choice) => {
    if (choice === 'Reload') {
      vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
  });
}

function report(error) {
  if (/EACCES|EPERM|ENOENT/.test(error.code)) {
    vscode.window.showErrorMessage(messages.accessDenied);
  } else {
    vscode.window.showErrorMessage(messages.failed + error.message);
  }
}

function enable() {
  const html = workbenchFile();
  if (!html) {
    vscode.window.showErrorMessage(messages.workbenchNotFound);
    return;
  }
  try {
    fs.writeFileSync(path.join(path.dirname(html), SCRIPT_NAME), neonScript(), 'utf8');
    const content = fs.readFileSync(html, 'utf8');
    if (content.includes(SCRIPT_NAME)) {
      reload(messages.refreshed);
      return;
    }
    fs.writeFileSync(html, content.replace(/<\/html>\s*$/, `\t${SCRIPT_TAG}\n</html>\n`), 'utf8');
    reload(messages.enabled);
  } catch (error) {
    report(error);
  }
}

function disable() {
  const html = workbenchFile();
  if (!html) {
    vscode.window.showErrorMessage(messages.workbenchNotFound);
    return;
  }
  try {
    const content = fs.readFileSync(html, 'utf8');
    if (!content.includes(SCRIPT_NAME)) {
      vscode.window.showInformationMessage(messages.notEnabled);
      return;
    }
    fs.writeFileSync(html, content.replace(SCRIPT_LINE, ''), 'utf8');
    const script = path.join(path.dirname(html), SCRIPT_NAME);
    if (fs.existsSync(script)) {
      fs.unlinkSync(script);
    }
    reload(messages.disabled);
  } catch (error) {
    report(error);
  }
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('miami26.enableNeon', enable),
    vscode.commands.registerCommand('miami26.disableNeon', disable),
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
