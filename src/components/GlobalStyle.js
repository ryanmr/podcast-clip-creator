import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  html {
    font-size: 16px;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    min-width: 300px;
    overflow-x: hidden;
    overflow-y: scroll;
    text-rendering: optimizeLegibility;
    text-size-adjust: 100%;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5;
    font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  }
  html,
  body {
    min-height: 100vh;
  }

  a {
    color: #5d96f4;
    transition: all 0.42s;
  }

  a:hover {
    color: #89afeb;
  }

  span[title] {
    border-bottom: 1px dotted #5e91e4;
  }
`;
