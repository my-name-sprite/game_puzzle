(() => {
    "use strict";
    let e = !1,
        t = JSON.parse(localStorage.getItem("size")) ? JSON.parse(localStorage.getItem("size")) : 4,
        l = Math.pow(t, 2),
        s = 400 / t;

    function n() {
        let e = [...Array(l - 1).keys()];
        return e.sort((() => Math.random() - .5)), e
    }

    function a(e) {
        return parseInt(e) <= 9 && e.toString().length < 2 ? "0" + e : e
    }

    function o() {
        t = JSON.parse(localStorage.getItem("size")), l = Math.pow(t, 2), s = 400 / t
    }
    let r = function () {
            let e = 0,
                t = 0;
            return function (l = !1) {
                return l ? (t = 0, e = 0) : (e++, 60 === e && (t++, e = 0), e = a(e), t = a(t)), {
                    sec: e,
                    min: t
                }
            }
        }(),
        i = function (e) {
            let t = 0;
            return function (e = !1) {
                return e ? t = 0 : t++, t
            }
        }(),
        c = [...Array(l - 1).keys()];
    localStorage.setItem("size", localStorage.getItem("size") ? localStorage.getItem("size") : 4);
    let m, d = 0,
        p = {
            top: t,
            left: t,
            value: 0
        },
        u = [],
        g = JSON.parse(localStorage.getItem("score")) ? JSON.parse(localStorage.getItem("score")) : [];

    function y(e, n) {
        if (0 !== u.length)
            for (p = {
                    top: t,
                    left: t,
                    value: 0
                }; 0 !== u.length;) u.pop();
        for (let a = 1; a < l; a++) {
            const l = document.createElement("div");
            let o;
            l.classList.add("cell"), l.style.width = s + "px", l.style.height = s + "px", o = e[a - 1] + 1, l.innerHTML = o, n.append(l);
            const r = a % t == 0 ? t : a % t,
                i = (a - r) / t + 1;
            u.push({
                left: r,
                top: i,
                element: l,
                value: o
            }), l.style.left = r * s - s + "px", l.style.top = i * s - s + "px", m = function (e) {
                let t = Date.now(),
                    o = e.clientX - l.getBoundingClientRect().left,
                    r = e.clientY - l.getBoundingClientRect().top;
                l.style.transition = "none", l.style.zIndex = 1e3;
                const i = l.previousElementSibling;

                function c(e, t) {
                    l.style.left = e - o + "px", l.style.top = t - r + "px"
                }

                function m(e) {
                    c(e.pageX, e.pageY)
                }
                document.body.append(l), c(e.pageX, e.pageY), document.addEventListener("mousemove", m), l.onmouseup = () => {
                    let e;
                    u.forEach((t => {
                        t.value === parseFloat(l.innerText) && (e = t)
                    }));
                    let o = Date.now() - t;
                    if (l.style.zIndex = 1, o < 200) e.element.style.transition = "all 0.3s", e.element.style.left = e.left * s - s + "px", e.element.style.top = e.top * s - s + "px", i.after(l), v(a - 1, n, u), document.removeEventListener("mousemove", m);
                    else {
                        document.removeEventListener("mousemove", m);
                        let t = Math.abs(n.offsetLeft - parseFloat(l.style.left.split("px"))),
                            o = Math.abs(n.offsetTop - parseFloat(l.style.top.split("px")));
                        i.after(l), Math.abs(p.left * s - s - t) <= 25 && Math.abs(p.top * s - s - o) <= 25 ? v(a - 1, n, u) : (l.style.left = e.left * s - s + "px", l.style.top = e.top * s - s + "px"), l.onmouseup = null
                    }
                    l.ondragstart = () => !1
                }
            }, l.onmousedown = m
        }
        const a = document.createElement("div");
        a.classList.add("cell--empty"), n.append(a), a.style.left = p.left * s - s + "px", a.style.top = p.top * s - s + "px", a.style.width = s + "px", a.style.height = s + "px", u.push(p)
    }

    function v(e, l, n) {
        const a = n[e];
        if (Math.abs(a.left - p.left) + Math.abs(a.top - p.top) > 1) return a.element.style.left = a.left * s - s + "px", void(a.element.style.top = a.top * s - s + "px");
        a.element.style.left = p.left * s - s + "px", a.element.style.top = p.top * s - s + "px";
        let o = p.left,
            r = p.top;
        p.left = a.left, p.top = a.top, a.left = o, a.top = r, d = i(), n.every((e => 0 === e.value ? e.top === t && e.left === t : (e.top - 1) * t + e.left === e.value)) && Array.from(l.querySelector(".menu").querySelectorAll(".screen__menu")).forEach((e => {
            if ("win" === e.dataset.name) {
                e.querySelector("p") && e.querySelector("p").remove(), l.querySelector(".menu").classList.toggle("visible");
                let t = document.body.querySelector(".time").innerText,
                    s = document.body.querySelector(".moves").innerText,
                    n = document.createElement("p");
                n.classList.add("text"), n.innerHTML = `Congrats you win.<br> ${t}, ${s}`, n.style.width = "250px", e.prepend(n), "win" === e.dataset.name && e.classList.toggle("visible"), Array.from(l.querySelectorAll(".cell")).forEach((e => {
                    e.style.pointerEvents = "none", e.style.opacity = .5
                })), g.length > 9 ? (g.push({
                    moves: parseFloat(s.split("Moves: ")[1]) + 1,
                    time: t.split("Time: ")[1],
                    size: `${JSON.parse(localStorage.getItem("size"))}x${JSON.parse(localStorage.getItem("size"))}`
                }), g.sort(((e, t) => e.time <= t.time && e.moves <= t.moves || e.size >= t.size ? -1 : 1)), g.pop()) : (g.push({
                    moves: parseFloat(s.split("Moves: ")[1]) + 1,
                    time: t.split("Time: ")[1],
                    size: `${JSON.parse(localStorage.getItem("size"))}x${JSON.parse(localStorage.getItem("size"))}`
                }), g.sort(((e, t) => e.time <= t.time && e.moves <= t.moves || e.size >= t.size ? -1 : 1))), localStorage.setItem("score", JSON.stringify(g))
            }
        })), document.querySelector(".swipe__sound").play()
    }
    let f, b = JSON.parse(localStorage.getItem("save")) ? JSON.parse(localStorage.getItem("save")) : [],
        x = !1;
    ! function () {
        const t = document.createElement("div");
        t.classList.add("game__board"), document.body.prepend(t);
        const l = document.createElement("header"),
            s = document.createElement("div");
        s.classList.add("time"), l.append(s);
        const n = document.createElement("div");
        n.classList.add("moves"), l.append(n);
        const a = document.createElement("div");
        a.classList.add("pause"), a.innerText = "Pause game", l.append(a), document.body.prepend(l);
        const o = document.createElement("div");
        o.classList.add("menu"), o.innerHTML = '\n  <div class="screen__menu main" data-name="main">\n    <div class="message">\n      <p class="text">Do you want to</p>\n      <button class="btn" style="text-decoration: underline;" data-target="save">save your game?</button>\n    </div>\n    <button class="btn">New Game</button>\n    <button class="btn" data-target="saved">Saved Games</button>\n    <button class="btn" data-target="score">Best Score</button>\n    <button class="btn" data-target="rules">Rules</button>\n    <button class="btn" data-target="settings">Settings</button>\n  </div>\n  <div class="screen__menu save" data-name="saved">\n    <h2> Saved games: </h2>\n    <div class="save__properties">\n      <p class="text" style="width: 60px; text-align: center;">№</p>\n      <p class="text" style="width: 60px; text-align: center;">Moves</p>\n      <p class="text" style="width: 60px; text-align: center;">Time</p>\n      <p class="text" style="width: 60px; text-align: center;">Size</p>\n      <p class="text" style="width: 60px; text-align: center;">Load</p>\n    </div>\n    <div class="saved__list">\n    </div>\n    <button class="btn back" data-target="main">Back</button>\n  </div>\n  <div class="screen__menu score" data-name="score">\n    <h2> Best Score </h2>\n    <div class="score__properties">\n      <p class="text" style="width: 60px; text-align: center;">№</p>\n      <p class="text" style="width: 60px; text-align: center;">Moves</p>\n      <p class="text" style="width: 60px; text-align: center;">Time</p>\n      <p class="text" style="width: 60px; text-align: center;">Size</p>\n    </div>\n    <div class="best__scores">\n    </div>\n    <button class="btn back" data-target="main">Back</button>\n  </div>\n    <div class="screen__menu rules" data-name="rules">\n    <h2 class="title">Rules: </h2>\n    <p class="description">The object of the puzzle is to place the tiles in order by making sliding moves that use the empty space.<br><br>\n      You can save your game and load it later. Or you can just use pause button. Also you can choose game field size of color in Settings</p>\n    <button class="btn back" data-target="main">Back</button>\n  </div>\n  <div class="screen__menu settings" data-name="settings">\n    <h2 class="title">Settings: </h2>\n    <label class="text">Field size:</label>\n    <select class="select__size">\n      <option value="3" class="option">3x3</option>\n      <option value="4" class="option">4x4</option>\n      <option value="5" class="option">5x5</option>\n      <option value="6" class="option">6x6</option>\n      <option value="7" class="option">7x7</option>\n      <option value="8" class="option">8x8</option>\n    </select>\n    <button class="btn back" data-target="main">Back</button>\n  </div>\n  <div class="screen__menu win" data-name="win">\n    <button class="btn back" data-target="main">Back</button>\n  </div>', t.append(o), a.addEventListener("click", (() => {
            e = !e, a.innerText = e ? "Resume game" : "Pause game";
            let l = document.body.querySelector(".game__board").querySelector(".menu");
            l.classList.toggle("visible"), l.querySelector(".screen__menu").classList.toggle("visible"), Array.from(t.querySelectorAll(".cell")).forEach((t => {
                t.style.pointerEvents = e ? "none" : "all", t.style.opacity = e ? .5 : 1
            }))
        }));
        let r = document.createElement("button");
        r.classList.add("button", "to__images"), r.innerText = "Swap to images", document.body.prepend(r)
    }(),
    function a() {
        const c = document.querySelector(".menu"),
            m = c.querySelectorAll(".screen__menu");
        let g = Array.from(m);
        for (let m = 0; m < g.length; m++) {
            let h, L = g[m];
            switch (L.dataset.name) {
                case "main":
                    h = Array.from(L.querySelectorAll(".btn"));
                    for (let m = 0; m < h.length; m++) {
                        let L = h[m];
                        switch (L.dataset.target) {
                            case "saved":
                                c.querySelector(".save").querySelector(".saved__list");
                                let m = JSON.parse(localStorage.getItem("save"));

                                function S(e) {
                                    x = !0;
                                    let l = m[e.target.dataset.index],
                                        n = document.querySelector(".game__board");
                                    n.innerHTML = l.field, localStorage.setItem("size", l.fieldSize), t = localStorage.getItem("size"), document.body.querySelector(".time").innerHTML = `Time: ${l.time.min}:${l.time.sec}`, document.body.querySelector(".moves").innerHTML = "Moves: " + l.moves;
                                    let o = l.cells,
                                        r = Array.from(n.querySelectorAll(".cell")),
                                        i = n.querySelector(".cell--empty");
                                    f = l.index, a(), o.forEach((e => {
                                        r.forEach((t => {
                                            parseFloat(t.innerText) === e.value && (e.element = t)
                                        })), 0 === e.value && (i.style.left = e.left * s - s + "px", i.style.top = e.top * s - s + "px", p.left = e.left, p.top = e.top)
                                    })), r.forEach((e => e.onmousedown = t => {
                                        let l = Date.now(),
                                            a = t.clientX - e.getBoundingClientRect().left,
                                            r = t.clientY - e.getBoundingClientRect().top;
                                        e.style.transition = "none", e.style.zIndex = 1e3;
                                        const i = e.previousElementSibling;

                                        function c(t, l) {
                                            e.style.left = t - a + "px", e.style.top = l - r + "px"
                                        }

                                        function m(e) {
                                            c(e.pageX, e.pageY)
                                        }
                                        document.body.append(e), c(t.pageX, t.pageY), document.addEventListener("mousemove", m), e.onmouseup = () => {
                                            let t;
                                            o.forEach((l => {
                                                l.value === parseFloat(e.innerText) && (t = l)
                                            }));
                                            let a = Date.now() - l;
                                            if (e.style.zIndex = 1, a < 200) t.element.style.transition = "all 0.3s", t.element.style.left = t.left * s - s + "px", t.element.style.top = t.top * s - s + "px", i.after(e), v(o.indexOf(t), n, o), document.removeEventListener("mousemove", m);
                                            else {
                                                document.removeEventListener("mousemove", m);
                                                let l = Math.abs(n.offsetLeft - parseFloat(e.style.left.split("px"))),
                                                    a = Math.abs(n.offsetTop - parseFloat(e.style.top.split("px")));
                                                i.after(e), Math.abs(p.left * s - s - l) <= 25 && Math.abs(p.top * s - s - a) <= 25 ? v(o.indexOf(t), n, o) : (e.style.left = t.left * s - s + "px", e.style.top = t.top * s - s + "px"), e.onmouseup = null
                                            }
                                            e.ondragstart = () => !1
                                        }
                                    }))
                                }
                                L.addEventListener("click", (() => {
                                    g.forEach((e => {
                                        "main" === e.dataset.name && e.classList.toggle("visible"), "saved" === e.dataset.name && e.classList.toggle("visible")
                                    }));
                                    let e = c.querySelector(".save").querySelector(".saved__list"),
                                        t = JSON.parse(localStorage.getItem("save"));
                                    if (t.length) {
                                        let l = Array.from(e.querySelectorAll(".save__item")).length;
                                        for (let t = 0; t < l; t++) e.querySelector(".save__item").remove();
                                        for (let l = 0; l < t.length; l++) {
                                            let s = document.createElement("div");
                                            s.classList.add("save__item", "number--" + (l + 1));
                                            let n = document.createElement("p");
                                            n.innerHTML = "" + (t[l].index + 1), n.style.width = "70px", n.style.textAlign = "center", s.append(n), n = document.createElement("p"), n.innerHTML = "" + t[l].moves, n.style.width = "70px", n.style.textAlign = "center", s.append(n), n = document.createElement("p"), n.innerHTML = `${t[l].time.min}:${t[l].time.sec}`, n.style.width = "70px", n.style.textAlign = "center", s.append(n), n = document.createElement("p"), n.style.width = "70px", n.style.textAlign = "center", n.innerHTML = "" + t[l].fieldSize, s.append(n);
                                            let a = document.createElement("button");
                                            a.classList.add("butt"), a.innerText = "Load", a.dataset.index = l, s.append(a), e.append(s)
                                        }
                                        if (e.querySelector(".save__item")) {
                                            let t = Array.from(e.querySelectorAll(".save__item"));
                                            t.forEach((e => e.querySelector(".butt").removeEventListener("click", S))), t.forEach((e => e.querySelector(".butt").addEventListener("click", S)))
                                        }
                                    }
                                }));
                                break;
                            case "save":
                                L.addEventListener("click", (() => {
                                    let e = document.querySelector(".game__board").innerHTML;
                                    b.push({
                                        index: b.length,
                                        field: e,
                                        fieldSize: t,
                                        time: {
                                            min: document.querySelector(".time").innerText.split("Time: ")[1].split(":")[0],
                                            sec: document.querySelector(".time").innerText.split("Time: ")[1].split(":")[1]
                                        },
                                        moves: d,
                                        cells: u
                                    }), localStorage.setItem("save", JSON.stringify(b))
                                }));
                                break;
                            case "score":
                                L.addEventListener("click", (() => {
                                    g.forEach((e => {
                                        "main" === e.dataset.name && e.classList.toggle("visible"), "score" === e.dataset.name && e.classList.toggle("visible")
                                    }));
                                    let e = JSON.parse(localStorage.getItem("score"));
                                    e.sort(((e, t) => e.time <= t.time && e.moves <= t.moves || e.size > t.size ? -1 : 1)), localStorage.setItem("score", JSON.stringify(e));
                                    let t = c.querySelector(".score").querySelector(".best__scores");
                                    if (e.length) {
                                        let l = Array.from(t.querySelectorAll(".score__item")).length;
                                        for (let e = 0; e < l; e++) t.querySelector(".score__item").remove();
                                        for (let t = 0; t < e.length && t <= 10; t++) {
                                            let l = document.createElement("div");
                                            l.classList.add("score__item", "" + (t + 1));
                                            let s = document.createElement("p");
                                            s.innerHTML = "" + (t + 1), s.style.width = "60px", s.style.textAlign = "center", l.append(s), s = document.createElement("p"), s.innerHTML = "" + e[t].moves, s.style.width = "60px", s.style.textAlign = "center", l.append(s), s = document.createElement("p"), s.innerHTML = "" + e[t].time, s.style.width = "60px", s.style.textAlign = "center", l.append(s), s = document.createElement("p"), s.style.width = "60px", s.style.textAlign = "center", s.innerHTML = "" + e[t].size, l.append(s), document.querySelector(".game__board").querySelector(".menu").querySelector(".score").querySelector(".best__scores").append(l)
                                        }
                                    }
                                }));
                                break;
                            case "rules":
                                L.addEventListener("click", (() => {
                                    g.forEach((e => {
                                        "main" === e.dataset.name && e.classList.toggle("visible"), "rules" === e.dataset.name && e.classList.toggle("visible")
                                    }))
                                }));
                                break;
                            case "settings":
                                L.addEventListener("click", (() => {
                                    g.forEach((e => {
                                        "main" === e.dataset.name && e.classList.toggle("visible"), "settings" === e.dataset.name && e.classList.toggle("visible")
                                    }))
                                }));
                                break;
                            default:
                                L.addEventListener("click", (() => {
                                    r(!0), d = i(!0);
                                    let t = document.querySelector(".game__board");
                                    for (let e = 0; e < l - 1; e++) t.querySelector(".cell").remove();
                                    t.querySelector(".cell--empty").remove(), o(), g.forEach((e => {
                                        "main" === e.dataset.name && e.classList.toggle("visible")
                                    })), t.querySelector(".menu").classList.toggle("visible"), y(n(), t), Array.from(t.querySelectorAll(".cell")).forEach((e => e.style.opacity = 1)), document.body.querySelector(".pause").innerText = "Pause game", e = !1
                                }))
                        }
                    }
                    break;
                case "saved":
                    h = Array.from(L.querySelectorAll(".btn"));
                    for (let e = 0; e < h.length; e++) {
                        let t = h[e];
                        "main" === t.dataset.target && t.addEventListener("click", (() => {
                            g.forEach((e => {
                                "main" === e.dataset.name && e.classList.toggle("visible"), "saved" === e.dataset.name && e.classList.toggle("visible")
                            }))
                        }))
                    }
                    break;
                case "score":
                    h = Array.from(L.querySelectorAll(".btn"));
                    for (let e = 0; e < h.length; e++) {
                        let t = h[e];
                        "main" === t.dataset.target && t.addEventListener("click", (() => {
                            g.forEach((e => {
                                "main" === e.dataset.name && e.classList.toggle("visible"), "score" === e.dataset.name && e.classList.toggle("visible")
                            }))
                        }))
                    }
                    break;
                case "rules":
                    h = Array.from(L.querySelectorAll(".btn"));
                    for (let e = 0; e < h.length; e++) {
                        let t = h[e];
                        "main" === t.dataset.target && t.addEventListener("click", (() => {
                            g.forEach((e => {
                                "main" === e.dataset.name && e.classList.toggle("visible"), "rules" === e.dataset.name && e.classList.toggle("visible")
                            }))
                        }))
                    }
                    break;
                case "settings":
                    let E = L.querySelector("select");
                    localStorage.getItem("size") && Array.from(E).forEach((e => {
                        e.value === JSON.parse(localStorage.getItem("size")) && E[m].setAttribute("selected", "")
                    })), E.onchange = function () {
                        for (let e = 0; e < E.length; e++) E[e].getAttribute("selected") && E[e].removeAttribute("selected"), E[e].selected && (E[e].setAttribute("selected", ""), localStorage.setItem("size", E[e].value), t = E[e].value)
                    }, h = Array.from(L.querySelectorAll(".btn"));
                    for (let e = 0; e < h.length; e++) {
                        let t = h[e];
                        "main" === t.dataset.target && t.addEventListener("click", (() => {
                            g.forEach((e => {
                                "main" === e.dataset.name && e.classList.toggle("visible"), "settings" === e.dataset.name && e.classList.toggle("visible")
                            }))
                        }))
                    }
                    break;
                case "win":
                    L.querySelector(".btn").addEventListener("click", (() => {
                        g.forEach((e => {
                            "main" === e.dataset.name && e.classList.toggle("visible"), "win" === e.dataset.name && e.classList.toggle("visible")
                        }))
                    }))
            }
        }
    }();
    let S = document.querySelector(".game__board");
    o(), y(c, S);
    const h = document.querySelector(".time"),
        L = document.querySelector(".moves");
    let E = {
        min: 0,
        sec: 0
    };

    function _(e, n) {
        if (0 !== u.length)
            for (p = {
                    top: t,
                    left: t,
                    value: 0
                }; 0 !== u.length;) u.pop();
        for (let a = 1; a < l; a++) {
            const l = document.createElement("canvas");
            let o;
            l.classList.add("cell"), l.setAttribute("width", Math.floor(s) - 3 + "px"), l.setAttribute("height", Math.floor(s) - 3 + "px"), n.append(l), o = e[a - 1] + 1, l.innerHTML = o;
            const r = a % t == 0 ? t : a % t,
                i = (a - r) / t + 1;
            u.push({
                left: r,
                top: i,
                element: l,
                value: o
            }), l.style.left = r * s - s + "px", l.style.top = i * s - s + "px";
            let c = function (e) {
                let t = Date.now(),
                    o = e.clientX - l.getBoundingClientRect().left,
                    r = e.clientY - l.getBoundingClientRect().top;
                l.style.transition = "none", l.style.zIndex = 1e3;
                const i = l.previousElementSibling;

                function c(e, t) {
                    l.style.left = e - o + "px", l.style.top = t - r + "px"
                }

                function m(e) {
                    c(e.pageX, e.pageY)
                }
                document.body.append(l), c(e.pageX, e.pageY), document.addEventListener("mousemove", m), l.onmouseup = () => {
                    let e;
                    u.forEach((t => {
                        t.value === parseFloat(l.innerHTML) && (e = t)
                    }));
                    let o = Date.now() - t;
                    if (l.style.zIndex = 1, o < 200) e.element.style.transition = "all 0.3s", e.element.style.left = e.left * s - s + "px", e.element.style.top = e.top * s - s + "px", i.after(l), v(a - 1, n, u), document.removeEventListener("mousemove", m);
                    else {
                        document.removeEventListener("mousemove", m);
                        let t = Math.abs(n.offsetLeft - parseFloat(l.style.left.split("px"))),
                            o = Math.abs(n.offsetTop - parseFloat(l.style.top.split("px")));
                        i.after(l), Math.abs(p.left * s - s - t) <= 25 && Math.abs(p.top * s - s - o) <= 25 ? v(a - 1, n, u) : (l.style.left = e.left * s - s + "px", l.style.top = e.top * s - s + "px"), l.onmouseup = null
                    }
                    l.ondragstart = () => !1
                }
            };
            l.onmousedown = c
        }
        const a = document.createElement("div");
        return a.classList.add("cell--empty"), n.append(a), a.style.left = p.left * s - s + "px", a.style.top = p.top * s - s + "px", a.style.width = s + "px", a.style.height = s + "px", u.push(p), u
    }! function t() {
        x && (x = !1, d = JSON.parse(localStorage.getItem("save"))[f].moves), E = e ? E : r(), L.innerHTML = "Moves: " + d, h.innerHTML = `Time: ${E.min} : ${E.sec}`, setTimeout(t, 1e3)
    }(), document.querySelector(".to__images").addEventListener("click", (function () {
        let e = document.querySelector(".game__board");
        r(!0), d = i(!0);
        for (let t = 0; t < l - 1; t++) e.querySelector(".cell").remove();
        e.querySelector(".cell--empty").remove(), o();
        let a = _(n(), e);
        const c = new Image;
        let m;
        c.src = "../assets/gem_pick.jpg", c.onload = function () {
            for (let e = 0; e < a.length - 1; e++) {
                m = a[e].element.getContext("2d");
                const l = a[e].value % t == 0 ? t : a[e].value % t,
                    n = (a[e].value - l) / t + 1;
                let o = l * s - s,
                    r = n * s - s;
                m.drawImage(c, o, r, s, s, 0, 0, s, s), m.font = "40px Arial", m.fillStyle = "white", m.fillText("" + a[e].value, 10, 33), m.font = "42px Arial", m.strokeText("" + a[e].value, 10, 33)
            }
        }
    }))
})();