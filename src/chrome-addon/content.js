function applyHighlight() {
  const s = document.createElement("style");
  s.id = "headlighter";
  s.textContent = `
*:is(h1,h2,h3,h4,h5,h6){box-shadow:0 0 0 3px Lime;position:relative;z-index:9999;}
*:is(h1,h2,h3,h4,h5,h6)::after{
  display:block;
  position:absolute;
  left:0;
  bottom:100%;
  transform:translateY(-50%);
  background:Lime;
  color:#307011;
  padding:2px 5px;
  line-height:1em;
  font-size:12px;
  border-radius:3px;
  z-index:9999;
}
h1::after{content:'h1';}
h2::after{content:'h2';}
h3::after{content:'h3';}
h4::after{content:'h4';}
h5::after{content:'h5';}
h6::after{content:'h6';}
:is(.h1,.h2,.h3,.h4,.h5,.h6):not(h1,h2,h3,h4,h5,h6){box-shadow:0 0 0 3px red;position:relative;z-index:9999;}
`;
  document.head.appendChild(s);
}

function removeHighlight() {
  const style = document.getElementById("headlighter");
  if (style) {
    // Check if the style element exists
    style.remove();
  }
}

chrome.storage.session.get(["highlightEnabled"], (result) => {
  const isEnabled =
    result && result.highlightEnabled === undefined
      ? false
      : result.highlightEnabled; // Check if result is defined
  if (isEnabled) {
    applyHighlight();
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "toggleHighlight") {
    if (request.highlightEnabled) {
      applyHighlight();
    } else {
      removeHighlight();
    }
  }
});
