var _e, y, Je, z, Pe, Ve, de, ve, fe, pe, X = {}, Ge = [], mt = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, we = Array.isArray;
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
function He(e) {
  (!e.__d && (e.__d = !0) && z.push(e) && !ie.__r++ || Pe !== y.debounceRendering) && ((Pe = y.debounceRendering) || Ve)(ie);
}
function ie() {
  var e, t, n, r, i, s, f, u;
  for (z.sort(de); e = z.shift(); ) e.__d && (t = z.length, r = void 0, s = (i = (n = e).__v).__e, f = [], u = [], n.__P && ((r = U({}, i)).__v = i.__v + 1, y.vnode && y.vnode(r), ye(n.__P, r, i, n.__n, n.__P.namespaceURI, 32 & i.__u ? [s] : null, f, s ?? G(i), !!(32 & i.__u), u), r.__v = i.__v, r.__.__k[r.__i] = r, et(f, r, u), r.__e != s && Xe(r)), z.length > t && z.sort(de));
  ie.__r = 0;
}
function Ye(e, t, n, r, i, s, f, u, p, d, m) {
  var o, b, h, S, P, x = r && r.__k || Ge, v = t.length;
  for (n.__d = p, bt(n, t, x), p = n.__d, o = 0; o < v; o++) (h = n.__k[o]) != null && (b = h.__i === -1 ? X : x[h.__i] || X, h.__i = o, ye(e, h, b, i, s, f, u, p, d, m), S = h.__e, h.ref && b.ref != h.ref && (b.ref && ke(b.ref, null, h), m.push(h.ref, h.__c || S, h)), P == null && S != null && (P = S), 65536 & h.__u || b.__k === h.__k ? p = Ze(h, p, e) : typeof h.type == "function" && h.__d !== void 0 ? p = h.__d : S && (p = S.nextSibling), h.__d = void 0, h.__u &= -196609);
  n.__d = p, n.__e = P;
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
function We(e, t, n) {
  t[0] === "-" ? e.setProperty(t, n ?? "") : e[t] = n == null ? "" : typeof n != "number" || mt.test(t) ? n : n + "px";
}
function ee(e, t, n, r, i) {
  var s;
  e: if (t === "style") if (typeof n == "string") e.style.cssText = n;
  else {
    if (typeof r == "string" && (e.style.cssText = r = ""), r) for (t in r) n && t in n || We(e.style, t, "");
    if (n) for (t in n) r && n[t] === r[t] || We(e.style, t, n[t]);
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
function qe(e) {
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
  var m, o, b, h, S, P, x, v, g, I, q, K, W, A, J, B, H = t.type;
  if (t.constructor !== void 0) return null;
  128 & n.__u && (p = !!(32 & n.__u), s = [u = t.__e = n.__e]), (m = y.__b) && m(t);
  e: if (typeof H == "function") try {
    if (v = t.props, g = "prototype" in H && H.prototype.render, I = (m = H.contextType) && r[m.__c], q = m ? I ? I.props.value : m.__ : r, n.__c ? x = (o = t.__c = n.__c).__ = o.__E : (g ? t.__c = o = new H(v, q) : (t.__c = o = new ne(v, q), o.constructor = H, o.render = yt), I && I.sub(o), o.props = v, o.state || (o.state = {}), o.context = q, o.__n = r, b = o.__d = !0, o.__h = [], o._sb = []), g && o.__s == null && (o.__s = o.state), g && H.getDerivedStateFromProps != null && (o.__s == o.state && (o.__s = U({}, o.__s)), U(o.__s, H.getDerivedStateFromProps(v, o.__s))), h = o.props, S = o.state, o.__v = t, b) g && H.getDerivedStateFromProps == null && o.componentWillMount != null && o.componentWillMount(), g && o.componentDidMount != null && o.__h.push(o.componentDidMount);
    else {
      if (g && H.getDerivedStateFromProps == null && v !== h && o.componentWillReceiveProps != null && o.componentWillReceiveProps(v, q), !o.__e && (o.shouldComponentUpdate != null && o.shouldComponentUpdate(v, o.__s, q) === !1 || t.__v === n.__v)) {
        for (t.__v !== n.__v && (o.props = v, o.state = o.__s, o.__d = !1), t.__e = n.__e, t.__k = n.__k, t.__k.some(function(V) {
          V && (V.__ = t);
        }), K = 0; K < o._sb.length; K++) o.__h.push(o._sb[K]);
        o._sb = [], o.__h.length && f.push(o);
        break e;
      }
      o.componentWillUpdate != null && o.componentWillUpdate(v, o.__s, q), g && o.componentDidUpdate != null && o.__h.push(function() {
        o.componentDidUpdate(h, S, P);
      });
    }
    if (o.context = q, o.props = v, o.__P = e, o.__e = !1, W = y.__r, A = 0, g) {
      for (o.state = o.__s, o.__d = !1, W && W(t), m = o.render(o.props, o.state, o.context), J = 0; J < o._sb.length; J++) o.__h.push(o._sb[J]);
      o._sb = [];
    } else do
      o.__d = !1, W && W(t), m = o.render(o.props, o.state, o.context), o.state = o.__s;
    while (o.__d && ++A < 25);
    o.state = o.__s, o.getChildContext != null && (r = U(U({}, r), o.getChildContext())), g && !b && o.getSnapshotBeforeUpdate != null && (P = o.getSnapshotBeforeUpdate(h, S)), Ye(e, we(B = m != null && m.type === se && m.key == null ? m.props.children : m) ? B : [B], t, n, r, i, s, f, u, p, d), o.base = t.__e, t.__u &= -161, o.__h.length && f.push(o), x && (o.__E = o.__ = null);
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
  var d, m, o, b, h, S, P, x = n.props, v = t.props, g = t.type;
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
  if (g === null) x === v || u && e.data === v || (e.data = v);
  else {
    if (s = s && _e.call(e.childNodes), x = n.props || X, !u && s != null) for (x = {}, d = 0; d < e.attributes.length; d++) x[(h = e.attributes[d]).name] = h.value;
    for (d in x) if (h = x[d], d != "children") {
      if (d == "dangerouslySetInnerHTML") o = h;
      else if (!(d in v)) {
        if (d == "value" && "defaultValue" in v || d == "checked" && "defaultChecked" in v) continue;
        ee(e, d, null, h, i);
      }
    }
    for (d in v) h = v[d], d == "children" ? b = h : d == "dangerouslySetInnerHTML" ? m = h : d == "value" ? S = h : d == "checked" ? P = h : u && typeof h != "function" || x[d] === h || ee(e, d, h, x[d], i);
    if (m) u || o && (m.__html === o.__html || m.__html === e.innerHTML) || (e.innerHTML = m.__html), t.__k = [];
    else if (o && (e.innerHTML = ""), Ye(e, we(b) ? b : [b], t, n, r, g === "foreignObject" ? "http://www.w3.org/1999/xhtml" : i, s, f, s ? s[0] : n.__k && G(n, 0), u, p), s != null) for (d = s.length; d--; ) Qe(s[d]);
    u || (d = "value", g === "progress" && S == null ? e.removeAttribute("value") : S !== void 0 && (S !== e[d] || g === "progress" && !S || g === "option" && S !== x[d]) && ee(e, d, S, x[d], i), d = "checked", P !== void 0 && P !== e[d] && ee(e, d, P, x[d], i));
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
  n = this.__s != null && this.__s !== this.state ? this.__s : this.__s = U({}, this.state), typeof e == "function" && (e = e(U({}, n), this.props)), e && U(n, e), e != null && this.__v && (t && this._sb.push(t), He(this));
}, ne.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), He(this));
}, ne.prototype.render = se, z = [], Ve = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, de = function(e, t) {
  return e.__v.__b - t.__v.__b;
}, ie.__r = 0, ve = 0, fe = qe(!1), pe = qe(!0);
var kt = 0;
function l(e, t, n, r, i, s) {
  t || (t = {});
  var f, u, p = t;
  "ref" in t && (f = t.ref, delete t.ref);
  var d = { type: e, props: p, key: n, ref: f, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --kt, __i: -1, __u: 0, __source: i, __self: s };
  if (typeof e == "function" && (f = e.defaultProps)) for (u in f) p[u] === void 0 && (p[u] = f[u]);
  return y.vnode && y.vnode(d), d;
}
var oe, T, ce, Me, me = 0, nt = [], E = y, Le = E.__b, Ue = E.__r, Re = E.diffed, Be = E.__c, Oe = E.unmount, De = E.__;
function rt(e, t) {
  E.__h && E.__h(T, e, me || t), me = 0;
  var n = T.__H || (T.__H = { __: [], __h: [] });
  return e >= n.__.length && n.__.push({}), n.__[e];
}
function M(e) {
  return me = 1, Nt(it, e);
}
function Nt(e, t, n) {
  var r = rt(oe++, 2);
  if (r.t = e, !r.__c && (r.__ = [it(void 0, t), function(u) {
    var p = r.__N ? r.__N[0] : r.__[0], d = r.t(p, u);
    p !== d && (r.__N = [d, r.__[1]], r.__c.setState({}));
  }], r.__c = T, !T.u)) {
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
    T.u = !0;
    var s = T.shouldComponentUpdate, f = T.componentWillUpdate;
    T.componentWillUpdate = function(u, p, d) {
      if (this.__e) {
        var m = s;
        s = void 0, i(u, p, d), s = m;
      }
      f && f.call(this, u, p, d);
    }, T.shouldComponentUpdate = i;
  }
  return r.__N || r.__;
}
function ue(e, t) {
  var n = rt(oe++, 3);
  !E.__s && $t(n.__H, t) && (n.__ = e, n.i = t, T.__H.__h.push(n));
}
function Ct() {
  for (var e; e = nt.shift(); ) if (e.__P && e.__H) try {
    e.__H.__h.forEach(re), e.__H.__h.forEach(ge), e.__H.__h = [];
  } catch (t) {
    e.__H.__h = [], E.__e(t, e.__v);
  }
}
E.__b = function(e) {
  T = null, Le && Le(e);
}, E.__ = function(e, t) {
  e && t.__k && t.__k.__m && (e.__m = t.__k.__m), De && De(e, t);
}, E.__r = function(e) {
  Ue && Ue(e), oe = 0;
  var t = (T = e.__c).__H;
  t && (ce === T ? (t.__h = [], T.__h = [], t.__.forEach(function(n) {
    n.__N && (n.__ = n.__N), n.i = n.__N = void 0;
  })) : (t.__h.forEach(re), t.__h.forEach(ge), t.__h = [], oe = 0)), ce = T;
}, E.diffed = function(e) {
  Re && Re(e);
  var t = e.__c;
  t && t.__H && (t.__H.__h.length && (nt.push(t) !== 1 && Me === E.requestAnimationFrame || ((Me = E.requestAnimationFrame) || St)(Ct)), t.__H.__.forEach(function(n) {
    n.i && (n.__H = n.i), n.i = void 0;
  })), ce = T = null;
}, E.__c = function(e, t) {
  t.some(function(n) {
    try {
      n.__h.forEach(re), n.__h = n.__h.filter(function(r) {
        return !r.__ || ge(r);
      });
    } catch (r) {
      t.some(function(i) {
        i.__h && (i.__h = []);
      }), t = [], E.__e(r, n.__v);
    }
  }), Be && Be(e, t);
}, E.unmount = function(e) {
  Oe && Oe(e);
  var t, n = e.__c;
  n && n.__H && (n.__H.__.forEach(function(r) {
    try {
      re(r);
    } catch (i) {
      t = i;
    }
  }), n.__H = void 0, t && E.__e(t, n.__v));
};
var ze = typeof requestAnimationFrame == "function";
function St(e) {
  var t, n = function() {
    clearTimeout(r), ze && cancelAnimationFrame(t), setTimeout(e);
  }, r = setTimeout(n, 100);
  ze && (t = requestAnimationFrame(n));
}
function re(e) {
  var t = T, n = e.__c;
  typeof n == "function" && (e.__c = void 0, n()), T = t;
}
function ge(e) {
  var t = T;
  e.__c = e.__(), T = t;
}
function $t(e, t) {
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
  var Ce, Se, $e, Te, xe;
  const [i, s] = M(!1), [f, u] = M("rating"), [p, d] = M(!1), [m, o] = M(null), [b, h] = M([]), [S, P] = M(""), [x, v] = M(""), [g, I] = M({}), [q] = M(() => {
    const _ = localStorage.getItem("fw_session_id");
    if (_) return _;
    const c = "sess_" + Math.random().toString(36).substr(2, 12);
    return localStorage.setItem("fw_session_id", c), c;
  }), [K] = M(() => localStorage.getItem("fw_visited_before") === "true");
  ue(() => {
    var _;
    if ((_ = e.behavior) != null && _.auto_open) {
      const c = (e.behavior.delay_open || 0) * 1e3, w = setTimeout(() => {
        s(!0);
      }, c);
      return () => clearTimeout(w);
    }
  }, [e.behavior]), ue(() => {
    var _;
    if (((_ = e.behavior) == null ? void 0 : _.persistence) === "remember_user_info") {
      const c = localStorage.getItem("fw_user_info");
      if (c)
        try {
          I(JSON.parse(c));
        } catch {
        }
    }
  }, [e.behavior]), ue(() => {
    localStorage.setItem("fw_visited_before", "true");
  }, []);
  const W = m !== null && ((Se = (Ce = e.flow) == null ? void 0 : Ce.feedback_step) != null && Se.logic_rules) ? e.flow.feedback_step.logic_rules.find((_) => (_.trigger_ratings || _.rating_group || []).includes(m)) : null, A = W ? {
    ...W,
    // Legacy: tags → New: tags_options
    tags_options: W.tags_options || W.tags || [],
    // Legacy: message_label → New: placeholder
    placeholder: W.placeholder || W.message_label || "Share your thoughts..."
  } : null, J = () => {
    var _;
    o(null), h([]), P(""), v(""), ((_ = e.behavior) == null ? void 0 : _.persistence) !== "remember_user_info" && I({}), u("rating");
  }, B = () => {
    s(!1), setTimeout(() => {
      J();
    }, 300);
  }, H = (_) => {
    var $, k, N, a;
    o(_);
    const c = ((k = ($ = e.flow) == null ? void 0 : $.feedback_step) == null ? void 0 : k.enabled) !== !1, w = ((a = (N = e.flow) == null ? void 0 : N.demographics_step) == null ? void 0 : a.enabled) === !0;
    c ? u("feedback") : w ? u("demographics") : le(_);
  }, V = () => {
    var c, w;
    ((w = (c = e.flow) == null ? void 0 : c.demographics_step) == null ? void 0 : w.enabled) === !0 ? u("demographics") : le(m);
  }, Ne = () => {
    o(null), h([]), P(""), v(""), u("rating");
  }, _t = () => {
    var k, N, a, C, F, O, L, D, Q;
    if (typeof performance > "u") return {};
    const _ = window.performance, c = _.timing || ((N = (k = _.getEntriesByType) == null ? void 0 : k.call(_, "navigation")) == null ? void 0 : N[0]), $ = (((a = _.getEntriesByType) == null ? void 0 : a.call(_, "layout-shift")) || []).reduce((Y, Z) => Y + (Z.value || 0), 0);
    return {
      lcp: (O = (F = (C = _.getEntriesByType) == null ? void 0 : C.call(_, "largest-contentful-paint")) == null ? void 0 : F[0]) == null ? void 0 : O.startTime,
      cls: $,
      fid: (Q = (D = (L = _.getEntriesByType) == null ? void 0 : L.call(_, "first-input")) == null ? void 0 : D[0]) == null ? void 0 : Q.processingStart,
      load_time: (c == null ? void 0 : c.loadEventEnd) - (c == null ? void 0 : c.navigationStart)
    };
  }, st = () => {
    const _ = navigator.userAgent;
    let c = "Unknown", w = "Unknown";
    _.includes("Android") ? c = "Android" : _.includes("iOS") ? c = "iOS" : _.includes("Windows") ? c = "Windows" : _.includes("Mac") ? c = "macOS" : _.includes("Linux") && (c = "Linux"), _.includes("Chrome") && !_.includes("Edg") ? w = "Chrome" : _.includes("Safari") && !_.includes("Chrome") ? w = "Safari" : _.includes("Firefox") ? w = "Firefox" : _.includes("Edg") && (w = "Edge");
    const $ = window.innerWidth;
    let k = "desktop";
    $ < 768 ? k = "mobile" : $ < 1024 && (k = "tablet");
    const N = navigator.connection, a = (N == null ? void 0 : N.effectiveType) || "unknown";
    return {
      device_type: k,
      os: c,
      browser: w,
      screen_res: `${window.screen.width}x${window.screen.height}`,
      connection: a,
      user_agent: _
    };
  }, le = async (_) => {
    var c, w, $, k, N;
    d(!0);
    try {
      const a = {
        project_id: t,
        rating: _,
        answers: {
          tags: b.length > 0 ? b : void 0,
          comment: S.trim() || void 0,
          email: A != null && A.collect_email && x.trim() || void 0,
          user_info: (w = (c = e.flow) == null ? void 0 : c.demographics_step) != null && w.enabled ? { ...g } : void 0
        },
        meta: {
          page: {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer
          },
          tech: st(),
          performance: _t(),
          session_id: q,
          is_returning_visitor: K
        }
      };
      if (r && console.log("[FeedbackWidget] Submitting:", a), (await fetch(`${n}/api/v1/widget/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a)
      })).ok) {
        (($ = e.behavior) == null ? void 0 : $.persistence) === "remember_user_info" && Object.keys(g).length > 0 && localStorage.setItem("fw_user_info", JSON.stringify(g)), u("success");
        const F = (N = (k = e.flow) == null ? void 0 : k.success_step) == null ? void 0 : N.auto_close_seconds;
        F && F > 0 && setTimeout(() => {
          B();
        }, F * 1e3), r && console.log("[FeedbackWidget] Submitted successfully");
      } else
        throw new Error("Failed to submit feedback");
    } catch (a) {
      console.error("[FeedbackWidget] Error:", a), alert("Gagal mengirim feedback. Silakan coba lagi.");
    } finally {
      d(!1);
    }
  }, lt = () => {
    var c;
    return `feedback-widget-container fw-position-${((c = e.theme) == null ? void 0 : c.position) || "bottom_right"}`;
  }, at = () => {
    var c;
    return `fw-trigger fw-btn-${((c = e.theme) == null ? void 0 : c.button_style) || "pill"}`;
  }, ct = () => {
    var w, $, k, N;
    const _ = (($ = (w = e.flow) == null ? void 0 : w.rating_step) == null ? void 0 : $.type) || "emoji", c = ((N = (k = e.flow) == null ? void 0 : k.rating_step) == null ? void 0 : N.scale) || 5;
    return _ === "emoji" ? (c === 3 ? ["😢", "😐", "😃"] : c === 4 ? ["😢", "😕", "🙂", "😃"] : ["😢", "😕", "😐", "🙂", "😃"]).map((C, F) => /* @__PURE__ */ l(
      "button",
      {
        className: "fw-rating-btn fw-emoji-btn",
        onClick: () => H(F + 1),
        "aria-label": `Rate ${F + 1}`,
        children: C
      },
      F
    )) : _ === "star" ? Array.from({ length: c }, (a, C) => C + 1).map((a) => /* @__PURE__ */ l(
      "button",
      {
        className: "fw-rating-btn fw-star-btn",
        onClick: () => H(a),
        "aria-label": `Rate ${a} stars`,
        children: /* @__PURE__ */ l("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ l("path", { d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" }) })
      },
      a
    )) : Array.from({ length: c }, (a, C) => C + 1).map((a) => /* @__PURE__ */ l(
      "button",
      {
        className: "fw-rating-btn fw-number-btn",
        onClick: () => H(a),
        "aria-label": `Rate ${a}`,
        children: a
      },
      a
    ));
  }, ut = () => {
    var w, $, k, N;
    const _ = (($ = (w = e.flow) == null ? void 0 : w.rating_step) == null ? void 0 : $.type) || "emoji", c = ((N = (k = e.flow) == null ? void 0 : k.rating_step) == null ? void 0 : N.scale) || 5;
    return _ === "emoji" ? (c === 3 ? ["😢", "😐", "😃"] : c === 4 ? ["😢", "😕", "🙂", "😃"] : ["😢", "😕", "😐", "🙂", "😃"]).map((C, F) => /* @__PURE__ */ l(
      "span",
      {
        className: `fw-rating-display fw-emoji-display ${F + 1 <= (m || 0) ? "fw-active" : ""}`,
        children: C
      },
      F
    )) : _ === "star" ? Array.from({ length: c }, (a, C) => C + 1).map((a) => /* @__PURE__ */ l(
      "span",
      {
        className: `fw-rating-display fw-star-display ${a <= (m || 0) ? "fw-active" : ""}`,
        children: /* @__PURE__ */ l("svg", { width: "16", height: "16", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ l("path", { d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" }) })
      },
      a
    )) : Array.from({ length: c }, (a, C) => C + 1).map((a) => /* @__PURE__ */ l(
      "span",
      {
        className: `fw-rating-display fw-number-display ${a <= (m || 0) ? "fw-active" : ""}`,
        children: a
      },
      a
    ));
  }, dt = () => {
    var c;
    const _ = (c = e.theme) == null ? void 0 : c.trigger_icon;
    return _ && _.startsWith("http") ? /* @__PURE__ */ l("img", { src: _, alt: "", className: "fw-trigger-icon-img" }) : /* @__PURE__ */ l("span", { className: "fw-trigger-icon-emoji", children: "💬" });
  }, ft = (_) => {
    var w, $, k, N;
    const c = g[_.key] || "";
    return _.type === "select" ? /* @__PURE__ */ l("div", { className: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { className: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l(
        "select",
        {
          className: "fw-select",
          required: _.required,
          onChange: (a) => I({
            ...g,
            [_.key]: a.target.value
          }),
          children: [
            /* @__PURE__ */ l("option", { value: "", children: "Pilih..." }),
            (w = _.options) == null ? void 0 : w.map((a) => /* @__PURE__ */ l("option", { value: a, selected: c === a, children: a }, a))
          ]
        }
      )
    ] }) : _.type === "radio_group" ? /* @__PURE__ */ l("div", { className: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { className: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l("div", { className: "fw-radio-group", children: ($ = _.options) == null ? void 0 : $.map((a, C) => /* @__PURE__ */ l(
        "label",
        {
          className: `fw-radio-option ${c === a ? "fw-active" : ""}`,
          children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "radio",
                name: _.key,
                value: a,
                checked: c === a,
                onChange: () => I({ ...g, [_.key]: a })
              }
            ),
            /* @__PURE__ */ l("span", { children: a })
          ]
        },
        `${_.key}-${C}`
      )) })
    ] }) : _.type === "chips" ? /* @__PURE__ */ l("div", { className: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { className: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l("div", { className: "fw-chips", children: (k = _.options) == null ? void 0 : k.map((a, C) => /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: `fw-chip ${c === a ? "fw-active" : ""}`,
          onClick: () => I({ ...g, [_.key]: a }),
          children: a
        },
        `${_.key}-${C}`
      )) })
    ] }) : _.type === "checkbox" ? /* @__PURE__ */ l("div", { className: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { className: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l("div", { className: "fw-checkbox-group", children: (N = _.options) == null ? void 0 : N.map((a, C) => {
        const F = Array.isArray(c) ? c.includes(a) : !1;
        return /* @__PURE__ */ l(
          "label",
          {
            className: "fw-checkbox-option",
            children: [
              /* @__PURE__ */ l(
                "input",
                {
                  type: "checkbox",
                  checked: F,
                  onChange: (O) => {
                    const L = Array.isArray(c) ? c : [];
                    O.target.checked ? I({
                      ...g,
                      [_.key]: [...L, a]
                    }) : I({
                      ...g,
                      [_.key]: L.filter((D) => D !== a)
                    });
                  }
                }
              ),
              /* @__PURE__ */ l("span", { children: a })
            ]
          },
          `${_.key}-${C}`
        );
      }) })
    ] }) : _.type === "email" ? /* @__PURE__ */ l("div", { className: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { className: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "email",
          className: "fw-input",
          placeholder: _.placeholder || "",
          value: c,
          required: _.required,
          onInput: (a) => I({
            ...g,
            [_.key]: a.target.value
          })
        }
      )
    ] }) : _.type === "number" ? /* @__PURE__ */ l("div", { className: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { className: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "number",
          className: "fw-input",
          placeholder: _.placeholder || "",
          value: c,
          required: _.required,
          onInput: (a) => I({
            ...g,
            [_.key]: a.target.value
          })
        }
      )
    ] }) : /* @__PURE__ */ l("div", { className: "fw-field-group", children: [
      /* @__PURE__ */ l("label", { className: "fw-field-label", children: [
        _.label,
        _.required && " *"
      ] }),
      /* @__PURE__ */ l(
        "input",
        {
          type: "text",
          className: "fw-input",
          placeholder: _.placeholder || "",
          value: c,
          required: _.required,
          onInput: (a) => I({
            ...g,
            [_.key]: a.target.value
          })
        }
      )
    ] });
  }, pt = () => {
    var _, c, w, $, k, N, a, C, F, O, L, D, Q, Y, Z, Ee, Fe, Ie, Ae, je;
    if (f === "rating")
      return /* @__PURE__ */ l("div", { className: "fw-screen fw-rating-screen", children: [
        /* @__PURE__ */ l("h4", { className: "fw-title", children: ((c = (_ = e.flow) == null ? void 0 : _.rating_step) == null ? void 0 : c.title) || "Rate your experience" }),
        /* @__PURE__ */ l("div", { className: "fw-rating-buttons", children: ct() })
      ] });
    if (f === "feedback" && A) {
      const ae = A.allow_skip_comment || S.trim().length > 0 || b.length > 0;
      return /* @__PURE__ */ l("div", { className: "fw-screen fw-feedback-screen", children: [
        /* @__PURE__ */ l("div", { className: "fw-rating-display-container", children: ut() }),
        A.subtitle && /* @__PURE__ */ l("p", { className: "fw-subtitle", children: A.subtitle }),
        /* @__PURE__ */ l("h4", { className: "fw-title", children: A.title }),
        /* @__PURE__ */ l(
          "textarea",
          {
            className: "fw-textarea",
            placeholder: A.placeholder || "Share your thoughts...",
            value: S,
            onInput: (j) => P(j.target.value),
            rows: 3
          }
        ),
        A.tags_options && A.tags_options.length > 0 && /* @__PURE__ */ l("div", { className: "fw-tags", children: A.tags_options.map((j) => /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: `fw-tag-option ${b.includes(j) ? "fw-active" : ""}`,
            onClick: () => {
              b.includes(j) ? h(b.filter((ht) => ht !== j)) : h([...b, j]);
            },
            children: j
          },
          j
        )) }),
        A.collect_email && /* @__PURE__ */ l(
          "input",
          {
            type: "email",
            className: "fw-input",
            placeholder: "Email Anda (opsional)",
            value: x,
            onInput: (j) => v(j.target.value)
          }
        ),
        /* @__PURE__ */ l(
          "button",
          {
            className: "fw-submit-btn",
            disabled: p || !ae,
            onClick: V,
            children: p ? "Mengirim..." : "Lanjut"
          }
        ),
        /* @__PURE__ */ l("button", { className: "fw-back-btn", onClick: Ne, children: "Kembali" })
      ] });
    }
    if (f === "demographics") {
      const ae = (k = ($ = (w = e.flow) == null ? void 0 : w.demographics_step) == null ? void 0 : $.fields) == null ? void 0 : k.every(
        (j) => j.required ? !!g[j.key] : !0
      );
      return /* @__PURE__ */ l("div", { className: "fw-screen fw-demographics-screen", children: [
        /* @__PURE__ */ l("h4", { className: "fw-title", children: (a = (N = e.flow) == null ? void 0 : N.demographics_step) == null ? void 0 : a.title }),
        ((F = (C = e.flow) == null ? void 0 : C.demographics_step) == null ? void 0 : F.subtitle) && /* @__PURE__ */ l("p", { className: "fw-subtitle", children: (O = e.flow) == null ? void 0 : O.demographics_step.subtitle }),
        /* @__PURE__ */ l("div", { className: "fw-fields", children: (Q = (D = (L = e.flow) == null ? void 0 : L.demographics_step) == null ? void 0 : D.fields) == null ? void 0 : Q.map((j) => /* @__PURE__ */ l("div", { children: ft(j) }, j.key)) }),
        /* @__PURE__ */ l(
          "button",
          {
            className: "fw-submit-btn",
            disabled: p || !ae,
            onClick: () => le(m),
            children: p ? "Mengirim..." : "Kirim"
          }
        ),
        /* @__PURE__ */ l("button", { className: "fw-back-btn", onClick: Ne, children: "Kembali" })
      ] });
    }
    return f === "success" ? /* @__PURE__ */ l("div", { className: "fw-screen fw-success-screen", children: [
      /* @__PURE__ */ l("div", { className: "fw-success-icon", children: "✓" }),
      /* @__PURE__ */ l("h4", { className: "fw-title", children: ((Z = (Y = e.flow) == null ? void 0 : Y.success_step) == null ? void 0 : Z.title) || "Terima Kasih!" }),
      /* @__PURE__ */ l("p", { className: "fw-description", children: ((Fe = (Ee = e.flow) == null ? void 0 : Ee.success_step) == null ? void 0 : Fe.message) || "Masukan Anda membantu kami menjadi lebih baik." }),
      ((Ae = (Ie = e.flow) == null ? void 0 : Ie.success_step) == null ? void 0 : Ae.show_cta) && /* @__PURE__ */ l(
        "a",
        {
          href: e.flow.success_step.cta_url || "#",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "fw-cta-btn",
          children: ((je = e.flow) == null ? void 0 : je.success_step.cta_text) || "CTA"
        }
      ),
      /* @__PURE__ */ l("button", { className: "fw-close-btn", onClick: B, children: "Tutup" })
    ] }) : null;
  };
  return /* @__PURE__ */ l("div", { className: lt(), children: [
    !i && /* @__PURE__ */ l(
      "button",
      {
        className: at(),
        onClick: () => s(!0),
        "aria-label": "Buka feedback",
        style: { backgroundColor: (($e = e.theme) == null ? void 0 : $e.primary_color) || "#6366f1" },
        children: [
          dt(),
          /* @__PURE__ */ l("span", { children: ((Te = e.theme) == null ? void 0 : Te.trigger_label) || "Feedback" })
        ]
      }
    ),
    i && /* @__PURE__ */ l(
      "div",
      {
        className: "fw-modal",
        onClick: (_) => _.target === _.currentTarget && B(),
        children: /* @__PURE__ */ l("div", { className: "fw-modal-content", children: [
          pt(),
          ((xe = e.behavior) == null ? void 0 : xe.show_branding) !== !1 && /* @__PURE__ */ l("div", { className: "fw-branding", children: /* @__PURE__ */ l("span", { children: "Powered by FeedbackApp" }) })
        ] })
      }
    )
  ] });
}
let R = null, be = null;
async function Tt(e, t) {
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
  r.id = "feedback-widget-root", document.body.appendChild(r), Tt(e.projectId, t).then((i) => {
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
function xt() {
  R && (R.unmount(), R.root.remove(), R = null);
}
function Et(e) {
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
    destroy: xt,
    updateConfig: Et
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
  xt as destroy,
  Ke as init,
  Et as updateConfig
};
