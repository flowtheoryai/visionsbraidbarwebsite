(function(){
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var pageTransition = document.getElementById("page-transition");
  if (pageTransition){
    if (reduceMotion){
      pageTransition.classList.add("pt-hidden");
    } else {
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          pageTransition.classList.add("pt-hidden");
        });
      });
      var isInternalNavLink = function(a){
        var href = a.getAttribute("href");
        if (!href || href.charAt(0) === "#") return false;
        if (a.target === "_blank") return false;
        if (/^(tel:|mailto:)/i.test(href)) return false;
        if (/^https?:\/\//i.test(href)) return false;
        return true;
      };
      document.querySelectorAll("a[href]").forEach(function(a){
        if (!isInternalNavLink(a)) return;
        a.addEventListener("click", function(e){
          if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          var href = a.getAttribute("href");
          e.preventDefault();
          pageTransition.classList.remove("pt-hidden");
          setTimeout(function(){ window.location.href = href; }, 420);
        });
      });
    }
  }

  var services = ["Knotless Braids","Box Braids","Cornrows","Faux Locs","Senegalese Twists","Crochets","Loc Maintenance","Gentlemen's Grooming","Young Visionaries","After Hours &amp; At-Home"];
  var track = document.getElementById("ticker-track");
  if (track){
    var html = "";
    for (var r=0;r<2;r++){
      services.forEach(function(s){ html += "<span>"+s+"</span><span class=\"gem\">&#10022;</span>"; });
    }
    track.innerHTML = html;
  }

  var popupOverlay = document.getElementById("popup-overlay");
  if (popupOverlay){
    var popupClose = document.getElementById("popup-close");
    var popupForm = document.getElementById("popup-form");
    var openPopup = function(){
      popupOverlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    var closePopup = function(){
      popupOverlay.classList.remove("is-open");
      document.body.style.overflow = "";
    };
    document.querySelectorAll("[data-popup-trigger]").forEach(function(btn){
      btn.addEventListener("click", openPopup);
    });
    if (popupClose) popupClose.addEventListener("click", closePopup);
    popupOverlay.addEventListener("click", function(e){
      if (e.target === popupOverlay) closePopup();
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape") closePopup();
    });
    if (popupForm) popupForm.addEventListener("submit", function(e){ e.preventDefault(); });
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

  document.querySelectorAll(".stagger").forEach(function(grid){
    Array.prototype.forEach.call(grid.children, function(child){
      child.classList.add("reveal");
    });
  });

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

  var svcCards = document.querySelectorAll(".svc-card");
  if (svcCards.length && !reduceMotion && window.matchMedia && window.matchMedia("(hover:hover) and (pointer:fine)").matches){
    svcCards.forEach(function(card){
      card.addEventListener("pointermove", function(e){
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (py - 0.5) * -10;
        var ry = (px - 0.5) * 10;
        card.style.transition = "none";
        card.style.transform = "perspective(1600px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("pointerleave", function(){
        card.style.transition = "";
        card.style.transform = "";
      });
    });
  }

  var shuffleStack = document.getElementById("shuffle-stack");
  if (shuffleStack){
    var serviceCards = [
      { name:"Knotless Braids", sub:"Box Braids · Knotless · Protective", type:"photo", src:"images/svc-braids-knotless.jpg" },
      { name:"Box Braids", sub:"Classic · Jumbo · Micro", type:"grad", grad:"g1" },
      { name:"Cornrows", sub:"Feed-In · Straight Backs · Designs", type:"grad", grad:"g2" },
      { name:"Faux Locs", sub:"Goddess · Butterfly · Distressed", type:"grad", grad:"g3" },
      { name:"Senegalese Twists", sub:"Twists · Passion · Marley", type:"photo", src:"images/svc-twists-locs.jpg" },
      { name:"Crochets", sub:"Quick Install · Low Manipulation", type:"grad", grad:"g4" },
      { name:"Loc Maintenance", sub:"Retwist · Repair · Style", type:"grad", grad:"g5" },
      { name:"Gentlemen's Grooming", sub:"Cornrows · Twists · Locs", type:"grad", grad:"g6" },
      { name:"Young Visionaries", sub:"Ages 5+ · Braids · Twists", type:"grad", grad:"g1" },
      { name:"After Hours &amp; At-Home", sub:"By Request · 20 Mile Radius", type:"grad", grad:"g3" }
    ];

    var cardEls = serviceCards.map(function(s, i){
      var el = document.createElement("div");
      el.className = "shuffle-card";
      el.setAttribute("role", "group");
      el.setAttribute("aria-roledescription", "slide");
      el.setAttribute("aria-label", s.name);
      el.tabIndex = -1;
      var visual = s.type === "photo"
        ? '<img src="' + s.src + '" alt="" loading="lazy">'
        : '<div class="shuffle-grad-' + s.grad + '" style="position:absolute;inset:0;"><span class="shuffle-mark" aria-hidden="true">' + s.name.charAt(0) + '</span></div>';
      el.innerHTML = visual + '<div class="shuffle-card-info"><p class="shuffle-name">' + s.name + '</p><p class="shuffle-sub">' + s.sub + '</p></div>';
      el.addEventListener("click", function(){
        if (el.getAttribute("data-pos") === "front") shuffleNext();
        else bringToFront(i);
      });
      shuffleStack.appendChild(el);
      return el;
    });

    var listEl = document.getElementById("shuffle-list");
    var listItemEls = [];
    if (listEl){
      listItemEls = serviceCards.map(function(s, i){
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.innerHTML = "<span>" + s.name + "</span><span class=\"shuffle-list-n\">" + pad(i + 1) + "</span>";
        btn.addEventListener("click", function(){ bringToFront(i); });
        li.appendChild(btn);
        listEl.appendChild(li);
        return li;
      });
    }

    var order = serviceCards.map(function(_, i){ return i; });
    var counterEl = document.getElementById("shuffle-counter");
    var liveEl = document.getElementById("shuffle-live");

    function pad(n){ return n < 10 ? "0" + n : "" + n; }

    function render(){
      var positions = ["front", "right", "left"];
      order.forEach(function(idx, pos){
        var el = cardEls[idx];
        el.setAttribute("data-pos", pos < 3 ? positions[pos] : "hidden");
        el.tabIndex = pos === 0 ? 0 : -1;
      });
      if (counterEl) counterEl.textContent = pad(order[0] + 1) + " / " + pad(serviceCards.length);
      if (liveEl) liveEl.textContent = serviceCards[order[0]].name;
      listItemEls.forEach(function(li, i){
        li.classList.toggle("active", i === order[0]);
      });
    }

    function shuffleNext(){
      order.push(order.shift());
      render();
    }
    function shufflePrev(){
      order.unshift(order.pop());
      render();
    }
    function bringToFront(targetIdx){
      var pos = order.indexOf(targetIdx);
      if (pos <= 0) return;
      order = order.slice(pos).concat(order.slice(0, pos));
      render();
    }

    render();

    var prevBtn = document.getElementById("shuffle-prev");
    var nextBtn = document.getElementById("shuffle-next");
    if (prevBtn) prevBtn.addEventListener("click", shufflePrev);
    if (nextBtn) nextBtn.addEventListener("click", shuffleNext);

    var deck = document.getElementById("shuffle-deck");
    if (deck){
      deck.addEventListener("keydown", function(e){
        if (e.key === "ArrowRight"){ e.preventDefault(); shuffleNext(); }
        else if (e.key === "ArrowLeft"){ e.preventDefault(); shufflePrev(); }
      });

      var inView = false;
      var autoplayId = null;
      function startAutoplay(){
        if (reduceMotion || autoplayId) return;
        autoplayId = setInterval(shuffleNext, 3200);
      }
      function stopAutoplay(){
        if (autoplayId){ clearInterval(autoplayId); autoplayId = null; }
      }
      deck.addEventListener("pointerenter", stopAutoplay);
      deck.addEventListener("pointerleave", function(){ if (inView) startAutoplay(); });
      deck.addEventListener("focusin", stopAutoplay);
      deck.addEventListener("focusout", function(){ if (inView) startAutoplay(); });

      if (!reduceMotion && "IntersectionObserver" in window){
        var deckObserver = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            inView = entry.isIntersecting;
            if (inView) startAutoplay(); else stopAutoplay();
          });
        }, {threshold:0.4});
        deckObserver.observe(deck);
      }
    }
  }
})();
