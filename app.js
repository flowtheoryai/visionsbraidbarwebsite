(function(){
  "use strict";

  var services = ["Knotless Braids","Box Braids","Cornrows","Faux Locs","Senegalese Twists","Crochets","Loc Maintenance","Gentlemen's Grooming","Young Visionaries","After Hours &amp; At-Home"];
  var track = document.getElementById("ticker-track");
  if (track){
    var html = "";
    for (var r=0;r<2;r++){
      services.forEach(function(s){ html += "<span>"+s+"</span><span class=\"gem\">&#10022;</span>"; });
    }
    track.innerHTML = html;
  }

  var nav = document.getElementById("site-nav");
  var onScroll = function(){
    if (!nav) return;
    if (window.scrollY > 10) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  document.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");
  if (hamburger && mobileMenu){
    hamburger.addEventListener("click", function(){
      var open = mobileMenu.classList.toggle("is-open");
      hamburger.classList.toggle("is-open", open);
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        mobileMenu.classList.remove("is-open");
        hamburger.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded","false");
        document.body.style.overflow = "";
      });
    });
  }

  var tabs = document.querySelectorAll(".svc-tab");
  if (tabs.length){
    var panels = {
      women: document.getElementById("panel-women"),
      men: document.getElementById("panel-men"),
      young: document.getElementById("panel-young")
    };
    tabs.forEach(function(tab){
      tab.addEventListener("click", function(){
        tabs.forEach(function(t){ t.classList.remove("active"); t.setAttribute("aria-selected","false"); });
        tab.classList.add("active"); tab.setAttribute("aria-selected","true");
        Object.keys(panels).forEach(function(k){ if(panels[k]) panels[k].classList.remove("active"); });
        var target = panels[tab.getAttribute("data-panel")];
        if (target) target.classList.add("active");
      });
    });
  }

  document.querySelectorAll(".faq-item").forEach(function(item){
    var btn = item.querySelector(".faq-q");
    btn.addEventListener("click", function(){
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function(other){
        if (other !== item){ other.classList.remove("open"); other.querySelector(".faq-q").setAttribute("aria-expanded","false"); }
      });
      item.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
    });
  });

  var form = document.getElementById("lead-form");
  var success = document.getElementById("lf-success");
  if (form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if (!form.checkValidity()){ form.reportValidity(); return; }
      form.hidden = true;
      success.hidden = false;
    });
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window){
    var targets = document.querySelectorAll(".reveal");
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("reveal-visible");
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:"0px 0px -40px 0px"});
    targets.forEach(function(el){
      el.classList.add("reveal-armed");
      io.observe(el);
    });
  }
})();
