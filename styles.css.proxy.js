// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "@keyframes enter {\n  0% {\n    opacity: 0;\n    transform: scale(0.9);\n  }\n  10% {\n    opacity: 0;\n    border-radius: 10vmin;\n  }\n  60% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  padding: 0;\n  min-height: 100vh;\n  background: linear-gradient(0deg, #af938488, #af938422);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.scene {\n  width: 50vmin;\n  height: 50vmin;\n  animation: 3s ease-in-out 0s 1 enter;\n  box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;\n  border-radius: 5vmin;\n  overflow: hidden;\n}\n.scene canvas {\n  width: 100%;\n  height: 100%;\n}\n@media (max-width: 640px) {\n  .scene {\n    position: fixed;\n    width: 100vmax;\n    height: 100vmax;\n    margin-left: -50vmax;\n    left: 50%;\n    animation: unset;\n    border-radius: 0;\n  }\n}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}