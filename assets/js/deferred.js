---
layout: js_minifier
---

function collapseCodeBlocks() {
    // top element
    let code_blocks = document.getElementsByTagName("pre");
    
    // cached elements are faster
    let elem = document.createElement("button");
    elem.classList.add("collapsible");
    let icon = document.createElement("i");
    icon.classList.add("lang-icon");
    let div = document.createElement("div");
    div.classList.add("lang-label");
    let container = div.cloneNode(false);
    container.classList.add("collapse-container");
    
    var len = code_blocks.length;
    for (var x = 0; x < len; x++) {
        // need the top level parent
        var block = code_blocks[x].parentElement.parentElement;
        var classNames = block.className.split(' ')[0];
        
        var language;
        var language_upper;
        
        // language- (9th)
        language = name.substring(9);
        language_upper = language.split("");
        language_upper[0] = language[0].toUpperCase();
        language_upper = language_upper.join("");

        let elem = elem.cloneNode(false);
        let icon = icon.cloneNode(false);
        let div = div.cloneNode(false);
        let container = container.cloneNode(false);

        icon.classList.add("devicon-" + language + "-plain");
        elem.appendChild(icon);

        var text = document.createTextNode(" " + language_upper);
        div.appendChild(text);
        elem.appendChild(div);

        var parent = block.parentNode;
        var referenceNode = block.nextElementSibling;
        
        container.appendChild(elem);
        container.appendChild(block);
        
        parent.insertBefore(container, referenceNode);
        
        // now add event listener to button
        elem.addEventListener("click", event => {
          event.currentTarget.classList.toggle("active");
          var content = event.currentTarget.nextElementSibling;
          // fix bug in minifier which shortened this to only one var
          var height = content.style.maxHeight;
          
          if (height) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
    }
}

var parseNum = str => +str.replace(/[^.\d]/g, '');

var time, html, section, header;
function postSetup() {
  let style = getComputedStyle(document.documentElement);
  time = parseNum(style.getPropertyValue('--transition-time'));
  
  html = document.documentElement;
  section = document.getElementsByTagName('section')[0];
  header = document.getElementsByTagName('header')[0];
}

(function () {
  collapseCodeBlocks();

  // set state of day/night icon
  // checked == day
  let dayNight = document.getElementById("theme-switcher");
  let theme = cherryblog.getTheme();
  dayNight.checked = theme == "light" ? true : false;

  // set click handler for switcher
  dayNight.addEventListener('click', event => {
    // set one-shot transition
    html.dataset.transition = '';
    header.dataset.transition = '';
    section.dataset.transition = '';
    
    cherryblog.toggleTheme();
    
    setTimeout(
      () => {
        // remove unneeded property
        delete html.dataset.transition;
        delete header.dataset.transition;
        delete section.dataset.transition;
      },
      time * 1000
    );
  });

  // dynamically add the themed comments
  // this detects if it's a post, BUT this MAY be used on other template pages, soo..
  let post = document.getElementsByClassName("post");
  // we need to check the path is at least 4, e.g. /2022/3/04/title.
  // this prevents it from loading on e.g. archive.html
  let is_post = window.location.pathname.split('/').slice(1).length == 4 && post.length != 0;
  if (is_post) {
    let script = document.createElement('script');
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "cherryleafroad/cherryleafroad.github.io");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("label", "comments");
    script.setAttribute("theme", cherryblog.getCommentsTheme(theme));
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;
    
    post[0].appendChild(script);
  }
  
  postSetup();
})();
