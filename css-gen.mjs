import githubMarkdownCss from 'generate-github-markdown-css';

/*
If the `light` and `dark` themes are different the CSS returned will include `prefers-color-scheme` blocks for light and dark that match the specified `light` and `dark` themes (considered "auto" mode). This mode will always `preserveVars` as they are necessary for the `prefers-color-scheme` blocks

If the `light` and `dark` themes are equal the output will only contain one theme (considered "single" mode)

In "single" mode the output will apply the values of all variables to the rules themselves.The output will not contain any `var(--variable)` statements. You can disable this by setting `preserveVariables` to true
*/

const gen = async () => {
  const res = await githubMarkdownCss({
    // The theme to use for light theme.
    light: 'light',
    // The theme to use for dark theme.
    dark: 'dark',
    // If `true`, will return a list of available themes instead of the CSS.
    list: false,
    // If `true`, will preserve the block of variables for a given theme even if
    // only exporting one theme. By default, variables are applied to the rules
    // themselves and the resulting CSS will not contain any `var(--variable)`.
    preserveVariables: false,
    // Only output the color variables part of the CSS. Forces
    // `preserveVariables` to be `true`.
    onlyVariables: false,
    // Only output the style part of the CSS without any variables. Forces
    // `preserveVariables` to be `true` and ignores the theme values.
    // Useful to get the base styles to use multiple themes.
    onlyStyles: false,
    // Include extra styles from GitHub Flavored Markdown, like code snippets.
    useFixture: true,
    // Set the root selector of the rendered Markdown body as it should appear
    // in the output CSS. Defaults to `.markdown-body`.
    rootSelector: '.markdown-body'
  });

  console.log('CSS generated successfully');
  console.log(res);
};
gen();
