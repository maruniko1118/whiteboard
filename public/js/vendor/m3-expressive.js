//#region node_modules/tslib/tslib.es6.mjs
function e(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var t = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, n = globalThis, r = n.ShadowRoot && (n.ShadyCSS === void 0 || n.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, i = Symbol(), a = /* @__PURE__ */ new WeakMap(), o = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== i) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (r && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = a.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && a.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, s = (e) => new o(typeof e == "string" ? e : e + "", void 0, i), c = (e, ...t) => new o(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, i), l = (e, t) => {
	if (r) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let r of t) {
		let t = document.createElement("style"), i = n.litNonce;
		i !== void 0 && t.setAttribute("nonce", i), t.textContent = r.cssText, e.appendChild(t);
	}
}, u = r ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return s(t);
})(e) : e, { is: d, defineProperty: f, getOwnPropertyDescriptor: p, getOwnPropertyNames: m, getOwnPropertySymbols: h, getPrototypeOf: g } = Object, _ = globalThis, v = _.trustedTypes, y = v ? v.emptyScript : "", b = _.reactiveElementPolyfillSupport, x = (e, t) => e, S = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? y : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, C = (e, t) => !d(e, t), w = {
	attribute: !0,
	type: String,
	converter: S,
	reflect: !1,
	useDefault: !1,
	hasChanged: C
};
Symbol.metadata ??= Symbol("metadata"), _.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var T = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = w) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && f(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = p(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? w;
	}
	static _$Ei() {
		if (this.hasOwnProperty(x("elementProperties"))) return;
		let e = g(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(x("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(x("properties"))) {
			let e = this.properties, t = [...m(e), ...h(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(u(e));
		} else e !== void 0 && t.push(u(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return l(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? S : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? S : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? C)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[x("elementProperties")] = /* @__PURE__ */ new Map(), T[x("finalized")] = /* @__PURE__ */ new Map(), b?.({ ReactiveElement: T }), (_.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var ee = {
	attribute: !0,
	type: String,
	converter: S,
	reflect: !1,
	hasChanged: C
}, te = (e = ee, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function E(e) {
	return (t, n) => typeof n == "object" ? te(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function D(e) {
	return E({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var ne = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function O(e, t) {
	return (n, r, i) => {
		let a = (t) => t.renderRoot?.querySelector(e) ?? null;
		if (t) {
			let { get: e, set: t } = typeof r == "object" ? n : i ?? (() => {
				let e = Symbol();
				return {
					get() {
						return this[e];
					},
					set(t) {
						this[e] = t;
					}
				};
			})();
			return ne(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return ne(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query-async.js
function re(e) {
	return (t, n) => ne(t, n, { async get() {
		return await this.updateComplete, this.renderRoot?.querySelector(e) ?? null;
	} });
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
function ie(e) {
	return (t, n) => {
		let { slot: r, selector: i } = e ?? {}, a = "slot" + (r ? `[name=${r}]` : ":not([name])");
		return ne(t, n, { get() {
			let t = (this.renderRoot?.querySelector(a))?.assignedElements(e) ?? [];
			return i === void 0 ? t : t.filter((e) => e.matches(i));
		} });
	};
}
//#endregion
//#region node_modules/lit-html/lit-html.js
var ae = globalThis, k = (e) => e, oe = ae.trustedTypes, se = oe ? oe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ce = "$lit$", le = `lit$${Math.random().toFixed(9).slice(2)}$`, ue = "?" + le, de = `<${ue}>`, fe = document, pe = () => fe.createComment(""), me = (e) => e === null || typeof e != "object" && typeof e != "function", he = Array.isArray, ge = (e) => he(e) || typeof e?.[Symbol.iterator] == "function", _e = "[ 	\n\f\r]", ve = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ye = /-->/g, be = />/g, xe = RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Se = /'/g, Ce = /"/g, we = /^(?:script|style|textarea|title)$/i, A = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), Te = Symbol.for("lit-noChange"), j = Symbol.for("lit-nothing"), Ee = /* @__PURE__ */ new WeakMap(), De = fe.createTreeWalker(fe, 129);
function Oe(e, t) {
	if (!he(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return se === void 0 ? t : se.createHTML(t);
}
var ke = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = ve;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === ve ? c[1] === "!--" ? o = ye : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = xe) : (we.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = xe) : o = be : o === xe ? c[0] === ">" ? (o = i ?? ve, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? xe : c[3] === "\"" ? Ce : Se) : o === Ce || o === Se ? o = xe : o === ye || o === be ? o = ve : (o = xe, i = void 0);
		let d = o === xe && e[t + 1].startsWith("/>") ? " " : "";
		a += o === ve ? n + de : l >= 0 ? (r.push(s), n.slice(0, l) + ce + n.slice(l) + le + d) : n + le + (l === -2 ? t : d);
	}
	return [Oe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Ae = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ke(t, n);
		if (this.el = e.createElement(l, r), De.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = De.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ce)) {
					let t = u[o++], n = i.getAttribute(e).split(le), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Fe : r[1] === "?" ? Ie : r[1] === "@" ? Le : Pe
					}), i.removeAttribute(e);
				} else e.startsWith(le) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (we.test(i.tagName)) {
					let e = i.textContent.split(le), t = e.length - 1;
					if (t > 0) {
						i.textContent = oe ? oe.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], pe()), De.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], pe());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ue) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(le, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += le.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = fe.createElement("template");
		return n.innerHTML = e, n;
	}
};
function je(e, t, n = e, r) {
	if (t === Te) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = me(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = je(e, i._$AS(e, t.values), i, r)), t;
}
var Me = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? fe).importNode(t, !0);
		De.currentNode = r;
		let i = De.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Ne(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Re(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = De.nextNode(), a++);
		}
		return De.currentNode = fe, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Ne = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = j, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = je(this, e, t), me(e) ? e === j || e == null || e === "" ? (this._$AH !== j && this._$AR(), this._$AH = j) : e !== this._$AH && e !== Te && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ge(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== j && me(this._$AH) ? this._$AA.nextSibling.data = e : this.T(fe.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ae.createElement(Oe(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Me(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ee.get(e.strings);
		return t === void 0 && Ee.set(e.strings, t = new Ae(e)), t;
	}
	k(t) {
		he(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(pe()), this.O(pe()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = k(e).nextSibling;
			k(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Pe = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = j, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = j;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = je(this, e, t, 0), a = !me(e) || e !== this._$AH && e !== Te, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = je(this, r[n + o], t, o), s === Te && (s = this._$AH[o]), a ||= !me(s) || s !== this._$AH[o], s === j ? e = j : e !== j && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === j ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Fe = class extends Pe {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === j ? void 0 : e;
	}
}, Ie = class extends Pe {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== j);
	}
}, Le = class extends Pe {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = je(this, e, t, 0) ?? j) === Te) return;
		let n = this._$AH, r = e === j && n !== j || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== j && (n === j || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Re = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		je(this, e);
	}
}, ze = ae.litHtmlPolyfillSupport;
ze?.(Ae, Ne), (ae.litHtmlVersions ??= []).push("3.3.3");
var Be = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Ne(t.insertBefore(pe(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Ve = globalThis, He = class extends T {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Be(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return Te;
	}
};
He._$litElement$ = !0, He.finalized = !0, Ve.litElementHydrateSupport?.({ LitElement: He });
var Ue = Ve.litElementPolyfillSupport;
Ue?.({ LitElement: He }), (Ve.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/lit-html/directive.js
var We = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Ge = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Ke = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, qe = Ge(class extends Ke {
	constructor(e) {
		if (super(e), e.type !== We.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
	}
	render(e) {
		return " " + Object.keys(e).filter((t) => e[t]).join(" ") + " ";
	}
	update(e, [t]) {
		if (this.st === void 0) {
			this.st = /* @__PURE__ */ new Set(), e.strings !== void 0 && (this.nt = new Set(e.strings.join(" ").split(/\s/).filter((e) => e !== "")));
			for (let e in t) t[e] && !this.nt?.has(e) && this.st.add(e);
			return this.render(t);
		}
		let n = e.element.classList;
		for (let e of this.st) e in t || (n.remove(e), this.st.delete(e));
		for (let e in t) {
			let r = !!t[e];
			r === this.st.has(e) || this.nt?.has(e) || (r ? (n.add(e), this.st.add(e)) : (n.remove(e), this.st.delete(e)));
		}
		return Te;
	}
}), Je = Symbol("attachableController"), Ye = new MutationObserver((e) => {
	for (let t of e) t.target[Je]?.hostConnected();
}), Xe = class {
	get htmlFor() {
		return this.host.getAttribute("for");
	}
	set htmlFor(e) {
		e === null ? this.host.removeAttribute("for") : this.host.setAttribute("for", e);
	}
	get control() {
		return this.host.hasAttribute("for") ? !this.htmlFor || !this.host.isConnected ? null : this.host.getRootNode().querySelector(`#${this.htmlFor}`) : this.currentControl || this.host.parentElement;
	}
	set control(e) {
		e ? this.attach(e) : this.detach();
	}
	constructor(e, t) {
		this.host = e, this.onControlChange = t, this.currentControl = null, e.addController(this), e[Je] = this, Ye?.observe(e, { attributeFilter: ["for"] });
	}
	attach(e) {
		e !== this.currentControl && (this.setCurrentControl(e), this.host.removeAttribute("for"));
	}
	detach() {
		this.setCurrentControl(null), this.host.setAttribute("for", "");
	}
	hostConnected() {
		this.setCurrentControl(this.control);
	}
	hostDisconnected() {
		this.setCurrentControl(null);
	}
	setCurrentControl(e) {
		this.onControlChange(this.currentControl, e), this.currentControl = e;
	}
}, Ze = {
	STANDARD: "cubic-bezier(0.2, 0, 0, 1)",
	STANDARD_ACCELERATE: "cubic-bezier(.3,0,1,1)",
	STANDARD_DECELERATE: "cubic-bezier(0,0,0,1)",
	EMPHASIZED: "cubic-bezier(.3,0,0,1)",
	EMPHASIZED_ACCELERATE: "cubic-bezier(.3,0,.8,.15)",
	EMPHASIZED_DECELERATE: "cubic-bezier(.05,.7,.1,1)"
}, Qe = 450, $e = 225, et = .2, tt = 10, nt = 75, rt = .35, it = "::after", at = "forwards", M;
(function(e) {
	e[e.INACTIVE = 0] = "INACTIVE", e[e.TOUCH_DELAY = 1] = "TOUCH_DELAY", e[e.HOLDING = 2] = "HOLDING", e[e.WAITING_FOR_CLICK = 3] = "WAITING_FOR_CLICK";
})(M ||= {});
var ot = [
	"click",
	"contextmenu",
	"pointercancel",
	"pointerdown",
	"pointerenter",
	"pointerleave",
	"pointerup"
], st = 150, ct = window.matchMedia("(forced-colors: active)"), lt = class extends He {
	constructor() {
		super(...arguments), this.disabled = !1, this.hovered = !1, this.pressed = !1, this.rippleSize = "", this.rippleScale = "", this.initialSize = 0, this.state = M.INACTIVE, this.attachableController = new Xe(this, this.onControlChange.bind(this));
	}
	get htmlFor() {
		return this.attachableController.htmlFor;
	}
	set htmlFor(e) {
		this.attachableController.htmlFor = e;
	}
	get control() {
		return this.attachableController.control;
	}
	set control(e) {
		this.attachableController.control = e;
	}
	attach(e) {
		this.attachableController.attach(e);
	}
	detach() {
		this.attachableController.detach();
	}
	connectedCallback() {
		super.connectedCallback(), this.setAttribute("aria-hidden", "true");
	}
	render() {
		return A`<div class="surface ${qe({
			hovered: this.hovered,
			pressed: this.pressed
		})}"></div>`;
	}
	update(e) {
		e.has("disabled") && this.disabled && (this.hovered = !1, this.pressed = !1), super.update(e);
	}
	handlePointerenter(e) {
		this.shouldReactToEvent(e) && (this.hovered = !0);
	}
	handlePointerleave(e) {
		this.shouldReactToEvent(e) && (this.hovered = !1, this.state !== M.INACTIVE && this.endPressAnimation());
	}
	handlePointerup(e) {
		if (this.shouldReactToEvent(e)) {
			if (this.state === M.HOLDING) {
				this.state = M.WAITING_FOR_CLICK;
				return;
			}
			if (this.state === M.TOUCH_DELAY) {
				this.state = M.WAITING_FOR_CLICK, this.startPressAnimation(this.rippleStartEvent);
				return;
			}
		}
	}
	async handlePointerdown(e) {
		if (this.shouldReactToEvent(e)) {
			if (this.rippleStartEvent = e, !this.isTouch(e)) {
				this.state = M.WAITING_FOR_CLICK, this.startPressAnimation(e);
				return;
			}
			this.state = M.TOUCH_DELAY, await new Promise((e) => {
				setTimeout(e, st);
			}), this.state === M.TOUCH_DELAY && (this.state = M.HOLDING, this.startPressAnimation(e));
		}
	}
	handleClick() {
		if (!this.disabled) {
			if (this.state === M.WAITING_FOR_CLICK) {
				this.endPressAnimation();
				return;
			}
			this.state === M.INACTIVE && (this.startPressAnimation(), this.endPressAnimation());
		}
	}
	handlePointercancel(e) {
		this.shouldReactToEvent(e) && this.endPressAnimation();
	}
	handleContextmenu() {
		this.disabled || this.endPressAnimation();
	}
	determineRippleSize() {
		let { height: e, width: t } = this.getBoundingClientRect(), n = Math.max(e, t), r = Math.max(rt * n, nt), i = this.currentCSSZoom ?? 1, a = Math.floor(n * et / i), o = Math.sqrt(t ** 2 + e ** 2) + tt;
		this.initialSize = a;
		let s = (o + r) / a;
		this.rippleScale = `${s / i}`, this.rippleSize = `${a}px`;
	}
	getNormalizedPointerEventCoords(e) {
		let { scrollX: t, scrollY: n } = window, { left: r, top: i } = this.getBoundingClientRect(), a = t + r, o = n + i, { pageX: s, pageY: c } = e, l = this.currentCSSZoom ?? 1;
		return {
			x: (s - a) / l,
			y: (c - o) / l
		};
	}
	getTranslationCoordinates(e) {
		let { height: t, width: n } = this.getBoundingClientRect(), r = this.currentCSSZoom ?? 1, i = {
			x: (n / r - this.initialSize) / 2,
			y: (t / r - this.initialSize) / 2
		}, a;
		return a = e instanceof PointerEvent ? this.getNormalizedPointerEventCoords(e) : {
			x: n / r / 2,
			y: t / r / 2
		}, a = {
			x: a.x - this.initialSize / 2,
			y: a.y - this.initialSize / 2
		}, {
			startPoint: a,
			endPoint: i
		};
	}
	startPressAnimation(e) {
		if (!this.mdRoot) return;
		this.pressed = !0, this.growAnimation?.cancel(), this.determineRippleSize();
		let { startPoint: t, endPoint: n } = this.getTranslationCoordinates(e), r = `${t.x}px, ${t.y}px`, i = `${n.x}px, ${n.y}px`;
		this.growAnimation = this.mdRoot.animate({
			top: [0, 0],
			left: [0, 0],
			height: [this.rippleSize, this.rippleSize],
			width: [this.rippleSize, this.rippleSize],
			transform: [`translate(${r}) scale(1)`, `translate(${i}) scale(${this.rippleScale})`]
		}, {
			pseudoElement: it,
			duration: Qe,
			easing: Ze.STANDARD,
			fill: at
		});
	}
	async endPressAnimation() {
		this.rippleStartEvent = void 0, this.state = M.INACTIVE;
		let e = this.growAnimation, t = Infinity;
		if (typeof e?.currentTime == "number" ? t = e.currentTime : e?.currentTime && (t = e.currentTime.to("ms").value), t >= $e) {
			this.pressed = !1;
			return;
		}
		await new Promise((e) => {
			setTimeout(e, $e - t);
		}), this.growAnimation === e && (this.pressed = !1);
	}
	shouldReactToEvent(e) {
		if (this.disabled || !e.isPrimary || this.rippleStartEvent && this.rippleStartEvent.pointerId !== e.pointerId) return !1;
		if (e.type === "pointerenter" || e.type === "pointerleave") return !this.isTouch(e);
		let t = e.buttons === 1;
		return this.isTouch(e) || t;
	}
	isTouch({ pointerType: e }) {
		return e === "touch";
	}
	async handleEvent(e) {
		if (!ct?.matches) switch (e.type) {
			case "click":
				this.handleClick();
				break;
			case "contextmenu":
				this.handleContextmenu();
				break;
			case "pointercancel":
				this.handlePointercancel(e);
				break;
			case "pointerdown":
				await this.handlePointerdown(e);
				break;
			case "pointerenter":
				this.handlePointerenter(e);
				break;
			case "pointerleave":
				this.handlePointerleave(e);
				break;
			case "pointerup": this.handlePointerup(e);
		}
	}
	onControlChange(e, t) {
		for (let n of ot) e?.removeEventListener(n, this), t?.addEventListener(n, this);
	}
};
e([E({
	type: Boolean,
	reflect: !0
})], lt.prototype, "disabled", void 0), e([D()], lt.prototype, "hovered", void 0), e([D()], lt.prototype, "pressed", void 0), e([O(".surface")], lt.prototype, "mdRoot", void 0);
//#endregion
//#region node_modules/@material/web/ripple/internal/ripple-styles.cssresult.js
var ut = c`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`;
ut.styleSheet;
//#endregion
//#region node_modules/@material/web/ripple/ripple.js
var dt = class extends lt {};
dt.styles = [ut], dt = e([t("md-ripple")], dt);
//#endregion
//#region node_modules/@material/web/focus/internal/focus-ring.js
var ft = [
	"focusin",
	"focusout",
	"pointerdown"
], pt = class extends He {
	constructor() {
		super(...arguments), this.visible = !1, this.inward = !1, this.attachableController = new Xe(this, this.onControlChange.bind(this));
	}
	get htmlFor() {
		return this.attachableController.htmlFor;
	}
	set htmlFor(e) {
		this.attachableController.htmlFor = e;
	}
	get control() {
		return this.attachableController.control;
	}
	set control(e) {
		this.attachableController.control = e;
	}
	attach(e) {
		this.attachableController.attach(e);
	}
	detach() {
		this.attachableController.detach();
	}
	connectedCallback() {
		super.connectedCallback(), this.setAttribute("aria-hidden", "true");
	}
	handleEvent(e) {
		if (!e[mt]) {
			switch (e.type) {
				default: return;
				case "focusin":
					this.visible = this.control?.matches(":focus-visible") ?? !1;
					break;
				case "focusout":
				case "pointerdown": this.visible = !1;
			}
			e[mt] = !0;
		}
	}
	onControlChange(e, t) {
		for (let n of ft) e?.removeEventListener(n, this), t?.addEventListener(n, this);
	}
	update(e) {
		e.has("visible") && this.dispatchEvent(new Event("visibility-changed")), super.update(e);
	}
};
e([E({
	type: Boolean,
	reflect: !0
})], pt.prototype, "visible", void 0), e([E({
	type: Boolean,
	reflect: !0
})], pt.prototype, "inward", void 0);
var mt = Symbol("handledByFocusRing"), ht = c`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`;
ht.styleSheet;
//#endregion
//#region node_modules/@material/web/focus/md-focus-ring.js
var gt = class extends pt {};
gt.styles = [ht], gt = e([t("md-focus-ring")], gt);
//#endregion
//#region node_modules/@material/web/elevation/internal/elevation.js
var _t = class extends He {
	connectedCallback() {
		super.connectedCallback(), this.setAttribute("aria-hidden", "true");
	}
	render() {
		return A`<span class="shadow"></span>`;
	}
}, vt = c`:host,.shadow,.shadow::before,.shadow::after{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-property:inherit;transition-timing-function:inherit}:host{display:flex;pointer-events:none;transition-property:box-shadow,opacity}.shadow::before,.shadow::after{content:"";transition-property:box-shadow,opacity;--_level: var(--md-elevation-level, 0);--_shadow-color: var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000))}.shadow::before{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0px var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}
`;
vt.styleSheet;
//#endregion
//#region node_modules/@material/web/elevation/elevation.js
var yt = class extends _t {};
yt.styles = [vt], yt = e([t("md-elevation")], yt);
//#endregion
//#region node_modules/@material/web/internal/aria/aria.js
var bt = /* @__PURE__ */ "role.ariaAtomic.ariaAutoComplete.ariaBusy.ariaChecked.ariaColCount.ariaColIndex.ariaColSpan.ariaCurrent.ariaDisabled.ariaExpanded.ariaHasPopup.ariaHidden.ariaInvalid.ariaKeyShortcuts.ariaLabel.ariaLevel.ariaLive.ariaModal.ariaMultiLine.ariaMultiSelectable.ariaOrientation.ariaPlaceholder.ariaPosInSet.ariaPressed.ariaReadOnly.ariaRequired.ariaRoleDescription.ariaRowCount.ariaRowIndex.ariaRowSpan.ariaSelected.ariaSetSize.ariaSort.ariaValueMax.ariaValueMin.ariaValueNow.ariaValueText".split("."), xt = bt.map(Ct);
function St(e) {
	return xt.includes(e);
}
function Ct(e) {
	return e.replace("aria", "aria-").replace(/Elements?/g, "").toLowerCase();
}
//#endregion
//#region node_modules/@material/web/internal/aria/delegate.js
var wt = Symbol("privateIgnoreAttributeChangesFor");
function Tt(e) {
	var t;
	class n extends e {
		constructor() {
			super(...arguments), this[t] = /* @__PURE__ */ new Set();
		}
		attributeChangedCallback(e, t, n) {
			if (!St(e)) {
				super.attributeChangedCallback(e, t, n);
				return;
			}
			if (this[wt].has(e)) return;
			this[wt].add(e), this.removeAttribute(e), this[wt].delete(e);
			let r = Ot(e);
			n === null ? delete this.dataset[r] : this.dataset[r] = n, this.requestUpdate(Ot(e), t);
		}
		getAttribute(e) {
			return St(e) ? super.getAttribute(Dt(e)) : super.getAttribute(e);
		}
		removeAttribute(e) {
			super.removeAttribute(e), St(e) && (super.removeAttribute(Dt(e)), this.requestUpdate());
		}
	}
	return t = wt, Et(n), n;
}
function Et(e) {
	for (let t of bt) {
		let n = Ct(t), r = Dt(n), i = Ot(n);
		e.createProperty(t, {
			attribute: n,
			noAccessor: !0
		}), e.createProperty(Symbol(r), {
			attribute: r,
			noAccessor: !0
		}), Object.defineProperty(e.prototype, t, {
			configurable: !0,
			enumerable: !0,
			get() {
				return this.dataset[i] ?? null;
			},
			set(e) {
				let n = this.dataset[i] ?? null;
				e !== n && (e === null ? delete this.dataset[i] : this.dataset[i] = e, this.requestUpdate(t, n));
			}
		});
	}
}
function Dt(e) {
	return `data-${e}`;
}
function Ot(e) {
	return e.replace(/-\w/, (e) => e[1].toUpperCase());
}
//#endregion
//#region node_modules/@material/web/internal/events/form-label-activation.js
function kt(e) {
	let t = new MouseEvent("click", { bubbles: !0 });
	return e.dispatchEvent(t), t;
}
function At(e) {
	return e.currentTarget !== e.target || e.composedPath()[0] !== e.target || e.target.disabled ? !1 : !jt(e);
}
function jt(e) {
	let t = Mt;
	return t && (e.preventDefault(), e.stopImmediatePropagation()), Nt(), t;
}
var Mt = !1;
async function Nt() {
	Mt = !0, await null, Mt = !1;
}
//#endregion
//#region node_modules/@material/web/labs/behaviors/element-internals.js
var Pt = Symbol("internals"), Ft = Symbol("privateInternals");
function It(e) {
	class t extends e {
		get [Pt]() {
			return this[Ft] || (this[Ft] = this.attachInternals()), this[Ft];
		}
	}
	return t;
}
//#endregion
//#region node_modules/@material/web/labs/behaviors/form-associated.js
var Lt = Symbol("getFormValue"), Rt = Symbol("getFormState");
function zt(t) {
	class n extends t {
		get form() {
			return this[Pt].form;
		}
		get labels() {
			return this[Pt].labels;
		}
		get name() {
			return this.getAttribute("name") ?? "";
		}
		set name(e) {
			this.setAttribute("name", e);
		}
		get disabled() {
			return this.hasAttribute("disabled");
		}
		set disabled(e) {
			this.toggleAttribute("disabled", !!e);
		}
		attributeChangedCallback(e, t, n) {
			if (e === "name" || e === "disabled") {
				let n = e === "disabled" ? t !== null : t;
				this.requestUpdate(e, n);
				return;
			}
			super.attributeChangedCallback(e, t, n);
		}
		requestUpdate(e, t, n) {
			super.requestUpdate(e, t, n), this[Pt].setFormValue(this[Lt](), this[Rt]());
		}
		[Lt]() {
			return this.getAttribute("value");
		}
		[Rt]() {
			return this[Lt]();
		}
		formDisabledCallback(e) {
			this.disabled = e;
		}
	}
	return n.formAssociated = !0, e([E({ noAccessor: !0 })], n.prototype, "name", null), e([E({
		type: Boolean,
		noAccessor: !0
	})], n.prototype, "disabled", null), n;
}
//#endregion
//#region node_modules/@material/web/internal/events/dispatch-hooks.js
var Bt = Symbol("dispatchHooks");
function Vt(e, t) {
	let n = e[Bt];
	if (!n) throw Error(`'${e.type}' event needs setupDispatchHooks().`);
	n.addEventListener("after", t, { once: !0 });
}
var Ht = /* @__PURE__ */ new WeakMap();
function Ut(e, ...t) {
	let n = Ht.get(e);
	n || (n = /* @__PURE__ */ new Set(), Ht.set(e, n));
	for (let r of t) n.has(r) || (e.addEventListener(r, (e) => {
		let t = new EventTarget();
		e[Bt] = t;
		let n = new AbortController(), i = () => {
			n.abort(), t.dispatchEvent(new Event("after"));
		}, a = (e) => function() {
			e.call(this), i();
		};
		e.stopPropagation = a(e.stopPropagation), e.stopImmediatePropagation = a(e.stopImmediatePropagation);
		let o = e.composedPath(), s;
		s = e.composed && e.bubbles ? o[o.length - 1] : e.bubbles ? o[0].getRootNode() : o[0], s.addEventListener(r, () => {
			i();
		}, {
			once: !0,
			signal: n.signal
		});
	}, { capture: !0 }), n.add(r));
}
//#endregion
//#region node_modules/@material/web/labs/behaviors/form-submitter.js
function Wt(t) {
	class n extends t {
		get name() {
			return this.getAttribute("name") ?? "";
		}
		set name(e) {
			this.setAttribute("name", e);
		}
		constructor(...e) {
			super(...e), this.type = "submit", this.value = "", Ut(this, "click"), this.addEventListener("click", async (e) => {
				let t = this.type === "reset", n = this.type === "submit", r = this[Pt], { form: i } = r;
				!i || !(n || t) || Vt(e, () => {
					if (!e.defaultPrevented) {
						if (t) {
							i.reset();
							return;
						}
						i.addEventListener("submit", (e) => {
							Object.defineProperty(e, "submitter", {
								configurable: !0,
								enumerable: !0,
								get: () => this
							});
						}, {
							capture: !0,
							once: !0
						}), r.setFormValue(this.value), i.requestSubmit();
					}
				});
			});
		}
	}
	return e([E()], n.prototype, "type", void 0), e([E({ reflect: !0 })], n.prototype, "value", void 0), n;
}
//#endregion
//#region node_modules/@material/web/button/internal/button.js
var Gt = Tt(Wt(zt(It(He)))), Kt = class extends Gt {
	constructor() {
		super(), this.softDisabled = !1, this.href = "", this.download = "", this.target = "", this.trailingIcon = !1, this.hasIcon = !1, this.addEventListener("click", this.handleClick.bind(this));
	}
	focus() {
		this.buttonElement?.focus();
	}
	blur() {
		this.buttonElement?.blur();
	}
	render() {
		let e = this.disabled || this.softDisabled, t = this.href ? this.renderLink() : this.renderButton(), n = this.href ? "link" : "button";
		return A`
      ${this.renderElevationOrOutline?.()}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${n}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${n}
        ?disabled="${e}"></md-ripple>
      ${t}
    `;
	}
	renderButton() {
		let { ariaLabel: e, ariaHasPopup: t, ariaExpanded: n } = this;
		return A`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled || j}
      aria-label="${e || j}"
      aria-haspopup="${t || j}"
      aria-expanded="${n || j}">
      ${this.renderContent()}
    </button>`;
	}
	renderLink() {
		let { ariaLabel: e, ariaHasPopup: t, ariaExpanded: n } = this;
		return A`<a
      id="link"
      class="button"
      aria-label="${e || j}"
      aria-haspopup="${t || j}"
      aria-expanded="${n || j}"
      aria-disabled=${this.disabled || this.softDisabled || j}
      tabindex="${this.disabled && !this.softDisabled ? -1 : j}"
      href=${this.href}
      download=${this.download || j}
      target=${this.target || j}
      >${this.renderContent()}
    </a>`;
	}
	renderContent() {
		let e = A`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;
		return A`
      <span class="touch"></span>
      ${this.trailingIcon ? j : e}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon ? e : j}
    `;
	}
	handleClick(e) {
		if (this.softDisabled || this.disabled && this.href) {
			e.stopImmediatePropagation(), e.preventDefault();
			return;
		}
		!At(e) || !this.buttonElement || (this.focus(), kt(this.buttonElement));
	}
	handleSlotChange() {
		this.hasIcon = this.assignedIcons.length > 0;
	}
};
Kt.shadowRootOptions = {
	mode: "open",
	delegatesFocus: !0
}, e([E({
	type: Boolean,
	attribute: "soft-disabled",
	reflect: !0
})], Kt.prototype, "softDisabled", void 0), e([E()], Kt.prototype, "href", void 0), e([E()], Kt.prototype, "download", void 0), e([E()], Kt.prototype, "target", void 0), e([E({
	type: Boolean,
	attribute: "trailing-icon",
	reflect: !0
})], Kt.prototype, "trailingIcon", void 0), e([E({
	type: Boolean,
	attribute: "has-icon",
	reflect: !0
})], Kt.prototype, "hasIcon", void 0), e([O(".button")], Kt.prototype, "buttonElement", void 0), e([ie({
	slot: "icon",
	flatten: !0
})], Kt.prototype, "assignedIcons", void 0);
//#endregion
//#region node_modules/@material/web/button/internal/filled-button.js
var qt = class extends Kt {
	renderElevationOrOutline() {
		return A`<md-elevation part="elevation"></md-elevation>`;
	}
}, Jt = c`:host{--_container-color: var(--md-filled-button-container-color, var(--md-sys-color-primary, #6750a4));--_container-elevation: var(--md-filled-button-container-elevation, 0);--_container-height: var(--md-filled-button-container-height, 40px);--_container-shadow-color: var(--md-filled-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-filled-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-filled-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-filled-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-filled-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-filled-button-focus-container-elevation, 0);--_focus-label-text-color: var(--md-filled-button-focus-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-container-elevation: var(--md-filled-button-hover-container-elevation, 1);--_hover-label-text-color: var(--md-filled-button-hover-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-color: var(--md-filled-button-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-opacity: var(--md-filled-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filled-button-label-text-color, var(--md-sys-color-on-primary, #fff));--_label-text-font: var(--md-filled-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filled-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filled-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-filled-button-pressed-container-elevation, 0);--_pressed-label-text-color: var(--md-filled-button-pressed-label-text-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-color: var(--md-filled-button-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-opacity: var(--md-filled-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-filled-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-button-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-icon-color: var(--md-filled-button-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-color: var(--md-filled-button-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-size: var(--md-filled-button-icon-size, 18px);--_pressed-icon-color: var(--md-filled-button-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_container-shape-start-start: var(--md-filled-button-container-shape-start-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-button-container-shape-start-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-button-container-shape-end-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-button-container-shape-end-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-filled-button-leading-space, 24px);--_trailing-space: var(--md-filled-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-filled-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-filled-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-filled-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-filled-button-with-trailing-icon-trailing-space, 16px)}
`;
Jt.styleSheet;
//#endregion
//#region node_modules/@material/web/button/internal/shared-elevation-styles.cssresult.js
var Yt = c`md-elevation{transition-duration:280ms}:host(:is([disabled],[soft-disabled])) md-elevation{transition:none}md-elevation{--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color)}:host(:focus-within) md-elevation{--md-elevation-level: var(--_focus-container-elevation)}:host(:hover) md-elevation{--md-elevation-level: var(--_hover-container-elevation)}:host(:active) md-elevation{--md-elevation-level: var(--_pressed-container-elevation)}:host(:is([disabled],[soft-disabled])) md-elevation{--md-elevation-level: var(--_disabled-container-elevation)}
`;
Yt.styleSheet;
//#endregion
//#region node_modules/@material/web/button/internal/shared-styles.cssresult.js
var Xt = c`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:max(48px,100%);left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`;
Xt.styleSheet;
//#endregion
//#region node_modules/@material/web/button/filled-button.js
var Zt = class extends qt {};
Zt.styles = [
	Xt,
	Yt,
	Jt
], Zt = e([t("md-filled-button")], Zt);
//#endregion
//#region node_modules/@material/web/button/internal/filled-tonal-button.js
var Qt = class extends Kt {
	renderElevationOrOutline() {
		return A`<md-elevation part="elevation"></md-elevation>`;
	}
}, $t = c`:host{--_container-color: var(--md-filled-tonal-button-container-color, var(--md-sys-color-secondary-container, #e8def8));--_container-elevation: var(--md-filled-tonal-button-container-elevation, 0);--_container-height: var(--md-filled-tonal-button-container-height, 40px);--_container-shadow-color: var(--md-filled-tonal-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-filled-tonal-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-filled-tonal-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-filled-tonal-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-filled-tonal-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-tonal-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-filled-tonal-button-focus-container-elevation, 0);--_focus-label-text-color: var(--md-filled-tonal-button-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-container-elevation: var(--md-filled-tonal-button-hover-container-elevation, 1);--_hover-label-text-color: var(--md-filled-tonal-button-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-color: var(--md-filled-tonal-button-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-opacity: var(--md-filled-tonal-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filled-tonal-button-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_label-text-font: var(--md-filled-tonal-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-tonal-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filled-tonal-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filled-tonal-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-filled-tonal-button-pressed-container-elevation, 0);--_pressed-label-text-color: var(--md-filled-tonal-button-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-color: var(--md-filled-tonal-button-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filled-tonal-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-filled-tonal-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-tonal-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-tonal-button-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-icon-color: var(--md-filled-tonal-button-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_icon-color: var(--md-filled-tonal-button-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_icon-size: var(--md-filled-tonal-button-icon-size, 18px);--_pressed-icon-color: var(--md-filled-tonal-button-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_container-shape-start-start: var(--md-filled-tonal-button-container-shape-start-start, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-tonal-button-container-shape-start-end, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-tonal-button-container-shape-end-end, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-tonal-button-container-shape-end-start, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-filled-tonal-button-leading-space, 24px);--_trailing-space: var(--md-filled-tonal-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-filled-tonal-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-filled-tonal-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-filled-tonal-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-filled-tonal-button-with-trailing-icon-trailing-space, 16px)}
`;
$t.styleSheet;
//#endregion
//#region node_modules/@material/web/button/filled-tonal-button.js
var en = class extends Qt {};
en.styles = [
	Xt,
	Yt,
	$t
], en = e([t("md-filled-tonal-button")], en);
//#endregion
//#region node_modules/@material/web/button/internal/outlined-button.js
var tn = class extends Kt {
	renderElevationOrOutline() {
		return A`<div class="outline"></div>`;
	}
}, nn = c`:host{--_container-height: var(--md-outlined-button-container-height, 40px);--_disabled-label-text-color: var(--md-outlined-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-button-disabled-label-text-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-button-disabled-outline-opacity, 0.12);--_focus-label-text-color: var(--md-outlined-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-outlined-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-outlined-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-outlined-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-outlined-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-outlined-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-button-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-button-outline-width, 1px);--_pressed-label-text-color: var(--md-outlined-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-outline-color: var(--md-outlined-button-pressed-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-color: var(--md-outlined-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-outlined-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-outlined-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-outlined-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-outlined-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-outlined-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-outlined-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-outlined-button-icon-size, 18px);--_pressed-icon-color: var(--md-outlined-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-outlined-button-container-shape-start-start, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-outlined-button-container-shape-start-end, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-outlined-button-container-shape-end-end, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-outlined-button-container-shape-end-start, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-outlined-button-leading-space, 24px);--_trailing-space: var(--md-outlined-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-outlined-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-outlined-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-outlined-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-outlined-button-with-trailing-icon-trailing-space, 16px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}.outline{inset:0;border-style:solid;position:absolute;box-sizing:border-box;border-color:var(--_outline-color);border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}:host(:active) .outline{border-color:var(--_pressed-outline-color)}:host(:is([disabled],[soft-disabled])) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])) .background{border-color:GrayText}:host(:is([disabled],[soft-disabled])) .outline{opacity:1}}.outline,md-ripple{border-width:var(--_outline-width)}md-ripple{inline-size:calc(100% - 2*var(--_outline-width));block-size:calc(100% - 2*var(--_outline-width));border-style:solid;border-color:rgba(0,0,0,0)}
`;
nn.styleSheet;
//#endregion
//#region node_modules/@material/web/button/outlined-button.js
var rn = class extends tn {};
rn.styles = [Xt, nn], rn = e([t("md-outlined-button")], rn);
//#endregion
//#region node_modules/@material/web/button/internal/text-button.js
var an = class extends Kt {}, on = c`:host{--_container-height: var(--md-text-button-container-height, 40px);--_disabled-label-text-color: var(--md-text-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-text-button-disabled-label-text-opacity, 0.38);--_focus-label-text-color: var(--md-text-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-text-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-text-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-text-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-text-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-text-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-text-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-text-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-text-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-text-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-text-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-text-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-text-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-text-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-text-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-text-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-text-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-text-button-icon-size, 18px);--_pressed-icon-color: var(--md-text-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-text-button-container-shape-start-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-text-button-container-shape-start-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-text-button-container-shape-end-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-text-button-container-shape-end-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-text-button-leading-space, 12px);--_trailing-space: var(--md-text-button-trailing-space, 12px);--_with-leading-icon-leading-space: var(--md-text-button-with-leading-icon-leading-space, 12px);--_with-leading-icon-trailing-space: var(--md-text-button-with-leading-icon-trailing-space, 16px);--_with-trailing-icon-leading-space: var(--md-text-button-with-trailing-icon-leading-space, 16px);--_with-trailing-icon-trailing-space: var(--md-text-button-with-trailing-icon-trailing-space, 12px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}
`;
on.styleSheet;
//#endregion
//#region node_modules/@material/web/button/text-button.js
var sn = class extends an {};
sn.styles = [Xt, on], sn = e([t("md-text-button")], sn);
//#endregion
//#region node_modules/lit-html/static.js
var cn = Symbol.for(""), ln = (e) => {
	if (e?.r === cn) return e?._$litStatic$;
}, un = (e, ...t) => ({
	_$litStatic$: t.reduce((t, n, r) => t + ((e) => {
		if (e._$litStatic$ !== void 0) return e._$litStatic$;
		throw Error(`Value passed to 'literal' function must be a 'literal' result: ${e}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`);
	})(n) + e[r + 1], e[0]),
	r: cn
}), dn = /* @__PURE__ */ new Map(), fn = ((e) => (t, ...n) => {
	let r = n.length, i, a, o = [], s = [], c, l = 0, u = !1;
	for (; l < r;) {
		for (c = t[l]; l < r && (a = n[l], (i = ln(a)) !== void 0);) c += i + t[++l], u = !0;
		l !== r && s.push(a), o.push(c), l++;
	}
	if (l === r && o.push(t[r]), u) {
		let e = o.join("$$lit$$");
		(t = dn.get(e)) === void 0 && (o.raw = o, dn.set(e, t = o)), n = s;
	}
	return e(t, ...n);
})(A);
//#endregion
//#region node_modules/@material/web/internal/controller/is-rtl.js
function pn(e, t = !0) {
	return t && getComputedStyle(e).getPropertyValue("direction").trim() === "rtl";
}
//#endregion
//#region node_modules/@material/web/iconbutton/internal/icon-button.js
var mn = Tt(Wt(zt(It(He)))), hn = class extends mn {
	constructor() {
		super(), this.softDisabled = !1, this.flipIconInRtl = !1, this.href = "", this.download = "", this.target = "", this.ariaLabelSelected = "", this.toggle = !1, this.selected = !1, this.flipIcon = pn(this, this.flipIconInRtl), Ut(this, "click"), this.addEventListener("click", (e) => {
			if (this.softDisabled || this.disabled && this.href) {
				e.stopImmediatePropagation(), e.preventDefault();
				return;
			}
			let t = this.selected;
			Vt(e, () => {
				!this.toggle || this.disabled || e.defaultPrevented || (this.selected = !t, this.dispatchEvent(new InputEvent("input", {
					bubbles: !0,
					composed: !0
				})), this.dispatchEvent(new Event("change", { bubbles: !0 })));
			});
		});
	}
	willUpdate() {
		this.href && (this.disabled = !1, this.softDisabled = !1);
	}
	render() {
		let e = this.href ? un`div` : un`button`, { ariaLabel: t, ariaHasPopup: n, ariaExpanded: r } = this, i = t && this.ariaLabelSelected, a = this.toggle ? this.selected : j, o = j;
		return this.href || (o = i && this.selected ? this.ariaLabelSelected : t), fn`<${e}
        class="icon-button ${qe(this.getRenderClasses())}"
        id="button"
        aria-label="${o || j}"
        aria-haspopup="${!this.href && n || j}"
        aria-expanded="${!this.href && r || j}"
        aria-pressed="${a}"
        aria-disabled=${!this.href && this.softDisabled || j}
        ?disabled="${!this.href && this.disabled}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${this.selected ? j : this.renderIcon()}
        ${this.selected ? this.renderSelectedIcon() : j}
        ${this.href ? this.renderLink() : this.renderTouchTarget()}
  </${e}>`;
	}
	renderLink() {
		let { ariaLabel: e } = this;
		return A`
      <a
        class="link"
        id="link"
        href="${this.href}"
        download="${this.download || j}"
        target="${this.target || j}"
        aria-label="${e || j}">
        ${this.renderTouchTarget()}
      </a>
    `;
	}
	getRenderClasses() {
		return {
			"flip-icon": this.flipIcon,
			selected: this.toggle && this.selected
		};
	}
	renderIcon() {
		return A`<span class="icon"><slot></slot></span>`;
	}
	renderSelectedIcon() {
		return A`<span class="icon icon--selected"
      ><slot name="selected"><slot></slot></slot
    ></span>`;
	}
	renderTouchTarget() {
		return A`<span class="touch"></span>`;
	}
	renderFocusRing() {
		return A`<md-focus-ring
      part="focus-ring"
      for=${this.href ? "link" : "button"}></md-focus-ring>`;
	}
	renderRipple() {
		let e = !this.href && (this.disabled || this.softDisabled);
		return A`<md-ripple
      for=${this.href ? "link" : j}
      ?disabled="${e}"></md-ripple>`;
	}
	connectedCallback() {
		this.flipIcon = pn(this, this.flipIconInRtl), super.connectedCallback();
	}
};
hn.shadowRootOptions = {
	mode: "open",
	delegatesFocus: !0
}, e([E({
	type: Boolean,
	attribute: "soft-disabled",
	reflect: !0
})], hn.prototype, "softDisabled", void 0), e([E({
	type: Boolean,
	attribute: "flip-icon-in-rtl"
})], hn.prototype, "flipIconInRtl", void 0), e([E()], hn.prototype, "href", void 0), e([E()], hn.prototype, "download", void 0), e([E()], hn.prototype, "target", void 0), e([E({ attribute: "aria-label-selected" })], hn.prototype, "ariaLabelSelected", void 0), e([E({ type: Boolean })], hn.prototype, "toggle", void 0), e([E({
	type: Boolean,
	reflect: !0
})], hn.prototype, "selected", void 0), e([D()], hn.prototype, "flipIcon", void 0);
//#endregion
//#region node_modules/@material/web/iconbutton/internal/shared-styles.cssresult.js
var gn = c`:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);height:var(--_container-height);width:var(--_container-width);justify-content:center}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) max(0px,(48px - var(--_container-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){pointer-events:none}.icon-button{place-items:center;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;place-content:center;outline:none;padding:0;position:relative;text-decoration:none;user-select:none;z-index:0;flex:1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.icon ::slotted(*){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size);font-weight:inherit}md-ripple{z-index:-1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.flip-icon .icon{transform:scaleX(-1)}.icon{display:inline-flex}.link{display:grid;height:100%;outline:none;place-items:center;position:absolute;width:100%}.touch{position:absolute;height:max(48px,100%);width:max(48px,100%)}:host([touch-target=none]) .touch{display:none}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1}}
`;
gn.styleSheet;
//#endregion
//#region node_modules/@material/web/iconbutton/internal/standard-styles.cssresult.js
var _n = c`:host{--_disabled-icon-color: var(--md-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-icon-button-disabled-icon-opacity, 0.38);--_icon-size: var(--md-icon-button-icon-size, 24px);--_selected-focus-icon-color: var(--md-icon-button-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-icon-color: var(--md-icon-button-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-color: var(--md-icon-button-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-opacity: var(--md-icon-button-selected-hover-state-layer-opacity, 0.08);--_selected-icon-color: var(--md-icon-button-selected-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-icon-color: var(--md-icon-button-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-color: var(--md-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-opacity: var(--md-icon-button-selected-pressed-state-layer-opacity, 0.12);--_state-layer-height: var(--md-icon-button-state-layer-height, 40px);--_state-layer-shape: var(--md-icon-button-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));--_state-layer-width: var(--md-icon-button-state-layer-width, 40px);--_focus-icon-color: var(--md-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-icon-button-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-icon-button-pressed-state-layer-opacity, 0.12);--_container-shape-start-start: 0;--_container-shape-start-end: 0;--_container-shape-end-end: 0;--_container-shape-end-start: 0;--_container-height: 0;--_container-width: 0;height:var(--_state-layer-height);width:var(--_state-layer-width)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_state-layer-height))/2) max(0px,(48px - var(--_state-layer-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_state-layer-shape);--md-focus-ring-shape-start-end: var(--_state-layer-shape);--md-focus-ring-shape-end-end: var(--_state-layer-shape);--md-focus-ring-shape-end-start: var(--_state-layer-shape)}.standard{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.standard:hover{color:var(--_hover-icon-color)}.standard:focus{color:var(--_focus-icon-color)}.standard:active{color:var(--_pressed-icon-color)}.standard:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}md-ripple{border-radius:var(--_state-layer-shape)}.standard:is(:disabled,[aria-disabled=true]){opacity:var(--_disabled-icon-opacity)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}
`;
_n.styleSheet;
//#endregion
//#region node_modules/@material/web/iconbutton/icon-button.js
var vn = class extends hn {
	getRenderClasses() {
		return {
			...super.getRenderClasses(),
			standard: !0
		};
	}
};
vn.styles = [gn, _n], vn = e([t("md-icon-button")], vn);
//#endregion
//#region node_modules/@material/web/iconbutton/internal/filled-styles.cssresult.js
var yn = c`:host{--_container-color: var(--md-filled-icon-button-container-color, var(--md-sys-color-primary, #6750a4));--_container-height: var(--md-filled-icon-button-container-height, 40px);--_container-width: var(--md-filled-icon-button-container-width, 40px);--_disabled-container-color: var(--md-filled-icon-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-icon-button-disabled-container-opacity, 0.12);--_disabled-icon-color: var(--md-filled-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-icon-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-icon-button-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-icon-color: var(--md-filled-icon-button-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-color: var(--md-filled-icon-button-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-opacity: var(--md-filled-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-filled-icon-button-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-size: var(--md-filled-icon-button-icon-size, 24px);--_pressed-icon-color: var(--md-filled-icon-button-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-color: var(--md-filled-icon-button-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-opacity: var(--md-filled-icon-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-filled-icon-button-selected-container-color, var(--md-sys-color-primary, #6750a4));--_toggle-selected-focus-icon-color: var(--md-filled-icon-button-toggle-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-hover-icon-color: var(--md-filled-icon-button-toggle-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-hover-state-layer-color: var(--md-filled-icon-button-toggle-selected-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-icon-color: var(--md-filled-icon-button-toggle-selected-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-pressed-icon-color: var(--md-filled-icon-button-toggle-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-pressed-state-layer-color: var(--md-filled-icon-button-toggle-selected-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_unselected-container-color: var(--md-filled-icon-button-unselected-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_toggle-focus-icon-color: var(--md-filled-icon-button-toggle-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-hover-icon-color: var(--md-filled-icon-button-toggle-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-hover-state-layer-color: var(--md-filled-icon-button-toggle-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_toggle-icon-color: var(--md-filled-icon-button-toggle-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-pressed-icon-color: var(--md-filled-icon-button-toggle-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-pressed-state-layer-color: var(--md-filled-icon-button-toggle-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-filled-icon-button-container-shape-start-start, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-icon-button-container-shape-start-end, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-icon-button-container-shape-end-end, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-icon-button-container-shape-end-start, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)))}.icon-button{color:var(--_icon-color)}.icon-button:hover{color:var(--_hover-icon-color)}.icon-button:focus{color:var(--_focus-icon-color)}.icon-button:active{color:var(--_pressed-icon-color)}.icon-button:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}.icon-button{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.icon-button::before{background-color:var(--_container-color);border-radius:inherit;content:"";inset:0;position:absolute;z-index:-1}.icon-button:is(:disabled,[aria-disabled=true])::before{background-color:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.icon-button:is(:disabled,[aria-disabled=true]) .icon{opacity:var(--_disabled-icon-opacity)}.toggle-filled:not(:disabled,[aria-disabled=true]){color:var(--_toggle-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-hover-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-focus-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-pressed-icon-color)}.toggle-filled{--md-ripple-hover-color: var(--_toggle-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-pressed-state-layer-color)}.toggle-filled:not(:disabled,[aria-disabled=true])::before{background-color:var(--_unselected-container-color)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_toggle-selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_toggle-selected-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-selected-pressed-state-layer-color)}.selected:not(:disabled,[aria-disabled=true])::before{background-color:var(--_selected-container-color)}
`;
yn.styleSheet;
//#endregion
//#region node_modules/@material/web/iconbutton/filled-icon-button.js
var bn = class extends hn {
	getRenderClasses() {
		return {
			...super.getRenderClasses(),
			filled: !0,
			"toggle-filled": this.toggle
		};
	}
};
bn.styles = [gn, yn], bn = e([t("md-filled-icon-button")], bn);
//#endregion
//#region node_modules/@material/web/iconbutton/internal/filled-tonal-styles.cssresult.js
var xn = c`:host{--_container-color: var(--md-filled-tonal-icon-button-container-color, var(--md-sys-color-secondary-container, #e8def8));--_container-height: var(--md-filled-tonal-icon-button-container-height, 40px);--_container-width: var(--md-filled-tonal-icon-button-container-width, 40px);--_disabled-container-color: var(--md-filled-tonal-icon-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-tonal-icon-button-disabled-container-opacity, 0.12);--_disabled-icon-color: var(--md-filled-tonal-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-tonal-icon-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-tonal-icon-button-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-icon-color: var(--md-filled-tonal-icon-button-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-color: var(--md-filled-tonal-icon-button-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-opacity: var(--md-filled-tonal-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-filled-tonal-icon-button-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_icon-size: var(--md-filled-tonal-icon-button-icon-size, 24px);--_pressed-icon-color: var(--md-filled-tonal-icon-button-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-color: var(--md-filled-tonal-icon-button-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filled-tonal-icon-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-filled-tonal-icon-button-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_toggle-selected-focus-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-hover-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-hover-state-layer-color: var(--md-filled-tonal-icon-button-toggle-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-pressed-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-pressed-state-layer-color: var(--md-filled-tonal-icon-button-toggle-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-container-color: var(--md-filled-tonal-icon-button-unselected-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_toggle-focus-icon-color: var(--md-filled-tonal-icon-button-toggle-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-hover-icon-color: var(--md-filled-tonal-icon-button-toggle-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-hover-state-layer-color: var(--md-filled-tonal-icon-button-toggle-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-icon-color: var(--md-filled-tonal-icon-button-toggle-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-pressed-icon-color: var(--md-filled-tonal-icon-button-toggle-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-pressed-state-layer-color: var(--md-filled-tonal-icon-button-toggle-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-filled-tonal-icon-button-container-shape-start-start, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-tonal-icon-button-container-shape-start-end, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-tonal-icon-button-container-shape-end-end, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-tonal-icon-button-container-shape-end-start, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)))}.icon-button{color:var(--_icon-color)}.icon-button:hover{color:var(--_hover-icon-color)}.icon-button:focus{color:var(--_focus-icon-color)}.icon-button:active{color:var(--_pressed-icon-color)}.icon-button:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}.icon-button{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.icon-button::before{background-color:var(--_container-color);border-radius:inherit;content:"";inset:0;position:absolute;z-index:-1}.icon-button:is(:disabled,[aria-disabled=true])::before{background-color:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.icon-button:is(:disabled,[aria-disabled=true]) .icon{opacity:var(--_disabled-icon-opacity)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]){color:var(--_toggle-icon-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-hover-icon-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-focus-icon-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-pressed-icon-color)}.toggle-filled-tonal{--md-ripple-hover-color: var(--_toggle-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-pressed-state-layer-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true])::before{background-color:var(--_unselected-container-color)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_toggle-selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_toggle-selected-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-selected-pressed-state-layer-color)}.selected:not(:disabled,[aria-disabled=true])::before{background-color:var(--_selected-container-color)}
`;
xn.styleSheet;
//#endregion
//#region node_modules/@material/web/iconbutton/filled-tonal-icon-button.js
var Sn = class extends hn {
	getRenderClasses() {
		return {
			...super.getRenderClasses(),
			"filled-tonal": !0,
			"toggle-filled-tonal": this.toggle
		};
	}
};
Sn.styles = [gn, xn], Sn = e([t("md-filled-tonal-icon-button")], Sn);
//#endregion
//#region node_modules/@material/web/iconbutton/internal/outlined-styles.cssresult.js
var Cn = c`:host{--_container-height: var(--md-outlined-icon-button-container-height, 40px);--_container-width: var(--md-outlined-icon-button-container-width, 40px);--_disabled-icon-color: var(--md-outlined-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-outlined-icon-button-disabled-icon-opacity, 0.38);--_disabled-selected-container-color: var(--md-outlined-icon-button-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-outlined-icon-button-disabled-selected-container-opacity, 0.12);--_hover-state-layer-opacity: var(--md-outlined-icon-button-hover-state-layer-opacity, 0.08);--_icon-size: var(--md-outlined-icon-button-icon-size, 24px);--_pressed-state-layer-opacity: var(--md-outlined-icon-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-outlined-icon-button-selected-container-color, var(--md-sys-color-inverse-surface, #322f35));--_selected-focus-icon-color: var(--md-outlined-icon-button-selected-focus-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-hover-icon-color: var(--md-outlined-icon-button-selected-hover-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-hover-state-layer-color: var(--md-outlined-icon-button-selected-hover-state-layer-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-icon-color: var(--md-outlined-icon-button-selected-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-pressed-icon-color: var(--md-outlined-icon-button-selected-pressed-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-pressed-state-layer-color: var(--md-outlined-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_disabled-outline-color: var(--md-outlined-icon-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-icon-button-disabled-outline-opacity, 0.12);--_focus-icon-color: var(--md-outlined-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-outlined-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-outlined-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_icon-color: var(--md-outlined-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-outlined-icon-button-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-icon-button-outline-width, 1px);--_pressed-icon-color: var(--md-outlined-icon-button-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-color: var(--md-outlined-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_container-shape-start-start: var(--md-outlined-icon-button-container-shape-start-start, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-outlined-icon-button-container-shape-start-end, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-outlined-icon-button-container-shape-end-end, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-outlined-icon-button-container-shape-end-start, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)))}.outlined{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.outlined::before{border-color:var(--_outline-color);border-width:var(--_outline-width)}.outlined:hover{color:var(--_hover-icon-color)}.outlined:focus{color:var(--_focus-icon-color)}.outlined:active{color:var(--_pressed-icon-color)}.outlined:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}.outlined:is(:disabled,[aria-disabled=true])::before{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}.outlined:is(:disabled,[aria-disabled=true]) .icon{opacity:var(--_disabled-icon-opacity)}.outlined::before{block-size:100%;border-style:solid;border-radius:inherit;box-sizing:border-box;content:"";inline-size:100%;inset:0;pointer-events:none;position:absolute;z-index:-1}.outlined.selected::before{border-width:0}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.selected:not(:disabled,[aria-disabled=true])::before{background-color:var(--_selected-container-color)}.selected:is(:disabled,[aria-disabled=true])::before{background-color:var(--_disabled-selected-container-color);opacity:var(--_disabled-selected-container-opacity)}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-outline-opacity: 1}.selected::before{border-color:CanvasText;border-width:var(--_outline-width)}.selected:is(:disabled,[aria-disabled=true])::before{border-color:GrayText;opacity:1}}
`;
Cn.styleSheet;
//#endregion
//#region node_modules/@material/web/iconbutton/outlined-icon-button.js
var wn = class extends hn {
	getRenderClasses() {
		return {
			...super.getRenderClasses(),
			outlined: !0
		};
	}
};
wn.styles = [gn, Cn], wn = e([t("md-outlined-icon-button")], wn);
//#endregion
//#region node_modules/@material/web/slider/internal/forced-colors-styles.cssresult.js
var Tn = c`@media(forced-colors: active){:host{--md-slider-active-track-color: CanvasText;--md-slider-disabled-active-track-color: GrayText;--md-slider-disabled-active-track-opacity: 1;--md-slider-disabled-handle-color: GrayText;--md-slider-disabled-inactive-track-color: GrayText;--md-slider-disabled-inactive-track-opacity: 1;--md-slider-focus-handle-color: CanvasText;--md-slider-handle-color: CanvasText;--md-slider-handle-shadow-color: Canvas;--md-slider-hover-handle-color: CanvasText;--md-slider-hover-state-layer-color: Canvas;--md-slider-hover-state-layer-opacity: 1;--md-slider-inactive-track-color: Canvas;--md-slider-label-container-color: Canvas;--md-slider-label-text-color: CanvasText;--md-slider-pressed-handle-color: CanvasText;--md-slider-pressed-state-layer-color: Canvas;--md-slider-pressed-state-layer-opacity: 1;--md-slider-with-overlap-handle-outline-color: CanvasText}.label,.label::before{border:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}:host(:not([disabled])) .track::before{border:1px solid var(--_active-track-color)}.tickmarks::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='CanvasText'%3E%3Ccircle cx='2' cy='2'  r='1'/%3E%3C/svg%3E")}.tickmarks::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='Canvas'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/svg%3E")}:host([disabled]) .tickmarks::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='Canvas'%3E%3Ccircle cx='2' cy='2'  r='1'/%3E%3C/svg%3E")}}
`;
Tn.styleSheet;
//#endregion
//#region node_modules/lit-html/directives/style-map.js
var En = "important", Dn = " !" + En, On = Ge(class extends Ke {
	constructor(e) {
		if (super(e), e.type !== We.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
	}
	render(e) {
		return Object.keys(e).reduce((t, n) => {
			let r = e[n];
			return r == null ? t : t + `${n = n.includes("-") ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
		}, "");
	}
	update(e, [t]) {
		let { style: n } = e.element;
		if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
		for (let e of this.ft) t[e] ?? (this.ft.delete(e), e.includes("-") ? n.removeProperty(e) : n[e] = null);
		for (let e in t) {
			let r = t[e];
			if (r != null) {
				this.ft.add(e);
				let t = typeof r == "string" && r.endsWith(Dn);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? En : "") : n[e] = r;
			}
		}
		return Te;
	}
});
//#endregion
//#region node_modules/lit-html/directives/when.js
function kn(e, t, n) {
	return e ? t(e) : n?.(e);
}
//#endregion
//#region node_modules/@material/web/internal/events/redispatch-event.js
function An(e, t) {
	t.bubbles && (!e.shadowRoot || t.composed) && t.stopPropagation();
	let n = Reflect.construct(t.constructor, [t.type, t]), r = e.dispatchEvent(n);
	return r || t.preventDefault(), r;
}
//#endregion
//#region node_modules/@material/web/slider/internal/slider.js
var jn = Tt(zt(It(He))), N = class extends jn {
	get nameStart() {
		return this.getAttribute("name-start") ?? this.name;
	}
	set nameStart(e) {
		this.setAttribute("name-start", e);
	}
	get nameEnd() {
		return this.getAttribute("name-end") ?? this.nameStart;
	}
	set nameEnd(e) {
		this.setAttribute("name-end", e);
	}
	get renderAriaLabelStart() {
		let { ariaLabel: e } = this;
		return this.ariaLabelStart || e && `${e} start` || this.valueLabelStart || String(this.valueStart);
	}
	get renderAriaValueTextStart() {
		return this.ariaValueTextStart || this.valueLabelStart || String(this.valueStart);
	}
	get renderAriaLabelEnd() {
		let { ariaLabel: e } = this;
		return this.range ? this.ariaLabelEnd || e && `${e} end` || this.valueLabelEnd || String(this.valueEnd) : e || this.valueLabel || String(this.value);
	}
	get renderAriaValueTextEnd() {
		if (this.range) return this.ariaValueTextEnd || this.valueLabelEnd || String(this.valueEnd);
		let { ariaValueText: e } = this;
		return e || this.valueLabel || String(this.value);
	}
	constructor() {
		super(), this.min = 0, this.max = 100, this.valueLabel = "", this.valueLabelStart = "", this.valueLabelEnd = "", this.ariaLabelStart = "", this.ariaValueTextStart = "", this.ariaLabelEnd = "", this.ariaValueTextEnd = "", this.step = 1, this.ticks = !1, this.labeled = !1, this.range = !1, this.handleStartHover = !1, this.handleEndHover = !1, this.startOnTop = !1, this.handlesOverlapping = !1, this.ripplePointerId = 1, this.isRedispatchingEvent = !1, this.addEventListener("click", (e) => {
			!At(e) || !this.inputEnd || (this.focus(), kt(this.inputEnd));
		});
	}
	focus() {
		this.inputEnd?.focus();
	}
	willUpdate(e) {
		this.renderValueStart = e.has("valueStart") ? this.valueStart : this.inputStart?.valueAsNumber;
		let t = e.has("valueEnd") && this.range || e.has("value");
		this.renderValueEnd = t ? this.range ? this.valueEnd : this.value : this.inputEnd?.valueAsNumber, e.get("handleStartHover") === void 0 ? e.get("handleEndHover") !== void 0 && this.toggleRippleHover(this.rippleEnd, this.handleEndHover) : this.toggleRippleHover(this.rippleStart, this.handleStartHover);
	}
	updated(e) {
		if (this.range && (this.renderValueStart = this.inputStart.valueAsNumber), this.renderValueEnd = this.inputEnd.valueAsNumber, this.range) {
			let e = (this.max - this.min) / 3;
			if (this.valueStart === void 0) {
				this.inputStart.valueAsNumber = this.min + e;
				let t = this.inputStart.valueAsNumber;
				this.valueStart = this.renderValueStart = t;
			}
			if (this.valueEnd === void 0) {
				this.inputEnd.valueAsNumber = this.min + 2 * e;
				let t = this.inputEnd.valueAsNumber;
				this.valueEnd = this.renderValueEnd = t;
			}
		} else this.value ??= this.renderValueEnd;
		if (e.has("range") || e.has("renderValueStart") || e.has("renderValueEnd") || this.isUpdatePending) {
			let e = this.handleStart?.querySelector(".handleNub"), t = this.handleEnd?.querySelector(".handleNub");
			this.handlesOverlapping = Nn(e, t);
		}
		this.performUpdate();
	}
	render() {
		let e = this.step === 0 ? 1 : this.step, t = Math.max(this.max - this.min, e), n = this.range ? ((this.renderValueStart ?? this.min) - this.min) / t : 0, r = ((this.renderValueEnd ?? this.min) - this.min) / t, i = {
			"--_start-fraction": String(n),
			"--_end-fraction": String(r),
			"--_tick-count": String(t / e)
		}, a = { ranged: this.range }, o = this.valueLabelStart || String(this.renderValueStart), s = (this.range ? this.valueLabelEnd : this.valueLabel) || String(this.renderValueEnd), c = {
			start: !0,
			value: this.renderValueStart,
			ariaLabel: this.renderAriaLabelStart,
			ariaValueText: this.renderAriaValueTextStart,
			ariaMin: this.min,
			ariaMax: this.valueEnd ?? this.max
		}, l = {
			start: !1,
			value: this.renderValueEnd,
			ariaLabel: this.renderAriaLabelEnd,
			ariaValueText: this.renderAriaValueTextEnd,
			ariaMin: this.range ? this.valueStart ?? this.min : this.min,
			ariaMax: this.max
		}, u = {
			start: !0,
			hover: this.handleStartHover,
			label: o
		}, d = {
			start: !1,
			hover: this.handleEndHover,
			label: s
		}, f = { hover: this.handleStartHover || this.handleEndHover };
		return A` <div
      class="container ${qe(a)}"
      style=${On(i)}>
      ${kn(this.range, () => this.renderInput(c))}
      ${this.renderInput(l)} ${this.renderTrack()}
      <div class="handleContainerPadded">
        <div class="handleContainerBlock">
          <div class="handleContainer ${qe(f)}">
            ${kn(this.range, () => this.renderHandle(u))}
            ${this.renderHandle(d)}
          </div>
        </div>
      </div>
    </div>`;
	}
	renderTrack() {
		return A`
      <div class="track"></div>
      ${this.ticks ? A`<div class="tickmarks"></div>` : j}
    `;
	}
	renderLabel(e) {
		return A`<div class="label" aria-hidden="true">
      <span class="labelContent" part="label">${e}</span>
    </div>`;
	}
	renderHandle({ start: e, hover: t, label: n }) {
		let r = !this.disabled && e === this.startOnTop, i = !this.disabled && this.handlesOverlapping, a = e ? "start" : "end";
		return A`<div
      class="handle ${qe({
			[a]: !0,
			hover: t,
			onTop: r,
			isOverlapping: i
		})}">
      <md-focus-ring part="focus-ring" for=${a}></md-focus-ring>
      <md-ripple
        for=${a}
        class=${a}
        ?disabled=${this.disabled}></md-ripple>
      <div class="handleNub">
        <md-elevation part="elevation"></md-elevation>
      </div>
      ${kn(this.labeled, () => this.renderLabel(n))}
    </div>`;
	}
	renderInput({ start: e, value: t, ariaLabel: n, ariaValueText: r, ariaMin: i, ariaMax: a }) {
		let o = e ? "start" : "end";
		return A`<input
      type="range"
      class="${qe({
			start: e,
			end: !e
		})}"
      @focus=${this.handleFocus}
      @pointerdown=${this.handleDown}
      @pointerup=${this.handleUp}
      @pointerenter=${this.handleEnter}
      @pointermove=${this.handleMove}
      @pointerleave=${this.handleLeave}
      @keydown=${this.handleKeydown}
      @keyup=${this.handleKeyup}
      @input=${this.handleInput}
      @change=${this.handleChange}
      id=${o}
      .disabled=${this.disabled}
      .min=${String(this.min)}
      aria-valuemin=${i}
      .max=${String(this.max)}
      aria-valuemax=${a}
      .step=${String(this.step)}
      .value=${String(t)}
      .tabIndex=${+!!e}
      aria-label=${n || j}
      aria-valuetext=${r} />`;
	}
	async toggleRippleHover(e, t) {
		let n = await e;
		n && (t ? n.handlePointerenter(new PointerEvent("pointerenter", {
			isPrimary: !0,
			pointerId: this.ripplePointerId
		})) : n.handlePointerleave(new PointerEvent("pointerleave", {
			isPrimary: !0,
			pointerId: this.ripplePointerId
		})));
	}
	handleFocus(e) {
		this.updateOnTop(e.target);
	}
	startAction(e) {
		let t = e.target, n = t === this.inputStart ? this.inputEnd : this.inputStart;
		this.action = {
			canFlip: e.type === "pointerdown",
			flipped: !1,
			target: t,
			fixed: n,
			values: /* @__PURE__ */ new Map([[t, t.valueAsNumber], [n, n?.valueAsNumber]])
		};
	}
	finishAction(e) {
		this.action = void 0;
	}
	handleKeydown(e) {
		this.startAction(e);
	}
	handleKeyup(e) {
		this.finishAction(e);
	}
	handleDown(e) {
		this.startAction(e), this.ripplePointerId = e.pointerId;
		let t = e.target === this.inputStart;
		this.handleStartHover = !this.disabled && t && !!this.handleStart, this.handleEndHover = !this.disabled && !t && !!this.handleEnd;
	}
	async handleUp(e) {
		if (!this.action) return;
		let { target: t, values: n, flipped: r } = this.action;
		await new Promise(requestAnimationFrame), t !== void 0 && (t.focus(), r && t.valueAsNumber !== n.get(t) && t.dispatchEvent(new Event("change", { bubbles: !0 }))), this.finishAction(e);
	}
	handleMove(e) {
		this.handleStartHover = !this.disabled && Mn(e, this.handleStart), this.handleEndHover = !this.disabled && Mn(e, this.handleEnd);
	}
	handleEnter(e) {
		this.handleMove(e);
	}
	handleLeave() {
		this.handleStartHover = !1, this.handleEndHover = !1;
	}
	updateOnTop(e) {
		this.startOnTop = e.classList.contains("start");
	}
	needsClamping() {
		if (!this.action) return !1;
		let { target: e, fixed: t } = this.action;
		return e === this.inputStart ? e.valueAsNumber > t.valueAsNumber : e.valueAsNumber < t.valueAsNumber;
	}
	isActionFlipped() {
		let { action: e } = this;
		if (!e) return !1;
		let { target: t, fixed: n, values: r } = e;
		return e.canFlip && r.get(t) === r.get(n) && this.needsClamping() && (e.canFlip = !1, e.flipped = !0, e.target = n, e.fixed = t), e.flipped;
	}
	flipAction() {
		if (!this.action) return !1;
		let { target: e, fixed: t, values: n } = this.action, r = e.valueAsNumber !== t.valueAsNumber;
		return e.valueAsNumber = t.valueAsNumber, t.valueAsNumber = n.get(t), r;
	}
	clampAction() {
		if (!this.needsClamping() || !this.action) return !1;
		let { target: e, fixed: t } = this.action;
		return e.valueAsNumber = t.valueAsNumber, !0;
	}
	handleInput(e) {
		if (this.isRedispatchingEvent) return;
		let t = !1, n = !1;
		this.range && (this.isActionFlipped() && (t = !0, n = this.flipAction()), this.clampAction() && (t = !0, n = !1));
		let r = e.target;
		this.updateOnTop(r), this.range ? (this.valueStart = this.inputStart.valueAsNumber, this.valueEnd = this.inputEnd.valueAsNumber) : this.value = this.inputEnd.valueAsNumber, t && e.stopPropagation(), n && (this.isRedispatchingEvent = !0, An(r, e), this.isRedispatchingEvent = !1);
	}
	handleChange(e) {
		let t = e.target, { target: n, values: r } = this.action ?? {};
		n && n.valueAsNumber === r.get(t) || An(this, e), this.finishAction(e);
	}
	[Lt]() {
		if (this.range) {
			let e = new FormData();
			return e.append(this.nameStart, String(this.valueStart)), e.append(this.nameEnd, String(this.valueEnd)), e;
		}
		return String(this.value);
	}
	formResetCallback() {
		if (this.range) {
			let e = this.getAttribute("value-start");
			this.valueStart = e === null ? void 0 : Number(e);
			let t = this.getAttribute("value-end");
			this.valueEnd = t === null ? void 0 : Number(t);
			return;
		}
		let e = this.getAttribute("value");
		this.value = e === null ? void 0 : Number(e);
	}
	formStateRestoreCallback(e) {
		if (Array.isArray(e)) {
			let [[, t], [, n]] = e;
			this.valueStart = Number(t), this.valueEnd = Number(n), this.range = !0;
			return;
		}
		this.value = Number(e), this.range = !1;
	}
};
N.shadowRootOptions = {
	...He.shadowRootOptions,
	delegatesFocus: !0
}, e([E({ type: Number })], N.prototype, "min", void 0), e([E({ type: Number })], N.prototype, "max", void 0), e([E({ type: Number })], N.prototype, "value", void 0), e([E({
	type: Number,
	attribute: "value-start"
})], N.prototype, "valueStart", void 0), e([E({
	type: Number,
	attribute: "value-end"
})], N.prototype, "valueEnd", void 0), e([E({ attribute: "value-label" })], N.prototype, "valueLabel", void 0), e([E({ attribute: "value-label-start" })], N.prototype, "valueLabelStart", void 0), e([E({ attribute: "value-label-end" })], N.prototype, "valueLabelEnd", void 0), e([E({ attribute: "aria-label-start" })], N.prototype, "ariaLabelStart", void 0), e([E({ attribute: "aria-valuetext-start" })], N.prototype, "ariaValueTextStart", void 0), e([E({ attribute: "aria-label-end" })], N.prototype, "ariaLabelEnd", void 0), e([E({ attribute: "aria-valuetext-end" })], N.prototype, "ariaValueTextEnd", void 0), e([E({ type: Number })], N.prototype, "step", void 0), e([E({ type: Boolean })], N.prototype, "ticks", void 0), e([E({ type: Boolean })], N.prototype, "labeled", void 0), e([E({ type: Boolean })], N.prototype, "range", void 0), e([O("input.start")], N.prototype, "inputStart", void 0), e([O(".handle.start")], N.prototype, "handleStart", void 0), e([re("md-ripple.start")], N.prototype, "rippleStart", void 0), e([O("input.end")], N.prototype, "inputEnd", void 0), e([O(".handle.end")], N.prototype, "handleEnd", void 0), e([re("md-ripple.end")], N.prototype, "rippleEnd", void 0), e([D()], N.prototype, "handleStartHover", void 0), e([D()], N.prototype, "handleEndHover", void 0), e([D()], N.prototype, "startOnTop", void 0), e([D()], N.prototype, "handlesOverlapping", void 0), e([D()], N.prototype, "renderValueStart", void 0), e([D()], N.prototype, "renderValueEnd", void 0);
function Mn({ x: e, y: t }, n) {
	if (!n) return !1;
	let { top: r, left: i, bottom: a, right: o } = n.getBoundingClientRect();
	return e >= i && e <= o && t >= r && t <= a;
}
function Nn(e, t) {
	if (!(e && t)) return !1;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	return !(n.top > r.bottom || n.right < r.left || n.bottom < r.top || n.left > r.right);
}
//#endregion
//#region node_modules/@material/web/slider/internal/slider-styles.cssresult.js
var Pn = c`:host{--_active-track-color: var(--md-slider-active-track-color, var(--md-sys-color-primary, #6750a4));--_active-track-height: var(--md-slider-active-track-height, 4px);--_active-track-shape: var(--md-slider-active-track-shape, var(--md-sys-shape-corner-full, 9999px));--_disabled-active-track-color: var(--md-slider-disabled-active-track-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-track-opacity: var(--md-slider-disabled-active-track-opacity, 0.38);--_disabled-handle-color: var(--md-slider-disabled-handle-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-handle-elevation: var(--md-slider-disabled-handle-elevation, 0);--_disabled-inactive-track-color: var(--md-slider-disabled-inactive-track-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-inactive-track-opacity: var(--md-slider-disabled-inactive-track-opacity, 0.12);--_focus-handle-color: var(--md-slider-focus-handle-color, var(--md-sys-color-primary, #6750a4));--_handle-color: var(--md-slider-handle-color, var(--md-sys-color-primary, #6750a4));--_handle-elevation: var(--md-slider-handle-elevation, 1);--_handle-height: var(--md-slider-handle-height, 20px);--_handle-shadow-color: var(--md-slider-handle-shadow-color, var(--md-sys-color-shadow, #000));--_handle-shape: var(--md-slider-handle-shape, var(--md-sys-shape-corner-full, 9999px));--_handle-width: var(--md-slider-handle-width, 20px);--_hover-handle-color: var(--md-slider-hover-handle-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-slider-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-slider-hover-state-layer-opacity, 0.08);--_inactive-track-color: var(--md-slider-inactive-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_inactive-track-height: var(--md-slider-inactive-track-height, 4px);--_inactive-track-shape: var(--md-slider-inactive-track-shape, var(--md-sys-shape-corner-full, 9999px));--_label-container-color: var(--md-slider-label-container-color, var(--md-sys-color-primary, #6750a4));--_label-container-height: var(--md-slider-label-container-height, 28px);--_pressed-handle-color: var(--md-slider-pressed-handle-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-slider-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-slider-pressed-state-layer-opacity, 0.12);--_state-layer-size: var(--md-slider-state-layer-size, 40px);--_with-overlap-handle-outline-color: var(--md-slider-with-overlap-handle-outline-color, var(--md-sys-color-on-primary, #fff));--_with-overlap-handle-outline-width: var(--md-slider-with-overlap-handle-outline-width, 1px);--_with-tick-marks-active-container-color: var(--md-slider-with-tick-marks-active-container-color, var(--md-sys-color-on-primary, #fff));--_with-tick-marks-container-size: var(--md-slider-with-tick-marks-container-size, 2px);--_with-tick-marks-disabled-container-color: var(--md-slider-with-tick-marks-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_with-tick-marks-inactive-container-color: var(--md-slider-with-tick-marks-inactive-container-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-slider-label-text-color, var(--md-sys-color-on-primary, #fff));--_label-text-font: var(--md-slider-label-text-font, var(--md-sys-typescale-label-medium-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-slider-label-text-line-height, var(--md-sys-typescale-label-medium-line-height, 1rem));--_label-text-size: var(--md-slider-label-text-size, var(--md-sys-typescale-label-medium-size, 0.75rem));--_label-text-weight: var(--md-slider-label-text-weight, var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500)));--_start-fraction: 0;--_end-fraction: 0;--_tick-count: 0;display:inline-flex;vertical-align:middle;min-inline-size:200px;--md-elevation-level: var(--_handle-elevation);--md-elevation-shadow-color: var(--_handle-shadow-color)}md-focus-ring{height:48px;inset:unset;width:48px}md-elevation{transition-duration:250ms}@media(prefers-reduced-motion){.label{transition-duration:0}}:host([disabled]){opacity:var(--_disabled-active-track-opacity);--md-elevation-level: var(--_disabled-handle-elevation)}.container{flex:1;display:flex;align-items:center;position:relative;block-size:var(--_state-layer-size);pointer-events:none;touch-action:none;user-select:none}.track,.tickmarks{position:absolute;inset:0;display:flex;align-items:center}.track::before,.tickmarks::before,.track::after,.tickmarks::after{position:absolute;content:"";inset-inline-start:calc(var(--_state-layer-size)/2 - var(--_with-tick-marks-container-size));inset-inline-end:calc(var(--_state-layer-size)/2 - var(--_with-tick-marks-container-size));background-size:calc((100% - var(--_with-tick-marks-container-size)*2)/var(--_tick-count)) 100%}.track::before,.tickmarks::before{block-size:var(--_inactive-track-height);border-radius:var(--_inactive-track-shape)}.track::before{background:var(--_inactive-track-color)}.tickmarks::before{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-inactive-container-color) 0, var(--_with-tick-marks-inactive-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}:host([disabled]) .track::before{opacity:calc(1/var(--_disabled-active-track-opacity)*var(--_disabled-inactive-track-opacity));background:var(--_disabled-inactive-track-color)}.track::after,.tickmarks::after{block-size:var(--_active-track-height);border-radius:var(--_active-track-shape);clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))) 0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)))}.track::after{background:var(--_active-track-color)}.tickmarks::after{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-active-container-color) 0, var(--_with-tick-marks-active-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}.track:dir(rtl)::after{clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)) 0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))))}.tickmarks:dir(rtl)::after{clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)) 0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))))}:host([disabled]) .track::after{background:var(--_disabled-active-track-color)}:host([disabled]) .tickmarks::before{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-disabled-container-color) 0, var(--_with-tick-marks-disabled-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}.handleContainerPadded{position:relative;block-size:100%;inline-size:100%;padding-inline:calc(var(--_state-layer-size)/2)}.handleContainerBlock{position:relative;block-size:100%;inline-size:100%}.handleContainer{position:absolute;inset-block-start:0;inset-block-end:0;inset-inline-start:calc(100%*var(--_start-fraction));inline-size:calc(100%*(var(--_end-fraction) - var(--_start-fraction)))}.handle{position:absolute;block-size:var(--_state-layer-size);inline-size:var(--_state-layer-size);border-radius:var(--_handle-shape);display:flex;place-content:center;place-items:center}.handleNub{position:absolute;height:var(--_handle-height);width:var(--_handle-width);border-radius:var(--_handle-shape);background:var(--_handle-color)}:host([disabled]) .handleNub{background:var(--_disabled-handle-color)}input.end:focus~.handleContainerPadded .handle.end>.handleNub,input.start:focus~.handleContainerPadded .handle.start>.handleNub{background:var(--_focus-handle-color)}.container>.handleContainerPadded .handle.hover>.handleNub{background:var(--_hover-handle-color)}:host(:not([disabled])) input.end:active~.handleContainerPadded .handle.end>.handleNub,:host(:not([disabled])) input.start:active~.handleContainerPadded .handle.start>.handleNub{background:var(--_pressed-handle-color)}.onTop.isOverlapping .label,.onTop.isOverlapping .label::before{outline:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}.onTop.isOverlapping .handleNub{border:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}.handle.start{inset-inline-start:calc(0px - var(--_state-layer-size)/2)}.handle.end{inset-inline-end:calc(0px - var(--_state-layer-size)/2)}.label{position:absolute;box-sizing:border-box;display:flex;padding:4px;place-content:center;place-items:center;border-radius:var(--md-sys-shape-corner-full, 9999px);color:var(--_label-text-color);font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);inset-block-end:100%;min-inline-size:var(--_label-container-height);min-block-size:var(--_label-container-height);background:var(--_label-container-color);transition:transform 100ms cubic-bezier(0.2, 0, 0, 1);transform-origin:center bottom;transform:scale(0)}:host(:focus-within) .label,.handleContainer.hover .label,:where(:has(input:active)) .label{transform:scale(1)}.label::before,.label::after{position:absolute;display:block;content:"";background:inherit}.label::before{inline-size:calc(var(--_label-container-height)/2);block-size:calc(var(--_label-container-height)/2);bottom:calc(var(--_label-container-height)/-10);transform:rotate(45deg)}.label::after{inset:0px;border-radius:inherit}.labelContent{z-index:1}input[type=range]{opacity:0;-webkit-tap-highlight-color:rgba(0,0,0,0);position:absolute;box-sizing:border-box;height:100%;width:100%;margin:0;background:rgba(0,0,0,0);cursor:pointer;pointer-events:auto;appearance:none}input[type=range]:focus{outline:none}::-webkit-slider-runnable-track{-webkit-appearance:none}::-moz-range-track{appearance:none}::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;block-size:var(--_handle-height);inline-size:var(--_handle-width);opacity:0;z-index:2}input.end::-webkit-slider-thumb{--_track-and-knob-padding: calc( (var(--_state-layer-size) - var(--_handle-width)) / 2 );--_x-translate: calc( var(--_track-and-knob-padding) - 2 * var(--_end-fraction) * var(--_track-and-knob-padding) );transform:translateX(var(--_x-translate))}input.end:dir(rtl)::-webkit-slider-thumb{transform:translateX(calc(-1 * var(--_x-translate)))}input.start::-webkit-slider-thumb{--_track-and-knob-padding: calc( (var(--_state-layer-size) - var(--_handle-width)) / 2 );--_x-translate: calc( var(--_track-and-knob-padding) - 2 * var(--_start-fraction) * var(--_track-and-knob-padding) );transform:translateX(var(--_x-translate))}input.start:dir(rtl)::-webkit-slider-thumb{transform:translateX(calc(-1 * var(--_x-translate)))}::-moz-range-thumb{appearance:none;block-size:var(--_state-layer-size);inline-size:var(--_state-layer-size);transform:scaleX(0);opacity:0;z-index:2}.ranged input.start{clip-path:inset(0 calc(100% - (var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2))) 0 0)}.ranged input.start:dir(rtl){clip-path:inset(0 0 0 calc(100% - (var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2))))}.ranged input.end{clip-path:inset(0 0 0 calc(var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2)))}.ranged input.end:dir(rtl){clip-path:inset(0 calc(var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2)) 0 0)}.onTop{z-index:1}.handle{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-ripple{border-radius:50%;height:var(--_state-layer-size);width:var(--_state-layer-size)}
`;
Pn.styleSheet;
//#endregion
//#region node_modules/@material/web/slider/slider.js
var Fn = class extends N {};
Fn.styles = [Pn, Tn], Fn = e([t("md-slider")], Fn);
//#endregion
//#region node_modules/@material/web/divider/internal/divider.js
var In = class extends He {
	constructor() {
		super(...arguments), this.inset = !1, this.insetStart = !1, this.insetEnd = !1;
	}
};
e([E({
	type: Boolean,
	reflect: !0
})], In.prototype, "inset", void 0), e([E({
	type: Boolean,
	reflect: !0,
	attribute: "inset-start"
})], In.prototype, "insetStart", void 0), e([E({
	type: Boolean,
	reflect: !0,
	attribute: "inset-end"
})], In.prototype, "insetEnd", void 0);
//#endregion
//#region node_modules/@material/web/divider/internal/divider-styles.cssresult.js
var Ln = c`:host{box-sizing:border-box;color:var(--md-divider-color, var(--md-sys-color-outline-variant, #cac4d0));display:flex;height:var(--md-divider-thickness, 1px);width:100%}:host([inset]),:host([inset-start]){padding-inline-start:16px}:host([inset]),:host([inset-end]){padding-inline-end:16px}:host::before{background:currentColor;content:"";height:100%;width:100%}@media(forced-colors: active){:host::before{background:CanvasText}}
`;
Ln.styleSheet;
//#endregion
//#region node_modules/@material/web/divider/divider.js
var Rn = class extends In {};
Rn.styles = [Ln], Rn = e([t("md-divider")], Rn);
//#endregion
//#region node_modules/@material/web/dialog/internal/animations.js
var zn = {
	dialog: [[[{ transform: "translateY(-50px)" }, { transform: "translateY(0)" }], {
		duration: 500,
		easing: Ze.EMPHASIZED
	}]],
	scrim: [[[{ opacity: 0 }, { opacity: .32 }], {
		duration: 500,
		easing: "linear"
	}]],
	container: [[[{ opacity: 0 }, { opacity: 1 }], {
		duration: 50,
		easing: "linear",
		pseudoElement: "::before"
	}], [[{ height: "35%" }, { height: "100%" }], {
		duration: 500,
		easing: Ze.EMPHASIZED,
		pseudoElement: "::before"
	}]],
	headline: [[[
		{ opacity: 0 },
		{
			opacity: 0,
			offset: .2
		},
		{ opacity: 1 }
	], {
		duration: 250,
		easing: "linear",
		fill: "forwards"
	}]],
	content: [[[
		{ opacity: 0 },
		{
			opacity: 0,
			offset: .2
		},
		{ opacity: 1 }
	], {
		duration: 250,
		easing: "linear",
		fill: "forwards"
	}]],
	actions: [[[
		{ opacity: 0 },
		{
			opacity: 0,
			offset: .5
		},
		{ opacity: 1 }
	], {
		duration: 300,
		easing: "linear",
		fill: "forwards"
	}]]
}, Bn = {
	dialog: [[[{ transform: "translateY(0)" }, { transform: "translateY(-50px)" }], {
		duration: 150,
		easing: Ze.EMPHASIZED_ACCELERATE
	}]],
	scrim: [[[{ opacity: .32 }, { opacity: 0 }], {
		duration: 150,
		easing: "linear"
	}]],
	container: [[[{ height: "100%" }, { height: "35%" }], {
		duration: 150,
		easing: Ze.EMPHASIZED_ACCELERATE,
		pseudoElement: "::before"
	}], [[{ opacity: "1" }, { opacity: "0" }], {
		delay: 100,
		duration: 50,
		easing: "linear",
		pseudoElement: "::before"
	}]],
	headline: [[[{ opacity: 1 }, { opacity: 0 }], {
		duration: 100,
		easing: "linear",
		fill: "forwards"
	}]],
	content: [[[{ opacity: 1 }, { opacity: 0 }], {
		duration: 100,
		easing: "linear",
		fill: "forwards"
	}]],
	actions: [[[{ opacity: 1 }, { opacity: 0 }], {
		duration: 100,
		easing: "linear",
		fill: "forwards"
	}]]
}, Vn = Tt(He), P = class extends Vn {
	get open() {
		return this.isOpen;
	}
	set open(e) {
		e !== this.isOpen && (this.isOpen = e, e ? (this.setAttribute("open", ""), this.show()) : (this.removeAttribute("open"), this.close()));
	}
	constructor() {
		super(), this.quick = !1, this.returnValue = "", this.noFocusTrap = !1, this.getOpenAnimation = () => zn, this.getCloseAnimation = () => Bn, this.isOpen = !1, this.isOpening = !1, this.isConnectedPromise = this.getIsConnectedPromise(), this.isAtScrollTop = !1, this.isAtScrollBottom = !1, this.nextClickIsFromContent = !1, this.hasHeadline = !1, this.hasActions = !1, this.hasIcon = !1, this.escapePressedWithoutCancel = !1, this.treewalker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT), this.addEventListener("submit", this.handleSubmit);
	}
	async show() {
		this.isOpening = !0, await this.isConnectedPromise, await this.updateComplete;
		let e = this.dialog;
		if (e.open || !this.isOpening) {
			this.isOpening = !1;
			return;
		}
		if (!this.dispatchEvent(new Event("open", { cancelable: !0 }))) {
			this.open = !1, this.isOpening = !1;
			return;
		}
		e.showModal(), this.open = !0, this.scroller && (this.scroller.scrollTop = 0), this.querySelector("[autofocus]")?.focus(), await this.animateDialog(this.getOpenAnimation()), this.dispatchEvent(new Event("opened")), this.isOpening = !1;
	}
	async close(e = this.returnValue) {
		if (this.isOpening = !1, !this.isConnected) {
			this.open = !1;
			return;
		}
		await this.updateComplete;
		let t = this.dialog;
		if (!t.open || this.isOpening) {
			this.open = !1;
			return;
		}
		let n = this.returnValue;
		if (this.returnValue = e, !this.dispatchEvent(new Event("close", { cancelable: !0 }))) {
			this.returnValue = n;
			return;
		}
		await this.animateDialog(this.getCloseAnimation()), t.close(e), this.open = !1, this.dispatchEvent(new Event("closed"));
	}
	connectedCallback() {
		super.connectedCallback(), this.isConnectedPromiseResolve();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.isConnectedPromise = this.getIsConnectedPromise();
	}
	render() {
		let e = this.open && !(this.isAtScrollTop && this.isAtScrollBottom), t = {
			"has-headline": this.hasHeadline,
			"has-actions": this.hasActions,
			"has-icon": this.hasIcon,
			scrollable: e,
			"show-top-divider": e && !this.isAtScrollTop,
			"show-bottom-divider": e && !this.isAtScrollBottom
		}, n = this.open && !this.noFocusTrap, r = A`
      <div
        class="focus-trap"
        tabindex="0"
        aria-hidden="true"
        @focus=${this.handleFocusTrapFocus}></div>
    `, { ariaLabel: i } = this;
		return A`
      <div class="scrim"></div>
      <dialog
        class=${qe(t)}
        aria-label=${i || j}
        aria-labelledby=${this.hasHeadline ? "headline" : j}
        role=${this.type === "alert" ? "alertdialog" : j}
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleClose}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue || j}>
        ${n ? r : j}
        <div class="container" @click=${this.handleContentClick}>
          <div class="headline">
            <div class="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.handleIconChange}></slot>
            </div>
            <h2 id="headline" aria-hidden=${!this.hasHeadline || j}>
              <slot
                name="headline"
                @slotchange=${this.handleHeadlineChange}></slot>
            </h2>
            <md-divider></md-divider>
          </div>
          <div class="scroller">
            <div class="content">
              <div class="top anchor"></div>
              <slot name="content"></slot>
              <div class="bottom anchor"></div>
            </div>
          </div>
          <div class="actions">
            <md-divider></md-divider>
            <slot name="actions" @slotchange=${this.handleActionsChange}></slot>
          </div>
        </div>
        ${n ? r : j}
      </dialog>
    `;
	}
	firstUpdated() {
		this.intersectionObserver = new IntersectionObserver((e) => {
			for (let t of e) this.handleAnchorIntersection(t);
		}, { root: this.scroller }), this.intersectionObserver.observe(this.topAnchor), this.intersectionObserver.observe(this.bottomAnchor);
	}
	handleDialogClick() {
		if (this.nextClickIsFromContent) {
			this.nextClickIsFromContent = !1;
			return;
		}
		this.dispatchEvent(new Event("cancel", { cancelable: !0 })) && this.close();
	}
	handleContentClick() {
		this.nextClickIsFromContent = !0;
	}
	handleSubmit(e) {
		let t = e.target, { submitter: n } = e;
		t.getAttribute("method") !== "dialog" || !n || this.close(n.getAttribute("value") ?? this.returnValue);
	}
	handleCancel(e) {
		if (e.target !== this.dialog) return;
		this.escapePressedWithoutCancel = !1;
		let t = !An(this, e);
		e.preventDefault(), !t && this.close();
	}
	handleClose() {
		this.escapePressedWithoutCancel && (this.escapePressedWithoutCancel = !1, this.dialog?.dispatchEvent(new Event("cancel", { cancelable: !0 })));
	}
	handleKeydown(e) {
		e.key === "Escape" && (this.escapePressedWithoutCancel = !0, setTimeout(() => {
			this.escapePressedWithoutCancel = !1;
		}));
	}
	async animateDialog(e) {
		if (this.cancelAnimations?.abort(), this.cancelAnimations = new AbortController(), this.quick) return;
		let { dialog: t, scrim: n, container: r, headline: i, content: a, actions: o } = this;
		if (!t || !n || !r || !i || !a || !o) return;
		let { container: s, dialog: c, scrim: l, headline: u, content: d, actions: f } = e, p = [
			[t, c ?? []],
			[n, l ?? []],
			[r, s ?? []],
			[i, u ?? []],
			[a, d ?? []],
			[o, f ?? []]
		], m = [];
		for (let [e, t] of p) for (let n of t) {
			let t = e.animate(...n);
			this.cancelAnimations.signal.addEventListener("abort", () => {
				t.cancel();
			}), m.push(t);
		}
		await Promise.all(m.map((e) => e.finished.catch(() => {})));
	}
	handleHeadlineChange(e) {
		let t = e.target;
		this.hasHeadline = t.assignedElements().length > 0;
	}
	handleActionsChange(e) {
		let t = e.target;
		this.hasActions = t.assignedElements().length > 0;
	}
	handleIconChange(e) {
		let t = e.target;
		this.hasIcon = t.assignedElements().length > 0;
	}
	handleAnchorIntersection(e) {
		let { target: t, isIntersecting: n } = e;
		t === this.topAnchor && (this.isAtScrollTop = n), t === this.bottomAnchor && (this.isAtScrollBottom = n);
	}
	getIsConnectedPromise() {
		return new Promise((e) => {
			this.isConnectedPromiseResolve = e;
		});
	}
	handleFocusTrapFocus(e) {
		let [t, n] = this.getFirstAndLastFocusableChildren();
		if (!t || !n) {
			this.dialog?.focus();
			return;
		}
		let r = e.target === this.firstFocusTrap, i = !r, a = e.relatedTarget === t, o = e.relatedTarget === n, s = !a && !o;
		if (i && o || r && s) {
			t.focus();
			return;
		}
		if (r && a || i && s) {
			n.focus();
			return;
		}
	}
	getFirstAndLastFocusableChildren() {
		if (!this.treewalker) return [null, null];
		let e = null, t = null;
		for (this.treewalker.currentNode = this.treewalker.root; this.treewalker.nextNode();) {
			let n = this.treewalker.currentNode;
			Hn(n) && (e ||= n, t = n);
		}
		return [e, t];
	}
};
e([E({ type: Boolean })], P.prototype, "open", null), e([E({ type: Boolean })], P.prototype, "quick", void 0), e([E({ attribute: !1 })], P.prototype, "returnValue", void 0), e([E()], P.prototype, "type", void 0), e([E({
	type: Boolean,
	attribute: "no-focus-trap"
})], P.prototype, "noFocusTrap", void 0), e([O("dialog")], P.prototype, "dialog", void 0), e([O(".scrim")], P.prototype, "scrim", void 0), e([O(".container")], P.prototype, "container", void 0), e([O(".headline")], P.prototype, "headline", void 0), e([O(".content")], P.prototype, "content", void 0), e([O(".actions")], P.prototype, "actions", void 0), e([D()], P.prototype, "isAtScrollTop", void 0), e([D()], P.prototype, "isAtScrollBottom", void 0), e([O(".scroller")], P.prototype, "scroller", void 0), e([O(".top.anchor")], P.prototype, "topAnchor", void 0), e([O(".bottom.anchor")], P.prototype, "bottomAnchor", void 0), e([O(".focus-trap")], P.prototype, "firstFocusTrap", void 0), e([D()], P.prototype, "hasHeadline", void 0), e([D()], P.prototype, "hasActions", void 0), e([D()], P.prototype, "hasIcon", void 0);
function Hn(e) {
	let t = ":not(:disabled,[disabled])";
	return e.matches(":is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])" + t + ":not([tabindex^=\"-\"])") ? !0 : !e.localName.includes("-") || !e.matches(t) ? !1 : e.shadowRoot?.delegatesFocus ?? !1;
}
//#endregion
//#region node_modules/@material/web/dialog/internal/dialog-styles.cssresult.js
var Un = c`:host{border-start-start-radius:var(--md-dialog-container-shape-start-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-start-end-radius:var(--md-dialog-container-shape-start-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-end-radius:var(--md-dialog-container-shape-end-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-start-radius:var(--md-dialog-container-shape-end-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));display:contents;margin:auto;max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;position:fixed;height:fit-content;width:fit-content}dialog{background:rgba(0,0,0,0);border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit}dialog[open]{display:flex}::backdrop{background:none}.scrim{background:var(--md-sys-color-scrim, #000);display:none;inset:0;opacity:32%;pointer-events:none;position:fixed;z-index:1}:host([open]) .scrim{display:flex}h2{all:unset;align-self:stretch}.headline{align-items:center;color:var(--md-dialog-headline-color, var(--md-sys-color-on-surface, #1d1b20));display:flex;flex-direction:column;font-family:var(--md-dialog-headline-font, var(--md-sys-typescale-headline-small-font, var(--md-ref-typeface-brand, Roboto)));font-size:var(--md-dialog-headline-size, var(--md-sys-typescale-headline-small-size, 1.5rem));line-height:var(--md-dialog-headline-line-height, var(--md-sys-typescale-headline-small-line-height, 2rem));font-weight:var(--md-dialog-headline-weight, var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400)));position:relative}slot[name=headline]::slotted(*){align-items:center;align-self:stretch;box-sizing:border-box;display:flex;gap:8px;padding:24px 24px 0}.icon{display:flex}slot[name=icon]::slotted(*){color:var(--md-dialog-icon-color, var(--md-sys-color-secondary, #625b71));fill:currentColor;font-size:var(--md-dialog-icon-size, 24px);margin-top:24px;height:var(--md-dialog-icon-size, 24px);width:var(--md-dialog-icon-size, 24px)}.has-icon slot[name=headline]::slotted(*){justify-content:center;padding-top:16px}.scrollable slot[name=headline]::slotted(*){padding-bottom:16px}.scrollable.has-headline slot[name=content]::slotted(*){padding-top:8px}.container{border-radius:inherit;display:flex;flex-direction:column;flex-grow:1;overflow:hidden;position:relative;transform-origin:top}.container::before{background:var(--md-dialog-container-color, var(--md-sys-color-surface-container-high, #ece6f0));border-radius:inherit;content:"";inset:0;position:absolute}.scroller{display:flex;flex:1;flex-direction:column;overflow:hidden;z-index:1}.scrollable .scroller{overflow-y:scroll}.content{color:var(--md-dialog-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-dialog-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-dialog-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-dialog-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));flex:1;font-weight:var(--md-dialog-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)));height:min-content;position:relative}slot[name=content]::slotted(*){box-sizing:border-box;padding:24px}.anchor{position:absolute}.top.anchor{top:0}.bottom.anchor{bottom:0}.actions{position:relative}slot[name=actions]::slotted(*){box-sizing:border-box;display:flex;gap:8px;justify-content:flex-end;padding:16px 24px 24px}.has-actions slot[name=content]::slotted(*){padding-bottom:8px}md-divider{display:none;position:absolute}.has-headline.show-top-divider .headline md-divider,.has-actions.show-bottom-divider .actions md-divider{display:flex}.headline md-divider{bottom:0}.actions md-divider{top:0}@media(forced-colors: active){dialog{outline:2px solid WindowText}}
`;
Un.styleSheet;
//#endregion
//#region node_modules/@material/web/dialog/dialog.js
var Wn = class extends P {};
Wn.styles = [Un], Wn = e([t("md-dialog")], Wn);
//#endregion
//#region node_modules/@material/material-color-utilities/utils/math_utils.js
function F(e) {
	return e < 0 ? -1 : e === 0 ? 0 : 1;
}
function Gn(e, t, n) {
	return (1 - n) * e + n * t;
}
function Kn(e, t, n) {
	return n < e ? e : n > t ? t : n;
}
function I(e, t, n) {
	return n < e ? e : n > t ? t : n;
}
function qn(e) {
	return e %= 360, e < 0 && (e += 360), e;
}
function Jn(e) {
	return e %= 360, e < 0 && (e += 360), e;
}
function Yn(e, t) {
	return [
		e[0] * t[0][0] + e[1] * t[0][1] + e[2] * t[0][2],
		e[0] * t[1][0] + e[1] * t[1][1] + e[2] * t[1][2],
		e[0] * t[2][0] + e[1] * t[2][1] + e[2] * t[2][2]
	];
}
//#endregion
//#region node_modules/@material/material-color-utilities/utils/color_utils.js
var Xn = [
	[
		.41233895,
		.35762064,
		.18051042
	],
	[
		.2126,
		.7152,
		.0722
	],
	[
		.01932141,
		.11916382,
		.95034478
	]
], Zn = [
	[
		3.2413774792388685,
		-1.5376652402851851,
		-.49885366846268053
	],
	[
		-.9691452513005321,
		1.8758853451067872,
		.04156585616912061
	],
	[
		.05562093689691305,
		-.20395524564742123,
		1.0571799111220335
	]
], Qn = [
	95.047,
	100,
	108.883
];
function $n(e, t, n) {
	return (255 << 24 | (e & 255) << 16 | (t & 255) << 8 | n & 255) >>> 0;
}
function er(e) {
	return $n(fr(e[0]), fr(e[1]), fr(e[2]));
}
function tr(e) {
	return e >> 16 & 255;
}
function nr(e) {
	return e >> 8 & 255;
}
function rr(e) {
	return e & 255;
}
function ir(e, t, n) {
	let r = Zn, i = r[0][0] * e + r[0][1] * t + r[0][2] * n, a = r[1][0] * e + r[1][1] * t + r[1][2] * n, o = r[2][0] * e + r[2][1] * t + r[2][2] * n;
	return $n(fr(i), fr(a), fr(o));
}
function ar(e) {
	return Yn([
		dr(tr(e)),
		dr(nr(e)),
		dr(rr(e))
	], Xn);
}
function or(e) {
	let t = dr(tr(e)), n = dr(nr(e)), r = dr(rr(e)), i = Xn, a = i[0][0] * t + i[0][1] * n + i[0][2] * r, o = i[1][0] * t + i[1][1] * n + i[1][2] * r, s = i[2][0] * t + i[2][1] * n + i[2][2] * r, c = Qn, l = a / c[0], u = o / c[1], d = s / c[2], f = mr(l), p = mr(u), m = mr(d);
	return [
		116 * p - 16,
		500 * (f - p),
		200 * (p - m)
	];
}
function sr(e) {
	let t = fr(lr(e));
	return $n(t, t, t);
}
function cr(e) {
	let t = ar(e)[1];
	return 116 * mr(t / 100) - 16;
}
function lr(e) {
	return 100 * hr((e + 16) / 116);
}
function ur(e) {
	return mr(e / 100) * 116 - 16;
}
function dr(e) {
	let t = e / 255;
	return t <= .040449936 ? t / 12.92 * 100 : ((t + .055) / 1.055) ** 2.4 * 100;
}
function fr(e) {
	let t = e / 100, n = 0;
	return n = t <= .0031308 ? t * 12.92 : 1.055 * t ** (1 / 2.4) - .055, Kn(0, 255, Math.round(n * 255));
}
function pr() {
	return Qn;
}
function mr(e) {
	return e > .008856451679035631 ? e ** (1 / 3) : (903.2962962962963 * e + 16) / 116;
}
function hr(e) {
	let t = e * e * e;
	return t > .008856451679035631 ? t : (116 * e - 16) / 903.2962962962963;
}
//#endregion
//#region node_modules/@material/material-color-utilities/hct/viewing_conditions.js
var gr = class e {
	static make(t = pr(), n = 200 / Math.PI * lr(50) / 100, r = 50, i = 2, a = !1) {
		let o = t, s = o[0] * .401288 + o[1] * .650173 + o[2] * -.051461, c = o[0] * -.250268 + o[1] * 1.204414 + o[2] * .045854, l = o[0] * -.002079 + o[1] * .048952 + o[2] * .953127, u = .8 + i / 10, d = u >= .9 ? Gn(.59, .69, (u - .9) * 10) : Gn(.525, .59, (u - .8) * 10), f = a ? 1 : u * (1 - 1 / 3.6 * Math.exp((-n - 42) / 92));
		f = f > 1 ? 1 : f < 0 ? 0 : f;
		let p = u, m = [
			100 / s * f + 1 - f,
			100 / c * f + 1 - f,
			100 / l * f + 1 - f
		], h = 1 / (5 * n + 1), g = h * h * h * h, _ = 1 - g, v = g * n + .1 * _ * _ * Math.cbrt(5 * n), y = lr(r) / t[1], b = 1.48 + Math.sqrt(y), x = .725 / y ** .2, S = x, C = [
			(v * m[0] * s / 100) ** .42,
			(v * m[1] * c / 100) ** .42,
			(v * m[2] * l / 100) ** .42
		], w = [
			400 * C[0] / (C[0] + 27.13),
			400 * C[1] / (C[1] + 27.13),
			400 * C[2] / (C[2] + 27.13)
		], T = (2 * w[0] + w[1] + .05 * w[2]) * x;
		return new e(y, T, x, S, d, p, m, v, v ** .25, b);
	}
	constructor(e, t, n, r, i, a, o, s, c, l) {
		this.n = e, this.aw = t, this.nbb = n, this.ncb = r, this.c = i, this.nc = a, this.rgbD = o, this.fl = s, this.fLRoot = c, this.z = l;
	}
};
gr.DEFAULT = gr.make();
//#endregion
//#region node_modules/@material/material-color-utilities/hct/cam16.js
var _r = class e {
	constructor(e, t, n, r, i, a, o, s, c) {
		this.hue = e, this.chroma = t, this.j = n, this.q = r, this.m = i, this.s = a, this.jstar = o, this.astar = s, this.bstar = c;
	}
	distance(e) {
		let t = this.jstar - e.jstar, n = this.astar - e.astar, r = this.bstar - e.bstar;
		return 1.41 * Math.sqrt(t * t + n * n + r * r) ** .63;
	}
	static fromInt(t) {
		return e.fromIntInViewingConditions(t, gr.DEFAULT);
	}
	static fromIntInViewingConditions(t, n) {
		let r = (t & 16711680) >> 16, i = (t & 65280) >> 8, a = t & 255, o = dr(r), s = dr(i), c = dr(a), l = .41233895 * o + .35762064 * s + .18051042 * c, u = .2126 * o + .7152 * s + .0722 * c, d = .01932141 * o + .11916382 * s + .95034478 * c, f = .401288 * l + .650173 * u - .051461 * d, p = -.250268 * l + 1.204414 * u + .045854 * d, m = -.002079 * l + .048952 * u + .953127 * d, h = n.rgbD[0] * f, g = n.rgbD[1] * p, _ = n.rgbD[2] * m, v = (n.fl * Math.abs(h) / 100) ** .42, y = (n.fl * Math.abs(g) / 100) ** .42, b = (n.fl * Math.abs(_) / 100) ** .42, x = F(h) * 400 * v / (v + 27.13), S = F(g) * 400 * y / (y + 27.13), C = F(_) * 400 * b / (b + 27.13), w = (11 * x + -12 * S + C) / 11, T = (x + S - 2 * C) / 9, ee = (20 * x + 20 * S + 21 * C) / 20, te = (40 * x + 20 * S + C) / 20, E = Jn(Math.atan2(T, w) * 180 / Math.PI), D = E * Math.PI / 180, ne = 100 * (te * n.nbb / n.aw) ** +(n.c * n.z), O = 4 / n.c * Math.sqrt(ne / 100) * (n.aw + 4) * n.fLRoot, re = E < 20.14 ? E + 360 : E, ie = (5e4 / 13 * (.25 * (Math.cos(re * Math.PI / 180 + 2) + 3.8)) * n.nc * n.ncb * Math.sqrt(w * w + T * T) / (ee + .305)) ** .9 * (1.64 - .29 ** n.n) ** .73, ae = ie * Math.sqrt(ne / 100), k = ae * n.fLRoot, oe = 50 * Math.sqrt(ie * n.c / (n.aw + 4)), se = (1 + 100 * .007) * ne / (1 + .007 * ne), ce = 1 / .0228 * Math.log(1 + .0228 * k), le = ce * Math.cos(D), ue = ce * Math.sin(D);
		return new e(E, ae, ne, O, k, oe, se, le, ue);
	}
	static fromJch(t, n, r) {
		return e.fromJchInViewingConditions(t, n, r, gr.DEFAULT);
	}
	static fromJchInViewingConditions(t, n, r, i) {
		let a = 4 / i.c * Math.sqrt(t / 100) * (i.aw + 4) * i.fLRoot, o = n * i.fLRoot, s = n / Math.sqrt(t / 100), c = 50 * Math.sqrt(s * i.c / (i.aw + 4)), l = r * Math.PI / 180, u = (1 + 100 * .007) * t / (1 + .007 * t), d = 1 / .0228 * Math.log(1 + .0228 * o), f = d * Math.cos(l), p = d * Math.sin(l);
		return new e(r, n, t, a, o, c, u, f, p);
	}
	static fromUcs(t, n, r) {
		return e.fromUcsInViewingConditions(t, n, r, gr.DEFAULT);
	}
	static fromUcsInViewingConditions(t, n, r, i) {
		let a = n, o = r, s = Math.sqrt(a * a + o * o), c = (Math.exp(s * .0228) - 1) / .0228 / i.fLRoot, l = 180 / Math.PI * Math.atan2(o, a);
		l < 0 && (l += 360);
		let u = t / (1 - (t - 100) * .007);
		return e.fromJchInViewingConditions(u, c, l, i);
	}
	toInt() {
		return this.viewed(gr.DEFAULT);
	}
	viewed(e) {
		let t = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** e.n) ** .73) ** (1 / .9), n = this.hue * Math.PI / 180, r = .25 * (Math.cos(n + 2) + 3.8), i = e.aw * (this.j / 100) ** (1 / e.c / e.z), a = 5e4 / 13 * r * e.nc * e.ncb, o = i / e.nbb, s = Math.sin(n), c = Math.cos(n), l = 23 * (o + .305) * t / (23 * a + 11 * t * c + 108 * t * s), u = l * c, d = l * s, f = (460 * o + 451 * u + 288 * d) / 1403, p = (460 * o - 891 * u - 261 * d) / 1403, m = (460 * o - 220 * u - 6300 * d) / 1403, h = Math.max(0, 27.13 * Math.abs(f) / (400 - Math.abs(f))), g = F(f) * (100 / e.fl) * h ** (1 / .42), _ = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), v = F(p) * (100 / e.fl) * _ ** (1 / .42), y = Math.max(0, 27.13 * Math.abs(m) / (400 - Math.abs(m))), b = F(m) * (100 / e.fl) * y ** (1 / .42), x = g / e.rgbD[0], S = v / e.rgbD[1], C = b / e.rgbD[2];
		return ir(1.86206786 * x - 1.01125463 * S + .14918677 * C, .38752654 * x + .62144744 * S - .00897398 * C, -.0158415 * x - .03412294 * S + 1.04996444 * C);
	}
	static fromXyzInViewingConditions(t, n, r, i) {
		let a = .401288 * t + .650173 * n - .051461 * r, o = -.250268 * t + 1.204414 * n + .045854 * r, s = -.002079 * t + .048952 * n + .953127 * r, c = i.rgbD[0] * a, l = i.rgbD[1] * o, u = i.rgbD[2] * s, d = (i.fl * Math.abs(c) / 100) ** .42, f = (i.fl * Math.abs(l) / 100) ** .42, p = (i.fl * Math.abs(u) / 100) ** .42, m = F(c) * 400 * d / (d + 27.13), h = F(l) * 400 * f / (f + 27.13), g = F(u) * 400 * p / (p + 27.13), _ = (11 * m + -12 * h + g) / 11, v = (m + h - 2 * g) / 9, y = (20 * m + 20 * h + 21 * g) / 20, b = (40 * m + 20 * h + g) / 20, x = Math.atan2(v, _) * 180 / Math.PI, S = x < 0 ? x + 360 : x >= 360 ? x - 360 : x, C = S * Math.PI / 180, w = 100 * (b * i.nbb / i.aw) ** +(i.c * i.z), T = 4 / i.c * Math.sqrt(w / 100) * (i.aw + 4) * i.fLRoot, ee = S < 20.14 ? S + 360 : S, te = (5e4 / 13 * (1 / 4 * (Math.cos(ee * Math.PI / 180 + 2) + 3.8)) * i.nc * i.ncb * Math.sqrt(_ * _ + v * v) / (y + .305)) ** .9 * (1.64 - .29 ** i.n) ** .73, E = te * Math.sqrt(w / 100), D = E * i.fLRoot, ne = 50 * Math.sqrt(te * i.c / (i.aw + 4)), O = (1 + 100 * .007) * w / (1 + .007 * w), re = Math.log(1 + .0228 * D) / .0228, ie = re * Math.cos(C), ae = re * Math.sin(C);
		return new e(S, E, w, T, D, ne, O, ie, ae);
	}
	xyzInViewingConditions(e) {
		let t = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** e.n) ** .73) ** (1 / .9), n = this.hue * Math.PI / 180, r = .25 * (Math.cos(n + 2) + 3.8), i = e.aw * (this.j / 100) ** (1 / e.c / e.z), a = 5e4 / 13 * r * e.nc * e.ncb, o = i / e.nbb, s = Math.sin(n), c = Math.cos(n), l = 23 * (o + .305) * t / (23 * a + 11 * t * c + 108 * t * s), u = l * c, d = l * s, f = (460 * o + 451 * u + 288 * d) / 1403, p = (460 * o - 891 * u - 261 * d) / 1403, m = (460 * o - 220 * u - 6300 * d) / 1403, h = Math.max(0, 27.13 * Math.abs(f) / (400 - Math.abs(f))), g = F(f) * (100 / e.fl) * h ** (1 / .42), _ = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), v = F(p) * (100 / e.fl) * _ ** (1 / .42), y = Math.max(0, 27.13 * Math.abs(m) / (400 - Math.abs(m))), b = F(m) * (100 / e.fl) * y ** (1 / .42), x = g / e.rgbD[0], S = v / e.rgbD[1], C = b / e.rgbD[2];
		return [
			1.86206786 * x - 1.01125463 * S + .14918677 * C,
			.38752654 * x + .62144744 * S - .00897398 * C,
			-.0158415 * x - .03412294 * S + 1.04996444 * C
		];
	}
}, vr = class e {
	static sanitizeRadians(e) {
		return (e + Math.PI * 8) % (Math.PI * 2);
	}
	static trueDelinearized(e) {
		let t = e / 100, n = 0;
		return n = t <= .0031308 ? t * 12.92 : 1.055 * t ** (1 / 2.4) - .055, n * 255;
	}
	static chromaticAdaptation(e) {
		let t = Math.abs(e) ** .42;
		return F(e) * 400 * t / (t + 27.13);
	}
	static hueOf(t) {
		let n = Yn(t, e.SCALED_DISCOUNT_FROM_LINRGB), r = e.chromaticAdaptation(n[0]), i = e.chromaticAdaptation(n[1]), a = e.chromaticAdaptation(n[2]), o = (11 * r + -12 * i + a) / 11, s = (r + i - 2 * a) / 9;
		return Math.atan2(s, o);
	}
	static areInCyclicOrder(t, n, r) {
		return e.sanitizeRadians(n - t) < e.sanitizeRadians(r - t);
	}
	static intercept(e, t, n) {
		return (t - e) / (n - e);
	}
	static lerpPoint(e, t, n) {
		return [
			e[0] + (n[0] - e[0]) * t,
			e[1] + (n[1] - e[1]) * t,
			e[2] + (n[2] - e[2]) * t
		];
	}
	static setCoordinate(t, n, r, i) {
		let a = e.intercept(t[i], n, r[i]);
		return e.lerpPoint(t, a, r);
	}
	static isBounded(e) {
		return 0 <= e && e <= 100;
	}
	static nthVertex(t, n) {
		let r = e.Y_FROM_LINRGB[0], i = e.Y_FROM_LINRGB[1], a = e.Y_FROM_LINRGB[2], o = n % 4 <= 1 ? 0 : 100, s = n % 2 == 0 ? 0 : 100;
		if (n < 4) {
			let n = o, c = s, l = (t - n * i - c * a) / r;
			return e.isBounded(l) ? [
				l,
				n,
				c
			] : [
				-1,
				-1,
				-1
			];
		}
		if (n < 8) {
			let n = o, c = s, l = (t - c * r - n * a) / i;
			return e.isBounded(l) ? [
				c,
				l,
				n
			] : [
				-1,
				-1,
				-1
			];
		}
		{
			let n = o, c = s, l = (t - n * r - c * i) / a;
			return e.isBounded(l) ? [
				n,
				c,
				l
			] : [
				-1,
				-1,
				-1
			];
		}
	}
	static bisectToSegment(t, n) {
		let r = [
			-1,
			-1,
			-1
		], i = r, a = 0, o = 0, s = !1, c = !0;
		for (let l = 0; l < 12; l++) {
			let u = e.nthVertex(t, l);
			if (u[0] < 0) continue;
			let d = e.hueOf(u);
			if (!s) {
				r = u, i = u, a = d, o = d, s = !0;
				continue;
			}
			(c || e.areInCyclicOrder(a, d, o)) && (c = !1, e.areInCyclicOrder(a, n, d) ? (i = u, o = d) : (r = u, a = d));
		}
		return [r, i];
	}
	static midpoint(e, t) {
		return [
			(e[0] + t[0]) / 2,
			(e[1] + t[1]) / 2,
			(e[2] + t[2]) / 2
		];
	}
	static criticalPlaneBelow(e) {
		return Math.floor(e - .5);
	}
	static criticalPlaneAbove(e) {
		return Math.ceil(e - .5);
	}
	static bisectToLimit(t, n) {
		let r = e.bisectToSegment(t, n), i = r[0], a = e.hueOf(i), o = r[1];
		for (let t = 0; t < 3; t++) if (i[t] !== o[t]) {
			let r = -1, s = 255;
			i[t] < o[t] ? (r = e.criticalPlaneBelow(e.trueDelinearized(i[t])), s = e.criticalPlaneAbove(e.trueDelinearized(o[t]))) : (r = e.criticalPlaneAbove(e.trueDelinearized(i[t])), s = e.criticalPlaneBelow(e.trueDelinearized(o[t])));
			for (let c = 0; c < 8 && !(Math.abs(s - r) <= 1); c++) {
				let c = Math.floor((r + s) / 2), l = e.CRITICAL_PLANES[c], u = e.setCoordinate(i, l, o, t), d = e.hueOf(u);
				e.areInCyclicOrder(a, n, d) ? (o = u, s = c) : (i = u, a = d, r = c);
			}
		}
		return e.midpoint(i, o);
	}
	static inverseChromaticAdaptation(e) {
		let t = Math.abs(e), n = Math.max(0, 27.13 * t / (400 - t));
		return F(e) * n ** (1 / .42);
	}
	static findResultByJ(t, n, r) {
		let i = Math.sqrt(r) * 11, a = gr.DEFAULT, o = 1 / (1.64 - .29 ** a.n) ** .73, s = .25 * (Math.cos(t + 2) + 3.8) * (5e4 / 13) * a.nc * a.ncb, c = Math.sin(t), l = Math.cos(t);
		for (let t = 0; t < 5; t++) {
			let u = i / 100, d = ((n === 0 || i === 0 ? 0 : n / Math.sqrt(u)) * o) ** (1 / .9), f = a.aw * u ** (1 / a.c / a.z) / a.nbb, p = 23 * (f + .305) * d / (23 * s + 11 * d * l + 108 * d * c), m = p * l, h = p * c, g = (460 * f + 451 * m + 288 * h) / 1403, _ = (460 * f - 891 * m - 261 * h) / 1403, v = (460 * f - 220 * m - 6300 * h) / 1403, y = Yn([
				e.inverseChromaticAdaptation(g),
				e.inverseChromaticAdaptation(_),
				e.inverseChromaticAdaptation(v)
			], e.LINRGB_FROM_SCALED_DISCOUNT);
			if (y[0] < 0 || y[1] < 0 || y[2] < 0) return 0;
			let b = e.Y_FROM_LINRGB[0], x = e.Y_FROM_LINRGB[1], S = e.Y_FROM_LINRGB[2], C = b * y[0] + x * y[1] + S * y[2];
			if (C <= 0) return 0;
			if (t === 4 || Math.abs(C - r) < .002) return y[0] > 100.01 || y[1] > 100.01 || y[2] > 100.01 ? 0 : er(y);
			i -= (C - r) * i / (2 * C);
		}
		return 0;
	}
	static solveToInt(t, n, r) {
		if (n < 1e-4 || r < 1e-4 || r > 99.9999) return sr(r);
		t = Jn(t);
		let i = t / 180 * Math.PI, a = lr(r), o = e.findResultByJ(i, n, a);
		return o === 0 ? er(e.bisectToLimit(a, i)) : o;
	}
	static solveToCam(t, n, r) {
		return _r.fromInt(e.solveToInt(t, n, r));
	}
};
vr.SCALED_DISCOUNT_FROM_LINRGB = [
	[
		.001200833568784504,
		.002389694492170889,
		.0002795742885861124
	],
	[
		.0005891086651375999,
		.0029785502573438758,
		.0003270666104008398
	],
	[
		.00010146692491640572,
		.0005364214359186694,
		.0032979401770712076
	]
], vr.LINRGB_FROM_SCALED_DISCOUNT = [
	[
		1373.2198709594231,
		-1100.4251190754821,
		-7.278681089101213
	],
	[
		-271.815969077903,
		559.6580465940733,
		-32.46047482791194
	],
	[
		1.9622899599665666,
		-57.173814538844006,
		308.7233197812385
	]
], vr.Y_FROM_LINRGB = [
	.2126,
	.7152,
	.0722
], vr.CRITICAL_PLANES = [
	.015176349177441876,
	.045529047532325624,
	.07588174588720938,
	.10623444424209313,
	.13658714259697685,
	.16693984095186062,
	.19729253930674434,
	.2276452376616281,
	.2579979360165119,
	.28835063437139563,
	.3188300904430532,
	.350925934958123,
	.3848314933096426,
	.42057480301049466,
	.458183274052838,
	.4976837250274023,
	.5391024159806381,
	.5824650784040898,
	.6277969426914107,
	.6751227633498623,
	.7244668422128921,
	.775853049866786,
	.829304845476233,
	.8848452951698498,
	.942497089126609,
	1.0022825574869039,
	1.0642236851973577,
	1.1283421258858297,
	1.1946592148522128,
	1.2631959812511864,
	1.3339731595349034,
	1.407011200216447,
	1.4823302800086415,
	1.5599503113873272,
	1.6398909516233677,
	1.7221716113234105,
	1.8068114625156377,
	1.8938294463134073,
	1.9832442801866852,
	2.075074464868551,
	2.1693382909216234,
	2.2660538449872063,
	2.36523901573795,
	2.4669114995532007,
	2.5710888059345764,
	2.6777882626779785,
	2.7870270208169257,
	2.898822059350997,
	3.0131901897720907,
	3.1301480604002863,
	3.2497121605402226,
	3.3718988244681087,
	3.4967242352587946,
	3.624204428461639,
	3.754355295633311,
	3.887192587735158,
	4.022731918402185,
	4.160988767090289,
	4.301978482107941,
	4.445716283538092,
	4.592217266055746,
	4.741496401646282,
	4.893568542229298,
	5.048448422192488,
	5.20615066083972,
	5.3666897647573375,
	5.5300801301023865,
	5.696336044816294,
	5.865471690767354,
	6.037501145825082,
	6.212438385869475,
	6.390297286737924,
	6.571091626112461,
	6.7548350853498045,
	6.941541251256611,
	7.131223617812143,
	7.323895587840543,
	7.5195704746346665,
	7.7182615035334345,
	7.919981813454504,
	8.124744458384042,
	8.332562408825165,
	8.543448553206703,
	8.757415699253682,
	8.974476575321063,
	9.194643831691977,
	9.417930041841839,
	9.644347703669503,
	9.873909240696694,
	10.106627003236781,
	10.342513269534024,
	10.58158024687427,
	10.8238400726681,
	11.069304815507364,
	11.317986476196008,
	11.569896988756009,
	11.825048221409341,
	12.083451977536606,
	12.345119996613247,
	12.610063955123938,
	12.878295467455942,
	13.149826086772048,
	13.42466730586372,
	13.702830557985108,
	13.984327217668513,
	14.269168601521828,
	14.55736596900856,
	14.848930523210871,
	15.143873411576273,
	15.44220572664832,
	15.743938506781891,
	16.04908273684337,
	16.35764934889634,
	16.66964922287304,
	16.985093187232053,
	17.30399201960269,
	17.62635644741625,
	17.95219714852476,
	18.281524751807332,
	18.614349837764564,
	18.95068293910138,
	19.290534541298456,
	19.633915083172692,
	19.98083495742689,
	20.331304511189067,
	20.685334046541502,
	21.042933821039977,
	21.404114048223256,
	21.76888489811322,
	22.137256497705877,
	22.50923893145328,
	22.884842241736916,
	23.264076429332462,
	23.6469514538663,
	24.033477234264016,
	24.42366364919083,
	24.817520537484558,
	25.21505769858089,
	25.61628489293138,
	26.021211842414342,
	26.429848230738664,
	26.842203703840827,
	27.258287870275353,
	27.678110301598522,
	28.10168053274597,
	28.529008062403893,
	28.96010235337422,
	29.39497283293396,
	29.83362889318845,
	30.276079891419332,
	30.722335150426627,
	31.172403958865512,
	31.62629557157785,
	32.08401920991837,
	32.54558406207592,
	33.010999283389665,
	33.4802739966603,
	33.953417292456834,
	34.430438229418264,
	34.911345834551085,
	35.39614910352207,
	35.88485700094671,
	36.37747846067349,
	36.87402238606382,
	37.37449765026789,
	37.87891309649659,
	38.38727753828926,
	38.89959975977785,
	39.41588851594697,
	39.93615253289054,
	40.460400508064545,
	40.98864111053629,
	41.520882981230194,
	42.05713473317016,
	42.597404951718396,
	43.141702194811224,
	43.6900349931913,
	44.24241185063697,
	44.798841244188324,
	45.35933162437017,
	45.92389141541209,
	46.49252901546552,
	47.065252796817916,
	47.64207110610409,
	48.22299226451468,
	48.808024568002054,
	49.3971762874833,
	49.9904556690408,
	50.587870934119984,
	51.189430279724725,
	51.79514187861014,
	52.40501387947288,
	53.0190544071392,
	53.637271562750364,
	54.259673423945976,
	54.88626804504493,
	55.517063457223934,
	56.15206766869424,
	56.79128866487574,
	57.43473440856916,
	58.08241284012621,
	58.734331877617365,
	59.39049941699807,
	60.05092333227251,
	60.715611475655585,
	61.38457167773311,
	62.057811747619894,
	62.7353394731159,
	63.417162620860914,
	64.10328893648692,
	64.79372614476921,
	65.48848194977529,
	66.18756403501224,
	66.89098006357258,
	67.59873767827808,
	68.31084450182222,
	69.02730813691093,
	69.74813616640164,
	70.47333615344107,
	71.20291564160104,
	71.93688215501312,
	72.67524319850172,
	73.41800625771542,
	74.16517879925733,
	74.9167682708136,
	75.67278210128072,
	76.43322770089146,
	77.1981124613393,
	77.96744375590167,
	78.74122893956174,
	79.51947534912904,
	80.30219030335869,
	81.08938110306934,
	81.88105503125999,
	82.67721935322541,
	83.4778813166706,
	84.28304815182372,
	85.09272707154808,
	85.90692527145302,
	86.72564993000343,
	87.54890820862819,
	88.3767072518277,
	89.2090541872801,
	90.04595612594655,
	90.88742016217518,
	91.73345337380438,
	92.58406282226491,
	93.43925555268066,
	94.29903859396902,
	95.16341895893969,
	96.03240364439274,
	96.9059996312159,
	97.78421388448044,
	98.6670533535366,
	99.55452497210776
];
//#endregion
//#region node_modules/@material/material-color-utilities/hct/hct.js
var L = class e {
	static from(t, n, r) {
		return new e(vr.solveToInt(t, n, r));
	}
	static fromInt(t) {
		return new e(t);
	}
	toInt() {
		return this.argb;
	}
	get hue() {
		return this.internalHue;
	}
	set hue(e) {
		this.setInternalState(vr.solveToInt(e, this.internalChroma, this.internalTone));
	}
	get chroma() {
		return this.internalChroma;
	}
	set chroma(e) {
		this.setInternalState(vr.solveToInt(this.internalHue, e, this.internalTone));
	}
	get tone() {
		return this.internalTone;
	}
	set tone(e) {
		this.setInternalState(vr.solveToInt(this.internalHue, this.internalChroma, e));
	}
	setValue(e, t) {
		this[e] = t;
	}
	toString() {
		return `HCT(${this.hue.toFixed(0)}, ${this.chroma.toFixed(0)}, ${this.tone.toFixed(0)})`;
	}
	static isBlue(e) {
		return e >= 250 && e < 270;
	}
	static isYellow(e) {
		return e >= 105 && e < 125;
	}
	static isCyan(e) {
		return e >= 170 && e < 207;
	}
	constructor(e) {
		this.argb = e;
		let t = _r.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = cr(e), this.argb = e;
	}
	setInternalState(e) {
		let t = _r.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = cr(e), this.argb = e;
	}
	inViewingConditions(t) {
		let n = _r.fromInt(this.toInt()).xyzInViewingConditions(t), r = _r.fromXyzInViewingConditions(n[0], n[1], n[2], gr.make());
		return e.from(r.hue, r.chroma, ur(n[1]));
	}
}, R = class e {
	static ratioOfTones(t, n) {
		return t = I(0, 100, t), n = I(0, 100, n), e.ratioOfYs(lr(t), lr(n));
	}
	static ratioOfYs(e, t) {
		let n = e > t ? e : t, r = n === t ? e : t;
		return (n + 5) / (r + 5);
	}
	static lighter(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = lr(t), i = n * (r + 5) - 5, a = e.ratioOfYs(i, r), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = ur(i) + .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static darker(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = lr(t), i = (r + 5) / n - 5, a = e.ratioOfYs(r, i), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = ur(i) - .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static lighterUnsafe(t, n) {
		let r = e.lighter(t, n);
		return r < 0 ? 100 : r;
	}
	static darkerUnsafe(t, n) {
		let r = e.darker(t, n);
		return r < 0 ? 0 : r;
	}
}, yr = class e {
	static isDisliked(e) {
		let t = Math.round(e.hue) >= 90 && Math.round(e.hue) <= 111, n = Math.round(e.chroma) > 16, r = Math.round(e.tone) < 65;
		return t && n && r;
	}
	static fixIfDisliked(t) {
		return e.isDisliked(t) ? L.from(t.hue, t.chroma, 70) : t;
	}
};
//#endregion
//#region node_modules/@material/material-color-utilities/dynamiccolor/dynamic_color.js
function br(e, t, n) {
	if (e.name !== n.name) throw Error(`Attempting to extend color ${e.name} with color ${n.name} of different name for spec version ${t}.`);
	if (e.isBackground !== n.isBackground) throw Error(`Attempting to extend color ${e.name} as a ${e.isBackground ? "background" : "foreground"} with color ${n.name} as a ${n.isBackground ? "background" : "foreground"} for spec version ${t}.`);
}
function z(e, t, n) {
	return br(e, t, n), B.fromPalette({
		name: e.name,
		palette: (r) => r.specVersion === t ? n.palette(r) : e.palette(r),
		tone: (r) => r.specVersion === t ? n.tone(r) : e.tone(r),
		isBackground: e.isBackground,
		chromaMultiplier: (r) => {
			let i = r.specVersion === t ? n.chromaMultiplier : e.chromaMultiplier;
			return i === void 0 ? 1 : i(r);
		},
		background: (r) => {
			let i = r.specVersion === t ? n.background : e.background;
			return i === void 0 ? void 0 : i(r);
		},
		secondBackground: (r) => {
			let i = r.specVersion === t ? n.secondBackground : e.secondBackground;
			return i === void 0 ? void 0 : i(r);
		},
		contrastCurve: (r) => {
			let i = r.specVersion === t ? n.contrastCurve : e.contrastCurve;
			return i === void 0 ? void 0 : i(r);
		},
		toneDeltaPair: (r) => {
			let i = r.specVersion === t ? n.toneDeltaPair : e.toneDeltaPair;
			return i === void 0 ? void 0 : i(r);
		}
	});
}
var B = class e {
	static fromPalette(t) {
		return new e(t.name ?? "", t.palette, t.tone ?? e.getInitialToneFromBackground(t.background), t.isBackground ?? !1, t.chromaMultiplier, t.background, t.secondBackground, t.contrastCurve, t.toneDeltaPair);
	}
	static getInitialToneFromBackground(e) {
		return e === void 0 ? (e) => 50 : (t) => e(t) ? e(t).getTone(t) : 50;
	}
	constructor(e, t, n, r, i, a, o, s, c) {
		if (this.name = e, this.palette = t, this.tone = n, this.isBackground = r, this.chromaMultiplier = i, this.background = a, this.secondBackground = o, this.contrastCurve = s, this.toneDeltaPair = c, this.hctCache = /* @__PURE__ */ new Map(), !a && o) throw Error(`Color ${e} has secondBackgrounddefined, but background is not defined.`);
		if (!a && s) throw Error(`Color ${e} has contrastCurvedefined, but background is not defined.`);
		if (a && !s) throw Error(`Color ${e} has backgrounddefined, but contrastCurve is not defined.`);
	}
	clone() {
		return e.fromPalette({
			name: this.name,
			palette: this.palette,
			tone: this.tone,
			isBackground: this.isBackground,
			chromaMultiplier: this.chromaMultiplier,
			background: this.background,
			secondBackground: this.secondBackground,
			contrastCurve: this.contrastCurve,
			toneDeltaPair: this.toneDeltaPair
		});
	}
	clearCache() {
		this.hctCache.clear();
	}
	getArgb(e) {
		return this.getHct(e).toInt();
	}
	getHct(e) {
		let t = this.hctCache.get(e);
		if (t != null) return t;
		let n = Tr(e.specVersion).getHct(e, this);
		return this.hctCache.size > 4 && this.hctCache.clear(), this.hctCache.set(e, n), n;
	}
	getTone(e) {
		return Tr(e.specVersion).getTone(e, this);
	}
	static foregroundTone(t, n) {
		let r = R.lighterUnsafe(t, n), i = R.darkerUnsafe(t, n), a = R.ratioOfTones(r, t), o = R.ratioOfTones(i, t);
		if (e.tonePrefersLightForeground(t)) {
			let e = Math.abs(a - o) < .1 && a < n && o < n;
			return a >= n || a >= o || e ? r : i;
		}
		return o >= n || o >= a ? i : r;
	}
	static tonePrefersLightForeground(e) {
		return Math.round(e) < 60;
	}
	static toneAllowsLightForeground(e) {
		return Math.round(e) <= 49;
	}
	static enableLightForeground(t) {
		return e.tonePrefersLightForeground(t) && !e.toneAllowsLightForeground(t) ? 49 : t;
	}
}, xr = class {
	getHct(e, t) {
		let n = t.getTone(e);
		return t.palette(e).getHct(n);
	}
	getTone(e, t) {
		let n = e.contrastLevel < 0, r = t.toneDeltaPair ? t.toneDeltaPair(e) : void 0;
		if (r) {
			let i = r.roleA, a = r.roleB, o = r.delta, s = r.polarity, c = r.stayTogether, l = s === "nearer" || s === "lighter" && !e.isDark || s === "darker" && e.isDark, u = l ? i : a, d = l ? a : i, f = t.name === u.name, p = e.isDark ? 1 : -1, m = u.tone(e), h = d.tone(e);
			if (t.background && u.contrastCurve && d.contrastCurve) {
				let r = t.background(e), i = u.contrastCurve(e), a = d.contrastCurve(e);
				if (r && i && a) {
					let t = r.getTone(e), o = i.get(e.contrastLevel), s = a.get(e.contrastLevel);
					R.ratioOfTones(t, m) < o && (m = B.foregroundTone(t, o)), R.ratioOfTones(t, h) < s && (h = B.foregroundTone(t, s)), n && (m = B.foregroundTone(t, o), h = B.foregroundTone(t, s));
				}
			}
			return (h - m) * p < o && (h = I(0, 100, m + o * p), (h - m) * p >= o || (m = I(0, 100, h - o * p))), 50 <= m && m < 60 ? p > 0 ? (m = 60, h = Math.max(h, m + o * p)) : (m = 49, h = Math.min(h, m + o * p)) : 50 <= h && h < 60 && (c ? p > 0 ? (m = 60, h = Math.max(h, m + o * p)) : (m = 49, h = Math.min(h, m + o * p)) : h = p > 0 ? 60 : 49), f ? m : h;
		}
		{
			let r = t.tone(e);
			if (t.background == null || t.background(e) === void 0 || t.contrastCurve == null || t.contrastCurve(e) === void 0) return r;
			let i = t.background(e).getTone(e), a = t.contrastCurve(e).get(e.contrastLevel);
			if (R.ratioOfTones(i, r) >= a || (r = B.foregroundTone(i, a)), n && (r = B.foregroundTone(i, a)), t.isBackground && 50 <= r && r < 60 && (r = R.ratioOfTones(49, i) >= a ? 49 : 60), t.secondBackground == null || t.secondBackground(e) === void 0) return r;
			let [o, s] = [t.background, t.secondBackground], [c, l] = [o(e).getTone(e), s(e).getTone(e)], [u, d] = [Math.max(c, l), Math.min(c, l)];
			if (R.ratioOfTones(u, r) >= a && R.ratioOfTones(d, r) >= a) return r;
			let f = R.lighter(u, a), p = R.darker(d, a), m = [];
			return f !== -1 && m.push(f), p !== -1 && m.push(p), B.tonePrefersLightForeground(c) || B.tonePrefersLightForeground(l) ? f < 0 ? 100 : f : m.length === 1 ? m[0] : p < 0 ? 0 : p;
		}
	}
}, Sr = class {
	getHct(e, t) {
		let n = t.palette(e), r = t.getTone(e), i = n.hue, a = n.chroma * (t.chromaMultiplier ? t.chromaMultiplier(e) : 1);
		return L.from(i, a, r);
	}
	getTone(e, t) {
		let n = t.toneDeltaPair ? t.toneDeltaPair(e) : void 0;
		if (n) {
			let r = n.roleA, i = n.roleB, a = n.polarity, o = n.constraint, s = a === "darker" || a === "relative_lighter" && e.isDark || a === "relative_darker" && !e.isDark ? -n.delta : n.delta, c = t.name === r.name, l = c ? r : i, u = c ? i : r, d = l.tone(e), f = u.getTone(e), p = s * (c ? 1 : -1);
			if (o === "exact" ? d = I(0, 100, f + p) : o === "nearer" ? d = p > 0 ? I(0, 100, I(f, f + p, d)) : I(0, 100, I(f + p, f, d)) : o === "farther" && (d = p > 0 ? I(f + p, 100, d) : I(0, f + p, d)), t.background && t.contrastCurve) {
				let n = t.background(e), r = t.contrastCurve(e);
				if (n && r) {
					let t = n.getTone(e), i = r.get(e.contrastLevel);
					d = R.ratioOfTones(t, d) >= i && e.contrastLevel >= 0 ? d : B.foregroundTone(t, i);
				}
			}
			return t.isBackground && !t.name.endsWith("_fixed_dim") && (d = d >= 57 ? I(65, 100, d) : I(0, 49, d)), d;
		}
		{
			let n = t.tone(e);
			if (t.background == null || t.background(e) === void 0 || t.contrastCurve == null || t.contrastCurve(e) === void 0) return n;
			let r = t.background(e).getTone(e), i = t.contrastCurve(e).get(e.contrastLevel);
			if (n = R.ratioOfTones(r, n) >= i && e.contrastLevel >= 0 ? n : B.foregroundTone(r, i), t.isBackground && !t.name.endsWith("_fixed_dim") && (n = n >= 57 ? I(65, 100, n) : I(0, 49, n)), t.secondBackground == null || t.secondBackground(e) === void 0) return n;
			let [a, o] = [t.background, t.secondBackground], [s, c] = [a(e).getTone(e), o(e).getTone(e)], [l, u] = [Math.max(s, c), Math.min(s, c)];
			if (R.ratioOfTones(l, n) >= i && R.ratioOfTones(u, n) >= i) return n;
			let d = R.lighter(l, i), f = R.darker(u, i), p = [];
			return d !== -1 && p.push(d), f !== -1 && p.push(f), B.tonePrefersLightForeground(s) || B.tonePrefersLightForeground(c) ? d < 0 ? 100 : d : p.length === 1 ? p[0] : f < 0 ? 0 : f;
		}
	}
}, Cr = new xr(), wr = new Sr();
function Tr(e) {
	return e === "2025" ? wr : Cr;
}
//#endregion
//#region node_modules/@material/material-color-utilities/palettes/tonal_palette.js
var V = class e {
	static fromInt(t) {
		let n = L.fromInt(t);
		return e.fromHct(n);
	}
	static fromHct(t) {
		return new e(t.hue, t.chroma, t);
	}
	static fromHueAndChroma(t, n) {
		let r = new Er(t, n).create();
		return new e(t, n, r);
	}
	constructor(e, t, n) {
		this.hue = e, this.chroma = t, this.keyColor = n, this.cache = /* @__PURE__ */ new Map();
	}
	tone(e) {
		let t = this.cache.get(e);
		return t === void 0 && (t = e == 99 && L.isYellow(this.hue) ? this.averageArgb(this.tone(98), this.tone(100)) : L.from(this.hue, this.chroma, e).toInt(), this.cache.set(e, t)), t;
	}
	getHct(e) {
		return L.fromInt(this.tone(e));
	}
	averageArgb(e, t) {
		let n = e >>> 16 & 255, r = e >>> 8 & 255, i = e & 255, a = t >>> 16 & 255, o = t >>> 8 & 255, s = t & 255, c = Math.round((n + a) / 2), l = Math.round((r + o) / 2), u = Math.round((i + s) / 2);
		return (255 << 24 | (c & 255) << 16 | (l & 255) << 8 | u & 255) >>> 0;
	}
}, Er = class {
	constructor(e, t) {
		this.hue = e, this.requestedChroma = t, this.chromaCache = /* @__PURE__ */ new Map(), this.maxChromaValue = 200;
	}
	create() {
		let e = 0, t = 100;
		for (; e < t;) {
			let n = Math.floor((e + t) / 2), r = this.maxChroma(n) < this.maxChroma(n + 1);
			if (this.maxChroma(n) >= this.requestedChroma - .01) {
				if (Math.abs(e - 50) < Math.abs(t - 50)) t = n;
				else {
					if (e === n) return L.from(this.hue, this.requestedChroma, e);
					e = n;
				}
			} else r ? e = n + 1 : t = n;
		}
		return L.from(this.hue, this.requestedChroma, e);
	}
	maxChroma(e) {
		if (this.chromaCache.has(e)) return this.chromaCache.get(e);
		let t = L.from(this.hue, this.maxChromaValue, e).chroma;
		return this.chromaCache.set(e, t), t;
	}
}, Dr = class e {
	constructor(e) {
		this.input = e, this.hctsByTempCache = [], this.hctsByHueCache = [], this.tempsByHctCache = /* @__PURE__ */ new Map(), this.inputRelativeTemperatureCache = -1, this.complementCache = null;
	}
	get hctsByTemp() {
		if (this.hctsByTempCache.length > 0) return this.hctsByTempCache;
		let e = this.hctsByHue.concat([this.input]), t = this.tempsByHct;
		return e.sort((e, n) => t.get(e) - t.get(n)), this.hctsByTempCache = e, e;
	}
	get warmest() {
		return this.hctsByTemp[this.hctsByTemp.length - 1];
	}
	get coldest() {
		return this.hctsByTemp[0];
	}
	analogous(e = 5, t = 12) {
		let n = Math.round(this.input.hue), r = this.hctsByHue[n], i = this.relativeTemperature(r), a = [r], o = 0;
		for (let e = 0; e < 360; e++) {
			let t = qn(n + e), r = this.hctsByHue[t], a = this.relativeTemperature(r), s = Math.abs(a - i);
			i = a, o += s;
		}
		let s = 1, c = o / t, l = 0;
		for (i = this.relativeTemperature(r); a.length < t;) {
			let e = qn(n + s), r = this.hctsByHue[e], o = this.relativeTemperature(r), u = Math.abs(o - i);
			l += u;
			let d = a.length * c, f = l >= d, p = 1;
			for (; f && a.length < t;) {
				a.push(r);
				let e = (a.length + p) * c;
				f = l >= e, p++;
			}
			if (i = o, s++, s > 360) {
				for (; a.length < t;) a.push(r);
				break;
			}
		}
		let u = [this.input], d = Math.floor((e - 1) / 2);
		for (let e = 1; e < d + 1; e++) {
			let t = 0 - e;
			for (; t < 0;) t = a.length + t;
			t >= a.length && (t %= a.length), u.splice(0, 0, a[t]);
		}
		let f = e - d - 1;
		for (let e = 1; e < f + 1; e++) {
			let t = e;
			for (; t < 0;) t = a.length + t;
			t >= a.length && (t %= a.length), u.push(a[t]);
		}
		return u;
	}
	get complement() {
		if (this.complementCache != null) return this.complementCache;
		let t = this.coldest.hue, n = this.tempsByHct.get(this.coldest), r = this.warmest.hue, i = this.tempsByHct.get(this.warmest) - n, a = e.isBetween(this.input.hue, t, r), o = a ? r : t, s = a ? t : r, c = 1e3, l = this.hctsByHue[Math.round(this.input.hue)], u = 1 - this.inputRelativeTemperature;
		for (let t = 0; t <= 360; t += 1) {
			let r = Jn(o + 1 * t);
			if (!e.isBetween(r, o, s)) continue;
			let a = this.hctsByHue[Math.round(r)], d = (this.tempsByHct.get(a) - n) / i, f = Math.abs(u - d);
			f < c && (c = f, l = a);
		}
		return this.complementCache = l, this.complementCache;
	}
	relativeTemperature(e) {
		let t = this.tempsByHct.get(this.warmest) - this.tempsByHct.get(this.coldest), n = this.tempsByHct.get(e) - this.tempsByHct.get(this.coldest);
		return t === 0 ? .5 : n / t;
	}
	get inputRelativeTemperature() {
		return this.inputRelativeTemperatureCache >= 0 || (this.inputRelativeTemperatureCache = this.relativeTemperature(this.input)), this.inputRelativeTemperatureCache;
	}
	get tempsByHct() {
		if (this.tempsByHctCache.size > 0) return this.tempsByHctCache;
		let t = this.hctsByHue.concat([this.input]), n = /* @__PURE__ */ new Map();
		for (let r of t) n.set(r, e.rawTemperature(r));
		return this.tempsByHctCache = n, n;
	}
	get hctsByHue() {
		if (this.hctsByHueCache.length > 0) return this.hctsByHueCache;
		let e = [];
		for (let t = 0; t <= 360; t += 1) {
			let n = L.from(t, this.input.chroma, this.input.tone);
			e.push(n);
		}
		return this.hctsByHueCache = e, this.hctsByHueCache;
	}
	static isBetween(e, t, n) {
		return t < n ? t <= e && e <= n : t <= e || e <= n;
	}
	static rawTemperature(e) {
		let t = or(e.toInt()), n = Jn(Math.atan2(t[2], t[1]) * 180 / Math.PI);
		return -.5 + .02 * Math.sqrt(t[1] * t[1] + t[2] * t[2]) ** 1.07 * Math.cos(Jn(n - 50) * Math.PI / 180);
	}
}, H = class {
	constructor(e, t, n, r) {
		this.low = e, this.normal = t, this.medium = n, this.high = r;
	}
	get(e) {
		return e <= -1 ? this.low : e < 0 ? Gn(this.low, this.normal, (e - -1) / 1) : e < .5 ? Gn(this.normal, this.medium, (e - 0) / .5) : e < 1 ? Gn(this.medium, this.high, (e - .5) / .5) : this.high;
	}
}, U = class {
	constructor(e, t, n, r, i, a) {
		this.roleA = e, this.roleB = t, this.delta = n, this.polarity = r, this.stayTogether = i, this.constraint = a, this.constraint = a ?? "exact";
	}
}, W;
(function(e) {
	e[e.MONOCHROME = 0] = "MONOCHROME", e[e.NEUTRAL = 1] = "NEUTRAL", e[e.TONAL_SPOT = 2] = "TONAL_SPOT", e[e.VIBRANT = 3] = "VIBRANT", e[e.EXPRESSIVE = 4] = "EXPRESSIVE", e[e.FIDELITY = 5] = "FIDELITY", e[e.CONTENT = 6] = "CONTENT", e[e.RAINBOW = 7] = "RAINBOW", e[e.FRUIT_SALAD = 8] = "FRUIT_SALAD";
})(W ||= {});
//#endregion
//#region node_modules/@material/material-color-utilities/dynamiccolor/color_spec_2021.js
function Or(e) {
	return e.variant === W.FIDELITY || e.variant === W.CONTENT;
}
function G(e) {
	return e.variant === W.MONOCHROME;
}
function kr(e, t, n, r) {
	let i = n, a = L.from(e, t, n);
	if (a.chroma < t) {
		let n = a.chroma;
		for (; a.chroma < t;) {
			i += r ? -1 : 1;
			let o = L.from(e, t, i);
			if (n > o.chroma || Math.abs(o.chroma - t) < .4) break;
			Math.abs(o.chroma - t) < Math.abs(a.chroma - t) && (a = o), n = Math.max(n, o.chroma);
		}
	}
	return i;
}
var Ar = class {
	primaryPaletteKeyColor() {
		return B.fromPalette({
			name: "primary_palette_key_color",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.primaryPalette.keyColor.tone
		});
	}
	secondaryPaletteKeyColor() {
		return B.fromPalette({
			name: "secondary_palette_key_color",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.secondaryPalette.keyColor.tone
		});
	}
	tertiaryPaletteKeyColor() {
		return B.fromPalette({
			name: "tertiary_palette_key_color",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.tertiaryPalette.keyColor.tone
		});
	}
	neutralPaletteKeyColor() {
		return B.fromPalette({
			name: "neutral_palette_key_color",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.neutralPalette.keyColor.tone
		});
	}
	neutralVariantPaletteKeyColor() {
		return B.fromPalette({
			name: "neutral_variant_palette_key_color",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.neutralVariantPalette.keyColor.tone
		});
	}
	errorPaletteKeyColor() {
		return B.fromPalette({
			name: "error_palette_key_color",
			palette: (e) => e.errorPalette,
			tone: (e) => e.errorPalette.keyColor.tone
		});
	}
	background() {
		return B.fromPalette({
			name: "background",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : 98,
			isBackground: !0
		});
	}
	onBackground() {
		return B.fromPalette({
			name: "on_background",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 10,
			background: (e) => this.background(),
			contrastCurve: (e) => new H(3, 3, 4.5, 7)
		});
	}
	surface() {
		return B.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : 98,
			isBackground: !0
		});
	}
	surfaceDim() {
		return B.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : new H(87, 87, 80, 75).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceBright() {
		return B.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new H(24, 24, 29, 34).get(e.contrastLevel) : 98,
			isBackground: !0
		});
	}
	surfaceContainerLowest() {
		return B.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new H(4, 4, 2, 0).get(e.contrastLevel) : 100,
			isBackground: !0
		});
	}
	surfaceContainerLow() {
		return B.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new H(10, 10, 11, 12).get(e.contrastLevel) : new H(96, 96, 96, 95).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainer() {
		return B.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new H(12, 12, 16, 20).get(e.contrastLevel) : new H(94, 94, 92, 90).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainerHigh() {
		return B.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new H(17, 17, 21, 25).get(e.contrastLevel) : new H(92, 92, 88, 85).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainerHighest() {
		return B.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new H(22, 22, 26, 30).get(e.contrastLevel) : new H(90, 90, 84, 80).get(e.contrastLevel),
			isBackground: !0
		});
	}
	onSurface() {
		return B.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 10,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(4.5, 7, 11, 21)
		});
	}
	surfaceVariant() {
		return B.fromPalette({
			name: "surface_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 30 : 90,
			isBackground: !0
		});
	}
	onSurfaceVariant() {
		return B.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 80 : 30,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(3, 4.5, 7, 11)
		});
	}
	inverseSurface() {
		return B.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 20,
			isBackground: !0
		});
	}
	inverseOnSurface() {
		return B.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 20 : 95,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => new H(4.5, 7, 11, 21)
		});
	}
	outline() {
		return B.fromPalette({
			name: "outline",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 60 : 50,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1.5, 3, 4.5, 7)
		});
	}
	outlineVariant() {
		return B.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 30 : 80,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5)
		});
	}
	shadow() {
		return B.fromPalette({
			name: "shadow",
			palette: (e) => e.neutralPalette,
			tone: (e) => 0
		});
	}
	scrim() {
		return B.fromPalette({
			name: "scrim",
			palette: (e) => e.neutralPalette,
			tone: (e) => 0
		});
	}
	surfaceTint() {
		return B.fromPalette({
			name: "surface_tint",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0
		});
	}
	primary() {
		return B.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => G(e) ? e.isDark ? 100 : 0 : e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new U(this.primaryContainer(), this.primary(), 10, "nearer", !1)
		});
	}
	primaryDim() {}
	onPrimary() {
		return B.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => G(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
			background: (e) => this.primary(),
			contrastCurve: (e) => new H(4.5, 7, 11, 21)
		});
	}
	primaryContainer() {
		return B.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => Or(e) ? e.sourceColorHct.tone : G(e) ? e.isDark ? 85 : 25 : e.isDark ? 30 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new U(this.primaryContainer(), this.primary(), 10, "nearer", !1)
		});
	}
	onPrimaryContainer() {
		return B.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => Or(e) ? B.foregroundTone(this.primaryContainer().tone(e), 4.5) : G(e) ? e.isDark ? 0 : 100 : e.isDark ? 90 : 30,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => new H(3, 4.5, 7, 11)
		});
	}
	inversePrimary() {
		return B.fromPalette({
			name: "inverse_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.isDark ? 40 : 80,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => new H(3, 4.5, 7, 7)
		});
	}
	secondary() {
		return B.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new U(this.secondaryContainer(), this.secondary(), 10, "nearer", !1)
		});
	}
	secondaryDim() {}
	onSecondary() {
		return B.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => G(e) ? e.isDark ? 10 : 100 : e.isDark ? 20 : 100,
			background: (e) => this.secondary(),
			contrastCurve: (e) => new H(4.5, 7, 11, 21)
		});
	}
	secondaryContainer() {
		return B.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => {
				let t = e.isDark ? 30 : 90;
				return G(e) ? e.isDark ? 30 : 85 : Or(e) ? kr(e.secondaryPalette.hue, e.secondaryPalette.chroma, t, !e.isDark) : t;
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new U(this.secondaryContainer(), this.secondary(), 10, "nearer", !1)
		});
	}
	onSecondaryContainer() {
		return B.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => G(e) ? e.isDark ? 90 : 10 : Or(e) ? B.foregroundTone(this.secondaryContainer().tone(e), 4.5) : e.isDark ? 90 : 30,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => new H(3, 4.5, 7, 11)
		});
	}
	tertiary() {
		return B.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => G(e) ? e.isDark ? 90 : 25 : e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new U(this.tertiaryContainer(), this.tertiary(), 10, "nearer", !1)
		});
	}
	tertiaryDim() {}
	onTertiary() {
		return B.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => G(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
			background: (e) => this.tertiary(),
			contrastCurve: (e) => new H(4.5, 7, 11, 21)
		});
	}
	tertiaryContainer() {
		return B.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				if (G(e)) return e.isDark ? 60 : 49;
				if (!Or(e)) return e.isDark ? 30 : 90;
				let t = e.tertiaryPalette.getHct(e.sourceColorHct.tone);
				return yr.fixIfDisliked(t).tone;
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new U(this.tertiaryContainer(), this.tertiary(), 10, "nearer", !1)
		});
	}
	onTertiaryContainer() {
		return B.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => G(e) ? e.isDark ? 0 : 100 : Or(e) ? B.foregroundTone(this.tertiaryContainer().tone(e), 4.5) : e.isDark ? 90 : 30,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => new H(3, 4.5, 7, 11)
		});
	}
	error() {
		return B.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new U(this.errorContainer(), this.error(), 10, "nearer", !1)
		});
	}
	errorDim() {}
	onError() {
		return B.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 20 : 100,
			background: (e) => this.error(),
			contrastCurve: (e) => new H(4.5, 7, 11, 21)
		});
	}
	errorContainer() {
		return B.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 30 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new U(this.errorContainer(), this.error(), 10, "nearer", !1)
		});
	}
	onErrorContainer() {
		return B.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => G(e) ? e.isDark ? 90 : 10 : e.isDark ? 90 : 30,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => new H(3, 4.5, 7, 11)
		});
	}
	primaryFixed() {
		return B.fromPalette({
			name: "primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => G(e) ? 40 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new U(this.primaryFixed(), this.primaryFixedDim(), 10, "lighter", !0)
		});
	}
	primaryFixedDim() {
		return B.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => G(e) ? 30 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new U(this.primaryFixed(), this.primaryFixedDim(), 10, "lighter", !0)
		});
	}
	onPrimaryFixed() {
		return B.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => G(e) ? 100 : 10,
			background: (e) => this.primaryFixedDim(),
			secondBackground: (e) => this.primaryFixed(),
			contrastCurve: (e) => new H(4.5, 7, 11, 21)
		});
	}
	onPrimaryFixedVariant() {
		return B.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			tone: (e) => G(e) ? 90 : 30,
			background: (e) => this.primaryFixedDim(),
			secondBackground: (e) => this.primaryFixed(),
			contrastCurve: (e) => new H(3, 4.5, 7, 11)
		});
	}
	secondaryFixed() {
		return B.fromPalette({
			name: "secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => G(e) ? 80 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new U(this.secondaryFixed(), this.secondaryFixedDim(), 10, "lighter", !0)
		});
	}
	secondaryFixedDim() {
		return B.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => G(e) ? 70 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new U(this.secondaryFixed(), this.secondaryFixedDim(), 10, "lighter", !0)
		});
	}
	onSecondaryFixed() {
		return B.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => 10,
			background: (e) => this.secondaryFixedDim(),
			secondBackground: (e) => this.secondaryFixed(),
			contrastCurve: (e) => new H(4.5, 7, 11, 21)
		});
	}
	onSecondaryFixedVariant() {
		return B.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			tone: (e) => G(e) ? 25 : 30,
			background: (e) => this.secondaryFixedDim(),
			secondBackground: (e) => this.secondaryFixed(),
			contrastCurve: (e) => new H(3, 4.5, 7, 11)
		});
	}
	tertiaryFixed() {
		return B.fromPalette({
			name: "tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => G(e) ? 40 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new U(this.tertiaryFixed(), this.tertiaryFixedDim(), 10, "lighter", !0)
		});
	}
	tertiaryFixedDim() {
		return B.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => G(e) ? 30 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new H(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new U(this.tertiaryFixed(), this.tertiaryFixedDim(), 10, "lighter", !0)
		});
	}
	onTertiaryFixed() {
		return B.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => G(e) ? 100 : 10,
			background: (e) => this.tertiaryFixedDim(),
			secondBackground: (e) => this.tertiaryFixed(),
			contrastCurve: (e) => new H(4.5, 7, 11, 21)
		});
	}
	onTertiaryFixedVariant() {
		return B.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => G(e) ? 90 : 30,
			background: (e) => this.tertiaryFixedDim(),
			secondBackground: (e) => this.tertiaryFixed(),
			contrastCurve: (e) => new H(3, 4.5, 7, 11)
		});
	}
	highestSurface(e) {
		return e.isDark ? this.surfaceBright() : this.surfaceDim();
	}
};
//#endregion
//#region node_modules/@material/material-color-utilities/dynamiccolor/color_spec_2025.js
function K(e, t = 0, n = 100, r = 1) {
	return I(t, n, Mr(e.hue, e.chroma * r, 100, !0));
}
function jr(e, t = 0, n = 100) {
	return I(t, n, Mr(e.hue, e.chroma, 0, !1));
}
function Mr(e, t, n, r) {
	let i = n, a = L.from(e, t, i);
	for (; a.chroma < t && !(n < 0 || n > 100);) {
		n += r ? -1 : 1;
		let o = L.from(e, t, n);
		a.chroma < o.chroma && (a = o, i = n);
	}
	return i;
}
function q(e) {
	return e === 1.5 ? new H(1.5, 1.5, 3, 5.5) : e === 3 ? new H(3, 3, 4.5, 7) : e === 4.5 ? new H(4.5, 4.5, 7, 11) : e === 6 ? new H(6, 6, 7, 11) : e === 7 ? new H(7, 7, 11, 21) : e === 9 ? new H(9, 9, 11, 21) : e === 11 ? new H(11, 11, 21, 21) : e === 21 ? new H(21, 21, 21, 21) : new H(e, e, 7, 21);
}
var Nr = class extends Ar {
	surface() {
		let e = B.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => (super.surface().tone(e), e.platform === "phone" ? e.isDark ? 4 : L.isYellow(e.neutralPalette.hue) ? 99 : e.variant === W.VIBRANT ? 97 : 98 : 0),
			isBackground: !0
		});
		return z(super.surface(), "2025", e);
	}
	surfaceDim() {
		let e = B.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 4 : L.isYellow(e.neutralPalette.hue) ? 90 : e.variant === W.VIBRANT ? 85 : 87,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (!e.isDark) {
					if (e.variant === W.NEUTRAL) return 2.5;
					if (e.variant === W.TONAL_SPOT) return 1.7;
					if (e.variant === W.EXPRESSIVE) return L.isYellow(e.neutralPalette.hue) ? 2.7 : 1.75;
					if (e.variant === W.VIBRANT) return 1.36;
				}
				return 1;
			}
		});
		return z(super.surfaceDim(), "2025", e);
	}
	surfaceBright() {
		let e = B.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 18 : L.isYellow(e.neutralPalette.hue) ? 99 : e.variant === W.VIBRANT ? 97 : 98,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.isDark) {
					if (e.variant === W.NEUTRAL) return 2.5;
					if (e.variant === W.TONAL_SPOT) return 1.7;
					if (e.variant === W.EXPRESSIVE) return L.isYellow(e.neutralPalette.hue) ? 2.7 : 1.75;
					if (e.variant === W.VIBRANT) return 1.36;
				}
				return 1;
			}
		});
		return z(super.surfaceBright(), "2025", e);
	}
	surfaceContainerLowest() {
		let e = B.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 0 : 100,
			isBackground: !0
		});
		return z(super.surfaceContainerLowest(), "2025", e);
	}
	surfaceContainerLow() {
		let e = B.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 6 : L.isYellow(e.neutralPalette.hue) ? 98 : e.variant === W.VIBRANT ? 95 : 96 : 15,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === W.NEUTRAL) return 1.3;
					if (e.variant === W.TONAL_SPOT) return 1.25;
					if (e.variant === W.EXPRESSIVE) return L.isYellow(e.neutralPalette.hue) ? 1.3 : 1.15;
					if (e.variant === W.VIBRANT) return 1.08;
				}
				return 1;
			}
		});
		return z(super.surfaceContainerLow(), "2025", e);
	}
	surfaceContainer() {
		let e = B.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 9 : L.isYellow(e.neutralPalette.hue) ? 96 : e.variant === W.VIBRANT ? 92 : 94 : 20,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === W.NEUTRAL) return 1.6;
					if (e.variant === W.TONAL_SPOT) return 1.4;
					if (e.variant === W.EXPRESSIVE) return L.isYellow(e.neutralPalette.hue) ? 1.6 : 1.3;
					if (e.variant === W.VIBRANT) return 1.15;
				}
				return 1;
			}
		});
		return z(super.surfaceContainer(), "2025", e);
	}
	surfaceContainerHigh() {
		let e = B.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 12 : L.isYellow(e.neutralPalette.hue) ? 94 : e.variant === W.VIBRANT ? 90 : 92 : 25,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === W.NEUTRAL) return 1.9;
					if (e.variant === W.TONAL_SPOT) return 1.5;
					if (e.variant === W.EXPRESSIVE) return L.isYellow(e.neutralPalette.hue) ? 1.95 : 1.45;
					if (e.variant === W.VIBRANT) return 1.22;
				}
				return 1;
			}
		});
		return z(super.surfaceContainerHigh(), "2025", e);
	}
	surfaceContainerHighest() {
		let e = B.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 15 : L.isYellow(e.neutralPalette.hue) ? 92 : e.variant === W.VIBRANT ? 88 : 90,
			isBackground: !0,
			chromaMultiplier: (e) => e.variant === W.NEUTRAL ? 2.2 : e.variant === W.TONAL_SPOT ? 1.7 : e.variant === W.EXPRESSIVE ? L.isYellow(e.neutralPalette.hue) ? 2.3 : 1.6 : e.variant === W.VIBRANT ? 1.29 : 1
		});
		return z(super.surfaceContainerHighest(), "2025", e);
	}
	onSurface() {
		let e = B.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === W.VIBRANT ? K(e.neutralPalette, 0, 100, 1.1) : B.getInitialToneFromBackground((e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh())(e),
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === W.NEUTRAL) return 2.2;
					if (e.variant === W.TONAL_SPOT) return 1.7;
					if (e.variant === W.EXPRESSIVE) return L.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.isDark && e.platform === "phone" ? q(11) : q(9)
		});
		return z(super.onSurface(), "2025", e);
	}
	onSurfaceVariant() {
		let e = B.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === W.NEUTRAL) return 2.2;
					if (e.variant === W.TONAL_SPOT) return 1.7;
					if (e.variant === W.EXPRESSIVE) return L.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? e.isDark ? q(6) : q(4.5) : q(7)
		});
		return z(super.onSurfaceVariant(), "2025", e);
	}
	outline() {
		let e = B.fromPalette({
			name: "outline",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === W.NEUTRAL) return 2.2;
					if (e.variant === W.TONAL_SPOT) return 1.7;
					if (e.variant === W.EXPRESSIVE) return L.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? q(3) : q(4.5)
		});
		return z(super.outline(), "2025", e);
	}
	outlineVariant() {
		let e = B.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === W.NEUTRAL) return 2.2;
					if (e.variant === W.TONAL_SPOT) return 1.7;
					if (e.variant === W.EXPRESSIVE) return L.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? q(1.5) : q(3)
		});
		return z(super.outlineVariant(), "2025", e);
	}
	inverseSurface() {
		let e = B.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 98 : 4,
			isBackground: !0
		});
		return z(super.inverseSurface(), "2025", e);
	}
	inverseOnSurface() {
		let e = B.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => q(7)
		});
		return z(super.inverseOnSurface(), "2025", e);
	}
	primary() {
		let e = B.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.variant === W.NEUTRAL ? e.platform === "phone" ? e.isDark ? 80 : 40 : 90 : e.variant === W.TONAL_SPOT ? e.platform === "phone" ? e.isDark ? 80 : K(e.primaryPalette) : K(e.primaryPalette, 0, 90) : e.variant === W.EXPRESSIVE ? e.platform === "phone" ? K(e.primaryPalette, 0, L.isYellow(e.primaryPalette.hue) ? 25 : L.isCyan(e.primaryPalette.hue) ? 88 : 98) : K(e.primaryPalette) : e.platform === "phone" ? K(e.primaryPalette, 0, L.isCyan(e.primaryPalette.hue) ? 88 : 98) : K(e.primaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? q(4.5) : q(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new U(this.primaryContainer(), this.primary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return z(super.primary(), "2025", e);
	}
	primaryDim() {
		return B.fromPalette({
			name: "primary_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.variant === W.NEUTRAL ? 85 : e.variant === W.TONAL_SPOT ? K(e.primaryPalette, 0, 90) : K(e.primaryPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => q(4.5),
			toneDeltaPair: (e) => new U(this.primaryDim(), this.primary(), 5, "darker", !0, "farther")
		});
	}
	onPrimary() {
		let e = B.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			background: (e) => e.platform === "phone" ? this.primary() : this.primaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? q(6) : q(7)
		});
		return z(super.onPrimary(), "2025", e);
	}
	primaryContainer() {
		let e = B.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.variant === W.NEUTRAL ? e.isDark ? 30 : 90 : e.variant === W.TONAL_SPOT ? e.isDark ? jr(e.primaryPalette, 35, 93) : K(e.primaryPalette, 0, 90) : e.variant === W.EXPRESSIVE ? e.isDark ? K(e.primaryPalette, 30, 93) : K(e.primaryPalette, 78, L.isCyan(e.primaryPalette.hue) ? 88 : 90) : e.isDark ? jr(e.primaryPalette, 66, 93) : K(e.primaryPalette, 66, L.isCyan(e.primaryPalette.hue) ? 88 : 93),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "phone" ? void 0 : new U(this.primaryContainer(), this.primaryDim(), 10, "darker", !0, "farther"),
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return z(super.primaryContainer(), "2025", e);
	}
	onPrimaryContainer() {
		let e = B.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? q(6) : q(7)
		});
		return z(super.onPrimaryContainer(), "2025", e);
	}
	primaryFixed() {
		let e = B.fromPalette({
			name: "primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.primaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return z(super.primaryFixed(), "2025", e);
	}
	primaryFixedDim() {
		let e = B.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => this.primaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new U(this.primaryFixedDim(), this.primaryFixed(), 5, "darker", !0, "exact")
		});
		return z(super.primaryFixedDim(), "2025", e);
	}
	onPrimaryFixed() {
		let e = B.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixedDim(),
			contrastCurve: (e) => q(7)
		});
		return z(super.onPrimaryFixed(), "2025", e);
	}
	onPrimaryFixedVariant() {
		let e = B.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixedDim(),
			contrastCurve: (e) => q(4.5)
		});
		return z(super.onPrimaryFixedVariant(), "2025", e);
	}
	inversePrimary() {
		let e = B.fromPalette({
			name: "inverse_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => K(e.primaryPalette),
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => e.platform === "phone" ? q(6) : q(7)
		});
		return z(super.inversePrimary(), "2025", e);
	}
	secondary() {
		let e = B.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === W.NEUTRAL ? 90 : K(e.secondaryPalette, 0, 90) : e.variant === W.NEUTRAL ? e.isDark ? jr(e.secondaryPalette, 0, 98) : K(e.secondaryPalette) : e.variant === W.VIBRANT ? K(e.secondaryPalette, 0, e.isDark ? 90 : 98) : e.isDark ? 80 : K(e.secondaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? q(4.5) : q(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new U(this.secondaryContainer(), this.secondary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return z(super.secondary(), "2025", e);
	}
	secondaryDim() {
		return B.fromPalette({
			name: "secondary_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.variant === W.NEUTRAL ? 85 : K(e.secondaryPalette, 0, 90),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => q(4.5),
			toneDeltaPair: (e) => new U(this.secondaryDim(), this.secondary(), 5, "darker", !0, "farther")
		});
	}
	onSecondary() {
		let e = B.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			background: (e) => e.platform === "phone" ? this.secondary() : this.secondaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? q(6) : q(7)
		});
		return z(super.onSecondary(), "2025", e);
	}
	secondaryContainer() {
		let e = B.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.variant === W.VIBRANT ? e.isDark ? jr(e.secondaryPalette, 30, 40) : K(e.secondaryPalette, 84, 90) : e.variant === W.EXPRESSIVE ? e.isDark ? 15 : K(e.secondaryPalette, 90, 95) : e.isDark ? 25 : 90,
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new U(this.secondaryContainer(), this.secondaryDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return z(super.secondaryContainer(), "2025", e);
	}
	onSecondaryContainer() {
		let e = B.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? q(6) : q(7)
		});
		return z(super.onSecondaryContainer(), "2025", e);
	}
	secondaryFixed() {
		let e = B.fromPalette({
			name: "secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.secondaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return z(super.secondaryFixed(), "2025", e);
	}
	secondaryFixedDim() {
		let e = B.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => this.secondaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new U(this.secondaryFixedDim(), this.secondaryFixed(), 5, "darker", !0, "exact")
		});
		return z(super.secondaryFixedDim(), "2025", e);
	}
	onSecondaryFixed() {
		let e = B.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixedDim(),
			contrastCurve: (e) => q(7)
		});
		return z(super.onSecondaryFixed(), "2025", e);
	}
	onSecondaryFixedVariant() {
		let e = B.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixedDim(),
			contrastCurve: (e) => q(4.5)
		});
		return z(super.onSecondaryFixedVariant(), "2025", e);
	}
	tertiary() {
		let e = B.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === W.TONAL_SPOT ? K(e.tertiaryPalette, 0, 90) : K(e.tertiaryPalette) : e.variant === W.EXPRESSIVE || e.variant === W.VIBRANT ? K(e.tertiaryPalette, 0, L.isCyan(e.tertiaryPalette.hue) ? 88 : e.isDark ? 98 : 100) : e.isDark ? K(e.tertiaryPalette, 0, 98) : K(e.tertiaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? q(4.5) : q(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new U(this.tertiaryContainer(), this.tertiary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return z(super.tertiary(), "2025", e);
	}
	tertiaryDim() {
		return B.fromPalette({
			name: "tertiary_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.variant === W.TONAL_SPOT ? K(e.tertiaryPalette, 0, 90) : K(e.tertiaryPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => q(4.5),
			toneDeltaPair: (e) => new U(this.tertiaryDim(), this.tertiary(), 5, "darker", !0, "farther")
		});
	}
	onTertiary() {
		let e = B.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			background: (e) => e.platform === "phone" ? this.tertiary() : this.tertiaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? q(6) : q(7)
		});
		return z(super.onTertiary(), "2025", e);
	}
	tertiaryContainer() {
		let e = B.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === W.TONAL_SPOT ? K(e.tertiaryPalette, 0, 90) : K(e.tertiaryPalette) : e.variant === W.NEUTRAL ? e.isDark ? K(e.tertiaryPalette, 0, 93) : K(e.tertiaryPalette, 0, 96) : e.variant === W.TONAL_SPOT ? K(e.tertiaryPalette, 0, e.isDark ? 93 : 100) : e.variant === W.EXPRESSIVE ? K(e.tertiaryPalette, 75, L.isCyan(e.tertiaryPalette.hue) ? 88 : e.isDark ? 93 : 100) : e.isDark ? K(e.tertiaryPalette, 0, 93) : K(e.tertiaryPalette, 72, 100),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new U(this.tertiaryContainer(), this.tertiaryDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return z(super.tertiaryContainer(), "2025", e);
	}
	onTertiaryContainer() {
		let e = B.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? q(6) : q(7)
		});
		return z(super.onTertiaryContainer(), "2025", e);
	}
	tertiaryFixed() {
		let e = B.fromPalette({
			name: "tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.tertiaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return z(super.tertiaryFixed(), "2025", e);
	}
	tertiaryFixedDim() {
		let e = B.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => this.tertiaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new U(this.tertiaryFixedDim(), this.tertiaryFixed(), 5, "darker", !0, "exact")
		});
		return z(super.tertiaryFixedDim(), "2025", e);
	}
	onTertiaryFixed() {
		let e = B.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixedDim(),
			contrastCurve: (e) => q(7)
		});
		return z(super.onTertiaryFixed(), "2025", e);
	}
	onTertiaryFixedVariant() {
		let e = B.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixedDim(),
			contrastCurve: (e) => q(4.5)
		});
		return z(super.onTertiaryFixedVariant(), "2025", e);
	}
	error() {
		let e = B.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? jr(e.errorPalette, 0, 98) : K(e.errorPalette) : jr(e.errorPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? q(4.5) : q(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new U(this.errorContainer(), this.error(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return z(super.error(), "2025", e);
	}
	errorDim() {
		return B.fromPalette({
			name: "error_dim",
			palette: (e) => e.errorPalette,
			tone: (e) => jr(e.errorPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => q(4.5),
			toneDeltaPair: (e) => new U(this.errorDim(), this.error(), 5, "darker", !0, "farther")
		});
	}
	onError() {
		let e = B.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			background: (e) => e.platform === "phone" ? this.error() : this.errorDim(),
			contrastCurve: (e) => e.platform === "phone" ? q(6) : q(7)
		});
		return z(super.onError(), "2025", e);
	}
	errorContainer() {
		let e = B.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.isDark ? jr(e.errorPalette, 30, 93) : K(e.errorPalette, 0, 90),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new U(this.errorContainer(), this.errorDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? q(1.5) : void 0
		});
		return z(super.errorContainer(), "2025", e);
	}
	onErrorContainer() {
		let e = B.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => e.platform === "phone" ? q(4.5) : q(7)
		});
		return z(super.onErrorContainer(), "2025", e);
	}
	surfaceVariant() {
		let e = Object.assign(this.surfaceContainerHighest().clone(), { name: "surface_variant" });
		return z(super.surfaceVariant(), "2025", e);
	}
	surfaceTint() {
		let e = Object.assign(this.primary().clone(), { name: "surface_tint" });
		return z(super.surfaceTint(), "2025", e);
	}
	background() {
		let e = Object.assign(this.surface().clone(), { name: "background" });
		return z(super.background(), "2025", e);
	}
	onBackground() {
		let e = Object.assign(this.onSurface().clone(), {
			name: "on_background",
			tone: (e) => e.platform === "watch" ? 100 : this.onSurface().getTone(e)
		});
		return z(super.onBackground(), "2025", e);
	}
}, J = class e {
	constructor() {
		this.allColors = [
			this.background(),
			this.onBackground(),
			this.surface(),
			this.surfaceDim(),
			this.surfaceBright(),
			this.surfaceContainerLowest(),
			this.surfaceContainerLow(),
			this.surfaceContainer(),
			this.surfaceContainerHigh(),
			this.surfaceContainerHighest(),
			this.onSurface(),
			this.onSurfaceVariant(),
			this.outline(),
			this.outlineVariant(),
			this.inverseSurface(),
			this.inverseOnSurface(),
			this.primary(),
			this.primaryDim(),
			this.onPrimary(),
			this.primaryContainer(),
			this.onPrimaryContainer(),
			this.primaryFixed(),
			this.primaryFixedDim(),
			this.onPrimaryFixed(),
			this.onPrimaryFixedVariant(),
			this.inversePrimary(),
			this.secondary(),
			this.secondaryDim(),
			this.onSecondary(),
			this.secondaryContainer(),
			this.onSecondaryContainer(),
			this.secondaryFixed(),
			this.secondaryFixedDim(),
			this.onSecondaryFixed(),
			this.onSecondaryFixedVariant(),
			this.tertiary(),
			this.tertiaryDim(),
			this.onTertiary(),
			this.tertiaryContainer(),
			this.onTertiaryContainer(),
			this.tertiaryFixed(),
			this.tertiaryFixedDim(),
			this.onTertiaryFixed(),
			this.onTertiaryFixedVariant(),
			this.error(),
			this.errorDim(),
			this.onError(),
			this.errorContainer(),
			this.onErrorContainer()
		].filter((e) => e !== void 0);
	}
	highestSurface(t) {
		return e.colorSpec.highestSurface(t);
	}
	primaryPaletteKeyColor() {
		return e.colorSpec.primaryPaletteKeyColor();
	}
	secondaryPaletteKeyColor() {
		return e.colorSpec.secondaryPaletteKeyColor();
	}
	tertiaryPaletteKeyColor() {
		return e.colorSpec.tertiaryPaletteKeyColor();
	}
	neutralPaletteKeyColor() {
		return e.colorSpec.neutralPaletteKeyColor();
	}
	neutralVariantPaletteKeyColor() {
		return e.colorSpec.neutralVariantPaletteKeyColor();
	}
	errorPaletteKeyColor() {
		return e.colorSpec.errorPaletteKeyColor();
	}
	background() {
		return e.colorSpec.background();
	}
	onBackground() {
		return e.colorSpec.onBackground();
	}
	surface() {
		return e.colorSpec.surface();
	}
	surfaceDim() {
		return e.colorSpec.surfaceDim();
	}
	surfaceBright() {
		return e.colorSpec.surfaceBright();
	}
	surfaceContainerLowest() {
		return e.colorSpec.surfaceContainerLowest();
	}
	surfaceContainerLow() {
		return e.colorSpec.surfaceContainerLow();
	}
	surfaceContainer() {
		return e.colorSpec.surfaceContainer();
	}
	surfaceContainerHigh() {
		return e.colorSpec.surfaceContainerHigh();
	}
	surfaceContainerHighest() {
		return e.colorSpec.surfaceContainerHighest();
	}
	onSurface() {
		return e.colorSpec.onSurface();
	}
	surfaceVariant() {
		return e.colorSpec.surfaceVariant();
	}
	onSurfaceVariant() {
		return e.colorSpec.onSurfaceVariant();
	}
	outline() {
		return e.colorSpec.outline();
	}
	outlineVariant() {
		return e.colorSpec.outlineVariant();
	}
	inverseSurface() {
		return e.colorSpec.inverseSurface();
	}
	inverseOnSurface() {
		return e.colorSpec.inverseOnSurface();
	}
	shadow() {
		return e.colorSpec.shadow();
	}
	scrim() {
		return e.colorSpec.scrim();
	}
	surfaceTint() {
		return e.colorSpec.surfaceTint();
	}
	primary() {
		return e.colorSpec.primary();
	}
	primaryDim() {
		return e.colorSpec.primaryDim();
	}
	onPrimary() {
		return e.colorSpec.onPrimary();
	}
	primaryContainer() {
		return e.colorSpec.primaryContainer();
	}
	onPrimaryContainer() {
		return e.colorSpec.onPrimaryContainer();
	}
	inversePrimary() {
		return e.colorSpec.inversePrimary();
	}
	primaryFixed() {
		return e.colorSpec.primaryFixed();
	}
	primaryFixedDim() {
		return e.colorSpec.primaryFixedDim();
	}
	onPrimaryFixed() {
		return e.colorSpec.onPrimaryFixed();
	}
	onPrimaryFixedVariant() {
		return e.colorSpec.onPrimaryFixedVariant();
	}
	secondary() {
		return e.colorSpec.secondary();
	}
	secondaryDim() {
		return e.colorSpec.secondaryDim();
	}
	onSecondary() {
		return e.colorSpec.onSecondary();
	}
	secondaryContainer() {
		return e.colorSpec.secondaryContainer();
	}
	onSecondaryContainer() {
		return e.colorSpec.onSecondaryContainer();
	}
	secondaryFixed() {
		return e.colorSpec.secondaryFixed();
	}
	secondaryFixedDim() {
		return e.colorSpec.secondaryFixedDim();
	}
	onSecondaryFixed() {
		return e.colorSpec.onSecondaryFixed();
	}
	onSecondaryFixedVariant() {
		return e.colorSpec.onSecondaryFixedVariant();
	}
	tertiary() {
		return e.colorSpec.tertiary();
	}
	tertiaryDim() {
		return e.colorSpec.tertiaryDim();
	}
	onTertiary() {
		return e.colorSpec.onTertiary();
	}
	tertiaryContainer() {
		return e.colorSpec.tertiaryContainer();
	}
	onTertiaryContainer() {
		return e.colorSpec.onTertiaryContainer();
	}
	tertiaryFixed() {
		return e.colorSpec.tertiaryFixed();
	}
	tertiaryFixedDim() {
		return e.colorSpec.tertiaryFixedDim();
	}
	onTertiaryFixed() {
		return e.colorSpec.onTertiaryFixed();
	}
	onTertiaryFixedVariant() {
		return e.colorSpec.onTertiaryFixedVariant();
	}
	error() {
		return e.colorSpec.error();
	}
	errorDim() {
		return e.colorSpec.errorDim();
	}
	onError() {
		return e.colorSpec.onError();
	}
	errorContainer() {
		return e.colorSpec.errorContainer();
	}
	onErrorContainer() {
		return e.colorSpec.onErrorContainer();
	}
	static highestSurface(t) {
		return e.colorSpec.highestSurface(t);
	}
};
J.contentAccentToneDelta = 15, J.colorSpec = new Nr(), J.primaryPaletteKeyColor = J.colorSpec.primaryPaletteKeyColor(), J.secondaryPaletteKeyColor = J.colorSpec.secondaryPaletteKeyColor(), J.tertiaryPaletteKeyColor = J.colorSpec.tertiaryPaletteKeyColor(), J.neutralPaletteKeyColor = J.colorSpec.neutralPaletteKeyColor(), J.neutralVariantPaletteKeyColor = J.colorSpec.neutralVariantPaletteKeyColor(), J.background = J.colorSpec.background(), J.onBackground = J.colorSpec.onBackground(), J.surface = J.colorSpec.surface(), J.surfaceDim = J.colorSpec.surfaceDim(), J.surfaceBright = J.colorSpec.surfaceBright(), J.surfaceContainerLowest = J.colorSpec.surfaceContainerLowest(), J.surfaceContainerLow = J.colorSpec.surfaceContainerLow(), J.surfaceContainer = J.colorSpec.surfaceContainer(), J.surfaceContainerHigh = J.colorSpec.surfaceContainerHigh(), J.surfaceContainerHighest = J.colorSpec.surfaceContainerHighest(), J.onSurface = J.colorSpec.onSurface(), J.surfaceVariant = J.colorSpec.surfaceVariant(), J.onSurfaceVariant = J.colorSpec.onSurfaceVariant(), J.inverseSurface = J.colorSpec.inverseSurface(), J.inverseOnSurface = J.colorSpec.inverseOnSurface(), J.outline = J.colorSpec.outline(), J.outlineVariant = J.colorSpec.outlineVariant(), J.shadow = J.colorSpec.shadow(), J.scrim = J.colorSpec.scrim(), J.surfaceTint = J.colorSpec.surfaceTint(), J.primary = J.colorSpec.primary(), J.onPrimary = J.colorSpec.onPrimary(), J.primaryContainer = J.colorSpec.primaryContainer(), J.onPrimaryContainer = J.colorSpec.onPrimaryContainer(), J.inversePrimary = J.colorSpec.inversePrimary(), J.secondary = J.colorSpec.secondary(), J.onSecondary = J.colorSpec.onSecondary(), J.secondaryContainer = J.colorSpec.secondaryContainer(), J.onSecondaryContainer = J.colorSpec.onSecondaryContainer(), J.tertiary = J.colorSpec.tertiary(), J.onTertiary = J.colorSpec.onTertiary(), J.tertiaryContainer = J.colorSpec.tertiaryContainer(), J.onTertiaryContainer = J.colorSpec.onTertiaryContainer(), J.error = J.colorSpec.error(), J.onError = J.colorSpec.onError(), J.errorContainer = J.colorSpec.errorContainer(), J.onErrorContainer = J.colorSpec.onErrorContainer(), J.primaryFixed = J.colorSpec.primaryFixed(), J.primaryFixedDim = J.colorSpec.primaryFixedDim(), J.onPrimaryFixed = J.colorSpec.onPrimaryFixed(), J.onPrimaryFixedVariant = J.colorSpec.onPrimaryFixedVariant(), J.secondaryFixed = J.colorSpec.secondaryFixed(), J.secondaryFixedDim = J.colorSpec.secondaryFixedDim(), J.onSecondaryFixed = J.colorSpec.onSecondaryFixed(), J.onSecondaryFixedVariant = J.colorSpec.onSecondaryFixedVariant(), J.tertiaryFixed = J.colorSpec.tertiaryFixed(), J.tertiaryFixedDim = J.colorSpec.tertiaryFixedDim(), J.onTertiaryFixed = J.colorSpec.onTertiaryFixed(), J.onTertiaryFixedVariant = J.colorSpec.onTertiaryFixedVariant();
//#endregion
//#region node_modules/@material/material-color-utilities/dynamiccolor/dynamic_scheme.js
var Y = class e {
	static maybeFallbackSpecVersion(e, t) {
		switch (t) {
			case W.EXPRESSIVE:
			case W.VIBRANT:
			case W.TONAL_SPOT:
			case W.NEUTRAL: return e;
			default: return "2021";
		}
	}
	constructor(t) {
		this.sourceColorArgb = t.sourceColorHct.toInt(), this.variant = t.variant, this.contrastLevel = t.contrastLevel, this.isDark = t.isDark, this.platform = t.platform ?? "phone", this.specVersion = e.maybeFallbackSpecVersion(t.specVersion ?? "2021", this.variant), this.sourceColorHct = t.sourceColorHct, this.primaryPalette = t.primaryPalette ?? Rr(this.specVersion).getPrimaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.secondaryPalette = t.secondaryPalette ?? Rr(this.specVersion).getSecondaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.tertiaryPalette = t.tertiaryPalette ?? Rr(this.specVersion).getTertiaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.neutralPalette = t.neutralPalette ?? Rr(this.specVersion).getNeutralPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.neutralVariantPalette = t.neutralVariantPalette ?? Rr(this.specVersion).getNeutralVariantPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.errorPalette = t.errorPalette ?? Rr(this.specVersion).getErrorPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel) ?? V.fromHueAndChroma(25, 84), this.colors = new J();
	}
	toString() {
		return `Scheme: variant=${W[this.variant]}, mode=${this.isDark ? "dark" : "light"}, platform=${this.platform}, contrastLevel=${this.contrastLevel.toFixed(1)}, seed=${this.sourceColorHct.toString()}, specVersion=${this.specVersion}`;
	}
	static getPiecewiseHue(e, t, n) {
		let r = Math.min(t.length - 1, n.length), i = e.hue;
		for (let e = 0; e < r; e++) if (i >= t[e] && i < t[e + 1]) return Jn(n[e]);
		return i;
	}
	static getRotatedHue(t, n, r) {
		let i = e.getPiecewiseHue(t, n, r);
		return Math.min(n.length - 1, r.length) <= 0 && (i = 0), Jn(t.hue + i);
	}
	getArgb(e) {
		return e.getArgb(this);
	}
	getHct(e) {
		return e.getHct(this);
	}
	get primaryPaletteKeyColor() {
		return this.getArgb(this.colors.primaryPaletteKeyColor());
	}
	get secondaryPaletteKeyColor() {
		return this.getArgb(this.colors.secondaryPaletteKeyColor());
	}
	get tertiaryPaletteKeyColor() {
		return this.getArgb(this.colors.tertiaryPaletteKeyColor());
	}
	get neutralPaletteKeyColor() {
		return this.getArgb(this.colors.neutralPaletteKeyColor());
	}
	get neutralVariantPaletteKeyColor() {
		return this.getArgb(this.colors.neutralVariantPaletteKeyColor());
	}
	get errorPaletteKeyColor() {
		return this.getArgb(this.colors.errorPaletteKeyColor());
	}
	get background() {
		return this.getArgb(this.colors.background());
	}
	get onBackground() {
		return this.getArgb(this.colors.onBackground());
	}
	get surface() {
		return this.getArgb(this.colors.surface());
	}
	get surfaceDim() {
		return this.getArgb(this.colors.surfaceDim());
	}
	get surfaceBright() {
		return this.getArgb(this.colors.surfaceBright());
	}
	get surfaceContainerLowest() {
		return this.getArgb(this.colors.surfaceContainerLowest());
	}
	get surfaceContainerLow() {
		return this.getArgb(this.colors.surfaceContainerLow());
	}
	get surfaceContainer() {
		return this.getArgb(this.colors.surfaceContainer());
	}
	get surfaceContainerHigh() {
		return this.getArgb(this.colors.surfaceContainerHigh());
	}
	get surfaceContainerHighest() {
		return this.getArgb(this.colors.surfaceContainerHighest());
	}
	get onSurface() {
		return this.getArgb(this.colors.onSurface());
	}
	get surfaceVariant() {
		return this.getArgb(this.colors.surfaceVariant());
	}
	get onSurfaceVariant() {
		return this.getArgb(this.colors.onSurfaceVariant());
	}
	get inverseSurface() {
		return this.getArgb(this.colors.inverseSurface());
	}
	get inverseOnSurface() {
		return this.getArgb(this.colors.inverseOnSurface());
	}
	get outline() {
		return this.getArgb(this.colors.outline());
	}
	get outlineVariant() {
		return this.getArgb(this.colors.outlineVariant());
	}
	get shadow() {
		return this.getArgb(this.colors.shadow());
	}
	get scrim() {
		return this.getArgb(this.colors.scrim());
	}
	get surfaceTint() {
		return this.getArgb(this.colors.surfaceTint());
	}
	get primary() {
		return this.getArgb(this.colors.primary());
	}
	get primaryDim() {
		let e = this.colors.primaryDim();
		if (e === void 0) throw Error("`primaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onPrimary() {
		return this.getArgb(this.colors.onPrimary());
	}
	get primaryContainer() {
		return this.getArgb(this.colors.primaryContainer());
	}
	get onPrimaryContainer() {
		return this.getArgb(this.colors.onPrimaryContainer());
	}
	get primaryFixed() {
		return this.getArgb(this.colors.primaryFixed());
	}
	get primaryFixedDim() {
		return this.getArgb(this.colors.primaryFixedDim());
	}
	get onPrimaryFixed() {
		return this.getArgb(this.colors.onPrimaryFixed());
	}
	get onPrimaryFixedVariant() {
		return this.getArgb(this.colors.onPrimaryFixedVariant());
	}
	get inversePrimary() {
		return this.getArgb(this.colors.inversePrimary());
	}
	get secondary() {
		return this.getArgb(this.colors.secondary());
	}
	get secondaryDim() {
		let e = this.colors.secondaryDim();
		if (e === void 0) throw Error("`secondaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onSecondary() {
		return this.getArgb(this.colors.onSecondary());
	}
	get secondaryContainer() {
		return this.getArgb(this.colors.secondaryContainer());
	}
	get onSecondaryContainer() {
		return this.getArgb(this.colors.onSecondaryContainer());
	}
	get secondaryFixed() {
		return this.getArgb(this.colors.secondaryFixed());
	}
	get secondaryFixedDim() {
		return this.getArgb(this.colors.secondaryFixedDim());
	}
	get onSecondaryFixed() {
		return this.getArgb(this.colors.onSecondaryFixed());
	}
	get onSecondaryFixedVariant() {
		return this.getArgb(this.colors.onSecondaryFixedVariant());
	}
	get tertiary() {
		return this.getArgb(this.colors.tertiary());
	}
	get tertiaryDim() {
		let e = this.colors.tertiaryDim();
		if (e === void 0) throw Error("`tertiaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onTertiary() {
		return this.getArgb(this.colors.onTertiary());
	}
	get tertiaryContainer() {
		return this.getArgb(this.colors.tertiaryContainer());
	}
	get onTertiaryContainer() {
		return this.getArgb(this.colors.onTertiaryContainer());
	}
	get tertiaryFixed() {
		return this.getArgb(this.colors.tertiaryFixed());
	}
	get tertiaryFixedDim() {
		return this.getArgb(this.colors.tertiaryFixedDim());
	}
	get onTertiaryFixed() {
		return this.getArgb(this.colors.onTertiaryFixed());
	}
	get onTertiaryFixedVariant() {
		return this.getArgb(this.colors.onTertiaryFixedVariant());
	}
	get error() {
		return this.getArgb(this.colors.error());
	}
	get errorDim() {
		let e = this.colors.errorDim();
		if (e === void 0) throw Error("`errorDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onError() {
		return this.getArgb(this.colors.onError());
	}
	get errorContainer() {
		return this.getArgb(this.colors.errorContainer());
	}
	get onErrorContainer() {
		return this.getArgb(this.colors.onErrorContainer());
	}
};
Y.DEFAULT_SPEC_VERSION = "2021", Y.DEFAULT_PLATFORM = "phone";
var Pr = class {
	getPrimaryPalette(e, t, n, r, i) {
		switch (e) {
			case W.CONTENT:
			case W.FIDELITY: return V.fromHueAndChroma(t.hue, t.chroma);
			case W.FRUIT_SALAD: return V.fromHueAndChroma(Jn(t.hue - 50), 48);
			case W.MONOCHROME: return V.fromHueAndChroma(t.hue, 0);
			case W.NEUTRAL: return V.fromHueAndChroma(t.hue, 12);
			case W.RAINBOW: return V.fromHueAndChroma(t.hue, 48);
			case W.TONAL_SPOT: return V.fromHueAndChroma(t.hue, 36);
			case W.EXPRESSIVE: return V.fromHueAndChroma(Jn(t.hue + 240), 40);
			case W.VIBRANT: return V.fromHueAndChroma(t.hue, 200);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getSecondaryPalette(e, t, n, r, i) {
		switch (e) {
			case W.CONTENT:
			case W.FIDELITY: return V.fromHueAndChroma(t.hue, Math.max(t.chroma - 32, t.chroma * .5));
			case W.FRUIT_SALAD: return V.fromHueAndChroma(Jn(t.hue - 50), 36);
			case W.MONOCHROME: return V.fromHueAndChroma(t.hue, 0);
			case W.NEUTRAL: return V.fromHueAndChroma(t.hue, 8);
			case W.RAINBOW: return V.fromHueAndChroma(t.hue, 16);
			case W.TONAL_SPOT: return V.fromHueAndChroma(t.hue, 16);
			case W.EXPRESSIVE: return V.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				21,
				51,
				121,
				151,
				191,
				271,
				321,
				360
			], [
				45,
				95,
				45,
				20,
				45,
				90,
				45,
				45,
				45
			]), 24);
			case W.VIBRANT: return V.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				41,
				61,
				101,
				131,
				181,
				251,
				301,
				360
			], [
				18,
				15,
				10,
				12,
				15,
				18,
				15,
				12,
				12
			]), 24);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getTertiaryPalette(e, t, n, r, i) {
		switch (e) {
			case W.CONTENT: return V.fromHct(yr.fixIfDisliked(new Dr(t).analogous(3, 6)[2]));
			case W.FIDELITY: return V.fromHct(yr.fixIfDisliked(new Dr(t).complement));
			case W.FRUIT_SALAD: return V.fromHueAndChroma(t.hue, 36);
			case W.MONOCHROME: return V.fromHueAndChroma(t.hue, 0);
			case W.NEUTRAL: return V.fromHueAndChroma(t.hue, 16);
			case W.RAINBOW:
			case W.TONAL_SPOT: return V.fromHueAndChroma(Jn(t.hue + 60), 24);
			case W.EXPRESSIVE: return V.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				21,
				51,
				121,
				151,
				191,
				271,
				321,
				360
			], [
				120,
				120,
				20,
				45,
				20,
				15,
				20,
				120,
				120
			]), 32);
			case W.VIBRANT: return V.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				41,
				61,
				101,
				131,
				181,
				251,
				301,
				360
			], [
				35,
				30,
				20,
				25,
				30,
				35,
				30,
				25,
				25
			]), 32);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getNeutralPalette(e, t, n, r, i) {
		switch (e) {
			case W.CONTENT:
			case W.FIDELITY: return V.fromHueAndChroma(t.hue, t.chroma / 8);
			case W.FRUIT_SALAD: return V.fromHueAndChroma(t.hue, 10);
			case W.MONOCHROME: return V.fromHueAndChroma(t.hue, 0);
			case W.NEUTRAL: return V.fromHueAndChroma(t.hue, 2);
			case W.RAINBOW: return V.fromHueAndChroma(t.hue, 0);
			case W.TONAL_SPOT: return V.fromHueAndChroma(t.hue, 6);
			case W.EXPRESSIVE: return V.fromHueAndChroma(Jn(t.hue + 15), 8);
			case W.VIBRANT: return V.fromHueAndChroma(t.hue, 10);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getNeutralVariantPalette(e, t, n, r, i) {
		switch (e) {
			case W.CONTENT: return V.fromHueAndChroma(t.hue, t.chroma / 8 + 4);
			case W.FIDELITY: return V.fromHueAndChroma(t.hue, t.chroma / 8 + 4);
			case W.FRUIT_SALAD: return V.fromHueAndChroma(t.hue, 16);
			case W.MONOCHROME: return V.fromHueAndChroma(t.hue, 0);
			case W.NEUTRAL: return V.fromHueAndChroma(t.hue, 2);
			case W.RAINBOW: return V.fromHueAndChroma(t.hue, 0);
			case W.TONAL_SPOT: return V.fromHueAndChroma(t.hue, 8);
			case W.EXPRESSIVE: return V.fromHueAndChroma(Jn(t.hue + 15), 12);
			case W.VIBRANT: return V.fromHueAndChroma(t.hue, 12);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getErrorPalette(e, t, n, r, i) {}
}, Fr = class e extends Pr {
	getPrimaryPalette(e, t, n, r, i) {
		switch (e) {
			case W.NEUTRAL: return V.fromHueAndChroma(t.hue, r === "phone" ? L.isBlue(t.hue) ? 12 : 8 : L.isBlue(t.hue) ? 16 : 12);
			case W.TONAL_SPOT: return V.fromHueAndChroma(t.hue, r === "phone" && n ? 26 : 32);
			case W.EXPRESSIVE: return V.fromHueAndChroma(t.hue, r === "phone" ? n ? 36 : 48 : 40);
			case W.VIBRANT: return V.fromHueAndChroma(t.hue, r === "phone" ? 74 : 56);
			default: return super.getPrimaryPalette(e, t, n, r, i);
		}
	}
	getSecondaryPalette(e, t, n, r, i) {
		switch (e) {
			case W.NEUTRAL: return V.fromHueAndChroma(t.hue, r === "phone" ? L.isBlue(t.hue) ? 6 : 4 : L.isBlue(t.hue) ? 10 : 6);
			case W.TONAL_SPOT: return V.fromHueAndChroma(t.hue, 16);
			case W.EXPRESSIVE: return V.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				105,
				140,
				204,
				253,
				278,
				300,
				333,
				360
			], [
				-160,
				155,
				-100,
				96,
				-96,
				-156,
				-165,
				-160
			]), r === "phone" && n ? 16 : 24);
			case W.VIBRANT: return V.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				38,
				105,
				140,
				333,
				360
			], [
				-14,
				10,
				-14,
				10,
				-14
			]), r === "phone" ? 56 : 36);
			default: return super.getSecondaryPalette(e, t, n, r, i);
		}
	}
	getTertiaryPalette(e, t, n, r, i) {
		switch (e) {
			case W.NEUTRAL: return V.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				38,
				105,
				161,
				204,
				278,
				333,
				360
			], [
				-32,
				26,
				10,
				-39,
				24,
				-15,
				-32
			]), r === "phone" ? 20 : 36);
			case W.TONAL_SPOT: return V.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				20,
				71,
				161,
				333,
				360
			], [
				-40,
				48,
				-32,
				40,
				-32
			]), r === "phone" ? 28 : 32);
			case W.EXPRESSIVE: return V.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				105,
				140,
				204,
				253,
				278,
				300,
				333,
				360
			], [
				-165,
				160,
				-105,
				101,
				-101,
				-160,
				-170,
				-165
			]), 48);
			case W.VIBRANT: return V.fromHueAndChroma(Y.getRotatedHue(t, [
				0,
				38,
				71,
				105,
				140,
				161,
				253,
				333,
				360
			], [
				-72,
				35,
				24,
				-24,
				62,
				50,
				62,
				-72
			]), 56);
			default: return super.getTertiaryPalette(e, t, n, r, i);
		}
	}
	static getExpressiveNeutralHue(e) {
		return Y.getRotatedHue(e, [
			0,
			71,
			124,
			253,
			278,
			300,
			360
		], [
			10,
			0,
			10,
			0,
			10,
			0
		]);
	}
	static getExpressiveNeutralChroma(t, n, r) {
		let i = e.getExpressiveNeutralHue(t);
		return r === "phone" ? n ? L.isYellow(i) ? 6 : 14 : 18 : 12;
	}
	static getVibrantNeutralHue(e) {
		return Y.getRotatedHue(e, [
			0,
			38,
			105,
			140,
			333,
			360
		], [
			-14,
			10,
			-14,
			10,
			-14
		]);
	}
	static getVibrantNeutralChroma(t, n) {
		let r = e.getVibrantNeutralHue(t);
		return n === "phone" || L.isBlue(r) ? 28 : 20;
	}
	getNeutralPalette(t, n, r, i, a) {
		switch (t) {
			case W.NEUTRAL: return V.fromHueAndChroma(n.hue, i === "phone" ? 1.4 : 6);
			case W.TONAL_SPOT: return V.fromHueAndChroma(n.hue, i === "phone" ? 5 : 10);
			case W.EXPRESSIVE: return V.fromHueAndChroma(e.getExpressiveNeutralHue(n), e.getExpressiveNeutralChroma(n, r, i));
			case W.VIBRANT: return V.fromHueAndChroma(e.getVibrantNeutralHue(n), e.getVibrantNeutralChroma(n, i));
			default: return super.getNeutralPalette(t, n, r, i, a);
		}
	}
	getNeutralVariantPalette(t, n, r, i, a) {
		switch (t) {
			case W.NEUTRAL: return V.fromHueAndChroma(n.hue, (i === "phone" ? 1.4 : 6) * 2.2);
			case W.TONAL_SPOT: return V.fromHueAndChroma(n.hue, (i === "phone" ? 5 : 10) * 1.7);
			case W.EXPRESSIVE:
				let o = e.getExpressiveNeutralHue(n), s = e.getExpressiveNeutralChroma(n, r, i);
				return V.fromHueAndChroma(o, s * (o >= 105 && o < 125 ? 1.6 : 2.3));
			case W.VIBRANT:
				let c = e.getVibrantNeutralHue(n), l = e.getVibrantNeutralChroma(n, i);
				return V.fromHueAndChroma(c, l * 1.29);
			default: return super.getNeutralVariantPalette(t, n, r, i, a);
		}
	}
	getErrorPalette(e, t, n, r, i) {
		let a = Y.getPiecewiseHue(t, [
			0,
			3,
			13,
			23,
			33,
			43,
			153,
			273,
			360
		], [
			12,
			22,
			32,
			12,
			22,
			32,
			22,
			12
		]);
		switch (e) {
			case W.NEUTRAL: return V.fromHueAndChroma(a, r === "phone" ? 50 : 40);
			case W.TONAL_SPOT: return V.fromHueAndChroma(a, r === "phone" ? 60 : 48);
			case W.EXPRESSIVE: return V.fromHueAndChroma(a, r === "phone" ? 64 : 48);
			case W.VIBRANT: return V.fromHueAndChroma(a, r === "phone" ? 80 : 60);
			default: return super.getErrorPalette(e, t, n, r, i);
		}
	}
}, Ir = new Pr(), Lr = new Fr();
function Rr(e) {
	return e === "2025" ? Lr : Ir;
}
//#endregion
//#region node_modules/@material/material-color-utilities/scheme/scheme_expressive.js
var zr = class extends Y {
	constructor(e, t, n, r = Y.DEFAULT_SPEC_VERSION, i = Y.DEFAULT_PLATFORM) {
		super({
			sourceColorHct: e,
			variant: W.EXPRESSIVE,
			contrastLevel: n,
			isDark: t,
			platform: i,
			specVersion: r
		});
	}
}, Br = class extends Y {
	constructor(e, t, n, r = Y.DEFAULT_SPEC_VERSION, i = Y.DEFAULT_PLATFORM) {
		super({
			sourceColorHct: e,
			variant: W.TONAL_SPOT,
			contrastLevel: n,
			isDark: t,
			platform: i,
			specVersion: r
		});
	}
}, Vr = class extends Y {
	constructor(e, t, n, r = Y.DEFAULT_SPEC_VERSION, i = Y.DEFAULT_PLATFORM) {
		super({
			sourceColorHct: e,
			variant: W.VIBRANT,
			contrastLevel: n,
			isDark: t,
			platform: i,
			specVersion: r
		});
	}
};
//#endregion
//#region node_modules/@material/material-color-utilities/utils/string_utils.js
function X(e) {
	let t = tr(e), n = nr(e), r = rr(e), i = [
		t.toString(16),
		n.toString(16),
		r.toString(16)
	];
	for (let [e, t] of i.entries()) t.length === 1 && (i[e] = "0" + t);
	return "#" + i.join("");
}
function Hr(e) {
	e = e.replace("#", "");
	let t = e.length === 3, n = e.length === 6, r = e.length === 8;
	if (!t && !n && !r) throw Error("unexpected hex " + e);
	let i = 0, a = 0, o = 0;
	return t ? (i = Ur(e.slice(0, 1).repeat(2)), a = Ur(e.slice(1, 2).repeat(2)), o = Ur(e.slice(2, 3).repeat(2))) : n ? (i = Ur(e.slice(0, 2)), a = Ur(e.slice(2, 4)), o = Ur(e.slice(4, 6))) : r && (i = Ur(e.slice(2, 4)), a = Ur(e.slice(4, 6)), o = Ur(e.slice(6, 8))), (255 << 24 | (i & 255) << 16 | (a & 255) << 8 | o & 255) >>> 0;
}
function Ur(e) {
	return parseInt(e, 16);
}
//#endregion
//#region node_modules/motion-utils/dist/es/array.mjs
function Wr(e, t) {
	e.indexOf(t) === -1 && e.push(t);
}
function Gr(e, t) {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}
//#endregion
//#region node_modules/motion-utils/dist/es/clamp.mjs
var Kr = (e, t, n) => n > t ? t : n < e ? e : n, qr = {}, Jr = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e), Yr = (e) => typeof e == "object" && !!e, Xr = (e) => /^0[^.\s]+$/u.test(e);
//#endregion
//#region node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function Zr(e) {
	let t;
	return () => (t === void 0 && (t = e()), t);
}
//#endregion
//#region node_modules/motion-utils/dist/es/noop.mjs
var Qr = /* @__NO_SIDE_EFFECTS__ */ (e) => e, $r = (...e) => e.reduce((e, t) => (n) => t(e(n))), ei = /* @__NO_SIDE_EFFECTS__ */ (e, t, n) => {
	let r = t - e;
	return r ? (n - e) / r : 1;
}, ti = class {
	constructor() {
		this.subscriptions = [];
	}
	add(e) {
		return Wr(this.subscriptions, e), () => this.remove(e);
	}
	remove(e) {
		Gr(this.subscriptions, e);
	}
	notify(e, t, n) {
		let r = this.subscriptions.length;
		if (r) {
			if (r === 1) this.subscriptions[0](e, t, n);
			else for (let i = 0; i < r; i++) {
				let r = this.subscriptions[i];
				r && r(e, t, n);
			}
		}
	}
	getSize() {
		return this.subscriptions.length;
	}
	clear() {
		this.subscriptions.length = 0;
	}
}, ni = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, ri = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3, ii = /* @__NO_SIDE_EFFECTS__ */ (e, t) => t ? 1e3 / t * e : 0, ai = (e, t, n) => {
	let r = t - e;
	return ((n - e) % r + r) % r + e;
}, oi = (e, t, n) => e * (3 * (1 - e) * ((1 - e) * t + e * n) + e * e);
/*#__NO_SIDE_EFFECTS__*/
function si(e, t, n, r) {
	return e === t && n === r ? Qr : (i) => {
		let a = 0, o = 1, s = i;
		for (let t = 0;; t++) {
			s >= a && s <= o || (s = (a + o) / 2);
			let r = oi(s, e, n) - i;
			if (r * r < 1e-28 || t === 40) break;
			r > 0 ? o = s : a = s, s -= r * 1e-7 / (oi(s + 1e-7, e, n) - i - r);
		}
		return oi(s, t, r);
	};
}
//#endregion
//#region node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var ci = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => t <= .5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, li = /* @__NO_SIDE_EFFECTS__ */ (e) => (t) => 1 - e(1 - t), ui = /*@__PURE__*/ si(.33, 1.53, .69, .99), di = /*@__PURE__*/ li(ui), fi = /*@__PURE__*/ ci(di), pi = (e) => e >= 1 ? 1 : (e *= 2) < 1 ? .5 * di(e) : .5 * (2 - 2 ** (-10 * (e - 1))), mi = (e) => 1 - Math.sin(Math.acos(e)), hi = /* @__PURE__ */ li(mi), gi = /* @__PURE__ */ ci(mi), _i = /*@__PURE__*/ si(.42, 0, 1, 1), vi = /*@__PURE__*/ si(0, 0, .58, 1), yi = /*@__PURE__*/ si(.42, 0, .58, 1), bi = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] != "number";
//#endregion
//#region node_modules/motion-utils/dist/es/easing/utils/get-easing-for-segment.mjs
/*#__NO_SIDE_EFFECTS__*/
function xi(e, t) {
	return /* @__PURE__ */ bi(e) ? e[ai(0, e.length, t)] : e;
}
//#endregion
//#region node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs
var Si = /* @__NO_SIDE_EFFECTS__ */ (e) => Array.isArray(e) && typeof e[0] == "number", Ci = {
	linear: Qr,
	easeIn: _i,
	easeInOut: yi,
	easeOut: vi,
	circIn: mi,
	circInOut: gi,
	circOut: hi,
	backIn: di,
	backInOut: fi,
	backOut: ui,
	anticipate: pi
}, wi = (e) => typeof e == "string", Ti = (e) => {
	if (/* @__PURE__ */ Si(e)) {
		let [t, n, r, i] = e;
		return /* @__PURE__ */ si(t, n, r, i);
	}
	return wi(e) ? Ci[e] : e;
}, Ei = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}, Di;
function Oi() {
	Di = void 0;
}
var Z = {
	now: () => (Di === void 0 && Z.set(Ei.isProcessing || qr.useManualTiming ? Ei.timestamp : performance.now()), Di),
	set: (e) => {
		Di = e, queueMicrotask(Oi);
	}
}, ki = (e) => Math.round(e * 1e5) / 1e5, Ai = /*@__PURE__*/ ((e) => (t) => typeof t == "string" && t.startsWith(e))("var(--"), ji = (e) => Ai(e) ? Mi.test(e.split("/*")[0].trim()) : !1, Mi = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Ni(e) {
	return typeof e == "string" && e.split("/*")[0].includes("var(--");
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var Pi = {
	test: (e) => typeof e == "number",
	parse: parseFloat,
	transform: (e) => e
}, Fi = {
	...Pi,
	transform: (e) => Kr(0, 1, e)
}, Ii = {
	...Pi,
	default: 1
}, Li = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function Ri(e) {
	return e == null;
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var zi = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Bi = (e, t) => (n) => !!(typeof n == "string" && zi.test(n) && n.startsWith(e) || t && !Ri(n) && Object.prototype.hasOwnProperty.call(n, t)), Vi = (e, t, n) => (r) => {
	if (typeof r != "string") return r;
	let [i, a, o, s] = r.match(Li);
	return {
		[e]: parseFloat(i),
		[t]: parseFloat(a),
		[n]: parseFloat(o),
		alpha: s === void 0 ? 1 : parseFloat(s)
	};
}, Hi = (e) => Kr(0, 255, e), Ui = {
	...Pi,
	transform: (e) => Math.round(Hi(e))
}, Wi = {
	test: /*@__PURE__*/ Bi("rgb", "red"),
	parse: /*@__PURE__*/ Vi("red", "green", "blue"),
	transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + Ui.transform(e) + ", " + Ui.transform(t) + ", " + Ui.transform(n) + ", " + ki(Fi.transform(r)) + ")"
}, Gi = (e, t, n) => {
	let r = e.substring(1 + t * n, 1 + (t + 1) * n);
	return n > 1 ? r : r + r;
};
function Ki(e) {
	let t = e.length > 5 ? 2 : 1, n = Gi(e, 3, t);
	return {
		red: parseInt(Gi(e, 0, t), 16),
		green: parseInt(Gi(e, 1, t), 16),
		blue: parseInt(Gi(e, 2, t), 16),
		alpha: n ? parseInt(n, 16) / 255 : 1
	};
}
var qi = {
	test: /*@__PURE__*/ Bi("#"),
	parse: Ki,
	transform: Wi.transform
}, Ji = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
	test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
	parse: parseFloat,
	transform: (t) => `${t}${e}`
}), Yi = /*@__PURE__*/ Ji("deg"), Xi = /*@__PURE__*/ Ji("%"), Q = /*@__PURE__*/ Ji("px"), Zi = /*@__PURE__*/ Ji("vh"), Qi = /*@__PURE__*/ Ji("vw"), $i = {
	...Xi,
	parse: (e) => Xi.parse(e) / 100,
	transform: (e) => Xi.transform(e * 100)
}, ea = {
	test: /*@__PURE__*/ Bi("hsl", "hue"),
	parse: /*@__PURE__*/ Vi("hue", "saturation", "lightness"),
	transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + Xi.transform(ki(t)) + ", " + Xi.transform(ki(n)) + ", " + ki(Fi.transform(r)) + ")"
}, $ = {
	test: (e) => Wi.test(e) || qi.test(e) || ea.test(e),
	parse: (e) => Wi.test(e) ? Wi.parse(e) : ea.test(e) ? ea.parse(e) : qi.parse(e),
	transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? Wi.transform(e) : ea.transform(e),
	getAnimatableNone: (e) => {
		let t = $.parse(e);
		return t.alpha = 0, $.transform(t);
	}
}, ta = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu, na = /*@__PURE__*/ new RegExp(Li.source), ra = /*@__PURE__*/ new RegExp(ta.source, "i");
function ia(e) {
	return isNaN(e) && typeof e == "string" && (na.test(e) || ra.test(e));
}
var aa = "number", oa = "color", sa = "var", ca = "var(", la = "${}", ua = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)(?![a-z]*\()/giu;
function da(e) {
	let t = e.toString();
	return na.test(t) || ra.test(t);
}
function fa(e) {
	let t = e.toString(), n = [], r = {
		color: [],
		number: [],
		var: []
	}, i = [], a = 0;
	return {
		values: n,
		split: t.replace(ua, (e) => ($.test(e) ? (r.color.push(a), i.push(oa), n.push($.parse(e))) : e.startsWith(ca) ? (r.var.push(a), i.push(sa), n.push(e)) : (r.number.push(a), i.push(aa), n.push(parseFloat(e))), ++a, la)).split(la),
		indexes: r,
		types: i
	};
}
function pa(e) {
	return fa(e).values;
}
function ma({ split: e, types: t }) {
	let n = e.length;
	return (r) => {
		let i = "";
		for (let a = 0; a < n; a++) if (i += e[a], r[a] !== void 0) {
			let e = t[a];
			i += e === aa ? ki(r[a]) : e === oa ? $.transform(r[a]) : r[a];
		}
		return i;
	};
}
function ha(e) {
	return ma(fa(e));
}
var ga = (e) => typeof e == "number" ? 0 : $.test(e) ? $.getAnimatableNone(e) : e, _a = (e, t) => typeof e == "number" ? t?.trim().endsWith("/") ? e : 0 : ga(e);
function va(e) {
	let t = fa(e);
	return ma(t)(t.values.map((e, n) => _a(e, t.split[n])));
}
var ya = {
	test: ia,
	parse: pa,
	createTransformer: ha,
	getAnimatableNone: va
};
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function ba(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function xa({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = ba(s, r, e + 1 / 3), a = ba(s, r, e), o = ba(s, r, e - 1 / 3);
	}
	return {
		red: Math.round(i * 255),
		green: Math.round(a * 255),
		blue: Math.round(o * 255),
		alpha: r
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function Sa(e, t) {
	return (n) => n > 0 ? t : e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/mix/number.mjs
var Ca = (e, t, n) => e + (t - e) * n, wa = (e, t, n) => {
	let r = e * e, i = n * (t * t - r) + r;
	return i < 0 ? 0 : Math.sqrt(i);
}, Ta = [
	qi,
	Wi,
	ea
], Ea = (e) => Ta.find((t) => t.test(e));
function Da(e) {
	let t = Ea(e);
	if (!t) return !1;
	let n = t.parse(e);
	return t === ea && (n = xa(n)), n;
}
var Oa = (e, t) => {
	let n = Da(e), r = Da(t);
	if (!n || !r) return Sa(e, t);
	let i = { ...n };
	return (e) => (i.red = wa(n.red, r.red, e), i.green = wa(n.green, r.green, e), i.blue = wa(n.blue, r.blue, e), i.alpha = Ca(n.alpha, r.alpha, e), Wi.transform(i));
}, ka = /* @__PURE__ */ new Set(["none", "hidden"]);
function Aa(e, t) {
	return ka.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function ja(e, t) {
	return (n) => Ca(e, t, n);
}
function Ma(e) {
	return typeof e == "number" ? ja : typeof e == "string" ? ji(e) ? Sa : $.test(e) ? Oa : Ia : Array.isArray(e) ? Na : typeof e == "object" ? $.test(e) ? Oa : Pa : Sa;
}
function Na(e, t) {
	let n = [...e], r = n.length, i = e.map((e, n) => Ma(e)(e, t[n]));
	return (e) => {
		for (let t = 0; t < r; t++) n[t] = i[t](e);
		return n;
	};
}
function Pa(e, t) {
	let n = {
		...e,
		...t
	}, r = {};
	for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = Ma(e[i])(e[i], t[i]));
	return (e) => {
		for (let t in r) n[t] = r[t](e);
		return n;
	};
}
function Fa(e, t) {
	let n = [], r = {
		color: 0,
		var: 0,
		number: 0
	};
	for (let i = 0; i < t.values.length; i++) {
		let a = t.types[i], o = e.indexes[a][r[a]], s = e.values[o] ?? 0;
		n[i] = s, r[a]++;
	}
	return n;
}
var Ia = (e, t) => {
	let n = fa(e), r = fa(t);
	return n.indexes.var.length === r.indexes.var.length && n.indexes.color.length === r.indexes.color.length && n.indexes.number.length >= r.indexes.number.length ? ka.has(e) && !r.values.length || ka.has(t) && !n.values.length ? Aa(e, t) : $r(Na(Fa(n, r), r.values), ma(r)) : Sa(e, t);
}, La = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
function Ra(e, t) {
	let n = La.exec(e);
	if (!n) return;
	let r = La.exec(t);
	if (!r || n[2] !== r[2]) return;
	let i = n[2], a = parseFloat(n[1]), o = parseFloat(r[1]);
	return (e) => ki(Ca(a, o, e)) + i;
}
function za(e, t, n) {
	if (typeof e == "number" && typeof t == "number" && typeof n == "number") return Ca(e, t, n);
	if (typeof e == "string" && typeof t == "string") {
		let n = Ra(e, t);
		if (n) return n;
	}
	return Ma(e)(e, t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/order.mjs
var Ba = [
	"setup",
	"read",
	"resolveKeyframes",
	"preUpdate",
	"update",
	"preRender",
	"render",
	"postRender"
];
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/render-step.mjs
function Va(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = !1, i = !1, a, o = /* @__PURE__ */ new Set(), s = {
		delta: 0,
		timestamp: 0,
		isProcessing: !1
	};
	function c(t) {
		o.has(t) && (n.add(t), e()), (a = t)(s);
	}
	let l = {
		schedule: (e, i = !1, s = !1) => {
			let c = s && r, l = c ? t : n;
			return i && o.add(e), c && e !== a && l.delete(e), l.add(e), e;
		},
		cancel: (e) => {
			n.delete(e), o.delete(e);
		},
		process: (e) => {
			if (s = e, r) {
				i = !0;
				return;
			}
			r = !0;
			let o = t;
			t = n, n = o, t.forEach(c), t.clear(), a = void 0, r = !1, i && (i = !1, l.process(e));
		}
	};
	return l;
}
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/batcher.mjs
var Ha = 40;
function Ua(e, t, n = {
	delta: 0,
	timestamp: 0,
	isProcessing: !1
}) {
	let r = !1, i = !0, a = () => r = !0, o = Ba.reduce((e, t) => (e[t] = Va(a), e), {}), { setup: s, read: c, resolveKeyframes: l, preUpdate: u, update: d, preRender: f, render: p, postRender: m } = o, h = () => {
		let a = qr.useManualTiming, o = a ? n.timestamp : performance.now();
		r = !1, a || (n.delta = i ? 1e3 / 60 : Math.max(Math.min(o - n.timestamp, Ha), 1)), n.timestamp = o, n.isProcessing = !0, s.process(n), c.process(n), l.process(n), u.process(n), d.process(n), f.process(n), p.process(n), m.process(n), n.isProcessing = !1, r && t && (i = !1, e(h));
	}, g = () => {
		r = !0, i = !0, n.isProcessing || e(h);
	};
	return {
		schedule: Ba.reduce((e, t) => {
			let n = o[t];
			return e[t] = (e, t = !1, i = !1) => (r || g(), n.schedule(e, t, i)), e;
		}, {}),
		cancel: (e) => {
			for (let t = 0; t < Ba.length; t++) o[Ba[t]].cancel(e);
		},
		state: n,
		steps: o
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/frameloop/frame.mjs
var { schedule: Wa, cancel: Ga, steps: Ka } = /* @__PURE__ */ Ua(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Qr, !0, Ei), qa = (e) => {
	let t = ({ timestamp: t }) => e(t);
	return {
		start: (e = !0) => Wa.update(t, e),
		stop: () => Ga(t),
		now: () => Ei.isProcessing ? Ei.timestamp : Z.now()
	};
}, Ja = (e, t, n = 10) => {
	let r = "", i = Math.max(Math.round(t / n), 2);
	for (let t = 0; t < i; t++) r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${r.substring(0, r.length - 2)})`;
}, Ya = 2e4;
function Xa(e, t = 50, n = Ya, r) {
	let i = 0, a = e.next(i);
	for (r?.push(a.value); !a.done && i < n;) i += t, a = e.next(i), r?.push(a.value);
	return i >= n ? Infinity : i;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
function Za(e, t = 100, n) {
	let { keyframes: r, velocity: i } = e, a = r && r[r.length - 1] - r[0], o = n({
		...e,
		velocity: i && a ? i * t / a : i,
		keyframes: [0, t]
	}), s = Math.min(Xa(o), Ya);
	return {
		type: "keyframes",
		ease: (e) => o.next(s * e).value / t,
		duration: /* @__PURE__ */ ri(s)
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/spring.mjs
var Qa = 100, $a = 10, eo = 1, to = 800, no = .3, ro = .3, io = .01, ao = 2, oo = .005, so = .5, co = .01, lo = 10, uo = .05, fo = (e) => e < 0 ? 1 / Math.max(1 + e, uo) : Math.max(1 - e, uo);
function po(e, t) {
	if (!(e > 1)) return 1;
	let n = Math.sqrt(e * e - 1), r = e - n, i = e + n, a = 2 * n * Math.exp(-t) * (1 + t);
	return go((e) => i * Math.exp(-r * e) - r * Math.exp(-i * e) - a, (e) => Math.exp(-i * e) - Math.exp(-r * e), t) / t;
}
function mo(e, t) {
	return e * Math.sqrt(1 - t * t);
}
var ho = 12;
function go(e, t, n) {
	let r = n;
	for (let n = 1; n < ho; n++) r -= e(r) / t(r);
	return r;
}
var _o = .001;
function vo({ duration: e = to, bounce: t = no }) {
	let n, r, i = fo(t);
	e = Kr(co, lo, /* @__PURE__ */ ri(e)), i < 1 ? (n = (t) => {
		let n = t * i, r = n * e, a = mo(t, i), o = Math.exp(-r);
		return _o - n / a * o;
	}, r = (t) => {
		let r = t * i * e, a = i * i * t * t * e, o = Math.exp(-r), s = mo(t * t, i);
		return (-n(t) + _o > 0 ? -1 : 1) * -a * o / s;
	}) : (n = (t) => -.001 + Math.exp(-t * e) * (t * e + 1), r = (t) => Math.exp(-t * e) * (-t * (e * e)));
	let a = 5 / e, o = go(n, r, a), s = o * po(i, o * e), c = s * s;
	return {
		stiffness: c,
		damping: i * 2 * Math.sqrt(c),
		duration: /* @__PURE__ */ ni(e)
	};
}
var yo = (e, t) => (t ? e >= 0 : e > 0) && e < Infinity;
function bo(e, t) {
	if (yo(e, t)) return e;
}
function xo(e) {
	let t = bo(e.stiffness), n = bo(e.damping, !0), r = bo(e.mass), i = {
		...e,
		stiffness: t ?? Qa,
		damping: n ?? $a,
		mass: r ?? eo,
		isResolvedFromDuration: !1,
		isTimeDefined: (t ?? n ?? r) === void 0 && (e.duration !== void 0 || e.bounce !== void 0)
	};
	if (i.isTimeDefined) {
		if (e.visualDuration) {
			let t = fo(e.bounce || 0), n = 2 * Math.PI / (e.visualDuration * 1.2) * po(t, 2 * Math.PI / 1.2);
			i.stiffness = n * n, i.damping = 2 * t * Math.sqrt(i.stiffness);
		} else Object.assign(i, vo(i)), i.isResolvedFromDuration = !0;
		(!yo(i.stiffness) || !yo(i.damping, !0)) && (i.stiffness = Qa, i.damping = $a);
	}
	return i;
}
function So(e = ro, t = no) {
	let n = typeof e == "object" ? e : {
		visualDuration: e,
		keyframes: [0, 1],
		bounce: t
	}, r = n.keyframes[0], i = n.keyframes[n.keyframes.length - 1], a = {
		done: !1,
		value: r
	}, { stiffness: o, damping: s, mass: c, duration: l, isResolvedFromDuration: u, isTimeDefined: d } = xo({ ...n }), f = (e) => d ? 0 : -/* @__PURE__ */ ri(e), p = s / (2 * Math.sqrt(o * c)), m = /* @__PURE__ */ ri(Math.sqrt(o / c)), h = p * m, g = {
		target: i,
		delta: i - r,
		velocity: f(n.velocity || 0) || 0,
		restSpeed: 0,
		restDelta: 0
	}, _ = () => {
		let e = Math.abs(g.delta) < 5;
		g.restSpeed = n.restSpeed || (e ? io : ao), g.restDelta = n.restDelta || (e ? oo : so);
	};
	_();
	let v, y, b;
	if (p < 1) {
		let e = mo(m, p), t = {
			A: 0,
			sinC: 0,
			cosC: 0,
			t: -1,
			env: 0,
			sin: 0,
			cos: 0
		};
		b = () => {
			t.A = (g.velocity + h * g.delta) / e, t.sinC = h * t.A + g.delta * e, t.cosC = h * g.delta - t.A * e;
		};
		let n = (n) => {
			n !== t.t && (t.t = n, t.env = Math.exp(-h * n), t.sin = Math.sin(e * n), t.cos = Math.cos(e * n));
		};
		v = (e) => (n(e), g.target - t.env * (t.A * t.sin + g.delta * t.cos)), y = (e) => (n(e), t.env * (t.sinC * t.sin + t.cosC * t.cos));
	} else if (p === 1) {
		v = (e) => g.target - Math.exp(-m * e) * (g.delta + (g.velocity + m * g.delta) * e);
		let e = { C: 0 };
		b = () => {
			e.C = g.velocity + m * g.delta;
		}, y = (t) => Math.exp(-m * t) * (m * e.C * t - g.velocity);
	} else {
		let e = m * Math.sqrt(p * p - 1), t = h - e, n = h + e, r = e < 1 || d ? Infinity : 300 / e, i = (e, t) => Math.exp(t > r ? (h - e) * r - h * t : -e * t), a = {
			S: 0,
			F: 0
		};
		b = () => {
			let t = (g.velocity + h * g.delta) / e;
			a.S = (g.delta + t) / 2, a.F = (g.delta - t) / 2;
		}, v = (e) => g.target - a.S * i(t, e) - a.F * i(n, e), y = (e) => t * a.S * i(t, e) + n * a.F * i(n, e);
	}
	b();
	let x = u && l || null, S = {
		calculatedDuration: x,
		retarget: (e, t) => {
			g.target = e[e.length - 1], g.delta = g.target - e[0], g.velocity = f(t), n.restSpeed && n.restDelta || _(), S.calculatedDuration = x, a.done = !1, b();
		},
		velocity: (e) => /* @__PURE__ */ ni(y(e)),
		next: (e) => {
			let t = v(e);
			if (u) a.done = e >= l;
			else {
				let n = /* @__PURE__ */ ni(y(e));
				a.done = Math.abs(n) <= g.restSpeed && Math.abs(g.target - t) <= g.restDelta;
			}
			return a.value = a.done ? g.target : t, a;
		},
		toString: () => {
			let e = Math.min(Xa(S), Ya), t = Ja((t) => S.next(e * t).value, e, 30);
			return e + "ms " + t;
		},
		toTransition: () => {}
	};
	return S;
}
var Co = /* @__PURE__ */ Object.assign(So, { applyToOptions: (e) => {
	let t = Za(e, 100, So);
	return e.ease = t.ease, e.duration = /* @__PURE__ */ ni(t.duration), e.type = "keyframes", e;
} });
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function wo({ keyframes: e, velocity: t = 0, power: n = .8, timeConstant: r = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: s, max: c, restDelta: l = .5, restSpeed: u }) {
	let d = e[0], f = {
		done: !1,
		value: d
	}, p = (e) => e < s || e > c, m = (e) => s === void 0 ? c : c === void 0 || Math.abs(s - e) < Math.abs(c - e) ? s : c, h = n * t, g = d + h, _ = o ? o(g) : g;
	_ !== g && (h = _ - d);
	let v = (e) => -h * Math.exp(-e / r), y = (e) => {
		let t = v(e);
		f.done = Math.abs(t) <= l, f.value = f.done ? _ : e ? _ + t : d;
	}, b, x, S = (e) => {
		p(f.value) && (b = e, x = Co({
			keyframes: [f.value, m(f.value)],
			velocity: -v(e) / r * 1e3,
			damping: i,
			stiffness: a,
			restDelta: l,
			restSpeed: u
		}));
	};
	return S(0), {
		calculatedDuration: null,
		next: (e) => {
			let t = !1;
			return !x && b === void 0 && (t = !0, y(e), S(e)), b !== void 0 && e >= b ? x.next(e - b) : (!t && y(e), f);
		}
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/interpolate.mjs
function To(e, t, n) {
	let r = [], i = qr.mix || za, a = e.length - 1;
	for (let o = 0; o < a; o++) {
		let a = n?.(e[o], e[o + 1]) || i(e[o], e[o + 1]);
		t && (a = $r(Array.isArray(t) ? t[o] || Qr : t, a)), r.push(a);
	}
	return r;
}
function Eo(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	if (a === 1) return () => t[0];
	if (a === 2 && t[0] === t[1]) return () => t[1];
	let o = e[0] === e[1];
	e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
	let s = To(t, r, i), c = s.length, l = (n) => {
		if (o && n < e[0]) return t[0];
		let r = 0;
		if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
		let i = /* @__PURE__ */ ei(e[r], e[r + 1], n);
		return s[r](i);
	};
	return n ? (t) => l(Kr(e[0], e[a - 1], t)) : l;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function Do(e, t) {
	let n = e[e.length - 1];
	for (let r = 1; r <= t; r++) {
		let i = /* @__PURE__ */ ei(0, t, r);
		e.push(Ca(n, 1, i));
	}
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function Oo(e) {
	let t = [0];
	return Do(t, e.length - 1), t;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function ko(e, t) {
	return e.map((e) => e * t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function Ao(e, t) {
	return e.map(() => t || yi).splice(0, e.length - 1);
}
function jo({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut", mixer: i }) {
	let a = typeof t[0] == "number" ? void 0 : i, o = /* @__PURE__ */ bi(r) ? r.map(Ti) : Ti(r) || yi, s = {
		done: !1,
		value: t[0]
	}, c = -1;
	if (!a) {
		for (let e = 1; e < t.length; e++) if (t[e] !== t[e - 1]) {
			if (c >= 0) {
				c = -2;
				break;
			}
			c = e - 1;
		}
	}
	if (c >= 0) {
		let r = n && n.length === t.length ? n : Oo(t), i = r[c] * e, a = r[c + 1] * e, l = t[c], u = t[c + 1], d = Array.isArray(o) ? o[c] : o, f = (qr.mix || za)(l, u), p = t.length - 2;
		return {
			calculatedDuration: e,
			next: (t) => (s.value = c && t < i ? f(0) : c < p && (t >= a || !e) ? typeof u == "number" ? u : f(1) : f(d(t >= a || !e ? 1 : t <= i ? 0 : (t - i) / (a - i))), s.done = t >= e, s)
		};
	}
	let l = Eo(ko(n && n.length === t.length ? n : Oo(t), e), t, {
		ease: Array.isArray(o) ? o : Ao(t, o),
		mixer: a
	});
	return {
		calculatedDuration: e,
		next: (t) => (s.value = l(t), s.done = t >= e, s)
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
var Mo = 5;
function No(e, t, n) {
	let r = Math.max(t - Mo, 0);
	return /* @__PURE__ */ ii(n - e(r), t - r);
}
function Po(e, t, n = 0) {
	return t <= 0 ? n : e.velocity ? e.velocity(t) : No((t) => e.next(t).value, t, e.next(t).value);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
function Fo(e, { repeat: t, repeatType: n = "loop" }, r, i = 1) {
	let a, o, s = 0;
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		n !== null && (s++ || (a = n), o = n);
	}
	let c = i < 0 || t && n !== "loop" && t % 2 == 1 ? 0 : s - 1;
	return !c || r === void 0 ? c ? o : a : r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
var Io = {
	decay: wo,
	inertia: wo,
	tween: jo,
	keyframes: jo,
	spring: Co
};
function Lo(e) {
	typeof e.type == "string" && (e.type = Io[e.type]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/resolve-start-time.mjs
var Ro = 40, zo = (e, t) => t - e > Ro && !qr.useManualTiming ? t : e;
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/notify-inspector.mjs
function Bo(e, t) {
	return {
		kind: e,
		animation: t,
		timestamp: Z.now(),
		frameTimestamp: Ei.timestamp,
		frameIsProcessing: Ei.isProcessing
	};
}
function Vo(e, t, n) {
	let r = globalThis.__MOTION_INSPECT__;
	if (r) try {
		r({
			...Bo("animation-start", e),
			options: n ? {
				...t,
				...n
			} : t
		});
	} catch {}
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var Ho = class {
	constructor() {
		this.isResolved = !1;
	}
	get finished() {
		return this._finished ||= this.isResolved ? Promise.resolve() : new Promise((e) => {
			this._resolve = e;
		}), this._finished;
	}
	updateFinished() {
		this._finished = this._resolve = void 0, this.isResolved = !1;
	}
	notifyFinished() {
		this.isResolved = !0, this._resolve?.();
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
}, Uo = (e) => e / 100, Wo = (e) => Math.round(e * 1e4) / 1e4, Go = class extends Ho {
	constructor(e) {
		super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
			done: !1,
			value: void 0
		}, this.stop = () => {
			let { motionValue: e } = this.options;
			e && e.updatedAt !== Z.now() && this.tick(Z.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
		}, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause(), Vo(this, this.options);
	}
	initAnimation() {
		let { options: e } = this;
		Lo(e);
		let { type: t = jo, repeat: n = 0, repeatDelay: r = 0, repeatType: i, velocity: a = 0 } = e, { keyframes: o } = e, s = t || jo;
		this.mixKeyframes = void 0, s !== jo && typeof o[0] != "number" && (this.mixKeyframes = $r(Uo, e.mixer?.(o[0], o[1]) || za(o[0], o[1])), o = [0, 100]);
		let c = s(o === e.keyframes ? e : {
			...e,
			keyframes: o
		});
		i === "mirror" && (this.mirroredGenerator = s({
			...e,
			keyframes: [...o].reverse(),
			velocity: -a
		})), c.calculatedDuration === null && (c.calculatedDuration = Xa(c));
		let { calculatedDuration: l } = c;
		this.calculatedDuration = l, this.resolvedDuration = l + r, this.totalDuration = this.resolvedDuration * (n + 1) - r, this.generator = c;
	}
	updateTime(e) {
		this.currentTime = this.holdTime ?? Math.round(e - this.startTime) * this.playbackSpeed;
	}
	tick(e, t = !1) {
		let { generator: n, totalDuration: r, calculatedDuration: i } = this;
		if (this.startTime === null) return n.next(0);
		let { delay: a = 0, keyframes: o, type: s, onUpdate: c, finalKeyframe: l } = this.options;
		this.startTime === this.pendingStartTime && (this.startTime = zo(this.startTime, e)), this.pendingStartTime = void 0, this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)), t ? this.currentTime = e : this.updateTime(e);
		let u = this.currentTime - a * (this.playbackSpeed >= 0 ? 1 : -1), d = this.playbackSpeed >= 0 ? u < 0 : u > r;
		this.currentTime = Math.max(u, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = r);
		let f = this.generate(this.currentTime, d), { done: p } = f;
		d || (p = this.playbackSpeed >= 0 ? i < Infinity ? this.currentTime >= r : p : this.currentTime <= 0);
		let m = this.holdTime === null && (this.state === "finished" || this.state === "running" && p);
		return m && s !== wo && (f.value = Fo(o, this.options, l, this.speed)), c && c(f.value), m && this.finish(), f;
	}
	at(e) {
		return this.holdTime ?? Wo((e - this.startTime) * this.playbackSpeed);
	}
	sampleAt(e, t) {
		let { options: n, totalDuration: r } = this, i = this.at(e) - (n.delay || 0);
		return i >= r && n.type !== wo ? Fo(n.keyframes, n, t ? void 0 : n.finalKeyframe) : this.generate(Math.max(i, 0), i < 0).value;
	}
	generate(e, t) {
		let { generator: n, totalDuration: r, mixKeyframes: i, mirroredGenerator: a, resolvedDuration: o } = this, { keyframes: s, repeat: c, repeatType: l, repeatDelay: u } = this.options, d = e, f = n;
		if (c) {
			let t = Math.min(e, r) / o, n = Math.floor(t), i = t % 1;
			!i && t >= 1 && (i = 1), i === 1 && n--, n = Math.min(n, c + 1), n % 2 && (l === "reverse" ? (i = 1 - i, u && (i -= u / o)) : l === "mirror" && (f = a)), d = Kr(0, 1, i) * o;
		}
		let p;
		return t ? (this.delayState.value = s[0], p = this.delayState) : p = f.next(d), i && !t && (p.value = i(p.value)), p;
	}
	get duration() {
		return /* @__PURE__ */ ri(this.calculatedDuration);
	}
	get iterationDuration() {
		return this.duration + /* @__PURE__ */ ri(this.options.delay ?? 0);
	}
	get time() {
		return /* @__PURE__ */ ri(this.currentTime);
	}
	set time(e) {
		this.state === "finished" && this.updateFinished(), e = /* @__PURE__ */ ni(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = e, this.tick(e));
	}
	getGeneratorVelocity() {
		return Po(this.generator, this.currentTime, this.options.velocity);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(e) {
		let t = this.playbackSpeed !== e;
		t && this.driver && this.updateTime(Z.now()), this.playbackSpeed = e, t && this.driver && (this.time = /* @__PURE__ */ ri(this.currentTime));
	}
	play() {
		if (this.isStopped) return;
		let { driver: e = qa, startTime: t } = this.options;
		this.driver ||= e((e) => this.tick(e)), this.options.onPlay?.();
		let n = this.driver.now();
		this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime === null ? this.startTime ||= t ?? (this.pendingStartTime = n) : this.startTime = n - this.holdTime / (this.playbackSpeed || 1), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
	}
	pause() {
		this.state = "paused", this.updateTime(Z.now()), this.holdTime = this.currentTime;
	}
	complete() {
		this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
	}
	finish() {
		this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
	}
	cancel() {
		this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
	}
	teardown() {
		this.state = "idle", this.driver?.stop(), this.driver = void 0, this.startTime = this.holdTime = null;
	}
	sample(e) {
		return this.startTime = 0, this.tick(e, !0);
	}
	attachTimeline(e) {
		return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), e.observe(this);
	}
}, Ko = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function qo(e) {
	let [t, n] = e.slice(0, -1).split("(");
	if (t === "drop-shadow") return e;
	let [r] = n.match(Li) || [];
	if (!r) return e;
	let i = n.replace(r, ""), a = +!!Ko.has(t);
	return r !== n && (a *= 100), t + "(" + a + i + ")";
}
var Jo = /\b([a-z-]*)\(.*?\)/gu, Yo = {
	...ya,
	getAnimatableNone: (e) => {
		let t = e.match(Jo);
		return t ? t.map(qo).join(" ") : e;
	}
}, Xo = {
	...ya,
	getAnimatableNone: (e) => {
		let t = ya.parse(e);
		return ya.createTransformer(e)(t.map((e) => typeof e == "number" ? 0 : typeof e == "object" ? {
			...e,
			alpha: 1
		} : e));
	}
}, Zo = {
	...Pi,
	transform: Math.round
}, Qo = {
	rotate: Yi,
	pathRotation: Yi,
	rotateX: Yi,
	rotateY: Yi,
	rotateZ: Yi,
	scale: Ii,
	scaleX: Ii,
	scaleY: Ii,
	scaleZ: Ii,
	skew: Yi,
	skewX: Yi,
	skewY: Yi,
	distance: Q,
	translateX: Q,
	translateY: Q,
	translateZ: Q,
	x: Q,
	y: Q,
	z: Q,
	perspective: Q,
	transformPerspective: Q,
	opacity: Fi,
	originX: $i,
	originY: $i,
	originZ: Q
}, $o = {
	borderWidth: Q,
	borderTopWidth: Q,
	borderRightWidth: Q,
	borderBottomWidth: Q,
	borderLeftWidth: Q,
	borderRadius: Q,
	borderTopLeftRadius: Q,
	borderTopRightRadius: Q,
	borderBottomRightRadius: Q,
	borderBottomLeftRadius: Q,
	width: Q,
	maxWidth: Q,
	height: Q,
	maxHeight: Q,
	top: Q,
	right: Q,
	bottom: Q,
	left: Q,
	inset: Q,
	insetBlock: Q,
	insetBlockStart: Q,
	insetBlockEnd: Q,
	insetInline: Q,
	insetInlineStart: Q,
	insetInlineEnd: Q,
	padding: Q,
	paddingTop: Q,
	paddingRight: Q,
	paddingBottom: Q,
	paddingLeft: Q,
	paddingBlock: Q,
	paddingBlockStart: Q,
	paddingBlockEnd: Q,
	paddingInline: Q,
	paddingInlineStart: Q,
	paddingInlineEnd: Q,
	margin: Q,
	marginTop: Q,
	marginRight: Q,
	marginBottom: Q,
	marginLeft: Q,
	marginBlock: Q,
	marginBlockStart: Q,
	marginBlockEnd: Q,
	marginInline: Q,
	marginInlineStart: Q,
	marginInlineEnd: Q,
	fontSize: Q,
	backgroundPositionX: Q,
	backgroundPositionY: Q,
	...Qo,
	zIndex: Zo,
	fillOpacity: Fi,
	strokeOpacity: Fi,
	numOctaves: Zo
}, es = {
	...$o,
	color: $,
	backgroundColor: $,
	outlineColor: $,
	fill: $,
	stroke: $,
	borderColor: $,
	borderTopColor: $,
	borderRightColor: $,
	borderBottomColor: $,
	borderLeftColor: $,
	filter: Yo,
	WebkitFilter: Yo,
	mask: Xo,
	WebkitMask: Xo
}, ts = (e) => es[e], ns = /*@__PURE__*/ new Set([Yo, Xo]), rs, is, as;
function os(e, t) {
	if (e === rs && t === is) return as;
	let n = ts(e);
	return ns.has(n) || (n = ya), as = n.getAnimatableNone ? n.getAnimatableNone(t) : void 0, rs = e, is = t, as;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function ss(e) {
	for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
var cs = (e) => e * 180 / Math.PI, ls = (e) => ds(cs(Math.atan2(e[1], e[0]))), us = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scaleZ: () => 1,
	scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
	rotate: ls,
	rotateZ: ls,
	skewX: (e) => cs(Math.atan(e[1])),
	skewY: (e) => cs(Math.atan(e[2])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, ds = (e) => (e %= 360, e < 0 && (e += 360), e), fs = ls, ps = (e) => Math.hypot(e[0], e[1]), ms = (e) => Math.hypot(e[4], e[5]), hs = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX: ps,
	scaleY: ms,
	scaleZ: (e) => Math.hypot(e[8], e[9], e[10]),
	scale: (e) => (ps(e) + ms(e)) / 2,
	rotateX: (e) => ds(cs(Math.atan2(e[6], e[5]))),
	rotateY: (e) => ds(cs(Math.atan2(-e[2], e[0]))),
	rotateZ: fs,
	rotate: fs,
	skewX: (e) => cs(Math.atan(e[4])),
	skewY: (e) => cs(Math.atan(e[1])),
	skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function gs(e) {
	return +!!e.includes("scale");
}
function _s(e, t) {
	if (!e || e === "none") return gs(t);
	let n = e.match(/^matrix(3d)?\(([-\d.e\s,]+)\)$/u);
	if (!n) return gs(t);
	let r = (n[1] ? hs : us)[t], i = n[2].split(",").map((e) => parseFloat(e));
	return typeof r == "function" ? r(i) : i[r];
}
var vs = (e, t) => {
	let { transform: n = "none" } = getComputedStyle(e);
	return _s(n, t);
}, ys = [
	"transformPerspective",
	"x",
	"y",
	"z",
	"translateX",
	"translateY",
	"translateZ",
	"scale",
	"scaleX",
	"scaleY",
	"scaleZ",
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skew",
	"skewX",
	"skewY"
], bs = /* @__PURE__ */ new Set([...ys, "pathRotation"]), xs = (e) => e === Pi || e === Q, Ss = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]), Cs = /* @__PURE__ */ ys.filter((e) => !Ss.has(e));
function ws(e) {
	let t = [];
	return Cs.forEach((n) => {
		let r = e.getValue(n);
		if (r !== void 0) {
			let e = r.get(), i = +!!n.startsWith("scale");
			if (e === i) return;
			t.push([n, e]), r.set(i);
		}
	}), t;
}
var Ts = /* @__PURE__ */ new Set(["bottom", "right"]);
function Es(e, t, n, r, i, a) {
	let o = parseFloat(e);
	if (!isNaN(o)) return o;
	let { min: s, max: c } = t()[n], l = c - s;
	return a === "border-box" ? l : l - parseFloat(r) - parseFloat(i);
}
var Ds = ({ transform: e }) => _s(e, "x"), Os = ({ transform: e }) => _s(e, "y"), ks = {
	width: ({ width: e, paddingLeft: t = "0", paddingRight: n = "0", boxSizing: r }, i) => Es(e, i, "x", t, n, r),
	height: ({ height: e, paddingTop: t = "0", paddingBottom: n = "0", boxSizing: r }, i) => Es(e, i, "y", t, n, r),
	top: ({ top: e }) => parseFloat(e),
	left: ({ left: e }) => parseFloat(e),
	bottom: ({ top: e }, t) => {
		let { y: n } = t();
		return parseFloat(e) + (n.max - n.min);
	},
	right: ({ left: e }, t) => {
		let { x: n } = t();
		return parseFloat(e) + (n.max - n.min);
	},
	x: Ds,
	y: Os,
	translateX: Ds,
	translateY: Os
}, As = /* @__PURE__ */ new Set(), js = !1, Ms = !1, Ns = !1;
function Ps() {
	if (Ms) {
		let e = [], t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
		As.forEach((r) => {
			r.needsMeasurement && (e.push(r), t.add(r.element), Ts.has(r.name) && n.add(r.element));
		});
		let r = /* @__PURE__ */ new Map();
		n.forEach((e) => {
			let t = ws(e);
			t.length && (r.set(e, t), e.render());
		}), e.forEach((e) => e.measureInitialState()), t.forEach((e) => {
			e.render();
			let t = r.get(e);
			t && t.forEach(([t, n]) => {
				e.getValue(t)?.set(n);
			});
		}), e.forEach((e) => e.measureEndState()), e.forEach((e) => {
			e.suspendedScrollY !== void 0 && window.scrollTo(0, e.suspendedScrollY);
		});
	}
	Ms = !1, js = !1, As.forEach((e) => e.complete(Ns)), As.clear();
}
function Fs() {
	As.forEach((e) => {
		e.readKeyframes(), e.needsMeasurement && (Ms = !0);
	});
}
function Is() {
	Ns = !0, Fs(), Ps(), Ns = !1;
}
function Ls(e, t, n) {
	if (typeof e == "string") {
		if (Jr(e) || Xr(e)) return parseFloat(e);
		if (!ya.test(e) && ya.test(n)) return os(t, n);
	}
	return e ?? void 0;
}
var Rs = class {
	constructor(e, t, n, r, i, a = !1) {
		this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = t, this.name = n, this.motionValue = r, this.element = i, this.isAsync = a;
	}
	scheduleResolve() {
		this.state = "scheduled", this.isAsync ? (As.add(this), js || (js = !0, Wa.read(Fs), Wa.resolveKeyframes(Ps))) : (this.readKeyframes(), this.complete());
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
		if (e[0] === null) {
			let i = r?.get(), a = e[e.length - 1];
			if (i !== void 0) e[0] = i;
			else if (n && t) {
				let r = Ls(n.readValue(t, a), t, a);
				r !== void 0 && (e[0] = r);
			}
			e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]);
		}
		ss(e);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(e = !1) {
		this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), As.delete(this);
	}
	cancel() {
		this.state === "scheduled" && (As.delete(this), this.state = "pending");
	}
	resume() {
		this.state === "pending" && this.scheduleResolve();
	}
}, zs = (e) => e.startsWith("--");
//#endregion
//#region node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function Bs(e, t, n) {
	zs(t) ? e.style.setProperty(t, n) : e.style[t] = n;
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/supports/flags.mjs
var Vs = {};
//#endregion
//#region node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function Hs(e, t) {
	let n = /* @__PURE__ */ Zr(e);
	return () => Vs[t] ?? n();
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var Us = /* @__PURE__ */ Hs(() => window.ScrollTimeline !== void 0, "scrollTimeline"), Ws = /*@__PURE__*/ Hs(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch {
		return !1;
	}
	return !0;
}, "linearEasing"), Gs = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, Ks = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ Gs([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ Gs([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ Gs([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ Gs([
		.33,
		1.53,
		.69,
		.99
	])
};
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function qs(e, t) {
	if (e) return typeof e == "function" ? Ws() ? Ja(e, t) : "ease-out" : /* @__PURE__ */ Si(e) ? Gs(e) : Array.isArray(e) ? e.map((e) => qs(e, t) || Ks.easeOut) : Ks[e];
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function Js(e, t, n, { delay: r = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: s = "easeOut", times: c } = {}, l = void 0) {
	let u = { [t]: n };
	c && (u.offset = c);
	let d = qs(s, i);
	Array.isArray(d) && (u.easing = d);
	let f = {
		delay: r,
		duration: i,
		easing: Array.isArray(d) ? "linear" : d,
		fill: "both",
		iterations: a + 1,
		direction: o === "reverse" ? "alternate" : "normal"
	};
	return l && (f.pseudoElement = l), e.animate(u, f);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function Ys(e) {
	return typeof e == "function" && "applyToOptions" in e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function Xs({ type: e, ...t }) {
	return Ys(e) && Ws() ? e.applyToOptions(t) : (t.duration ??= 300, t.ease ??= "easeOut", t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
var Zs = class extends Ho {
	constructor(e) {
		if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !e) return;
		let { element: t, name: n, keyframes: r, pseudoElement: i, allowFlatten: a = !1, finalKeyframe: o, onComplete: s } = e;
		this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e;
		let c = Xs(e);
		this.animation = Js(t, n, r, c, i), c.autoplay === !1 && this.animation.pause(), this.animation.onfinish = this.onFinish = () => {
			if (this.animation.onfinish = null, this.finishedTime = this.time, !i) {
				let e = Fo(r, this.options, o, this.speed);
				this.updateMotionValue?.(e), Bs(t, n, e), this.animation.cancel();
			}
			s?.(), this.notifyFinished();
		}, Vo(this, e, c);
	}
	play() {
		this.isStopped || (this.manualStartTime = null, this.animation.onfinish = this.onFinish, this.animation.play(), this.state === "finished" && this.updateFinished());
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.isStopped || (this.animation.onfinish = this.onFinish), this.animation.finish?.();
	}
	cancel() {
		this.animation.onfinish = null;
		try {
			this.animation.cancel();
		} catch {}
	}
	stop() {
		this.isStopped || (this.isStopped = !0, this.state !== "idle" && this.finishedTime === null && (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel()));
	}
	commitStyles() {
		let e = this.options?.element;
		!this.isPseudoElement && e?.isConnected && this.animation.commitStyles?.();
	}
	get duration() {
		let e = this.animation.effect?.getComputedTiming?.().duration || 0;
		return /* @__PURE__ */ ri(Number(e));
	}
	get iterationDuration() {
		let { delay: e = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ ri(e);
	}
	get time() {
		return /* @__PURE__ */ ri(Number(this.animation.currentTime) || 0);
	}
	set time(e) {
		let t = this.finishedTime !== null;
		this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ ni(e), t && (this.animation.pause(), this.updateFinished());
	}
	get speed() {
		return this.animation.playbackRate;
	}
	set speed(e) {
		e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
	}
	get state() {
		return this.finishedTime === null ? this.animation.playState : "finished";
	}
	get startTime() {
		return this.manualStartTime ?? Number(this.animation.startTime);
	}
	set startTime(e) {
		this.manualStartTime = this.animation.startTime = e;
	}
	attachTimeline({ timeline: e, onAttach: t, observe: n }) {
		return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = this.onFinish = null, e && Us() ? (this.animation.timeline = e, t?.(this.animation), Qr) : n(this);
	}
}, Qs = {
	anticipate: pi,
	backInOut: fi,
	circInOut: gi
};
function $s(e) {
	return e in Qs;
}
function ec(e) {
	typeof e.ease == "string" && $s(e.ease) && (e.ease = Qs[e.ease]);
}
var tc = class extends Zs {
	constructor(e) {
		ec(e), Lo(e), super(e), e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime), this.options = e;
	}
	elapsed() {
		return this.state === "running" ? (Z.now() - this.startTime) * this.speed : this.time * 1e3;
	}
	sample(e) {
		if (!this.sampler) {
			let { motionValue: e, onUpdate: t, onComplete: n, onPlay: r, onStop: i, element: a, ...o } = this.options;
			this.sampler = new Go({
				...o,
				autoplay: !1
			}), this.sampler.stop();
		}
		return this.sampler.sample(Math.max(0, e)).value;
	}
	liveValue() {
		let { state: e } = this;
		if (e === "running" || e === "paused") return this.sample(this.elapsed());
	}
	updateMotionValue(e) {
		let { motionValue: t, element: n, name: r } = this.options;
		if (!t) return;
		if (e !== void 0) {
			t.set(e);
			return;
		}
		let { speed: i } = this, a = this.elapsed(), o = this.state === "running" && i ? Kr(0, 10, a) : 0, s = this.sample(a);
		n && r && Bs(n, r, s), t.setWithVelocity(this.sample(a - o * Math.sign(i)), s, o / Math.abs(i || 1));
	}
}, nc = (e, t) => t !== "zIndex" && !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && (ya.test(e) || e === "0") && !e.startsWith("url("));
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function rc(e) {
	let t = e[0];
	if (e.length === 1) return !0;
	for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function ic(e, t, n, r) {
	let i = e[0];
	if (i === null) return !1;
	if (t === "display" || t === "visibility") return !0;
	let a = e[e.length - 1], o = nc(i, t), s = nc(a, t);
	return !o || !s ? !1 : rc(e) || (n === "spring" || Ys(n)) && r;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function ac(e) {
	e.duration = 0, e.type = "keyframes";
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
var oc = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform"
]), sc = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function cc(e) {
	for (let t = 0; t < e.length; t++) if (typeof e[t] == "string" && sc.test(e[t])) return !0;
	return !1;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/waapi/utils/needs-mixer.mjs
var lc = ({ mixer: e, keyframes: t }) => e && typeof t[0] != "number" && t.some((n, r) => r && e(t[r - 1], n)), uc = /* @__PURE__ */ new Set([
	"color",
	"backgroundColor",
	"outlineColor",
	"fill",
	"stroke",
	"borderColor",
	"borderTopColor",
	"borderRightColor",
	"borderBottomColor",
	"borderLeftColor"
]), dc = () => !qr.useManualTiming && Object.hasOwnProperty.call(Element.prototype, "animate");
function fc(e) {
	let { motionValue: t, name: n, repeatDelay: r, repeatType: i, damping: a, type: o, keyframes: s } = e;
	if (!n || !(oc.has(n) || uc.has(n))) return !1;
	let c = t?.owner?.current;
	if (!(c instanceof HTMLElement) && !(c instanceof SVGElement)) return !1;
	let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
	return dc() && (oc.has(n) || uc.has(n) && cc(s)) && (n !== "transform" || !u) && !l && !r && i !== "mirror" && a !== 0 && o !== "inertia" && !lc(e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
var pc = (e, t) => t && typeof e == "number" ? t.transform(e) : e, mc = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
};
ys.length;
var hc = {}, gc = (e, t, n = pc(t, Qo[e])) => (hc[e] || (hc[e] = (mc[e] || e) + "(")) + n + ")", _c = (e, t) => (typeof t == "number" ? t : parseFloat(t)) === +!!e.startsWith("scale"), vc = /* @__PURE__ */ new WeakMap(), yc = 200, bc = .001, xc = .1, Sc = .001, Cc = 100, wc = 100, Tc = /* @__PURE__ */ new Set([
	"linear",
	"easeIn",
	"easeOut",
	"easeInOut"
]), Ec = (e) => Tc.has(e), Dc = /* @__PURE__ */ new WeakMap(), Oc = (e, t) => {
	let n = Dc.get(e);
	return n?.[0] !== t && (n = [t, "linear(" + Oo(Array(t + 1)).map((t) => Wo(e(t)) + " " + Wo(t * 100) + "%") + ")"], Dc.set(e, n)), n[1];
}, kc = (e, t) => Math.min(yc, Math.max(2, Math.ceil((t - e) / 10))), Ac = (e, t) => Math.abs(e - t) <= bc, jc = (e, t) => e - t, Mc = (e, t, n) => Oo(Array(n + 1)).map((n) => Ca(e, t, n)), Nc = (e) => e.motionValue.owner, Pc = (e) => vc.get(e), Fc = ({ state: e }) => e === "idle" || e === "finished", Ic = (e, t) => e.latestValues ? e.latestValues[t] : e.getValue(t)?.get(), Lc = ({ name: e, motionValue: t }) => e && ys.includes(e) && t?.owner?.current instanceof HTMLElement && dc() && Ws();
function Rc(e) {
	let t = Nc(e), { onUpdate: n, transformTemplate: r } = t.getProps();
	return !e.isHandoff && !n && !e.hasOnUpdate && !r && e.type !== "inertia" && (Ic(t, "transform") || "none") === "none" && !Ic(t, "pathRotation") && !t.projection?.isProjecting() && !lc(e);
}
var zc = class {
	constructor(e, t, n, r) {
		this.element = e, this.update = t, this.makeDriver = n, this.animation = r;
	}
	get js() {
		return this.driver ||= this.makeDriver(this.update);
	}
	now() {
		return this.driver || this.makeDriver !== qa ? this.js.now() : Ei.isProcessing ? Ei.timestamp : Z.now();
	}
	start(e = !0) {
		let t = Pc(this.element);
		!t || t.isJS ? this.js.start(e) : t.schedule(!1, !e);
	}
	stopJS() {
		this.driver?.stop();
	}
	stop() {
		this.stopJS();
		let e = Pc(this.element);
		e && !e.isFinishing && e.release(this.animation);
	}
}, Bc, Vc = class extends Go {
	constructor(e) {
		let t = Nc(e).current, { driver: n = qa } = e, r, i = Rc(e);
		e.driver = (e) => new zc(t, e, n, r), super(e), r = this;
		let a = this.driver;
		a && (a.animation = this), this.canAccelerate = i;
		let { stop: o } = this;
		this.stop = () => {
			this.isAccelerated() && this.sync(), o();
		};
	}
	offsets() {
		let { keyframes: e, times: t } = this.options;
		return t || (this.offsetsOf !== e && (this.offsetsOf = e, this.cachedOffsets = Oo(e)), this.cachedOffsets);
	}
	get group() {
		return Pc(Nc(this.options).current);
	}
	get js() {
		return this.driver?.js;
	}
	stopJS() {
		this.driver?.stopJS();
	}
	get name() {
		return this.options.name;
	}
	timing() {
		let { startTime: e, speed: t, totalDuration: n } = this, { delay: r = 0, repeatType: i } = this.options;
		return this.holdTime === null ? n === Infinity ? [e + r / t, this.resolvedDuration * (i === "loop" ? 1 : 2) / t || 1] : [e + (r + n) / t, 0] : [Infinity, 0];
	}
	isAccelerated() {
		let { group: e, state: t } = this;
		return e?.tracks.has(this) && !e.isJS && this.canAccelerate && (t === "running" || t === "paused");
	}
	liveValue() {
		return this.isAccelerated() ? this.sampleAt(Z.now()) : void 0;
	}
	tween() {
		let { keyframes: e, type: t, repeat: n, delay: r = 0 } = this.options, i = -1;
		if (n || t !== jo || this.holdTime !== null) return;
		for (let t = 1; t < e.length; t++) if (e[t] !== e[t - 1]) {
			if (i >= 0) return;
			i = t - 1;
		}
		let { ease: a } = this.options;
		/* @__PURE__ */ bi(a) && (a = a[i]);
		let o = this.offsets(), s = (e) => this.startTime + (r + o[e] * this.totalDuration) / this.speed;
		if (i >= 0) {
			let e = /* @__PURE__ */ Si(a) ? Gs(a) : Ec(a) ? Ks[a] : Ti(a);
			return [
				s(i),
				s(i + 1),
				typeof e == "string" || Ac(e(0), 0) && Ac(e(1), 1) ? e : void 0
			];
		}
	}
	boundaries(e, t) {
		let { startTime: n, speed: r, resolvedDuration: i, options: a } = this, { delay: o = 0, repeat: s = 0, repeatDelay: c = 0, repeatType: l, type: u } = a, d = (u || jo) === jo ? this.offsets() : [0, 1], f = n + o / r, p = [];
		if (this.holdTime !== null || !(i > 0)) return p;
		for (let n = Math.max(0, Math.floor((e - f) * r / i)); n <= s; n++) {
			let a = f + n * i / r;
			if (a > t) break;
			for (let o of d) {
				let s = a + (n % 2 && l && l !== "loop" ? 1 - o : o) * (i - c) / r;
				s > e && s < t && p.push(s);
			}
		}
		return p;
	}
	numberAt(e) {
		return parseFloat(this.sampleAt(e, !0));
	}
	sync() {
		let e = Z.now(), t = this.sampleAt(e, !0);
		this.options.motionValue.setWithVelocity(this.holdTime === null ? this.sampleAt(e - 10, !0) : t, t, 10);
	}
	play() {
		this.isStopped || ((this.group || Wc(Nc(this.options))).tracks.add(this), super.play());
	}
	pause() {
		super.pause(), this.isAccelerated() && this.group.schedule(!1);
	}
	complete() {
		super.complete();
		let { group: e } = this;
		e && !e.isJS && this.tick(Z.now());
	}
	get time() {
		return this.isAccelerated() ? /* @__PURE__ */ ri(Kr(0, this.totalDuration, this.at(Z.now()) - (this.options.delay || 0))) : super.time;
	}
	set time(e) {
		(Bc ??= Object.getOwnPropertyDescriptor(Go.prototype, "time").set).call(this, e);
	}
	attachTimeline(e) {
		return this.canAccelerate = !1, this.group?.demote(!0), super.attachTimeline(e);
	}
}, Hc, Uc = (e) => {
	Hc || queueMicrotask(() => {
		let e = Hc;
		Hc = void 0, e.forEach((e) => e());
	}), (Hc ||= []).push(e);
};
function Wc(e) {
	let t = e.current, n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = {}, a = [], o = /* @__PURE__ */ new Map(), s = [], c = !1, l = !1, u = !1, d = !1, f = -Infinity, p, m = Infinity, h, g = (e) => {
		for (let t of n) if (t.name === e) return !0;
	}, _ = (t, n) => {
		let o = {};
		for (let s of t === void 0 ? ys : a) {
			let a = r.get(s), c = t === void 0 ? Ic(e, s) : a ? a.sampleAt(n > t && !a.timing()[1] ? n : t) : i[s];
			c !== void 0 && (o[s] = c);
		}
		return o;
	}, v = (e, t) => {
		let n = "";
		for (let r in e) {
			let i = e[r];
			(!t || !_c(r, i)) && (n += gc(r, i) + " ");
		}
		return (t ? n.trim() : n) || "none";
	}, y = (e, t) => v(_(e, t)), b = (e = _()) => {
		t.style.transform = v(e, !0);
	}, x = (e) => {
		e.onfinish = e.oncancel = null, e.cancel();
	}, S = (e = !0) => {
		clearTimeout(p), m = Infinity, h = void 0, e && b(), s.forEach(({ animation: e }) => x(e)), s = [];
	}, C = (e, n) => new Animation(new KeyframeEffect(t, e, n)), w = (e, t, n = Infinity) => {
		let r = {
			animation: e,
			offset: t,
			end: n
		};
		e.startTime = Z.now() + t, n < Infinity && (e.onfinish = () => {
			r.isDone = !0, s.some((e) => e.end === Infinity) && (x(e), s = s.filter((e) => e !== r)), k.schedule(!1);
		}), e.oncancel = () => s.includes(r) && k.demote(), s.push(r);
	}, T = (e, t, n) => {
		let r = (t, n) => Math.abs(e(n) - e(t)), i = r(t, n);
		for (; n - t > .01;) {
			let e = (t + n) / 2;
			r(t, e) > r(e, n) ? n = e : t = e;
		}
		return r(t, n) > i / 2 ? [t, n] : [];
	}, ee = (e, t, n, r) => {
		let i = kc(t, n);
		if (r.length * 4 > i) return;
		let a;
		for (let r of e) {
			let e = r.numberAt(t), i = (r.numberAt((t + n) / 2) - e) / (r.numberAt(n) - e);
			if (i === i) {
				if (a === void 0) a = i;
				else if (!Ac(i, a)) return;
			}
		}
		let o = Mc(t, n, i).concat(r).sort(jc), s = (e) => /* @__PURE__ */ ei(t, n, e), c, l;
		for (let n of e) {
			let e = n.numberAt(t), r = o.map((t) => n.numberAt(t) - e), i = r[r.length - 1], a = r.some((e) => Math.abs(e) * bc > Math.abs(i)) ? 0 : i, s = r.map((e) => a ? e / a : e);
			if (a && !c) c = s, l = (t) => (n.numberAt(t) - e) / a;
			else if (s.some((e, t) => !Ac(e, a && c[t]))) return;
		}
		if (!c || c.every((e, t) => Ac(e, s(o[t])))) return "linear";
		let u = [], d = (e, t = l(e)) => u.push(Wo(t) + " " + Wo(s(e) * 100) + "%");
		return c.forEach((e, t) => {
			t && Math.abs(e - c[t - 1]) > .2 && T(l, o[t - 1], o[t]).forEach((e) => d(e)), d(o[t], e);
		}), "linear(" + u + ")";
	}, te = (e, t, n, r) => {
		let i = [t], a = [], o = n, s = t;
		for (let r of e) {
			let e = r.tween();
			if (e?.[2] !== "linear") {
				let [i, c] = r.timing(), [l, u] = e || [t, c ? n : i];
				o = Math.min(o, l), s = Math.max(s, u), a.push(r);
			}
		}
		o = Math.max(t, o), s = Math.min(n, s);
		let c = (e, t) => a.every((n) => !(Math.abs(n.numberAt((e + t) / 2) - (n.numberAt(e) + n.numberAt(t)) / 2) > (n.name.startsWith("scale") ? Sc : xc))), l = (t, n, r) => {
			if (n - t < 1 || c(t, n)) i.push(n);
			else if (r < 4) l(t, (t + n) / 2, r + 1), l((t + n) / 2, n, r + 1);
			else {
				for (let r of e) i.push(...T((e) => r.numberAt(e), t, n));
				i.push(n);
			}
		}, u = s > o ? Mc(o, s, Math.ceil((s - o) / 100)) : [];
		u.push(n);
		for (let e of r) u.push(e, Math.min(e + .01, n));
		let d = t;
		for (let e of u.sort(jc)) e > d && l(d, e, 0), d = e;
		return i.sort(jc);
	}, E = (e) => {
		let t;
		for (let n of e) {
			let e = n.tween();
			if (!e || t && (Math.abs(e[0] - t[0]) > 1 || Math.abs(e[1] - t[1]) > 1)) return;
			t = [
				e[0],
				e[1],
				!t || e[2] === t[2] ? e[2] : void 0
			];
		}
		return t;
	}, D = (e, t, n, r, i = { fill: "both" }, a) => {
		let o = r ? [] : e.flatMap((e) => e.boundaries(t, n)), s = r || ee(e, t, n, o), c = s ? [t, n] : te(e, t, n, o), l = c.map((e) => y(e, a)), u = { transform: l };
		return s || (u.offset = c.map((e) => /* @__PURE__ */ ei(t, n, e))), l.every((e) => e === l[0]) && (b(_(t, a)), u = null), C(u, {
			...i,
			duration: n - t,
			easing: s || "linear"
		});
	}, ne = (e) => {
		let t = Z.now() + e;
		t < m && (clearTimeout(p), m = t, p = setTimeout(() => {
			m = Infinity, k.schedule(!1);
		}, e));
	}, O = (t) => {
		let c = t, l = 0, u = 0, d = [], f = [], p = /* @__PURE__ */ new Set();
		r.clear(), o = /* @__PURE__ */ new Map();
		for (let e of n) {
			r.set(e.name, e);
			let [n, i] = e.timing(), a = n === Infinity;
			if (o.set(e, [
				e.at(t),
				e.speed,
				a
			]), !a) {
				if (e.speed < 0) return;
				if (i) {
					if (l) {
						let e = (n - u) / i;
						if (Math.abs(i - l) > 1 || Math.abs(e - Math.round(e)) * l > 1) return;
					} else l = i, u = n;
					f.push(e);
				} else p.add(n);
				d.push(e), c = Math.max(c, n);
			}
		}
		i = {}, a = ys.filter((t) => {
			if (r.has(t)) return !0;
			let n = i[t] = Ic(e, t);
			return n !== void 0 && !_c(t, n);
		}), S(!1);
		let m = !l && E(d);
		try {
			if (c > t) {
				let e;
				if (m && m[1] > t) {
					let [n, r, i] = m;
					if (n - t > wc) return d.forEach((e) => e.sync()), ne(h = n - t - wc), !0;
					e = typeof i == "string" ? i : i ? Oc(i, kc(n, r)) : ee(d, n, r, []), e && w(D(d, n, r, e, {
						fill: "both",
						endDelay: c - r
					}), n - t, c - n);
				}
				e || w(D(d, t, c), 0, c - t), p.forEach((e) => e < c - 1 && w(C(null, { duration: e - t }), 0, e - t));
			}
			if (l) {
				let e = u + Math.floor((c - u) / l) * l;
				w(D(f, e, e + l, void 0, {
					iterations: Infinity,
					iterationStart: (c - e) / l,
					fill: "forwards"
				}, c), c - t);
			}
		} catch {
			return;
		}
		return s.length || S(), !0;
	}, re = (e, t) => {
		let r, i = 0;
		for (let t of n) {
			let n = o.get(t);
			if (!n) return !1;
			let [a, c, l] = n, u = t.at(e), d = t.timing()[0] === Infinity;
			if (l) {
				if (d && (u === a || !s.length)) continue;
				return !1;
			}
			let f = (u - a) / c, p = d ? 0 : t.speed / c;
			if (r === void 0) r = f, i = p;
			else if (Math.abs(f - r) > 1 || p !== i) return !1;
		}
		if (r === void 0) return !0;
		if (!s.length) {
			if (h === void 0 || t && i) return !1;
			if (i) {
				let e = (h - r) / i;
				if (e < 1) return !1;
				ne(e);
			}
			return !0;
		}
		for (let { offset: e, end: n, isDone: i } of s) {
			let a = r - e;
			if (n < Infinity && (i ? a < n - 1 : a < 0 && (t || e <= 0) || a >= n)) return !1;
		}
		for (let { animation: t, offset: n, isDone: a } of s) {
			if (a) continue;
			let o = r - n;
			i && t.updatePlaybackRate && t.playState === "running" && Math.abs(Number(t.currentTime) - o) < 20 ? t.playbackRate !== i && t.updatePlaybackRate(i) : i ? (t.playbackRate !== i && (t.playbackRate = i), t.startTime = e - o / i) : (t.startTime = null, t.currentTime = o);
		}
		return !0;
	}, ie = () => !n.size && (u = !0, Pc(t) === k && vc.delete(t), k.isJS || S(), !0), ae = () => {
		let t = Z.now();
		if (k.isJS || (k.isFinishing = !0, n.forEach((n) => {
			let [r, a] = n.timing();
			n.state === "running" && n.speed > 0 && !a && r <= t + 1 && (n.complete(), i[n.name] = Ic(e, n.name), o.has(n) || (c = !0));
		}), k.isFinishing = !1), l = !1, u || (n.forEach((e) => Fc(e) && n.delete(e)), ie())) return;
		for (let e of n) if (!e.canAccelerate) return k.demote(!0);
		k.isJS && (k.isJS = !1, c = !0, n.forEach((e) => e.stopJS()));
		let r = c, a = d;
		if (c = d = !1, r || !re(t, a)) {
			if (a) {
				if (t - f < Cc) return k.demote();
				f = t;
			}
			if (!O(t)) return k.demote();
		} else if (h !== void 0 && !a) return;
		n.forEach((e) => e.timing()[0] === Infinity && e.sync());
	}, k = {
		tracks: n,
		isJS: !1,
		isFinishing: !1,
		schedule(e, t) {
			u || (c ||= e, d ||= !!t, l || (l = !0, Ei.isProcessing ? Wa.render(ae, !1, !0) : Uc(ae)));
		},
		release(e) {
			Fc(e) && n.delete(e), ie() || k.schedule(!0);
		},
		check() {
			if (!k.isJS) {
				for (let t in i) if (Ic(e, t) !== i[t] && !g(t)) return k.schedule(!0, !0);
			}
		},
		demote(e) {
			if (!(k.isJS || u)) return n.forEach((t) => {
				t.isAccelerated() && t.sync(), e || (t.canAccelerate = !1);
			}), k.isJS = !0, o = /* @__PURE__ */ new Map(), S(), n.forEach((e) => e.state === "running" && e.js?.start()), !0;
		}
	};
	return vc.set(t, k), k;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var Gc = class extends Ho {
	constructor(e) {
		super(), this.stop = () => {
			this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
		}, this.createdAt = Z.now();
		let { keyframes: t, name: n, motionValue: r, element: i } = e, a = e;
		a.autoplay ??= !0, a.delay ??= 0, a.type ??= "keyframes", a.repeat ??= 0, a.repeatDelay ??= 0, a.repeatType ??= "loop";
		let o = i?.KeyframeResolver || Rs;
		this.keyframeResolver = new o(t, (e, t, n) => this.onKeyframesResolved(e, t, a, !n), n, r, i), this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(e, t, n, r) {
		this.keyframeResolver = void 0;
		let { name: i, type: a, velocity: o, delay: s, isHandoff: c, onUpdate: l } = n;
		this.resolvedAt = Z.now();
		let u = ic(e, i, a, o);
		u || ((qr.instantAnimations || !s) && l?.(Fo(e, n, t)), e[0] = e[e.length - 1], ac(n), n.repeat = 0);
		let { onComplete: d } = n;
		n.finalKeyframe = t, n.keyframes = e, n.onComplete = () => {
			d?.(), this.notifyFinished();
		};
		let f = u && !c && fc(n), p = !f && Lc(n);
		r && (f || p || this.resolvedAt !== this.createdAt) && (n.startTime ??= zo(this.createdAt, this.resolvedAt));
		let m;
		if (f) {
			n.element = n.motionValue?.owner?.current;
			try {
				m = new tc(n);
			} catch {
				m = new Go(n);
			}
		} else m = p ? new Vc(n) : new Go(n);
		this.pendingTimeline &&= (this.stopTimeline = m.attachTimeline(this.pendingTimeline), void 0), this._animation = m;
	}
	get finished() {
		return this._animation ? this._animation.finished : super.finished;
	}
	then(e, t) {
		return this.finished.finally(e).then(() => {});
	}
	liveValue() {
		return this._animation?.liveValue?.();
	}
	get animation() {
		return this._animation || (this.keyframeResolver?.resume(), Is()), this._animation;
	}
	get duration() {
		return this.animation.duration;
	}
	get iterationDuration() {
		return this.animation.iterationDuration;
	}
	get time() {
		return this.animation.time;
	}
	set time(e) {
		this.animation.time = e;
	}
	get speed() {
		return this.animation.speed;
	}
	get state() {
		return this.animation.state;
	}
	set speed(e) {
		this.animation.speed = e;
	}
	get startTime() {
		return this.animation.startTime;
	}
	attachTimeline(e) {
		return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
	}
	play() {
		this.animation.play();
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.complete();
	}
	cancel() {
		this._animation?.cancel(), this.keyframeResolver?.cancel();
	}
}, Kc = class {
	constructor(e) {
		this.stop = () => {
			for (let e of this.animations) e.stop();
		}, this.animations = e.filter(Boolean);
	}
	get finished() {
		return Promise.all(this.animations.map((e) => e.finished));
	}
	getAll(e) {
		return this.animations[0][e];
	}
	attachTimeline(e) {
		let t = this.animations.map((t) => t.attachTimeline(e));
		return () => {
			t.forEach((e, t) => {
				e && e(), this.animations[t].stop();
			});
		};
	}
	get time() {
		return this.getAll("time");
	}
	set time(e) {
		for (let t of this.animations) t.time = e;
	}
	get speed() {
		return this.getAll("speed");
	}
	set speed(e) {
		for (let t of this.animations) t.speed = e;
	}
	get state() {
		return this.getAll("state");
	}
	get startTime() {
		return this.getAll("startTime");
	}
	get duration() {
		return qc(this.animations, "duration");
	}
	get iterationDuration() {
		return qc(this.animations, "iterationDuration");
	}
	play() {
		for (let e of this.animations) e.play();
	}
	pause() {
		for (let e of this.animations) e.pause();
	}
	cancel() {
		for (let e of this.animations) e.cancel();
	}
	complete() {
		for (let e of this.animations) e.complete();
	}
};
function qc(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e[r][t];
		i !== null && i > n && (n = i);
	}
	return n;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/GroupAnimationWithThen.mjs
var Jc = class extends Kc {
	then(e, t) {
		return this.finished.finally(e).then(() => {});
	}
}, Yc = 30, Xc = (e) => !isNaN(parseFloat(e)), Zc = { current: void 0 }, Qc = class {
	constructor(e, t = {}) {
		this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (e) => {
			let t = Z.now();
			if (this.updatedAt !== t && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(e), this.current !== this.prev && (this.dirty(), this.dependents)) for (let e of this.dependents) e.dirty();
		}, this.hasAnimated = !1, this.setCurrent(e), this.owner = t.owner;
	}
	setCurrent(e) {
		this.current = e, this.updatedAt = Z.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = Xc(this.current));
	}
	setPrevFrameValue(e = this.current) {
		this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
	}
	onChange(e) {
		return this.on("change", e);
	}
	on(e, t) {
		var n;
		return e === "change" ? this.onChangeSubscribe(t) : ((n = this.events)[e] || (n[e] = new ti())).add(t);
	}
	onChangeSubscribe(e) {
		let { events: t } = this;
		return !t.change && !this.changeSubscriber ? this.changeSubscriber = e : (t.change || (t.change = new ti(), t.change.add(this.changeSubscriber), this.changeSubscriber = void 0), t.change.add(e)), () => {
			this.changeSubscriber === e ? this.changeSubscriber = void 0 : t.change?.remove(e), this.stopIfUnobserved();
		};
	}
	stopIfUnobserved() {
		Wa.read(() => {
			!this.changeSubscriber && !this.events.change?.getSize() && this.stop();
		});
	}
	clearListeners() {
		this.changeSubscriber = void 0;
		for (let e in this.events) this.events[e].clear();
	}
	attach(e, t) {
		this.passiveEffect = e, this.stopPassiveEffect = t;
	}
	set(e) {
		this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
	}
	setWithVelocity(e, t, n) {
		this.set(t), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - n;
	}
	jump(e, t = !0) {
		t && (this.updatedAt = Z.now(), this.stop()), this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, this.stopPassiveEffect?.();
	}
	dirty() {
		let { current: e, changeSubscriber: t } = this;
		t ? t(e) : this.events.change?.notify(e);
	}
	addDependent(e) {
		(this.dependents ||= /* @__PURE__ */ new Set()).add(e);
	}
	removeDependent(e) {
		this.dependents?.delete(e);
	}
	get() {
		Zc.current?.push(this);
		let e = this.animation?.liveValue?.();
		return e === void 0 ? this.current : e;
	}
	getCurrent() {
		return this.current;
	}
	getPrevious() {
		return this.prev;
	}
	getVelocity() {
		let e = Z.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > Yc) return 0;
		let t = Math.min(this.updatedAt - this.prevUpdatedAt, Yc);
		return /* @__PURE__ */ ii(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
	}
	start(e) {
		return new Promise((t) => this.run(e, t));
	}
	run(e, t) {
		this.stop(), this.hasAnimated = !0;
		let n = !1, r;
		r = e(() => {
			n = !0, this.events.animationComplete?.notify(), this.animation === r && (this.animation = void 0), t?.();
		}), n || (this.animation = r), this.events.animationStart?.notify();
	}
	stop() {
		this.animation && (this.animation.stop(), this.events.animationCancel?.notify()), this.animation = void 0;
	}
	isAnimating() {
		return !!this.animation;
	}
	destroy() {
		this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect?.();
	}
};
function $c(e, t) {
	return new Qc(e, t);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
function el(e, t) {
	if (e?.inherit && t) {
		let { inherit: n, ...r } = e;
		return {
			...t,
			...r
		};
	}
	return e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function tl(e, t) {
	let n = e?.[t] ?? e?.default ?? e;
	return n === e ? n : el(n, e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var nl = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
}, rl = (e) => ({
	type: "spring",
	stiffness: 550,
	damping: e === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
}), il = {
	type: "keyframes",
	duration: .8
}, al = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
}, ol = (e, { keyframes: t }) => t.length > 2 ? il : bs.has(e) ? e.startsWith("scale") ? rl(t[1]) : nl : al, sl = /* @__PURE__ */ new Set([
	"when",
	"delay",
	"delayChildren",
	"staggerChildren",
	"staggerDirection",
	"repeat",
	"repeatType",
	"repeatDelay",
	"from",
	"elapsed",
	"out",
	"mixer"
]);
function cl(e) {
	for (let t in e) if (!sl.has(t)) return !0;
	return !1;
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var ll = (e, t, n, r = {}, i, a) => (o) => {
	let s = tl(r, e) || {}, c = s.delay || r.delay || 0, { elapsed: l = 0 } = r;
	l -= /* @__PURE__ */ ni(c);
	let u = {
		keyframes: Array.isArray(n) ? n : [null, n],
		ease: "easeOut",
		velocity: t.getVelocity(),
		...s,
		delay: -l,
		onUpdate: (e) => {
			t.set(e), s.onUpdate && s.onUpdate(e);
		},
		onComplete: () => {
			o(), s.onComplete && s.onComplete();
		},
		name: e,
		motionValue: t,
		element: a ? void 0 : i,
		hasOnUpdate: !!s.onUpdate
	};
	cl(s) || Object.assign(u, ol(e, u)), u.duration &&= /* @__PURE__ */ ni(u.duration), u.repeatDelay &&= /* @__PURE__ */ ni(u.repeatDelay), u.from !== void 0 && (u.keyframes[0] = u.from);
	let d = !1;
	if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (ac(u), u.delay === 0 && (d = !0)), (qr.instantAnimations || qr.skipAnimations || i?.shouldSkipAnimations || s.skipAnimations) && (d = !0, ac(u), u.delay = 0), u.allowFlatten = !s.type && !s.ease, d && !a && t.get() !== void 0) {
		let e = Fo(u.keyframes, s);
		if (e !== void 0) {
			Wa.update(() => {
				u.onUpdate(e), u.onComplete();
			});
			return;
		}
	}
	return s.isSync ? new Go(u) : new Gc(u);
}, ul = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function dl(e) {
	let t = ul.exec(e);
	if (!t) return [,];
	let [, n, r, i] = t;
	return [`--${n ?? r}`, i];
}
function fl(e, t, n = 1) {
	let [r, i] = dl(e);
	if (!r) return;
	let a = window.getComputedStyle(t).getPropertyValue(r);
	if (a) {
		let e = a.trim();
		return Jr(e) ? parseFloat(e) : e;
	}
	return ji(i) ? fl(i, t, n + 1) : i;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/utils/keys-position.mjs
var pl = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...ys
]), ml = (e) => !!(e && e.getVelocity), hl = {
	test: (e) => e === "auto",
	parse: (e) => e
}, gl = (e) => (t) => t.test(e), _l = [
	Pi,
	Q,
	Xi,
	Yi,
	Qi,
	Zi,
	hl
], vl = (e) => _l.find(gl(e));
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function yl(e) {
	return typeof e == "number" ? e === 0 : e === null || e === "none" || e === "0" || Xr(e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
var bl = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function xl(e, t, n) {
	let r = 0, i;
	for (; r < e.length && !i;) {
		let t = e[r];
		typeof t == "string" && !bl.has(t) && da(t) && (i = e[r]), r++;
	}
	if (i && n) for (let r of t) e[r] !== i && (e[r] = os(n, i));
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var Sl = class extends Rs {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i, !0);
	}
	scheduleResolve() {
		if (this.canReadNow() && (this.readKeyframes(), !this.needsMeasurement)) return this.complete();
		super.scheduleResolve();
	}
	canReadNow() {
		let { unresolvedKeyframes: e, element: t, motionValue: n } = this, r = e[0] ?? n?.get();
		if (!t?.current || r === void 0) return !1;
		for (let t = 0; t < e.length; t++) if (Ni(t ? e[t] : r)) return !1;
		return !0;
	}
	readKeyframes() {
		let { unresolvedKeyframes: e, element: t, name: n } = this;
		if (!t?.current) return;
		super.readKeyframes();
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (typeof r == "string" && (r = r.trim(), ji(r))) {
				let i = fl(r, t.current);
				i !== void 0 && (e[n] = i), n === e.length - 1 && (this.finalKeyframe = r);
			}
		}
		if (this.resolveNoneKeyframes(), !pl.has(n) || e.length !== 2) return;
		let [r, i] = e;
		if (typeof r == "number" && typeof i == "number") return;
		let a = vl(r), o = vl(i);
		if (Ni(r) !== Ni(i) && ks[n]) {
			this.needsMeasurement = !0;
			return;
		}
		if (a !== o) {
			if (xs(a) && xs(o)) for (let t = 0; t < e.length; t++) {
				let n = e[t];
				typeof n == "string" && (e[t] = parseFloat(n));
			}
			else ks[n] && (this.needsMeasurement = !0);
		}
	}
	resolveNoneKeyframes() {
		let { unresolvedKeyframes: e, name: t } = this, n = [];
		for (let t = 0; t < e.length; t++) (e[t] === null || yl(e[t])) && n.push(t);
		n.length && xl(e, n, t);
	}
	measure() {
		let { element: e, name: t } = this;
		return ks[t](window.getComputedStyle(e.current), () => e.measureViewportBox());
	}
	measureInitialState() {
		let { element: e, unresolvedKeyframes: t, name: n } = this;
		if (!e?.current) return;
		n === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = this.measure(), t[0] = this.measuredOrigin;
		let r = t[t.length - 1];
		r !== void 0 && this.motionValue?.jump(r, !1);
	}
	measureEndState() {
		let { element: e, unresolvedKeyframes: t } = this;
		if (!e?.current) return;
		this.motionValue?.jump(this.measuredOrigin, !1);
		let n = t.length - 1, r = t[n];
		t[n] = this.measure(), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), this.resolveNoneKeyframes();
	}
}, Cl = [];
function wl(e) {
	Tl(e), Cl.unshift(e);
}
function Tl(e) {
	Gr(Cl, e);
}
function El(e) {
	return Cl.find((t) => t.test(e));
}
function Dl(e, t, n = {}, r) {
	let i = [], { velocity: a, path: o } = n, s = n.reduceMotion ?? r?.shouldReduceMotion;
	o?.animateValues && r && (t = { ...t }, o.animateValues(e, t, n, 0, i));
	for (let o in t) {
		if (o === "transition" || o === "transitionEnd") continue;
		let c = t[o];
		if (c === void 0) continue;
		let l = e(o), u = l.get();
		if (u !== void 0 && !l.isAnimating() && !Array.isArray(c) && c === u && !a) {
			Wa.update(() => l.set(c));
			continue;
		}
		l.run(ll(o, l, c, s && pl.has(o) ? { type: !1 } : n, r)), l.animation && i.push(l.animation);
	}
	let { transitionEnd: c } = t;
	if (c) {
		let t = () => Wa.update(() => {
			for (let t in c) e(t).set(c[t]);
		});
		i.length ? Promise.all(i).then(t) : t();
	}
	return i;
}
function Ol(e, t, n, r, i) {
	let a, o = !1, s = Dl((r) => {
		let s = a?.[r] ?? e.get(t, r);
		if (!s) {
			let c;
			if (!i) {
				let i = n[r];
				c = kl(i) ?? e.read(t, r, i);
			}
			s = $c(c, { owner: i }), o ? e(t, { [r]: s }) : (a ||= {})[r] = s;
		}
		return s;
	}, n, r, i);
	return o = !0, a && e(t, a), s;
}
function kl(e) {
	let t = Array.isArray(e) ? e[0] : void 0;
	return t === null ? void 0 : t;
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/is-html-element.mjs
function Al(e) {
	return Yr(e) && "offsetHeight" in e && !("ownerSVGElement" in e);
}
//#endregion
//#region node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
function jl(e) {
	return Yr(e) && "ownerSVGElement" in e;
}
//#endregion
//#region node_modules/motion-dom/dist/es/scope/active.mjs
var Ml = {};
//#endregion
//#region node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function Nl(e, t, n) {
	if (e == null) return [];
	if (e instanceof EventTarget) return [e];
	if (typeof e == "string") {
		let r = t ? t.current : Ml.current?.root || document, i = n?.[e] ?? r.querySelectorAll(e);
		return i ? Array.from(i) : [];
	}
	return Array.from(e).filter((e) => e != null);
}
//#endregion
//#region node_modules/motion-dom/dist/es/effects/MotionValueState.mjs
var Pl = class {
	constructor(e = Wa.render) {
		this.step = e, this.values = /* @__PURE__ */ new Map(), this.pending = [], this.numPending = 0, this.flush = () => {
			let { pending: e, numPending: t } = this;
			this.numPending = 0;
			for (let n = 0; n < t; n++) e[n]();
		};
	}
	set(e, t, n, r) {
		if (this.values.get(e)?.onRemove(), r) for (let e of this.values.values()) e.value === r && (n = e.render);
		let i = () => n && this.schedule(n);
		t.get() !== void 0 && i();
		let a = t.on("change", i), o = () => {
			a(), n && !r && this.cancel(n), this.values.get(e)?.onRemove === o && this.values.delete(e);
		};
		return this.values.set(e, {
			value: t,
			render: r ? void 0 : n,
			onRemove: o
		}), o;
	}
	get(e) {
		return this.values.get(e)?.value;
	}
	release() {
		let e = /* @__PURE__ */ new Map();
		return this.values.forEach((t, n) => {
			e.set(n, t.value), t.onRemove();
		}), this.transformKeys = this.transformValues = void 0, e;
	}
	schedule(e) {
		let { pending: t, numPending: n } = this;
		for (let r = 0; r < n; r++) if (t[r] === e) return;
		n || this.step(this.flush), t[this.numPending++] = e;
	}
	cancel(e) {
		let { pending: t } = this;
		for (let n = 0; n < this.numPending; n++) if (t[n] === e) {
			t[n] = t[--this.numPending];
			return;
		}
	}
};
//#endregion
//#region node_modules/motion-dom/dist/es/effects/utils/create-effect.mjs
function Fl(e, { step: t, ...n } = {}) {
	let r = /* @__PURE__ */ new WeakMap();
	return Object.assign((n, i) => {
		let a = r.get(n) ?? new Pl(t);
		r.set(n, a);
		let o = [];
		for (let t in i) {
			let r = i[t], s = e(n, a, t, r);
			o.push(s);
		}
		return () => {
			for (let e of o) e();
		};
	}, n, {
		get: (e, t) => r.get(e)?.get(t),
		flush: (e) => r.get(e)?.flush(),
		state: (e) => r.get(e)
	});
}
//#endregion
//#region node_modules/motion-dom/dist/es/effects/style/transform.mjs
function Il(e) {
	let t = "", { transformKeys: n = [], transformValues: r = {} } = e;
	for (let e = 0; e < n.length; e++) {
		let i = n[e], a = r[i].getCurrent();
		a !== void 0 && (_c(i, a) || (t += (t && " ") + gc(i, a)));
	}
	let i = e.get("pathRotation")?.get();
	return i && (t += (t && " ") + gc("rotate", i)), t || "none";
}
//#endregion
//#region node_modules/motion-dom/dist/es/effects/style/index.mjs
var Ll = /* @__PURE__ */ new Set([
	"originX",
	"originY",
	"originZ"
]), Rl = (e, t) => pc(e.get(t)?.get(), $o[t]), zl = (e, t, n, r) => {
	let i, a;
	if (bs.has(n)) {
		if (n !== "pathRotation") {
			let e = t.transformKeys ??= [];
			(t.transformValues ??= {})[n] = r, e.includes(n) || (e.push(n), e.sort((e, t) => ys.indexOf(e) - ys.indexOf(t)));
		}
		t.get("transform") || (!Al(e) && !t.get("transformBox") && zl(e, t, "transformBox", new Qc("fill-box")), t.set("transform", new Qc("none"), () => {
			vc.get(e)?.check(), e.style.transform = Il(t);
		})), a = t.get("transform");
	} else Ll.has(n) ? (t.get("transformOrigin") || t.set("transformOrigin", new Qc(""), () => {
		let n = Rl(t, "originX") ?? "50%", r = Rl(t, "originY") ?? "50%", i = Rl(t, "originZ") ?? 0;
		e.style.transformOrigin = `${n} ${r} ${i}`;
	}), a = t.get("transformOrigin")) : i = zs(n) ? () => {
		e.style.setProperty(n, r.getCurrent());
	} : () => {
		e.style[n] = pc(r.getCurrent(), $o[n]);
	};
	return t.set(n, r, i, a);
}, Bl = (e) => Al(e) || jl(e), Vl = (e, t) => {
	if (bs.has(t)) return vs(e, t);
	let n = getComputedStyle(e), r = zs(t) ? n.getPropertyValue(t) : n[t];
	return typeof r == "string" && r.trim() || 0;
}, Hl = /*@__PURE__*/ Fl(zl, {
	test: Bl,
	read: Vl
});
//#endregion
//#region node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function Ul(e) {
	return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
var Wl = [
	"transform",
	"opacity",
	"clipPath",
	"filter",
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
//#endregion
//#region node_modules/motion-dom/dist/es/effects/attr/index.mjs
function Gl(e, t) {
	if (!(t in e)) return !1;
	let n = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e), t) || Object.getOwnPropertyDescriptor(e, t);
	return n && typeof n.set == "function";
}
var Kl = (e, t, n, r, i = n) => {
	let a = Gl(e, i);
	!a && (i.startsWith("data") || i.startsWith("aria")) && (i = Ul(i));
	let o = $o[n] || $o[i], s = a ? () => {
		e[i] = pc(r.get(), $o[n]);
	} : () => {
		let t = pc(r.get(), o);
		t == null ? e.removeAttribute(i) : e.setAttribute(i, String(t));
	};
	return t.set(n, r, s);
};
//#endregion
//#region node_modules/motion-dom/dist/es/effects/svg/index.mjs
function ql(e, t, n, r) {
	return Wa.render(() => e.setAttribute("pathLength", "1")), n === "pathOffset" ? t.set(n, r, () => {
		let t = r.get();
		e.setAttribute("stroke-dashoffset", `${-t}`);
	}) : (t.get("stroke-dasharray") || t.set("stroke-dasharray", new Qc("1 1"), () => {
		let n = t.get("pathLength")?.get() ?? 1, r = t.get("pathSpacing")?.get();
		e.setAttribute("stroke-dasharray", `${n} ${r ?? 1 - Number(n)}`);
	}), t.set(n, r, void 0, t.get("stroke-dasharray")));
}
var Jl = /*@__PURE__*/ Fl((e, t, n, r) => n.startsWith("path") && !bs.has(n) ? ql(e, t, n, r) : n.startsWith("attr") ? Kl(e, t, n, r, Yl(n)) : n === "d" ? t.set(n, r, () => {
	let t = r.get()?.replace(/path\(|["')]/g, "");
	t === void 0 ? e.removeAttribute(n) : e.setAttribute(n, t);
}) : (bs.has(n) || Ll.has(n) || zs(n) || n in e.style ? zl : Kl)(e, t, n, r), {
	test: jl,
	read: (e, t) => bs.has(t) ? $o[t]?.default || 0 : zs(t) || Wl.includes(t) ? Vl(e, t) || e.getAttribute(Ul(t)) || 0 : (t = Yl(t), e.getAttribute(Ul(t)) ?? e.getAttribute(t) ?? void 0)
});
function Yl(e) {
	return e.replace(/^attr([A-Z])/, (e, t) => t.toLowerCase());
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
function Xl({ top: e, left: t, right: n, bottom: r }) {
	return {
		x: {
			min: t,
			max: n
		},
		y: {
			min: e,
			max: r
		}
	};
}
function Zl(e, t) {
	if (!t) return e;
	let n = t({
		x: e.left,
		y: e.top
	}), r = t({
		x: e.right,
		y: e.bottom
	});
	return {
		top: n.y,
		left: n.x,
		bottom: r.y,
		right: r.x
	};
}
//#endregion
//#region node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function Ql(e, t) {
	return Xl(Zl(e.getBoundingClientRect(), t));
}
//#endregion
//#region node_modules/motion-dom/dist/es/animation/animate/element.mjs
var $l = {}, eu = (e) => jl(e) ? Jl : Hl, tu = class {
	constructor(e, t) {
		this.effect = e, this.current = t, this.KeyframeResolver = Sl;
	}
	getValue(e) {
		return this.effect.get(this.current, e);
	}
	readValue(e, t) {
		return this.effect.read(this.current, e, t);
	}
	render() {
		this.effect.flush(this.current);
	}
	measureViewportBox() {
		return Ql(this.current);
	}
	getProps() {
		return $l;
	}
};
function nu(e, t, n, r) {
	if (Ml.current?.track(e), r) return Dl((e) => r.getValue(e, null), t, n, r);
	let i = eu(e);
	return Ol(i, e, t, n, new tu(i, e));
}
//#endregion
//#region node_modules/motion-dom/dist/es/effects/prop/index.mjs
var ru = /*@__PURE__*/ Fl((e, t, n, r) => t.set(n, r, () => {
	e[n] = r.get();
}), {
	test: (e) => Yr(e),
	read: (e, t) => {
		let n = e[t];
		return typeof n == "string" || typeof n == "number" ? n : void 0;
	}
});
//#endregion
//#region node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function iu(e, t, n) {
	let r = ml(e) ? e : $c(e);
	return r.run(ll("", r, t, n)), r.animation;
}
//#endregion
//#region node_modules/motion-dom/dist/es/render/store.mjs
var au = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/motion-dom/dist/es/utils/stagger.mjs
function ou(e = .1, { startDelay: t = 0, from: n = 0, ease: r, grid: i } = {}) {
	let a = {};
	return (o, s) => {
		let c = a[s];
		if (!c) {
			let [e, t] = i || [Infinity, 1], r = Math.min(e, s) - 1, o = Math.max(t, Math.ceil(s / e)) - 1, l = typeof n == "number", u = n === "first" ? 0 : n === "last" ? 1 : .5, d = l ? n % e : r * u, f = l ? Math.floor(n / e) : o * u;
			c = a[s] = [];
			for (let t = 0; t < s; t++) {
				let i = t % e, a = Math.floor(t / e), s = Math.min(i, r - i), l = Math.min(a, o - a);
				if (n === "random") {
					let e = Math.random() * (t + 1) | 0;
					c[t] = c[e], c[e] = t;
				} else c[t] = n === "edges" ? Math.min(r ? s : l, o ? l : s) : Math.hypot(i - d, a - f);
			}
			c.push(i ? Math.max(...c) : s);
		}
		let l = e * c[o], u = e * c[s];
		return r && u && (l = Ti(r)(l / u) * u), t + l;
	};
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/utils/is-dom-keyframes.mjs
function su(e) {
	return typeof e == "object" && !Array.isArray(e);
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/animate/resolve-subjects.mjs
function cu(e, t, n, r) {
	return e == null ? [] : typeof e == "string" && su(t) ? Nl(e, n, r) : e instanceof NodeList ? Array.from(e) : Array.isArray(e) ? e.filter((e) => e != null) : [e];
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/sequence/utils/calc-repeat-duration.mjs
function lu(e, t, n) {
	return e * (t + 1) + n * t;
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/sequence/utils/calc-time.mjs
function uu(e, t) {
	if (t.has(e)) return t.get(e);
	let [, n, r] = e.match(/^(.+?)([+-][\d.]+)$/) || [];
	return t.has(n) ? Math.max(0, t.get(n) + parseFloat(r)) : void 0;
}
function du(e, t, n, r) {
	return typeof t == "number" ? t : t.startsWith("-") || t.startsWith("+") ? Math.max(0, e + parseFloat(t)) : t === "<" ? n : t.startsWith("<") ? Math.max(0, n + parseFloat(t.slice(1))) : uu(t, r) ?? e;
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/sequence/utils/edit.mjs
function fu(e, t, n) {
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.at > t && i.at < n && (Gr(e, i), r--);
	}
}
function pu(e, t, n, r, i, a) {
	fu(e, i, a);
	for (let o = 0; o < t.length; o++) e.push({
		value: t[o],
		at: Ca(i, a, r[o]),
		easing: /* @__PURE__ */ xi(n, o)
	});
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/sequence/utils/normalize-times.mjs
function mu(e, t, n = 0) {
	let r = t + 1 + t * n;
	for (let t = 0; t < e.length; t++) e[t] = e[t] / r;
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/sequence/utils/sort.mjs
function hu(e, t) {
	return e.at === t.at ? e.value === null ? 1 : t.value === null ? -1 : 0 : e.at - t.at;
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/sequence/create.mjs
var gu = "easeInOut", _u = 20;
function vu(e, { defaultTransition: t = {}, ...n } = {}, r, i, a) {
	let o = t.duration || .3, s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = {}, u = /* @__PURE__ */ new Map(), d = 0, f = 0, p = 0, m = (e, n) => {
		let a = n, s = (e) => typeof e == "number" ? n + e : du(f, e, d, u);
		for (let n = 0; n < e.length; n++) {
			let h = e[n];
			if (typeof h == "string") {
				u.set(h, f);
				continue;
			}
			if (!Array.isArray(h)) {
				let e = h.at === void 0 ? f : s(h.at);
				"sequence" in h ? (d = f = e, f = m(h.sequence, e), d = e, a = Math.max(a, f)) : u.set(h.name, e);
				continue;
			}
			let [g, _, v = {}] = h;
			v.at !== void 0 && (f = s(v.at));
			let y = 0, b = (e, n, r, a = 0, s = 0) => {
				let c = xu(e), { delay: l = 0, times: u = Oo(c), type: d = t.type || "keyframes", repeat: m, repeatType: h, repeatDelay: g = 0, ..._ } = n, { ease: v = t.ease || "easeOut", duration: b } = n;
				r.mixer ||= n.mixer;
				let x = typeof l == "function" ? l(a, s) : l, S = c.length, C = Ys(d) ? d : i?.[d || "keyframes"];
				if (S <= 2 && C) {
					let e = 100;
					if (S === 2 && wu(c)) {
						let t = c[1] - c[0];
						e = Math.abs(t);
					}
					let n = {
						...t,
						..._
					};
					b !== void 0 && (n.duration = /* @__PURE__ */ ni(b));
					let r = Za(n, e, C);
					v = r.ease, b = r.duration;
				}
				b ??= o;
				let w = f + x;
				u.length === 1 && u[0] === 0 && (u[1] = 1);
				let T = u.length - c.length;
				if (T > 0 && Do(u, T), c.length === 1 && c.unshift(null), m && m < _u) {
					let e = b > 0 ? g / b : 0;
					b = lu(b, m, g);
					let t = [...c], n = [...u];
					v = Array.isArray(v) ? [...v] : [v];
					let r = [...v], i = h === "reverse" || h === "mirror", a = t, o = r;
					i && (a = [...t].reverse(), h === "reverse" && (o = [...r].reverse().map((e) => typeof e == "function" ? /* @__PURE__ */ li(e) : e)));
					for (let s = 0; s < m; s++) {
						let l = i && s % 2 == 0, d = l ? a : t, f = l ? o : r, p = (s + 1) * (1 + e);
						e > 0 && (c.push(c[c.length - 1]), u.push(p), v.push("linear")), c.push(...d);
						for (let e = 0; e < d.length; e++) u.push(n[e] + p), v.push(e === 0 ? "linear" : /* @__PURE__ */ xi(f, e - 1));
					}
					mu(u, m, e);
				}
				let ee = w + b;
				pu(r, c, v, u, w, ee), y = Math.max(x + b, y), p = Math.max(ee, p);
			};
			if (ml(g)) {
				let e = yu(g, c);
				b(_, v, bu("default", e));
			} else {
				let e = cu(g, _, r, l), t = e.length;
				for (let n = 0; n < t; n++) {
					_ = _, v = v;
					let r = e[n], i = yu(r, c);
					for (let e in _) b(_[e], Su(v, e), bu(e, i), n, t);
				}
			}
			d = f, f += y, a = Math.max(a, f);
		}
		return a;
	};
	m(e, 0), a && (a.duration = p, a.labels = u);
	let { type: h, ...g } = t;
	return c.forEach((e, r) => {
		for (let i in e) {
			let a = e[i];
			a.sort(hu);
			let o = [], c = [], l = [];
			for (let e = 0; e < a.length; e++) {
				let { at: t, value: n, easing: r } = a[e];
				o.push(n), c.push(/* @__PURE__ */ ei(0, p, t)), l.push(r || "easeOut");
			}
			c[0] !== 0 && (c.unshift(0), o.unshift(o[0]), l.unshift(gu)), c[c.length - 1] !== 1 && (c.push(1), o.push(null)), s.has(r) || s.set(r, {
				keyframes: {},
				transition: {}
			});
			let u = s.get(r);
			u.keyframes[i] = o, u.transition[i] = {
				...g,
				duration: p,
				ease: l,
				times: c,
				mixer: a.mixer || t.mixer,
				...n
			};
		}
	}), s;
}
function yu(e, t) {
	return !t.has(e) && t.set(e, {}), t.get(e);
}
function bu(e, t) {
	return t[e] || (t[e] = []), t[e];
}
function xu(e) {
	return Array.isArray(e) ? e : [e];
}
function Su(e, t) {
	return e && e[t] ? {
		...e,
		...e[t]
	} : { ...e };
}
var Cu = (e) => typeof e == "number", wu = (e) => e.every(Cu);
//#endregion
//#region node_modules/framer-motion/dist/es/animation/animate/subject.mjs
function Tu(e, t) {
	return ml(e) || typeof e == "number" || typeof e == "string" && !su(t);
}
function Eu(e, t, n, r) {
	let i = [];
	if (Tu(e, t)) i.push(iu(e, su(t) && t.default || t, n && (n.default || n)));
	else {
		if (e == null) return i;
		let a = cu(e, t, r), o = a.length;
		for (let e = 0; e < o; e++) {
			let r = a[e], s = { ...n };
			"delay" in s && typeof s.delay == "function" && (s.delay = s.delay(e, o)), r instanceof Element ? i.push(...nu(r, t, s, au.get(r))) : i.push(...Ol(El(r) ?? ru, r, t, s));
		}
	}
	return i;
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/animate/sequence.mjs
function Du(e, t, n, r) {
	let i = [], a = vu(e.map((e) => {
		if (Array.isArray(e) && typeof e[0] == "function") {
			let t = e[0], n = $c(0);
			return n.on("change", t), e.length === 1 ? [n, [0, 1]] : e.length === 2 ? [
				n,
				[0, 1],
				e[1]
			] : [
				n,
				e[1],
				e[2]
			];
		}
		return e;
	}), t, n, { spring: Co }, r), o = t?.reduceMotion ?? t?.defaultTransition?.reduceMotion;
	return a.forEach(({ keyframes: e, transition: t }, n) => {
		i.push(...Eu(n, e, {
			...t,
			reduceMotion: o
		}));
	}), i;
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/timeline/index.mjs
var Ou = 0;
function ku({ repeat: e = 0, repeatDelay: t = 0, repeatType: n = "loop", delay: r = 0 }, i, a, o) {
	let s = i + t, c = o === void 0;
	if (c) {
		let t = Math.max(0, a - r);
		o = s && t > 0 ? Math.min(e, Math.ceil(t / s - 1e-9) - 1) : 0, a = Math.min(t - o * s, i);
	}
	return n !== "loop" && o % 2 && (a = i - a), [o, c ? a : r + o * s + a];
}
function Au(e, t) {
	let n = [...e], r = typeof n[0] == "function" ? Math.max(1, n.length - 1) : 2;
	return n[r] = {
		...n[r],
		at: t
	}, n;
}
var ju = (e, t) => t === void 0 ? e : {
	name: e,
	at: t
};
function Mu(e) {
	e.pause(), e.time = 0, e.stop();
}
var Nu = class e {
	constructor(e = [], t = {}, n) {
		this.options = t, this.entries = [], this.repeatIndex = 0, this.prevTime = 0, this.markers = [], this.labels = /* @__PURE__ */ new Map(), this.totalDuration = 0, this.isDirty = !1, this.isDone = !1, this.isRebuilding = !1, this.playbackSpeed = 1, this.motionScope = Ml.current, this.isKilled = !1, this.isWrapped = !1, this.stop = () => {
			this.flush(), this.group?.stop();
		}, this.isPaused = t.autoplay === !1, this.newFinished(), e.forEach((e) => this.add(e)), n ? (this.isDirty = !1, this.isWrapped = !0, this.group = new Jc(n), this.watch()) : (this.invalidate(), this.flush());
	}
	add(t, n) {
		return t instanceof e && t.adopt(this), this.push({
			item: t,
			at: n
		});
	}
	call(e, t) {
		return this.push({
			item: e,
			at: t,
			marker: {
				name: "_m" + Ou++,
				time: 0,
				callback: e
			}
		});
	}
	addPause(e, t) {
		return this.push({
			item: t || {},
			at: e,
			marker: {
				name: "_m" + Ou++,
				time: 0,
				callback: t,
				pause: !0
			}
		});
	}
	move(e, t) {
		return this.entries.forEach((n) => {
			n.item === e && (n.at = t);
		}), this.invalidate();
	}
	remove(t) {
		return t instanceof e && (t.parent = void 0), this.entries = this.entries.filter((e) => e.item !== t), this.invalidate();
	}
	clear() {
		return this.entries = [], this.invalidate();
	}
	getLabelTime(e) {
		return this.flush(), this.labels.get(e);
	}
	seek(e) {
		return this.time = this.resolve(e), this;
	}
	playTo(e) {
		let t = this.resolve(e), n = this.iterationDuration, r = this.time, [i] = ku(this.options, n, r), a = ku(this.options, n, t, i)[1], o = Math.abs(this.speed);
		return this.speed = a < r ? -o : o, this.stopAt = t, this.clock || this.invalidate(), this.play(), this;
	}
	reverse() {
		return this.speed = -this.speed, this.play(), this;
	}
	get progress() {
		return this.duration ? this.time / this.duration : 0;
	}
	set progress(e) {
		this.time = e * this.duration;
	}
	get time() {
		return this.active()?.time ?? 0;
	}
	set time(e) {
		this.flush(), this.prevTime = e, this.group && (this.group.time = e), this.repeatIndex = this.currentRepeat();
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(e) {
		this.playbackSpeed = e, this.group && (this.group.speed = e);
	}
	get duration() {
		return this.flush(), this.isWrapped ? this.group.duration : this.totalDuration;
	}
	get iterationDuration() {
		return this.flush(), this.isWrapped ? this.group.iterationDuration : this.totalDuration;
	}
	get state() {
		return this.active()?.state ?? "idle";
	}
	get startTime() {
		return this.active()?.startTime ?? null;
	}
	play() {
		this.flush(), this.isPaused = !1, this.group?.play(), this.isDone && (this.newFinished(), this.watch());
	}
	pause() {
		this.flush(), this.isPaused = !0, this.group?.pause();
	}
	cancel() {
		this.flush(), this.group?.cancel();
	}
	complete() {
		this.flush(), this.group?.complete();
	}
	attachTimeline(e) {
		return this.flush(), this.scrollTimeline = e, this.detachScroll = this.group?.attachTimeline(e), () => {
			this.scrollTimeline = void 0, this.detachScroll?.();
		};
	}
	then(e, t) {
		return this.finished.then(e, t);
	}
	active() {
		return this.flush(), this.group?.animations.length ? this.group : void 0;
	}
	push(e) {
		return this.entries.push(e), this.invalidate();
	}
	invalidate() {
		return this.parent ? this.parent.invalidate() : this.isDirty || (this.isDirty = !0, queueMicrotask(() => this.flush())), this;
	}
	flush() {
		this.isDirty && !this.parent && !this.isKilled && this.build();
	}
	adopt(e) {
		this.group &&= (Mu(this.group), void 0), this.isDirty = !1, this.parent = e;
	}
	build() {
		let e = this.isWrapped ? this.group.iterationDuration : this.totalDuration;
		this.isDirty = !1, this.isWrapped = !1;
		let t = this.group, n = 0;
		t && (this.isRebuilding = !0, this.scrollTimeline ? (this.detachScroll?.(), t.cancel()) : (n = t.animations.length ? t.time : 0, Mu(t)), this.isRebuilding = !1);
		let { defaultTransition: r, onComplete: i, onUpdate: a, onRepeat: o, onReverseComplete: s, autoplay: c, scope: l, ...u } = this.options, d = {};
		l?.reduceMotion !== void 0 && (d.reduceMotion = l.reduceMotion), l?.skipAnimations !== void 0 && (d.skipAnimations = l.skipAnimations), Object.assign(d, u);
		let f = /* @__PURE__ */ new Map(), p = {}, m = Ml.current;
		Ml.current = this.motionScope;
		let h;
		try {
			h = Du(this.toSequence(f), {
				defaultTransition: r,
				...d
			}, l, p);
		} finally {
			Ml.current = m;
		}
		let g = p.labels, _ = d.duration ?? p.duration, v = p.duration ? _ / p.duration : 1;
		if (g.forEach((e, t) => g.set(t, e * v)), this.markers = [], f.forEach((e, t) => {
			e.time = g.get(t), g.delete(t), _ = Math.max(_, e.time), this.markers.push(e);
		}), this.markers.sort((e, t) => e.time - t.time), this.labels = g, this.totalDuration = _, this.clock = this.clockAnimation = void 0, this.markers.length || this.stopAt !== void 0 || a || o) {
			let e = this.clock = $c(0);
			e.on("change", (t) => e === this.clock && this.onClock(t)), h.unshift(this.clockAnimation = iu(e, [0, _], {
				...d,
				duration: _,
				ease: "linear"
			}));
		}
		let y = this.group = new Jc(h), { delay: b = 0, repeat: x = 0, repeatDelay: S = 0 } = this.options, [C, w] = ku(this.options, e, n);
		n > b && (n = ku(this.options, _, Math.min(w, _), C)[1]), this.isDone && n < b + (x + 1) * (_ + S) - S && this.newFinished(), this.scrollTimeline ? this.detachScroll = y.attachTimeline(this.scrollTimeline) : (y.speed = this.playbackSpeed, this.isPaused && y.pause(), n && (y.time = n)), this.repeatIndex = this.currentRepeat(), this.prevTime = n || -1, this.watch();
	}
	toSequence(t) {
		return this.entries.map(({ item: n, at: r, marker: i }) => i ? (t.set(i.name, i), ju(i.name, r)) : n instanceof e ? {
			sequence: n.toSequence(t),
			at: r
		} : typeof n == "string" ? ju(n, r) : r === void 0 ? n : Array.isArray(n) ? Au(n, r) : {
			...n,
			at: r
		});
	}
	resolve(e) {
		return this.flush(), typeof e == "number" ? e : uu(e, this.labels) ?? this.time;
	}
	currentRepeat() {
		return ku(this.options, this.totalDuration, this.clockAnimation?.time ?? 0)[0];
	}
	onClock(e) {
		let t = this.prevTime;
		if (this.prevTime = e, this.isRebuilding) return;
		let { onUpdate: n, onRepeat: r, repeatType: i = "loop" } = this.options;
		n?.(e);
		let a = this.currentRepeat(), o = a > this.repeatIndex ? 1 : -1;
		for (; a !== this.repeatIndex;) {
			let e = this.speed > 0 == (i === "loop" || !(this.repeatIndex % 2)), n = e ? this.totalDuration : 0;
			if (this.cross(t, n)) return;
			this.repeatIndex += o, r?.(), t = i === "loop" ? e ? -1 : Infinity : n;
		}
		this.cross(t, e);
	}
	cross(e, t) {
		if (e === t) return;
		let n = t > e, r = (r) => n ? r > e && r <= t : r < e && r >= t, i = n ? this.markers : [...this.markers].reverse();
		for (let e of i) if (r(e.time) && (e.callback?.(n ? 1 : -1), e.pause)) return this.pauseAt(e.time);
		if (this.stopAt !== void 0 && r(this.stopAt)) return this.pauseAt(this.stopAt), this.stopAt = void 0, !0;
	}
	pauseAt(e) {
		return this.pause(), this.time = ku(this.options, this.totalDuration, e, this.repeatIndex)[1], !0;
	}
	watch() {
		let e = this.group;
		e.finished.then(() => {
			if (e !== this.group || this.isDone) return;
			this.isDone = !0;
			let { onComplete: t, onReverseComplete: n } = this.options, r = this.speed < 0 && n || t, i = this.resolveFinished;
			r?.(), i();
		});
	}
	newFinished() {
		this.isDone = !1, this.finished = new Promise((e) => {
			this.resolveFinished = e;
		});
		let { scope: e } = this.options, t = this.motionScope?.add(() => {
			this.isKilled = !0, this.stop();
		});
		e?.animations.push(this), this.finished.then(() => {
			t?.(), e && Gr(e.animations, this);
		});
	}
};
//#endregion
//#region node_modules/framer-motion/dist/es/animation/animate/index.mjs
function Pu(e) {
	return Array.isArray(e) && e.some((e) => Array.isArray(e) || e?.sequence);
}
function Fu(e = {}) {
	let { scope: t, reduceMotion: n, skipAnimations: r } = e;
	function i(e, i, a) {
		let o = Ml.current?.transition, s = {};
		n !== void 0 && (s.reduceMotion = n), r !== void 0 && (s.skipAnimations = r);
		let c;
		if (Pu(e)) {
			let r = {
				...s,
				...i,
				scope: t
			};
			o && (r.defaultTransition = {
				...o,
				...r.defaultTransition
			}), r.reduceMotion = i?.reduceMotion ?? r.defaultTransition?.reduceMotion ?? n, c = new Nu(e, r);
		} else {
			let { onComplete: n, ...r } = a || {}, l = {
				...s,
				...o,
				...r
			}, { onUpdate: u } = r;
			c = new Nu([typeof e == "number" || typeof e == "string" && (typeof i == "string" || Array.isArray(i)) ? [
				u || (() => {}),
				Array.isArray(i) ? i : [e, i],
				{
					...l,
					onUpdate: void 0
				}
			] : [
				e,
				i,
				l
			]], {
				...s,
				onComplete: n,
				scope: t
			}, Eu(e, i, l, t));
		}
		return c;
	}
	return i;
}
var Iu = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Fu(), {
	addEffect: wl,
	removeEffect: Tl
});
//#endregion
//#region src/m3-vendor.ts
typeof globalThis < "u" && globalThis.process === void 0 && (globalThis.process = { env: { NODE_ENV: "production" } });
function Lu(e, t) {
	let n = new zr(L.fromInt(Hr(e)), t, 0, "2025", "phone");
	return {
		"--md-sys-color-primary": X(n.primary),
		"--md-sys-color-primary-dim": X(n.primaryDim),
		"--md-sys-color-on-primary": X(n.onPrimary),
		"--md-sys-color-primary-container": X(n.primaryContainer),
		"--md-sys-color-on-primary-container": X(n.onPrimaryContainer),
		"--md-sys-color-inverse-primary": X(n.inversePrimary),
		"--md-sys-color-secondary": X(n.secondary),
		"--md-sys-color-secondary-dim": X(n.secondaryDim),
		"--md-sys-color-on-secondary": X(n.onSecondary),
		"--md-sys-color-secondary-container": X(n.secondaryContainer),
		"--md-sys-color-on-secondary-container": X(n.onSecondaryContainer),
		"--md-sys-color-tertiary": X(n.tertiary),
		"--md-sys-color-tertiary-dim": X(n.tertiaryDim),
		"--md-sys-color-on-tertiary": X(n.onTertiary),
		"--md-sys-color-tertiary-container": X(n.tertiaryContainer),
		"--md-sys-color-on-tertiary-container": X(n.onTertiaryContainer),
		"--md-sys-color-error": X(n.error),
		"--md-sys-color-on-error": X(n.onError),
		"--md-sys-color-error-container": X(n.errorContainer),
		"--md-sys-color-on-error-container": X(n.onErrorContainer),
		"--md-sys-color-background": X(n.background),
		"--md-sys-color-on-background": X(n.onBackground),
		"--md-sys-color-surface": X(n.surface),
		"--md-sys-color-surface-dim": X(n.surfaceDim),
		"--md-sys-color-surface-bright": X(n.surfaceBright),
		"--md-sys-color-surface-container-lowest": X(n.surfaceContainerLowest),
		"--md-sys-color-surface-container-low": X(n.surfaceContainerLow),
		"--md-sys-color-surface-container": X(n.surfaceContainer),
		"--md-sys-color-surface-container-high": X(n.surfaceContainerHigh),
		"--md-sys-color-surface-container-highest": X(n.surfaceContainerHighest),
		"--md-sys-color-on-surface": X(n.onSurface),
		"--md-sys-color-surface-variant": X(n.surfaceVariant),
		"--md-sys-color-on-surface-variant": X(n.onSurfaceVariant),
		"--md-sys-color-inverse-surface": X(n.inverseSurface),
		"--md-sys-color-inverse-on-surface": X(n.inverseOnSurface),
		"--md-sys-color-outline": X(n.outline),
		"--md-sys-color-outline-variant": X(n.outlineVariant),
		"--md-sys-color-shadow": X(n.shadow),
		"--md-sys-color-scrim": X(n.scrim),
		"--md-sys-color-surface-tint": X(n.surfaceTint)
	};
}
//#endregion
export { L as Hct, zr as SchemeExpressive, Br as SchemeTonalSpot, Vr as SchemeVibrant, Iu as animate, Hr as argbFromHex, Lu as generateM3ExpressiveTokens, X as hexFromArgb, Co as spring, ou as stagger };
