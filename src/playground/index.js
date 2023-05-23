import "babel-polyfill";

import { flowDiagrams } from "./flowDiagrams";
import { parseMermaid } from "../parser";
import { DEFAULT_FONT_SIZE, SKIP_CASES } from "./settings";

// Initialize Mermaid
const mermaid = window.mermaid;
mermaid.initialize({ startOnLoad: false });

import "./initExcalidraw"
import "./initCustomTest"

// Render all the diagram test cases
const containerEl = document.getElementById("diagrams");
flowDiagrams.forEach(async (diagramDefinition, i) => {
  if (SKIP_CASES.includes(i + 1)) return;

  const diagramContainerEl = document.createElement("div");
  diagramContainerEl.id = `diagram-container-${i}`;
  diagramContainerEl.innerHTML = `<h1>Test #${
    i + 1
  }</h1><div id="diagram-${i}"></div><button onclick="renderExcalidraw(document.getElementById('parsed-${i}').innerText)">Render to Excalidraw</button><pre id="parsed-${i}"></pre>`;

  const diagramEl = diagramContainerEl.querySelector(`#diagram-${i}`);
  const { svg } = await mermaid.render(
    `diagram-${i}`,
    `%%{init: {"themeVariables": {"fontSize": "${DEFAULT_FONT_SIZE}px"}} }%%\n` +
      diagramDefinition
  );

  diagramEl.innerHTML = svg;
  containerEl.append(diagramContainerEl);

  // get parsed data
  const parsedDataViewerEl = diagramContainerEl.querySelector(`#parsed-${i}`);
  const data = await parseMermaid(mermaid, diagramDefinition, {
    fontSize: DEFAULT_FONT_SIZE,
  });
  parsedDataViewerEl.innerHTML = JSON.stringify(data, null, 2);
});