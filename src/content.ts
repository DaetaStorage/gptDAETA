//@ts-expect-error ?script is fine
import scriptPath from "./main?script&module";

const script = document.createElement("script");
script.type = "module"; // if you wanna use imports
script.src = chrome.runtime.getURL(scriptPath);

document.body.appendChild(script);
