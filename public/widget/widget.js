var _e, y, Je, z, He, Ve, de, ve, fe, pe, X = {}, Ge = [], mt = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, we = Array.isArray;
function U(e, t) {
  for (var n in t) e[n] = t[n];
  return e;
}
function Qe(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
function gt(e, t, n) {
  var r, i, s, f = {};
  for (s in t) s == "key" ? r = t[s] : s == "ref" ? i = t[s] : f[s] = t[s];
  if (arguments.length > 2 && (f.children = arguments.length > 3 ? _e.call(arguments, 2) : n), typeof e == "function" && e.defaultProps != null) for (s in e.defaultProps) f[s] === void 0 && (f[s] = e.defaultProps[s]);
  return te(e, f, r, i, null);
}
function te(e, t, n, r, i) {
  var s = { type: e, props: t, key: n, ref: r, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: i ?? ++Je, __i: -1, __u: 0 };
  return i == null && y.vnode != null && y.vnode(s), s;
}
function se(e) {
  return e.children;
}
function ne(e, t) {
  this.props = e, this.context = t;
}
function G(e, t) {
  if (t == null) return e.__ ? G(e.__, e.__i + 1) : null;
  for (var n; t < e.__k.length; t++) if ((n = e.__k[t]) != null && n.__e != null) return n.__e;
  return typeof e.type == "function" ? G(e) : null;
}
function Xe(e) {
  var t, n;
  if ((e = e.__) != null && e.__c != null) {
    for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++) if ((n = e.__k[t]) != null && n.__e != null) {
      e.__e = e.__c.base = n.__e;
      break;
    }
    return Xe(e);
  }
}
function We(e) {
  (!e.__d && (e.__d = !0) && z.push(e) && !ie.__r++ || He !== y.debounceRendering) && ((He = y.debounceRendering) || Ve)(ie);
}
function ie() {
  var e, t, n, r, i, s, f, u;
  for (z.sort(de); e = z.shift(); ) e.__d && (t = z.length, r = void 0, s = (i = (n = e).__v).__e, f = [], u = [], n.__P && ((r = U({}, i)).__v = i.__v + 1, y.vnode && y.vnode(r), ye(n.__P, r, i, n.__n, n.__P.namespaceURI, 32 & i.__u ? [s] : null, f, s ?? G(i), !!(32 & i.__u), u), r.__v = i.__v, r.__.__k[r.__i] = r, et(f, r, u), r.__e != s && Xe(r)), z.length > t && z.sort(de));
  ie.__r = 0;
}
function Ye(e, t, n, r, i, s, f, u, p, d, m) {
  var o, b, h, $, H, E = r && r.__k || Ge, v = t.length;
  for (n.__d = p, bt(n, t, E), p = n.__d, o = 0; o < v; o++) (h = n.__k[o]) != null && (b = h.__i === -1 ? X : E[h.__i] || X, h.__i = o, ye(e, h, b, i, s, f, u, p, d, m), $ = h.__e, h.ref && b.ref != h.ref && (b.ref && ke(b.ref, null, h), m.push(h.ref, h.__c || $, h)), H == null && $ != null && (H = $), 65536 & h.__u || b.__k === h.__k ? p = Ze(h, p, e) : typeof h.type == "function" && h.__d !== void 0 ? p = h.__d : $ && (p = $.nextSibling), h.__d = void 0, h.__u &= -196609);
  n.__d = p, n.__e = H;
}
function bt(e, t, n) {
  var r, i, s, f, u, p = t.length, d = n.length, m = d, o = 0;
  for (e.__k = [], r = 0; r < p; r++) (i = t[r]) != null && typeof i != "boolean" && typeof i != "function" ? (f = r + o, (i = e.__k[r] = typeof i == "string" || typeof i == "number" || typeof i == "bigint" || i.constructor == String ? te(null, i, null, null, null) : we(i) ? te(se, { children: i }, null, null, null) : i.constructor === void 0 && i.__b > 0 ? te(i.type, i.props, i.key, i.ref ? i.ref : null, i.__v) : i).__ = e, i.__b = e.__b + 1, s = null, (u = i.__i = vt(i, n, f, m)) !== -1 && (m--, (s = n[u]) && (s.__u |= 131072)), s == null || s.__v === null ? (u == -1 && o--, typeof i.type != "function" && (i.__u |= 65536)) : u !== f && (u == f - 1 ? o-- : u == f + 1 ? o++ : (u > f ? o-- : o++, i.__u |= 65536))) : i = e.__k[r] = null;
  if (m) for (r = 0; r < d; r++) (s = n[r]) != null && !(131072 & s.__u) && (s.__e == e.__d && (e.__d = G(s)), tt(s, s));
}
function Ze(e, t, n) {
  var r, i;
  if (typeof e.type == "function") {
    for (r = e.__k, i = 0; r && i < r.length; i++) r[i] && (r[i].__ = e, t = Ze(r[i], t, n));
    return t;
  }
  e.__e != t && (t && e.type && !n.contains(t) && (t = G(e)), n.insertBefore(e.__e, t || null), t = e.__e);
  do
    t = t && t.nextSibling;
  while (t != null && t.nodeType === 8);
  return t;
}
function vt(e, t, n, r) {
  var i = e.key, s = e.type, f = n - 1, u = n + 1, p = t[n];
  if (p === null || p && i == p.key && s === p.type && !(131072 & p.__u)) return n;
  if (r > (p != null && !(131072 & p.__u) ? 1 : 0)) for (; f >= 0 || u < t.length; ) {
    if (f >= 0) {
      if ((p = t[f]) && !(131072 & p.__u) && i == p.key && s === p.type) return f;
      f--;
    }
    if (u < t.length) {
      if ((p = t[u]) && !(131072 & p.__u) && i == p.key && s === p.type) return u;
      u++;
    }
  }
  return -1;
}
function qe(e, t, n) {
  t[0] === "-" ? e.setProperty(t, n ?? "") : e[t] = n == null ? "" : typeof n != "number" || mt.test(t) ? n : n + "px";
}
function ee(e, t, n, r, i) {
  var s;
  e: if (t === "style") if (typeof n == "string") e.style.cssText = n;
  else {
    if (typeof r == "string" && (e.style.cssText = r = ""), r) for (t in r) n && t in n || qe(e.style, t, "");
    if (n) for (t in n) r && n[t] === r[t] || qe(e.style, t, n[t]);
  }
  else if (t[0] === "o" && t[1] === "n") s = t !== (t = t.replace(/(PointerCapture)$|Capture$/i, "$1")), t = t.toLowerCase() in e || t === "onFocusOut" || t === "onFocusIn" ? t.toLowerCase().slice(2) : t.slice(2), e.l || (e.l = {}), e.l[t + s] = n, n ? r ? n.u = r.u : (n.u = ve, e.addEventListener(t, s ? pe : fe, s)) : e.removeEventListener(t, s ? pe : fe, s);
  else {
    if (i == "http://www.w3.org/2000/svg") t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (t != "width" && t != "height" && t != "href" && t != "list" && t != "form" && t != "tabIndex" && t != "download" && t != "rowSpan" && t != "colSpan" && t != "role" && t != "popover" && t in e) try {
      e[t] = n ?? "";
      break e;
    } catch {
    }
    typeof n == "function" || (n == null || n === !1 && t[4] !== "-" ? e.removeAttribute(t) : e.setAttribute(t, t == "popover" && n == 1 ? "" : n));
  }
}
function Ne(e) {
  return function(t) {
    if (this.l) {
      var n = this.l[t.type + e];
      if (t.t == null) t.t = ve++;
      else if (t.t < n.u) return;
      return n(y.event ? y.event(t) : t);
    }
  };
}
function ye(e, t, n, r, i, s, f, u, p, d) {
  var m, o, b, h, $, H, E, v, g, A, N, K, q, j, J, B, W = t.type;
  if (t.constructor !== void 0) return null;
  128 & n.__u && (p = !!(32 & n.__u), s = [u = t.__e = n.__e]), (m = y.__b) && m(t);
  e: if (typeof W == "function") try {
    if (v = t.props, g = "prototype" in W && W.prototype.render, A = (m = W.contextType) && r[m.__c], N = m ? A ? A.props.value : m.__ : r, n.__c ? E = (o = t.__c = n.__c).__ = o.__E : (g ? t.__c = o = new W(v, N) : (t.__c = o = new ne(v, N), o.constructor = W, o.render = yt), A && A.sub(o), o.props = v, o.state || (o.state = {}), o.context = N, o.__n = r, b = o.__d = !0, o.__h = [], o._sb = []), g && o.__s == null && (o.__s = o.state), g && W.getDerivedStateFromProps != null && (o.__s == o.state && (o.__s = U({}, o.__s)), U(o.__s, W.getDerivedStateFromProps(v, o.__s))), h = o.props, $ = o.state, o.__v = t, b) g && W.getDerivedStateFromProps == null && o.componentWillMount != null && o.componentWillMount(), g && o.componentDidMount != null && o.__h.push(o.componentDidMount);
    else {
      if (g && W.getDerivedStateFromProps == null && v !== h && o.componentWillReceiveProps != null && o.componentWillReceiveProps(v, N), !o.__e && (o.shouldComponentUpdate != null && o.shouldComponentUpdate(v, o.__s, N) === !1 || t.__v === n.__v)) {
        for (t.__v !== n.__v && (o.props = v, o.state = o.__s, o.__d = !1), t.__e = n.__e, t.__k = n.__k, t.__k.some(function(V) {
          V && (V.__ = t);
        }), K = 0; K < o._sb.length; K++) o.__h.push(o._sb[K]);
        o._sb = [], o.__h.length && f.push(o);
        break e;
      }
      o.componentWillUpdate != null && o.componentWillUpdate(v, o.__s, N), g && o.componentDidUpdate != null && o.__h.push(function() {
        o.componentDidUpdate(h, $, H);
      });
    }
    if (o.context = N, o.props = v, o.__P = e, o.__e = !1, q = y.__r, j = 0, g) {
      for (o.state = o.__s, o.__d = !1, q && q(t), m = o.render(o.props, o.state, o.context), J = 0; J < o._sb.length; J++) o.__h.push(o._sb[J]);
      o._sb = [];
    } else do
      o.__d = !1, q && q(t), m = o.render(o.props, o.state, o.context), o.state = o.__s;
    while (o.__d && ++j < 25);
    o.state = o.__s, o.getChildContext != null && (r = U(U({}, r), o.getChildContext())), g && !b && o.getSnapshotBeforeUpdate != null && (H = o.getSnapshotBeforeUpdate(h, $)), Ye(e, we(B = m != null && m.type === se && m.key == null ? m.props.children : m) ? B : [B], t, n, r, i, s, f, u, p, d), o.base = t.__e, t.__u &= -161, o.__h.length && f.push(o), E && (o.__E = o.__ = null);
  } catch (V) {
    if (t.__v = null, p || s != null) {
      for (t.__u |= p ? 160 : 128; u && u.nodeType === 8 && u.nextSibling; ) u = u.nextSibling;
      s[s.indexOf(u)] = null, t.__e = u;
    } else t.__e = n.__e, t.__k = n.__k;
    y.__e(V, t, n);
  }
  else s == null && t.__v === n.__v ? (t.__k = n.__k, t.__e = n.__e) : t.__e = wt(n.__e, t, n, r, i, s, f, p, d);
  (m = y.diffed) && m(t);
}
function et(e, t, n) {
  t.__d = void 0;
  for (var r = 0; r < n.length; r++) ke(n[r], n[++r], n[++r]);
  y.__c && y.__c(t, e), e.some(function(i) {
    try {
      e = i.__h, i.__h = [], e.some(function(s) {
        s.call(i);
      });
    } catch (s) {
      y.__e(s, i.__v);
    }
  });
}
function wt(e, t, n, r, i, s, f, u, p) {
  var d, m, o, b, h, $, H, E = n.props, v = t.props, g = t.type;
  if (g === "svg" ? i = "http://www.w3.org/2000/svg" : g === "math" ? i = "http://www.w3.org/1998/Math/MathML" : i || (i = "http://www.w3.org/1999/xhtml"), s != null) {
    for (d = 0; d < s.length; d++) if ((h = s[d]) && "setAttribute" in h == !!g && (g ? h.localName === g : h.nodeType === 3)) {
      e = h, s[d] = null;
      break;
    }
  }
  if (e == null) {
    if (g === null) return document.createTextNode(v);
    e = document.createElementNS(i, g, v.is && v), u && (y.__m && y.__m(t, s), u = !1), s = null;
  }
  if (g === null) E === v || u && e.data === v || (e.data = v);
  else {
    if (s = s && _e.call(e.childNodes), E = n.props || X, !u && s != null) for (E = {}, d = 0; d < e.attributes.length; d++) E[(h = e.attributes[d]).name] = h.value;
    for (d in E) if (h = E[d], d != "children") {
      if (d == "dangerouslySetInnerHTML") o = h;
      else if (!(d in v)) {
        if (d == "value" && "defaultValue" in v || d == "checked" && "defaultChecked" in v) continue;
        ee(e, d, null, h, i);
      }
    }
    for (d in v) h = v[d], d == "children" ? b = h : d == "dangerouslySetInnerHTML" ? m = h : d == "value" ? $ = h : d == "checked" ? H = h : u && typeof h != "function" || E[d] === h || ee(e, d, h, E[d], i);
    if (m) u || o && (m.__html === o.__html || m.__html === e.innerHTML) || (e.innerHTML = m.__html), t.__k = [];
    else if (o && (e.innerHTML = ""), Ye(e, we(b) ? b : [b], t, n, r, g === "foreignObject" ? "http://www.w3.org/1999/xhtml" : i, s, f, s ? s[0] : n.__k && G(n, 0), u, p), s != null) for (d = s.length; d--; ) Qe(s[d]);
    u || (d = "value", g === "progress" && $ == null ? e.removeAttribute("value") : $ !== void 0 && ($ !== e[d] || g === "progress" && !$ || g === "option" && $ !== E[d]) && ee(e, d, $, E[d], i), d = "checked", H !== void 0 && H !== e[d] && ee(e, d, H, E[d], i));
  }
  return e;
}
function ke(e, t, n) {
  try {
    if (typeof e == "function") {
      var r = typeof e.__u == "function";
      r && e.__u(), r && t == null || (e.__u = e(t));
    } else e.current = t;
  } catch (i) {
    y.__e(i, n);
  }
}
function tt(e, t, n) {
  var r, i;
  if (y.unmount && y.unmount(e), (r = e.ref) && (r.current && r.current !== e.__e || ke(r, null, t)), (r = e.__c) != null) {
    if (r.componentWillUnmount) try {
      r.componentWillUnmount();
    } catch (s) {
      y.__e(s, t);
    }
    r.base = r.__P = null;
  }
  if (r = e.__k) for (i = 0; i < r.length; i++) r[i] && tt(r[i], t, n || typeof e.type != "function");
  n || Qe(e.__e), e.__c = e.__ = e.__e = e.__d = void 0;
}
function yt(e, t, n) {
  return this.constructor(e, n);
}
function he(e, t, n) {
  var r, i, s, f;
  y.__ && y.__(e, t), i = (r = !1) ? null : t.__k, s = [], f = [], ye(t, e = t.__k = gt(se, null, [e]), i || X, X, t.namespaceURI, i ? null : t.firstChild ? _e.call(t.childNodes) : null, s, i ? i.__e : t.firstChild, r, f), et(s, e, f);
}
_e = Ge.slice, y = { __e: function(e, t, n, r) {
  for (var i, s, f; t = t.__; ) if ((i = t.__c) && !i.__) try {
    if ((s = i.constructor) && s.getDerivedStateFromError != null && (i.setState(s.getDerivedStateFromError(e)), f = i.__d), i.componentDidCatch != null && (i.componentDidCatch(e, r || {}), f = i.__d), f) return i.__E = i;
  } catch (u) {
    e = u;
  }
  throw e;
} }, Je = 0, ne.prototype.setState = function(e, t) {
  var n;
  n = this.__s != null && this.__s !== this.state ? this.__s : this.__s = U({}, this.state), typeof e == "function" && (e = e(U({}, n), this.props)), e && U(n, e), e != null && this.__v && (t && this._sb.push(t), We(this));
}, ne.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), We(this));
}, ne.prototype.render = se, z = [], Ve = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, de = function(e, t) {
  return e.__v.__b - t.__v.__b;
}, ie.__r = 0, ve = 0, fe = Ne(!1), pe = Ne(!0);
var kt = 0;
function l(e, t, n, r, i, s) {
  t || (t = {});
  var f, u, p = t;
  "ref" in t && (f = t.ref, delete t.ref);
  var d = { type: e, props: p, key: n, ref: f, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --kt, __i: -1, __u: 0, __source: i, __self: s };
  if (typeof e == "function" && (f = e.defaultProps)) for (u in f) p[u] === void 0 && (p[u] = f[u]);
  return y.vnode && y.vnode(d), d;
}
var oe, x, ae, Me, me = 0, nt = [], F = y, Le = F.__b, Ue = F.__r, Re = F.diffed, Be = F.__c, Oe = F.unmount, De = F.__;
function rt(e, t) {
  F.__h && F.__h(x, e, me || t), me = 0;
  var n = x.__H || (x.__H = { __: [], __h: [] });
  return e >= n.__.length && n.__.push({}), n.__[e];
}
function M(e) {
  return me = 1, Ct(it, e);
}
function Ct(e, t, n) {
  var r = rt(oe++, 2);
  if (r.t = e, !r.__c && (r.__ = [it(void 0, t), function(u) {
    var p = r.__N ? r.__N[0] : r.__[0], d = r.t(p, u);
    p !== d && (r.__N = [d, r.__[1]], r.__c.setState({}));
  }], r.__c = x, !x.u)) {
    var i = function(u, p, d) {
      if (!r.__c.__H) return !0;
      var m = r.__c.__H.__.filter(function(b) {
        return !!b.__c;
      });
      if (m.every(function(b) {
        return !b.__N;
      })) return !s || s.call(this, u, p, d);
      var o = !1;
      return m.forEach(function(b) {
        if (b.__N) {
          var h = b.__[0];
          b.__ = b.__N, b.__N = void 0, h !== b.__[0] && (o = !0);
        }
      }), !(!o && r.__c.props === u) && (!s || s.call(this, u, p, d));
    };
    x.u = !0;
    var s = x.shouldComponentUpdate, f = x.componentWillUpdate;
    x.componentWillUpdate = function(u, p, d) {
      if (this.__e) {
        var m = s;
        s = void 0, i(u, p, d), s = m;
      }
      f && f.call(this, u, p, d);
    }, x.shouldComponentUpdate = i;
  }
  return r.__N || r.__;
}
function ue(e, t) {
  var n = rt(oe++, 3);
  !F.__s && Tt(n.__H, t) && (n.__ = e, n.i = t, x.__H.__h.push(n));
}
function St() {
  for (var e; e = nt.shift(); ) if (e.__P && e.__H) try {
    e.__H.__h.forEach(re), e.__H.__h.forEach(ge), e.__H.__h = [];
  } catch (t) {
    e.__H.__h = [], F.__e(t, e.__v);
  }
}
F.__b = function(e) {
  x = null, Le && Le(e);
}, F.__ = function(e, t) {
  e && t.__k && t.__k.__m && (e.__m = t.__k.__m), De && De(e, t);
}, F.__r = function(e) {
  Ue && Ue(e), oe = 0;
  var t = (x = e.__c).__H;
  t && (ae === x ? (t.__h = [], x.__h = [], t.__.forEach(function(n) {
    n.__N && (n.__ = n.__N), n.i = n.__N = void 0;
  })) : (t.__h.forEach(re), t.__h.forEach(ge), t.__h = [], oe = 0)), ae = x;
}, F.diffed = function(e) {
  Re && Re(e);
  var t = e.__c;
  t && t.__H && (t.__H.__h.length && (nt.push(t) !== 1 && Me === F.requestAnimationFrame || ((Me = F.requestAnimationFrame) || $t)(St)), t.__H.__.forEach(function(n) {
    n.i && (n.__H = n.i), n.i = void 0;
  })), ae = x = null;
}, F.__c = function(e, t) {
  t.some(function(n) {
    try {
      n.__h.forEach(re), n.__h = n.__h.filter(function(r) {
        return !r.__ || ge(r);
      });
    } catch (r) {
      t.some(function(i) {
        i.__h && (i.__h = []);
      }), t = [], F.__e(r, n.__v);
    }
  }), Be && Be(e, t);
}, F.unmount = function(e) {
  Oe && Oe(e);
  var t, n = e.__c;
  n && n.__H && (n.__H.__.forEach(function(r) {
    try {
      re(r);
    } catch (i) {
      t = i;
    }
  }), n.__H = void 0, t && F.__e(t, n.__v));
};
var ze = typeof requestAnimationFrame == "function";
function $t(e) {
  var t, n = function() {
    clearTimeout(r), ze && cancelAnimationFrame(t), setTimeout(e);
  }, r = setTimeout(n, 100);
  ze && (t = requestAnimationFrame(n));
}
function re(e) {
  var t = x, n = e.__c;
  typeof n == "function" && (e.__c = void 0, n()), x = t;
}
function ge(e) {
  var t = x;
  e.__c = e.__(), x = t;
}
function Tt(e, t) {
  return !e || e.length !== t.length || t.some(function(n, r) {
    return n !== e[r];
  });
}
function it(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function ot({
  config: e,
  projectId: t,
  apiEndpoint: n,
  debug: r
}) {
  var Se, $e, Te, xe, Ee;
  const [i, s] = M(!1), [f, u] = M("rating"), [p, d] = M(!1), [m, o] = M(null), [b, h] = M([]), [$, H] = M(""), [E, v] = M(""), [g, A] = M({}), [N] = M(() => {
    const _ = localStorage.getItem("fw_session_id");
    if (_) return _;
    const a = "sess_" + Math.random().toString(36).substr(2, 12);
    return localStorage.setItem("fw_session_id", a), a;
  }), [K] = M(() => localStorage.getItem("fw_visited_before") === "true");
  ue(() => {
    var _;
    if ((_ = e.behavior) != null && _.auto_open) {
      const a = (e.behavior.delay_open || 0) * 1e3, w = setTimeout(() => {
        s(!0);
      }, a);
      return () => clearTimeout(w);
    }
  }, [e.behavior]), ue(() => {
    var _;
    if (((_ = e.behavior) == null ? void 0 : _.persistence) === "remember_user_info") {
      const a = localStorage.getItem("fw_user_info");
      if (a)
        try {
          A(JSON.parse(a));
        } catch {
        }
    }
  }, [e.behavior]), ue(() => {
    localStorage.setItem("fw_visited_before", "true");
  }, []);
  const q = m !== null && (($e = (Se = e.flow) == null ? void 0 : Se.feedback_step) != null && $e.logic_rules) ? e.flow.feedback_step.logic_rules.find((_) => (_.trigger_ratings || _.rating_group || []).includes(m)) : null, j = q ? {
    ...q,
    // Legacy: tags → New: tags_options
    tags_options: q.tags_options || q.tags || [],
    // Legacy: message_label → New: placeholder
    placeholder: q.placeholder || q.message_label || "Share your thoughts..."
  } : null, J = () => {
    var _;
    o(null), h([]), H(""), v(""), ((_ = e.behavior) == null ? void 0 : _.persistence) !== "remember_user_info" && A({}), u("rating");
  }, B = () => {
    s(!1), setTimeout(() => {
      J();
    }, 300);
  }, W = (_) => {
    var T, k, C, c;
    o(_);
    const a = ((k = (T = e.flow) == null ? void 0 : T.feedback_step) == null ? void 0 : k.enabled) !== !1, w = ((c = (C = e.flow) == null ? void 0 : C.demographics_step) == null ? void 0 : c.enabled) === !0;
    a ? u("feedback") : w ? u("demographics") : le(_);
  }, V = () => {
    var a, w;
    ((w = (a = e.flow) == null ? void 0 : a.demographics_step) == null ? void 0 : w.enabled) === !0 ? u("demographics") : le(m);
  }, Ce = () => {
    o(null), h([]), H(""), v(""), u("rating");
  }, _t = () => {
    var k, C, c, S, I, O, L, D, Q;
    if (typeof performance > "u") return {};
    const _ = window.performance, a = _.timing || ((C = (k = _.getEntriesByType) == null ? void 0 : k.call(_, "navigation")) == null ? void 0 : C[0]), T = (((c = _.getEntriesByType) == null ? void 0 : c.call(_, "layout-shift")) || []).reduce((Y, Z) => Y + (Z.value || 0), 0);
    return {
      lcp: (O = (I = (S = _.getEntriesByType) == null ? void 0 : S.call(_, "largest-contentful-paint")) == null ? void 0 : I[0]) == null ? void 0 : O.startTime,
      cls: T,
      fid: (Q = (D = (L = _.getEntriesByType) == null ? void 0 : L.call(_, "first-input")) == null ? void 0 : D[0]) == null ? void 0 : Q.processingStart,
      load_time: (a == null ? void 0 : a.loadEventEnd) - (a == null ? void 0 : a.navigationStart)
    };
  }, st = () => {
    const _ = navigator.userAgent;
    let a = "Unknown", w = "Unknown";
    _.includes("Android") ? a = "Android" : _.includes("iOS") ? a = "iOS" : _.includes("Windows") ? a = "Windows" : _.includes("Mac") ? a = "macOS" : _.includes("Linux") && (a = "Linux"), _.includes("Chrome") && !_.includes("Edg") ? w = "Chrome" : _.includes("Safari") && !_.includes("Chrome") ? w = "Safari" : _.includes("Firefox") ? w = "Firefox" : _.includes("Edg") && (w = "Edge");
    const T = window.innerWidth;
    let k = "desktop";
    T < 768 ? k = "mobile" : T < 1024 && (k = "tablet");
    const C = navigator.connection, c = (C == null ? void 0 : C.effectiveType) || "unknown";
    return {
      device_type: k,
      os: a,
      browser: w,
      screen_res: `${window.screen.width}x${window.screen.height}`,
      connection: c,
      user_agent: _
    };
  }, le = async (_) => {
    var a, w, T, k, C;
    d(!0);
    try {
      const c = {
        project_id: t,
        rating: _,
        answers: {
          tags: b.length > 0 ? b : void 0,
          comment: $.trim() || void 0,
          email: j != null && j.collect_email && E.trim() || void 0,
          user_info: (w = (a = e.flow) == null ? void 0 : a.demographics_step) != null && w.enabled ? { ...g } : void 0
        },
        meta: {
          page: {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer
          },
          tech: st(),
          performance: _t(),
          session_id: N,
          is_returning_visitor: K
        }
      };
      if (r && console.log("[FeedbackWidget] Submitting:", c), (await fetch(`${n}/api/v1/widget/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c)
      })).ok) {
        ((T = e.behavior) == null ? void 0 : T.persistence) === "remember_user_info" && Object.keys(g).length > 0 && localStorage.setItem("fw_user_info", JSON.stringify(g)), u("success");
        const I = (C = (k = e.flow) == null ? void 0 : k.success_step) == null ? void 0 : C.auto_close_seconds;
        I && I > 0 && setTimeout(() => {
          B();
        }, I * 1e3), r && console.log("[FeedbackWidget] Submitted successfully");
      } else
        throw new Error("Failed to submit feedback");
    } catch (c) {
      console.error("[FeedbackWidget] Error:", c), alert("Gagal mengirim feedback. Silakan coba lagi.");
    } finally {
      d(!1);
    }
  }, lt = () => {
    var a;
    return `feedback-widget-container fw-position-${((a = e.theme) == null ? void 0 : a.position) || "bottom_right"}`;
  }, ct = () => {
    var a;
    return `fw-trigger fw-btn-${((a = e.theme) == null ? void 0 : a.button_style) || "pill"}`;
  }, at = () => {
    var w, T, k, C;
    const _ = ((T = (w = e.flow) == null ? void 0 : w.rating_step) == null ? void 0 : T.type) || "emoji", a = ((C = (k = e.flow) == null ? void 0 : k.rating_step) == null ? void 0 : C.scale) || 5;
    return _ === "emoji" ? (a === 3 ? ["😢", "😐", "😃"] : a === 4 ? ["😢", "😕", "🙂", "😃"] : ["😢", "😕", "😐", "🙂", "😃"]).map((S, I) => /* @__PURE__ */ l(
      "button",
      {
        class: "fw-rating-btn fw-emoji-btn",
        onClick: () => W(I + 1),
        "aria-label": `Rate ${I + 1}`,
        children: S
      },
      I
    )) : _ === "star" ? Array.from({ length: a }, (c, S) => S + 1).map((c) => /* @__PURE__ */ l(
      "button",
      {
        class: "fw-rating-btn fw-star-btn",
        onClick: () => W(c),
        "aria-label": `Rate ${c} stars`,
        children: /* @__PURE__ */ l("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ l("path", { d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" }) })
      },
      c
    )) : Array.from({ length: a }, (c, S) => S + 1).map((c) => /* @__PURE__ */ l(
      "button",
      {
        class: "fw-rating-btn fw-number-btn",
        onClick: () => W(c),
        "aria-label": `Rate ${c}`,
        children: c
      },
      c
    ));
  }, ut = () => {
    var w, T, k, C;
    const _ = ((T = (w = e.flow) == null ? void 0 : w.rating_step) == null ? void 0 : T.type) || "emoji", a = ((C = (k = e.flow) == null ? void 0 : k.rating_step) == null ? void 0 : C.scale) || 5;
    return _ === "emoji" ? (a === 3 ? ["😢", "😐", "😃"] : a === 4 ? ["😢", "😕", "🙂", "😃"] : ["😢", "😕", "😐", "🙂", "😃"]).map((S, I) => /* @__PURE__ */ l(
      "span",
      {
        class: `fw-rating-display fw-emoji-display ${I + 1 <= (m || 0) ? "fw-active" : ""}`,
        children: S
      },
      I
    )) : _ === "star" ? Array.from({ length: a }, (c, S) => S + 1).map((c) => /* @__PURE__ */ l(
      "span",
      {
        class: `fw-rating-display fw-star-display ${c <= (m || 0) ? "fw-active" : ""}`,
        children: /* @__PURE__ */ l("svg", { width: "16", height: "16", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ l("path", { d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" }) })
      },
      c
    )) : Array.from({ length: a }, (c, S) => S + 1).map((c) => /* @__PURE__ */ l(
      "span",
      {
        class: `fw-rating-display fw-number-display ${c <= (m || 0) ? "fw-active" : ""}`,
        children: c
      },
      c
    ));
  }, dt = () => {
    var a;
    const _ = (a = e.theme) == null ? void 0 : a.trigger_icon;
    return _ && _.startsWith("http") ? /* @__PURE__ */ l("img", { src: _, alt: "", class: "fw-trigger-icon-img" }) : /* @__PURE__ */ l("span", { class: "fw-trigger-icon-emoji", children: "💬" });
  }, ft = (_) => {
    var w, T, k, C;
    const a = g[_.key] || "";
    return _.type === "select" ? /* @__PURE__ */ l("div", { class: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { class: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l(
        "select",
        {
          class: "fw-select",
          required: _.required,
          onChange: (c) => A({
            ...g,
            [_.key]: c.target.value
          }),
          children: [
            /* @__PURE__ */ l("option", { value: "", children: "Pilih..." }),
            (w = _.options) == null ? void 0 : w.map((c) => /* @__PURE__ */ l("option", { value: c, selected: a === c, children: c }, c))
          ]
        }
      )
    ] }) : _.type === "radio_group" ? /* @__PURE__ */ l("div", { class: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { class: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l("div", { class: "fw-radio-group", children: (T = _.options) == null ? void 0 : T.map((c, S) => /* @__PURE__ */ l(
        "label",
        {
          class: `fw-radio-option ${a === c ? "fw-active" : ""}`,
          children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "radio",
                name: _.key,
                value: c,
                checked: a === c,
                onChange: () => A({ ...g, [_.key]: c })
              }
            ),
            /* @__PURE__ */ l("span", { children: c })
          ]
        },
        `${_.key}-${S}`
      )) })
    ] }) : _.type === "chips" ? /* @__PURE__ */ l("div", { class: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { class: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l("div", { class: "fw-chips", children: (k = _.options) == null ? void 0 : k.map((c, S) => /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          class: `fw-chip ${a === c ? "fw-active" : ""}`,
          onClick: () => A({ ...g, [_.key]: c }),
          children: c
        },
        `${_.key}-${S}`
      )) })
    ] }) : _.type === "checkbox" ? /* @__PURE__ */ l("div", { class: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { class: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l("div", { class: "fw-checkbox-group", children: (C = _.options) == null ? void 0 : C.map((c, S) => {
        const I = Array.isArray(a) ? a.includes(c) : !1;
        return /* @__PURE__ */ l("label", { class: "fw-checkbox-option", children: [
          /* @__PURE__ */ l(
            "input",
            {
              type: "checkbox",
              checked: I,
              onChange: (O) => {
                const L = Array.isArray(a) ? a : [];
                O.target.checked ? A({
                  ...g,
                  [_.key]: [...L, c]
                }) : A({
                  ...g,
                  [_.key]: L.filter((D) => D !== c)
                });
              }
            }
          ),
          /* @__PURE__ */ l("span", { children: c })
        ] }, `${_.key}-${S}`);
      }) })
    ] }) : _.type === "email" ? /* @__PURE__ */ l("div", { class: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { class: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "email",
          class: "fw-input",
          placeholder: _.placeholder || "",
          value: a,
          required: _.required,
          onInput: (c) => A({
            ...g,
            [_.key]: c.target.value
          })
        }
      )
    ] }) : _.type === "number" ? /* @__PURE__ */ l("div", { class: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { class: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "number",
          class: "fw-input",
          placeholder: _.placeholder || "",
          value: a,
          required: _.required,
          onInput: (c) => A({
            ...g,
            [_.key]: c.target.value
          })
        }
      )
    ] }) : /* @__PURE__ */ l("div", { class: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { class: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          class: "fw-input",
          placeholder: _.placeholder || "",
          value: a,
          required: _.required,
          onInput: (c) => A({
            ...g,
            [_.key]: c.target.value
          })
        }
      )
    ] });
  }, pt = () => {
    var _, a, w, T, k, C, c, S, I, O, L, D, Q, Y, Z, Fe, Ie, Ae, je, Pe;
    if (f === "rating")
      return /* @__PURE__ */ l("div", { class: "fw-screen fw-rating-screen", children: [
        /* @__PURE__ */ l("h4", { class: "fw-title", children: ((a = (_ = e.flow) == null ? void 0 : _.rating_step) == null ? void 0 : a.title) || "Rate your experience" }),
        /* @__PURE__ */ l("div", { class: "fw-rating-buttons", children: at() })
      ] });
    if (f === "feedback" && j) {
      const ce = j.allow_skip_comment || $.trim().length > 0 || b.length > 0;
      return /* @__PURE__ */ l("div", { class: "fw-screen fw-feedback-screen", children: [
        /* @__PURE__ */ l("div", { class: "fw-rating-display-container", children: ut() }),
        j.subtitle && /* @__PURE__ */ l("p", { class: "fw-subtitle", children: j.subtitle }),
        /* @__PURE__ */ l("h4", { class: "fw-title", children: j.title }),
        /* @__PURE__ */ l(
          "textarea",
          {
            class: "fw-textarea",
            placeholder: j.placeholder || "Share your thoughts...",
            value: $,
            onInput: (P) => H(P.target.value),
            rows: 3
          }
        ),
        j.tags_options && j.tags_options.length > 0 && /* @__PURE__ */ l("div", { class: "fw-tags", children: j.tags_options.map((P) => /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            class: `fw-tag-option ${b.includes(P) ? "fw-active" : ""}`,
            onClick: () => {
              b.includes(P) ? h(b.filter((ht) => ht !== P)) : h([...b, P]);
            },
            children: P
          },
          P
        )) }),
        j.collect_email && /* @__PURE__ */ l(
          "input",
          {
            type: "email",
            class: "fw-input",
            placeholder: "Email Anda (opsional)",
            value: E,
            onInput: (P) => v(P.target.value)
          }
        ),
        /* @__PURE__ */ l(
          "button",
          {
            class: "fw-submit-btn",
            disabled: p || !ce,
            onClick: V,
            children: p ? "Mengirim..." : "Lanjut"
          }
        ),
        /* @__PURE__ */ l("button", { class: "fw-back-btn", onClick: Ce, children: "Kembali" })
      ] });
    }
    if (f === "demographics") {
      const ce = (k = (T = (w = e.flow) == null ? void 0 : w.demographics_step) == null ? void 0 : T.fields) == null ? void 0 : k.every(
        (P) => P.required ? !!g[P.key] : !0
      );
      return /* @__PURE__ */ l("div", { class: "fw-screen fw-demographics-screen", children: [
        /* @__PURE__ */ l("h4", { class: "fw-title", children: (c = (C = e.flow) == null ? void 0 : C.demographics_step) == null ? void 0 : c.title }),
        ((I = (S = e.flow) == null ? void 0 : S.demographics_step) == null ? void 0 : I.subtitle) && /* @__PURE__ */ l("p", { class: "fw-subtitle", children: (O = e.flow) == null ? void 0 : O.demographics_step.subtitle }),
        /* @__PURE__ */ l("div", { class: "fw-fields", children: (Q = (D = (L = e.flow) == null ? void 0 : L.demographics_step) == null ? void 0 : D.fields) == null ? void 0 : Q.map((P) => /* @__PURE__ */ l("div", { children: ft(P) }, P.key)) }),
        /* @__PURE__ */ l(
          "button",
          {
            class: "fw-submit-btn",
            disabled: p || !ce,
            onClick: () => le(m),
            children: p ? "Mengirim..." : "Kirim"
          }
        ),
        /* @__PURE__ */ l("button", { class: "fw-back-btn", onClick: Ce, children: "Kembali" })
      ] });
    }
    return f === "success" ? /* @__PURE__ */ l("div", { class: "fw-screen fw-success-screen", children: [
      /* @__PURE__ */ l("div", { class: "fw-success-icon", children: "✓" }),
      /* @__PURE__ */ l("h4", { class: "fw-title", children: ((Z = (Y = e.flow) == null ? void 0 : Y.success_step) == null ? void 0 : Z.title) || "Terima Kasih!" }),
      /* @__PURE__ */ l("p", { class: "fw-description", children: ((Ie = (Fe = e.flow) == null ? void 0 : Fe.success_step) == null ? void 0 : Ie.message) || "Masukan Anda membantu kami menjadi lebih baik." }),
      ((je = (Ae = e.flow) == null ? void 0 : Ae.success_step) == null ? void 0 : je.show_cta) && /* @__PURE__ */ l(
        "a",
        {
          href: e.flow.success_step.cta_url || "#",
          target: "_blank",
          rel: "noopener noreferrer",
          class: "fw-cta-btn",
          children: ((Pe = e.flow) == null ? void 0 : Pe.success_step.cta_text) || "CTA"
        }
      ),
      /* @__PURE__ */ l("button", { class: "fw-close-btn", onClick: B, children: "Tutup" })
    ] }) : null;
  };
  return /* @__PURE__ */ l("div", { class: lt(), children: [
    !i && /* @__PURE__ */ l(
      "button",
      {
        class: ct(),
        onClick: () => s(!0),
        "aria-label": "Buka feedback",
        style: { backgroundColor: ((Te = e.theme) == null ? void 0 : Te.primary_color) || "#6366f1" },
        children: [
          dt(),
          /* @__PURE__ */ l("span", { children: ((xe = e.theme) == null ? void 0 : xe.trigger_label) || "Feedback" })
        ]
      }
    ),
    i && /* @__PURE__ */ l(
      "div",
      {
        class: "fw-modal",
        onClick: (_) => _.target === _.currentTarget && B(),
        children: /* @__PURE__ */ l("div", { class: "fw-modal-content", children: [
          pt(),
          ((Ee = e.behavior) == null ? void 0 : Ee.show_branding) !== !1 && /* @__PURE__ */ l("div", { class: "fw-branding", children: /* @__PURE__ */ l("span", { children: "Powered by FeedbackApp" }) })
        ] })
      }
    )
  ] });
}
let R = null, be = null;
async function xt(e, t) {
  try {
    const n = await fetch(
      `${t}/api/v1/widget/config?project_id=${e}`
    );
    if (n.ok)
      return await n.json() || {};
  } catch {
    console.warn("[FeedbackWidget] Could not fetch config, using defaults");
  }
  return {};
}
function Ke(e) {
  const t = e.apiEndpoint || "https://your-domain.com", n = e.debug || !1;
  n && console.log(
    "[FeedbackWidget] Initializing with projectId:",
    e.projectId
  );
  const r = document.createElement("div");
  r.id = "feedback-widget-root", document.body.appendChild(r), xt(e.projectId, t).then((i) => {
    be = i, R = {
      root: r,
      unmount: () => {
        he(null, r);
      }
    }, he(
      /* @__PURE__ */ l(
        ot,
        {
          config: i,
          projectId: e.projectId,
          apiEndpoint: t,
          debug: n
        }
      ),
      r
    ), n && console.log("[FeedbackWidget] Config loaded:", i);
  });
}
function Et() {
  R && (R.unmount(), R.root.remove(), R = null);
}
function Ft(e) {
  if (!R || !be) {
    console.warn("[FeedbackWidget] Widget not initialized. Call init() first.");
    return;
  }
  const t = R.root.getAttribute("data-project-id") || "";
  he(
    /* @__PURE__ */ l(
      ot,
      {
        config: { ...be, ...e },
        projectId: t,
        apiEndpoint: "",
        debug: !1
      }
    ),
    R.root
  );
}
if (typeof window < "u") {
  window.FeedbackWidget = {
    init: Ke,
    destroy: Et,
    updateConfig: Ft
  };
  const e = document.querySelector("script[data-feedback-widget]");
  if (e) {
    const t = e.getAttribute("data-project-id"), n = e.getAttribute("data-api-endpoint"), r = e.getAttribute("data-debug") === "true";
    t && Ke({
      projectId: t,
      apiEndpoint: n || void 0,
      debug: r || !1
    });
  }
}
export {
  ot as default,
  Et as destroy,
  Ke as init,
  Ft as updateConfig
};
