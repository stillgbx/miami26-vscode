// Miami '26 neon, injected into the VS Code workbench by the "Miami '26: Enable Neon" command.
// Adapted from the "Neon Dreams" of SynthWave '84 by Robb Owen (MIT License).
//
// VS Code writes the token colors into a style element as ".mtkN { color: #rrggbb; }". When a
// Miami '26 theme is active, this script adds a text-shadow to the tokens whose color glows in
// that theme, and the editor chrome styles of the theme. It follows theme and color changes,
// and removes its styles when another theme is selected.
(function () {
  const THEMES = /*THEMES*/[];
  const BRIGHTNESS = '/*NEON_BRIGHTNESS*/';
  const DISABLE_GLOW = /*DISABLE_GLOW*/false;
  const STYLE_ID = 'miami26-neon-styles';

  const activeTheme = () => THEMES.find((t) => document.querySelector(`[class*="${t.className}"]`));

  const glowStyles = (tokenStyles, glow) => {
    let css = '';
    const rule = /(\.mtk\d+)\s*\{\s*color:\s*#([0-9a-f]{6})\s*;?\s*\}/gi;
    let match;
    while ((match = rule.exec(tokenStyles)) !== null) {
      const shadow = glow[match[2].toLowerCase()];
      if (shadow) {
        css += `.monaco-editor ${match[1]}{text-shadow:${shadow.replace(/\[NEON_BRIGHTNESS\]/g, BRIGHTNESS)};` +
          'backface-visibility:hidden}';
      }
    }
    return css;
  };

  const update = () => {
    const existing = document.getElementById(STYLE_ID);
    const theme = activeTheme();
    const tokens = document.querySelector('.vscode-tokens-styles');
    if (!theme || !tokens || !tokens.textContent) {
      if (existing) {
        existing.remove();
      }
      return;
    }

    const css = (DISABLE_GLOW ? '' : glowStyles(tokens.textContent, theme.glow)) + theme.chrome;
    if (existing && existing.textContent === css) {
      return;
    }
    const style = existing || document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    if (!existing) {
      document.body.appendChild(style);
    }
  };

  // Batch the DOM changes: VS Code updates the theme class and the token styles in several steps.
  let pending = false;
  const schedule = () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        update();
      });
    }
  };

  // Watch the theme class on the workbench and the content of the token styles.
  const watched = new WeakSet();
  const watch = () => {
    const workbench = document.querySelector('.monaco-workbench');
    const tokens = document.querySelector('.vscode-tokens-styles');
    if (workbench && !watched.has(workbench)) {
      watched.add(workbench);
      new MutationObserver(schedule).observe(workbench, { attributes: true, attributeFilter: ['class'] });
    }
    if (tokens && !watched.has(tokens)) {
      watched.add(tokens);
      new MutationObserver(schedule).observe(tokens, { childList: true, characterData: true, subtree: true });
    }
    schedule();
  };

  // The workbench and the token styles are created after this script runs, in the body or the head.
  new MutationObserver(watch).observe(document.body, { childList: true });
  new MutationObserver(watch).observe(document.head, { childList: true });
  watch();
})();
