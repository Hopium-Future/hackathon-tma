(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
    [2704],
    {
        72227: (e) => {
            e.exports = { summary: 'summary-3UYGeClB', hovered: 'hovered-3UYGeClB', caret: 'caret-3UYGeClB' };
        },
        32455: (e) => {
            e.exports = {
                'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
                'small-height-breakpoint': 'screen and (max-height: 360px)',
                'tablet-small-breakpoint': 'screen and (max-width: 428px)'
            };
        },
        6960: (e) => {
            e.exports = {
                container: 'container-3n5_2-hI',
                inputContainer: 'inputContainer-3n5_2-hI',
                withCancel: 'withCancel-3n5_2-hI',
                input: 'input-3n5_2-hI',
                icon: 'icon-3n5_2-hI',
                cancel: 'cancel-3n5_2-hI'
            };
        },
        78714: (e) => {
            e.exports = { scrollWrap: 'scrollWrap-2-It3_hB' };
        },
        60499: (e) => {
            e.exports = { container: 'container-9xiUj6X_', separator: 'separator-9xiUj6X_', section: 'section-9xiUj6X_' };
        },
        8251: (e) => {
            e.exports = {
                action: 'action-DhEzLCdX',
                hovered: 'hovered-DhEzLCdX',
                active: 'active-DhEzLCdX',
                label: 'label-DhEzLCdX',
                description: 'description-DhEzLCdX',
                selected: 'selected-DhEzLCdX',
                small: 'small-DhEzLCdX',
                withDescription: 'withDescription-DhEzLCdX',
                labelAndDescription: 'labelAndDescription-DhEzLCdX',
                icon: 'icon-DhEzLCdX',
                fakeIcon: 'fakeIcon-DhEzLCdX',
                highlighted: 'highlighted-DhEzLCdX'
            };
        },
        72346: (e) => {
            e.exports = {
                menu: 'menu-__tSsAAY',
                withDescriptions: 'withDescriptions-__tSsAAY',
                header: 'header-__tSsAAY',
                title: 'title-__tSsAAY',
                container: 'container-__tSsAAY',
                icon: 'icon-__tSsAAY',
                clear: 'clear-__tSsAAY',
                input: 'input-__tSsAAY',
                highlighted: 'highlighted-__tSsAAY',
                active: 'active-__tSsAAY',
                section: 'section-__tSsAAY'
            };
        },
        75074: () => {},
        75695: (e) => {
            e.exports = { highlighted: 'highlighted-1Qud56dI' };
        },
        78706: (e) => {
            e.exports = { separator: 'separator-eqcGT_ow', small: 'small-eqcGT_ow', normal: 'normal-eqcGT_ow', large: 'large-eqcGT_ow' };
        },
        2632: (e) => {
            e.exports = { icon: 'icon-19OjtB6A', dropped: 'dropped-19OjtB6A' };
        },
        74818: (e, t, n) => {
            'use strict';
            function o(e) {
                return r(e, s);
            }
            function i(e) {
                return r(e, a);
            }
            function r(e, t) {
                const n = Object.entries(e).filter(t),
                    o = {};
                for (const [e, t] of n) o[e] = t;
                return o;
            }
            function s(e) {
                const [t, n] = e;
                return 0 === t.indexOf('data-') && 'string' == typeof n;
            }
            function a(e) {
                return 0 === e[0].indexOf('aria-');
            }
            n.d(t, { filterDataProps: () => o, filterAriaProps: () => i, filterProps: () => r, isDataAttribute: () => s, isAriaAttribute: () => a });
        },
        99055: (e, t, n) => {
            'use strict';
            n.d(t, { CollapsibleSection: () => c });
            var o = n(67294),
                i = n(94184),
                r = n.n(i),
                s = n(88262),
                a = n(72227);
            function c(e) {
                return o.createElement(
                    o.Fragment,
                    null,
                    o.createElement(
                        'div',
                        {
                            className: r()(e.className, a.summary),
                            onClick: function () {
                                e.onStateChange && e.onStateChange(!e.open);
                            },
                            'data-open': e.open
                        },
                        e.summary,
                        o.createElement(s.ToolWidgetCaret, { className: a.caret, dropped: Boolean(e.open) })
                    ),
                    e.open && e.children
                );
            }
        },
        19330: (e, t, n) => {
            'use strict';
            n.d(t, {
                VerticalAttachEdge: () => o,
                HorizontalAttachEdge: () => i,
                VerticalDropDirection: () => r,
                HorizontalDropDirection: () => s,
                getPopupPositioner: () => l
            });
            var o,
                i,
                r,
                s,
                a = n(16282);
            !(function (e) {
                (e[(e.Top = 0)] = 'Top'), (e[(e.Bottom = 1)] = 'Bottom');
            })(o || (o = {})),
                (function (e) {
                    (e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right');
                })(i || (i = {})),
                (function (e) {
                    (e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'), (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop');
                })(r || (r = {})),
                (function (e) {
                    (e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'), (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft');
                })(s || (s = {}));
            const c = {
                verticalAttachEdge: o.Bottom,
                horizontalAttachEdge: i.Left,
                verticalDropDirection: r.FromTopToBottom,
                horizontalDropDirection: s.FromLeftToRight,
                verticalMargin: 0,
                horizontalMargin: 0,
                matchButtonAndListboxWidths: !1
            };
            function l(e, t) {
                return (n, l) => {
                    const u = (0, a.ensureNotNull)(e).getBoundingClientRect(),
                        {
                            verticalAttachEdge: d = c.verticalAttachEdge,
                            verticalDropDirection: h = c.verticalDropDirection,
                            horizontalAttachEdge: m = c.horizontalAttachEdge,
                            horizontalDropDirection: p = c.horizontalDropDirection,
                            horizontalMargin: f = c.horizontalMargin,
                            verticalMargin: g = c.verticalMargin,
                            matchButtonAndListboxWidths: v = c.matchButtonAndListboxWidths
                        } = t,
                        E = d === o.Top ? -1 * g : g,
                        C = m === i.Right ? u.right : u.left,
                        x = d === o.Top ? u.top : u.bottom,
                        D = { x: C - (p === s.FromRightToLeft ? n : 0) + f, y: x - (h === r.FromBottomToTop ? l : 0) + E };
                    return v && (D.overrideWidth = u.width), D;
                };
            }
        },
        99207: (e, t, n) => {
            'use strict';
            n.r(t), n.d(t, { currencyActions: () => r });
            var o = n(16282),
                i = n(79881);
            function r(e, t, n) {
                if (null === t || t.readOnly) return [];
                const r = [],
                    s = (e, t, n, o, i, r) => ({ id: e, label: t, icon: n, description: o, isActive: i, onClick: r }),
                    a = (t) => {
                        e.setPriceScaleCurrency(n, t);
                    },
                    c = t.selectedCurrency,
                    l = t.originalCurrencies,
                    u = t.baseCurrencies,
                    d = t.displayedValues,
                    h = { id: 'first_section', actions: [] };
                if (l.size > 1) {
                    const e = s('Mixed', (0, i.t)('Mixed'), void 0, void 0, null === t.selectedCurrency, () => a(null));
                    h.actions.push(e);
                }
                const m = e.model().availableCurrencies();
                if (null !== c) {
                    const e = (0, o.ensureNotNull)(m.item(c)),
                        t = s(c, (0, o.ensureDefined)(d.get(c)), e.logoUrl, e.description, !0, () => {});
                    h.actions.push(t);
                }
                const p = m.filterConvertible(u, (e) => e !== c && l.has(e));
                for (const e of p) {
                    const n = (0, o.ensureNotNull)(m.item(e.id));
                    h.actions.push(s(e.id, e.code, n.logoUrl, n.description, t.selectedCurrency === e.id, () => a(e.id)));
                }
                h.actions.length > 0 && r.push(h);
                const f = m.filterConvertible(u, (e) => e !== c && !l.has(e)),
                    g = { id: 'second_section', actions: [] };
                for (const e of f) {
                    const n = (0, o.ensureNotNull)(m.item(e.id));
                    g.actions.push(s(e.id, e.code, n.logoUrl, n.description, t.selectedCurrency === e.id, () => a(e.id)));
                }
                return g.actions.length > 0 && r.push(g), r;
            }
        },
        10768: (e, t, n) => {
            'use strict';
            n.r(t), n.d(t, { unitActions: () => r });
            var o = n(16282),
                i = n(79881);
            function r(e, t, n) {
                if (null === t || 0 === t.availableGroups.size) return [];
                const r = [],
                    s = (e, t, n, o, i) => ({ id: e, label: t, isActive: o, onClick: i, description: n }),
                    a = (t) => {
                        e.setPriceScaleUnit(n, t);
                    },
                    c = t.selectedUnit,
                    l = t.originalUnits,
                    u = t.names,
                    d = t.descriptions,
                    h = { actions: [], id: 'first_section' };
                if (l.size > 1) {
                    const e = s('Mixed', (0, i.t)('Mixed'), void 0, null === t.selectedUnit, () => a(null));
                    h.actions.push(e);
                }
                const m = e.model().availableUnits();
                if (null !== c) {
                    const e = s(c, (0, o.ensureDefined)(u.get(c)), (0, o.ensureDefined)(d.get(c)), !0, () => {});
                    h.actions.push(e);
                }
                const p = m.unitsByGroups(t.availableGroups);
                for (const e of p) for (const t of e.units) t.id !== c && l.has(t.id) && h.actions.push(s(t.id, t.name, t.description, !1, () => a(t.id)));
                h.actions.length > 0 && r.push(h);
                const f = c && m.unitGroupById(c);
                if (null !== f)
                    for (const e of p) {
                        if (e.name !== f) continue;
                        const t = { id: e.name, actions: [], name: e.name };
                        for (const n of e.units) n.id === c || l.has(n.id) || t.actions.push(s(n.id, n.name, n.description, !1, () => a(n.id)));
                        t.actions.length > 0 && r.push(t);
                    }
                for (const e of p) {
                    if (e.name === f) continue;
                    const t = { id: e.name, actions: [], name: e.name };
                    for (const n of e.units) n.id === c || l.has(n.id) || t.actions.push(s(n.id, n.name, n.description, !1, () => a(n.id)));
                    t.actions.length > 0 && r.push(t);
                }
                return r;
            }
        },
        59726: (e, t, n) => {
            'use strict';
            function o(e, t, n, o, i) {
                function r(i) {
                    if (e > i.timeStamp) return;
                    const r = i.target;
                    void 0 !== n && null !== t && null !== r && r.ownerDocument === o && (t.contains(r) || n(i));
                }
                return (
                    i.click && o.addEventListener('click', r, !1),
                    i.mouseDown && o.addEventListener('mousedown', r, !1),
                    i.touchEnd && o.addEventListener('touchend', r, !1),
                    i.touchStart && o.addEventListener('touchstart', r, !1),
                    () => {
                        o.removeEventListener('click', r, !1),
                            o.removeEventListener('mousedown', r, !1),
                            o.removeEventListener('touchend', r, !1),
                            o.removeEventListener('touchstart', r, !1);
                    }
                );
            }
            n.d(t, { addOutsideEventListener: () => o });
        },
        72923: (e, t, n) => {
            'use strict';
            n.d(t, { DialogBreakpoints: () => i });
            var o = n(32455);
            const i = { SmallHeight: o['small-height-breakpoint'], TabletSmall: o['tablet-small-breakpoint'], TabletNormal: o['tablet-normal-breakpoint'] };
        },
        40834: (e, t, n) => {
            'use strict';
            n.d(t, { DialogSearch: () => u });
            var o = n(67294),
                i = n(94184),
                r = n.n(i),
                s = n(79881),
                a = n(49775),
                c = n(2796),
                l = n(6960);
            function u(e) {
                const { children: t, renderInput: n, onCancel: i, ...u } = e;
                return o.createElement(
                    'div',
                    { className: l.container },
                    o.createElement('div', { className: r()(l.inputContainer, i && l.withCancel) }, n || o.createElement(d, { ...u })),
                    t,
                    o.createElement(a.Icon, { className: l.icon, icon: c }),
                    i && o.createElement('div', { className: l.cancel, onClick: i }, (0, s.t)('Cancel'))
                );
            }
            function d(e) {
                const { className: t, reference: n, value: i, onChange: s, onFocus: a, onBlur: c, onKeyDown: u, onSelect: d, placeholder: h, ...m } = e;
                return o.createElement('input', {
                    ...m,
                    ref: n,
                    type: 'text',
                    className: r()(t, l.input),
                    autoComplete: 'off',
                    'data-role': 'search',
                    placeholder: h,
                    value: i,
                    onChange: s,
                    onFocus: a,
                    onBlur: c,
                    onSelect: d,
                    onKeyDown: u
                });
            }
        },
        23412: (e, t, n) => {
            'use strict';
            n.r(t), n.d(t, { showUnitConversion: () => M });
            var o = n(67294),
                i = n(73935),
                r = n(68521),
                s = n(65802),
                a = n(42998);
            var c = n(72923),
                l = n(19330),
                u = n(94184),
                d = n.n(u),
                h = n(79881),
                m = n(49775),
                p = n(76420),
                f = n(90901),
                g = n(4598),
                v = n(10869),
                E = n(99055);
            n(75074);
            function C(e) {
                // var t, n;
                // const i = ((r = e.size), (s = e.className), u('tv-circle-logo', 'tv-circle-logo--' + r, s));
                // var r, s;
                // const a = null !== (n = null !== (t = e.alt) && void 0 !== t ? t : e.title) && void 0 !== n ? n : '';
                // return (function (e) {
                //     return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length;
                // })(e)
                //     ? o.createElement('img', { className: i, src: e.logoUrl, alt: a, title: e.title, loading: e.loading })
                //     : o.createElement('span', { className: i, title: e.title }, e.placeholderLetter);
            }
            var x = n(11945),
                D = n(8251);
            function w(e) {
                const {
                        label: t,
                        icon: n,
                        rules: i,
                        search: r,
                        description: s,
                        onClick: a,
                        onClose: c,
                        isActive: l,
                        isSmallSize: u,
                        isSelected: h,
                        selectedRef: m,
                        hasDescriptions: p,
                        hasIcons: f
                    } = e,
                    g = (0, o.useCallback)(() => {
                        a(), c && c();
                    }, [a, c]),
                    v = u && D.small;
                return o.createElement(
                    'div',
                    { className: d()(D.action, l && D.active, v, p && D.withDescription, h && D.selected), onClick: g, ref: m },
                    f &&
                        (void 0 !== n
                            ? o.createElement(C, {
                                  logoUrl: n,
                                  size: p ? 'xsmall' : 'xxsmall',
                                  className: d()(D.icon, v)
                              })
                            : o.createElement('span', { className: d()(D.fakeIcon, v) })),
                    o.createElement(
                        'div',
                        { className: d()(D.labelAndDescription, v) },
                        o.createElement('span', { className: d()(D.label, v) }, E(t)),
                        p && o.createElement('br', null),
                        p && o.createElement('span', { className: d()(D.description, v) }, s ? E(s) : '')
                    )
                );
                function E(e) {
                    return o.createElement(x.HighlightedText, { text: e, rules: i, queryString: r, className: d()(l && D.highlighted, l && D.active) });
                }
            }
            var S = n(70422),
                y = n(37978),
                A = n(72346),
                b = n(78714);
            const N = (0, g.mergeThemes)(f.DEFAULT_MENU_THEME, b);
            function L(e) {
                const {
                        title: t,
                        sections: n,
                        onClose: i,
                        selectedId: r,
                        selectedRef: s,
                        search: a,
                        setSearch: c,
                        items: l,
                        rules: u,
                        searchRef: f,
                        hasDescriptions: g,
                        hasIcons: C,
                        ...x
                    } = e,
                    [D, b] = (0, o.useState)(() => n.reduce((e, t, n) => (t.name && (e[t.id] = !0), e), {}));
                function L(e) {
                    const { id: t, ...n } = e;
                    return o.createElement(w, {
                        key: t,
                        rules: u,
                        search: a,
                        onClose: i,
                        isSmallSize: !0,
                        isSelected: t === r,
                        selectedRef: t === r ? s : void 0,
                        hasDescriptions: g,
                        hasIcons: C,
                        ...n
                    });
                }
                return o.createElement(
                    p.PopupMenu,
                    {
                        ...x,
                        onClose: i,
                        className: d()(A.menu, g && A.withDescriptions),
                        theme: N,
                        maxHeight: g ? 313 : 280,
                        noMomentumBasedScroll: !0,
                        isOpened: !0,
                        onOpen: function () {
                            var e;
                            null === (e = f.current) || void 0 === e || e.focus();
                        }
                    },
                    o.createElement(
                        'div',
                        { className: A.header },
                        o.createElement('div', { className: A.title }, t),
                        o.createElement(
                            'div',
                            { className: A.container },
                            o.createElement(m.Icon, { icon: S, className: A.icon }),
                            o.createElement('input', {
                                size: 1,
                                type: 'text',
                                className: A.input,
                                placeholder: (0, h.t)('Search'),
                                autoComplete: 'off',
                                'data-role': 'search',
                                onChange: function (e) {
                                    c(e.target.value);
                                },
                                value: a,
                                ref: f
                            }),
                            Boolean(a) &&
                                o.createElement(m.Icon, {
                                    icon: y,
                                    className: A.clear,
                                    onClick: function () {
                                        c('');
                                    }
                                })
                        )
                    ),
                    a
                        ? l.map(L)
                        : n.map((e, t) =>
                              o.createElement(
                                  o.Fragment,
                                  { key: e.id },
                                  Boolean(t) && o.createElement(v.PopupMenuSeparator, null),
                                  e.name
                                      ? o.createElement(
                                            E.CollapsibleSection,
                                            { summary: e.name, className: A.section, open: D[e.id], onStateChange: (t) => b({ ...D, [e.id]: t }) },
                                            e.actions.map(L)
                                        )
                                      : e.actions.map(L)
                              )
                          )
                );
            }
            var k = n(93590),
                z = n(40834),
                I = n(60499);
            function _(e) {
                const {
                    title: t,
                    onClose: n,
                    sections: i,
                    selectedId: r,
                    selectedRef: s,
                    search: a,
                    setSearch: c,
                    items: l,
                    rules: u,
                    searchRef: d,
                    hasIcons: m,
                    hasDescriptions: p
                } = e;
                return o.createElement(k.AdaptivePopupDialog, {
                    title: t,
                    onClose: n,
                    render: function () {
                        return o.createElement(
                            o.Fragment,
                            null,
                            o.createElement(z.DialogSearch, { placeholder: (0, h.t)('Search'), onChange: f, reference: d }),
                            o.createElement(
                                'div',
                                { className: I.container },
                                a
                                    ? l.map((e) => {
                                          const { id: t, isActive: i, ...c } = e;
                                          return o.createElement(w, {
                                              key: t,
                                              isActive: i,
                                              onClose: n,
                                              rules: u,
                                              search: a,
                                              isSelected: t === r,
                                              selectedRef: t === r ? s : void 0,
                                              hasIcons: m,
                                              hasDescriptions: p,
                                              ...c
                                          });
                                      })
                                    : i.map((e, t) =>
                                          o.createElement(
                                              o.Fragment,
                                              { key: e.id },
                                              e.name && o.createElement('div', { className: I.section }, e.name),
                                              e.actions.map((c, l) => {
                                                  const { id: d, ...h } = c,
                                                      f = l === e.actions.length - 1,
                                                      g = t === i.length - 1;
                                                  return o.createElement(
                                                      o.Fragment,
                                                      { key: d },
                                                      o.createElement(w, {
                                                          rules: u,
                                                          search: a,
                                                          onClose: n,
                                                          isSelected: d === r,
                                                          selectedRef: d === r ? s : void 0,
                                                          hasIcons: m,
                                                          hasDescriptions: p,
                                                          ...h
                                                      }),
                                                      !g && f && o.createElement('div', { className: I.separator })
                                                  );
                                              })
                                          )
                                      )
                            )
                        );
                    },
                    dataName: 'unit-conversion-dialog',
                    draggable: !1,
                    fullScreen: !0,
                    isOpened: !0
                });
                function f(e) {
                    c(e.target.value);
                }
            }
            const T = { horizontalAttachEdge: l.HorizontalAttachEdge.Right, horizontalDropDirection: l.HorizontalDropDirection.FromRightToLeft };
            function B(e) {
                const { element: t, ...n } = e,
                    [i, u] = (0, o.useState)(C()),
                    [d, h] = (0, o.useState)(''),
                    m = (0, o.useRef)(null),
                    p = (0, o.useRef)(null),
                    f = (0, o.useMemo)(() => (0, s.createRegExpList)(d), [d]),
                    { activeIdx: g, setActiveIdx: v } = (function (e, t, n, i = 'keydown') {
                        const [r, s] = (0, o.useState)(-1);
                        return (
                            (0, o.useEffect)(() => {
                                if (!e) return;
                                const n = (e) => {
                                    switch ((0, a.hashFromEvent)(e)) {
                                        case 40:
                                            if (r === t.length - 1) break;
                                            e.preventDefault(), s(r + 1);
                                            break;
                                        case 38:
                                            if (r <= 0) break;
                                            e.preventDefault(), s(r - 1);
                                            break;
                                    }
                                };
                                return (
                                    e.addEventListener('keydown', n),
                                    () => {
                                        e.removeEventListener('keydown', n);
                                    }
                                );
                            }, [e, r, t]),
                            (0, o.useEffect)(() => {
                                if (!e || !n) return;
                                const o = (e) => {
                                    var o;
                                    e.repeat || (13 === (0, a.hashFromEvent)(e) && n(null !== (o = t[r]) && void 0 !== o ? o : null, e));
                                };
                                return (
                                    e.addEventListener(i, o),
                                    () => {
                                        e.removeEventListener(i, o);
                                    }
                                );
                            }, [e, r, t, n, i]),
                            { activeIdx: r, setActiveIdx: s }
                        );
                    })(m.current, i, function (e) {
                        e && (e.onClick(), n.onClose());
                    });
                !(function (e, t = []) {
                    (0, o.useEffect)(() => {
                        e(-1);
                    }, [...t]);
                })(v, [i]),
                    (function (e, t) {
                        (0, o.useEffect)(() => {
                            var n;
                            t >= 0 && (null === (n = e.current) || void 0 === n || n.scrollIntoView({ block: 'nearest' }));
                        }, [t]);
                    })(p, g),
                    (0, o.useEffect)(() => {
                        u(
                            d
                                ? (function (e, t, n) {
                                      const o = e.reduce((e, t) => [...e, ...t.actions], []);
                                      return (0, s.rankedSearch)({ data: o, rules: n, queryString: t, primaryKey: 'label', secondaryKey: 'description' });
                                  })(n.sections, d, f)
                                : C()
                        );
                    }, [d, n.sections, f]);
                const E = (0, o.useMemo)(
                    () => ({
                        selectedId: Boolean(g >= 0 && i[g]) ? i[g].id : '',
                        selectedRef: p,
                        search: d,
                        setSearch: h,
                        searchRef: m,
                        items: i,
                        rules: f,
                        hasIcons: i.some((e) => void 0 !== e.icon),
                        hasDescriptions: i.some((e) => void 0 !== e.description)
                    }),
                    [g, p, d, h, m, i, f]
                );
                return o.createElement(r.MatchMedia, { rule: c.DialogBreakpoints.TabletSmall }, (e) =>
                    e ? o.createElement(_, { ...n, ...E }) : o.createElement(L, { ...n, ...E, position: (0, l.getPopupPositioner)(t, T), doNotCloseOn: t })
                );
                function C() {
                    return n.sections.reduce((e, t) => (e.push(...t.actions), e), []);
                }
            }
            function M(e, t, n) {
                let r = document.createElement('div');
                const s = () => {
                        null !== r && (i.unmountComponentAtNode(r), (r = null));
                    },
                    a = { title: e, sections: n, element: t, onClose: s };
                return i.render(o.createElement(B, { ...a }), r), { close: s, isOpened: () => null !== r };
            }
        },
        65802: (e, t, n) => {
            'use strict';
            n.d(t, { rankedSearch: () => i, createRegExpList: () => r, getHighlightedChars: () => s });
            var o = n(47903);
            function i(e) {
                const { data: t, rules: n, queryString: i, isPreventedFromFiltering: r, primaryKey: s, secondaryKey: a = s, optionalPrimaryKey: c } = e;
                return t
                    .map((e) => {
                        const t = c && e[c] ? e[c] : e[s],
                            r = e[a];
                        let l,
                            u = 0;
                        return (
                            n.forEach((e) => {
                                var n, s, a, c;
                                const { re: d, fullMatch: h } = e;
                                return (
                                    (d.lastIndex = 0),
                                    t && t.toLowerCase() === i.toLowerCase()
                                        ? ((u = 3), void (l = null === (n = t.match(h)) || void 0 === n ? void 0 : n.index))
                                        : (0, o.isString)(t) && h.test(t)
                                        ? ((u = 2), void (l = null === (s = t.match(h)) || void 0 === s ? void 0 : s.index))
                                        : (0, o.isString)(r) && h.test(r)
                                        ? ((u = 1), void (l = null === (a = r.match(h)) || void 0 === a ? void 0 : a.index))
                                        : void (
                                              (0, o.isString)(r) &&
                                              d.test(r) &&
                                              ((u = 1), (l = null === (c = r.match(d)) || void 0 === c ? void 0 : c.index))
                                          )
                                );
                            }),
                            { matchPriority: u, matchIndex: l, item: e }
                        );
                    })
                    .filter((e) => r || e.matchPriority)
                    .sort((e, t) => {
                        if (e.matchPriority < t.matchPriority) return 1;
                        if (e.matchPriority > t.matchPriority) return -1;
                        if (e.matchPriority === t.matchPriority) {
                            if (void 0 === e.matchIndex || void 0 === t.matchIndex) return 0;
                            if (e.matchIndex > t.matchIndex) return 1;
                            if (e.matchIndex < t.matchIndex) return -1;
                        }
                        return 0;
                    })
                    .map(({ item: e }) => e);
            }
            function r(e, t) {
                const n = [],
                    o = e.toLowerCase(),
                    i =
                        e
                            .split('')
                            .map((e, t) => `(${0 !== t ? '[/\\s-]' + a(e) : a(e)})`)
                            .join('(.*?)') + '(.*)';
                return (
                    n.push({ fullMatch: new RegExp(`(${a(e)})`, 'i'), re: new RegExp('^' + i, 'i'), reserveRe: new RegExp(i, 'i'), fuzzyHighlight: !0 }),
                    t && t.hasOwnProperty(o) && n.push({ fullMatch: t[o], re: t[o], fuzzyHighlight: !1 }),
                    n
                );
            }
            function s(e, t, n) {
                const o = [];
                return e && n
                    ? (n.forEach((e) => {
                          const { fullMatch: n, re: i, reserveRe: r } = e;
                          (n.lastIndex = 0), (i.lastIndex = 0);
                          const s = n.exec(t),
                              a = s || i.exec(t) || (r && r.exec(t));
                          if (((e.fuzzyHighlight = !s), a))
                              if (e.fuzzyHighlight) {
                                  let e = a.index;
                                  for (let t = 1; t < a.length; t++) {
                                      const n = a[t],
                                          i = a[t].length;
                                      if (t % 2) {
                                          const t = n.startsWith(' ') || n.startsWith('/') || n.startsWith('-');
                                          o[t ? e + 1 : e] = !0;
                                      }
                                      e += i;
                                  }
                              } else for (let e = 0; e < a[0].length; e++) o[a.index + e] = !0;
                      }),
                      o)
                    : o;
            }
            function a(e) {
                return e.replace(/[!-/[-^{-}]/g, '\\$&');
            }
        },
        11945: (e, t, n) => {
            'use strict';
            n.d(t, { HighlightedText: () => a });
            var o = n(67294),
                i = n(94184),
                r = n(65802),
                s = n(75695);
            function a(e) {
                const { queryString: t, rules: n, text: a, className: c } = e,
                    l = (0, o.useMemo)(() => (0, r.getHighlightedChars)(t, a, n), [t, n, a]);
                return o.createElement(
                    o.Fragment,
                    null,
                    l.length
                        ? a
                              .split('')
                              .map((e, t) =>
                                  o.createElement(
                                      o.Fragment,
                                      { key: t },
                                      l[t] ? o.createElement('span', { className: i(s.highlighted, c) }, e) : o.createElement('span', null, e)
                                  )
                              )
                        : a
                );
            }
        },
        10869: (e, t, n) => {
            'use strict';
            n.d(t, { PopupMenuSeparator: () => a });
            var o = n(67294),
                i = n(94184),
                r = n.n(i),
                s = n(78706);
            function a(e) {
                const { size: t = 'normal', className: n } = e;
                return o.createElement('div', {
                    className: r()(s.separator, 'small' === t && s.small, 'normal' === t && s.normal, 'large' === t && s.large, n)
                });
            }
        },
        76420: (e, t, n) => {
            'use strict';
            n.d(t, { PopupMenu: () => l });
            var o = n(67294),
                i = n(73935),
                r = n(4735),
                s = n(90901),
                a = n(94884),
                c = n(47165);
            function l(e) {
                const { controller: t, children: n, isOpened: l, closeOnClickOutside: u = !0, doNotCloseOn: d, onClickOutside: h, onClose: m, ...p } = e,
                    f = (0, o.useContext)(a.CloseDelegateContext),
                    g = (0, c.useOutsideEvent)({
                        handler: function (e) {
                            h && h(e);
                            if (!u) return;
                            if (d && e.target instanceof Node) {
                                const t = i.findDOMNode(d);
                                if (t instanceof Node && t.contains(e.target)) return;
                            }
                            m();
                        },
                        mouseDown: !0,
                        touchStart: !0
                    });
                return l
                    ? o.createElement(
                          r.Portal,
                          { top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none' },
                          o.createElement(
                              'span',
                              { ref: g, style: { pointerEvents: 'auto' } },
                              o.createElement(
                                  s.Menu,
                                  {
                                      ...p,
                                      onClose: m,
                                      onScroll: function (t) {
                                          const { onScroll: n } = e;
                                          n && n(t);
                                      },
                                      customCloseDelegate: f,
                                      ref: t
                                  },
                                  n
                              )
                          )
                      )
                    : null;
            }
        },
        88262: (e, t, n) => {
            'use strict';
            n.d(t, { ToolWidgetCaret: () => c });
            var o = n(67294),
                i = n(94184),
                r = n(49775),
                s = n(2632),
                a = n(85533);
            function c(e) {
                const { dropped: t, className: n } = e;
                return o.createElement(r.Icon, { className: i(n, s.icon, { [s.dropped]: t }), icon: a });
            }
        },
        4598: (e, t, n) => {
            'use strict';
            function o(e, t, n = {}) {
                const o = Object.assign({}, t);
                for (const i of Object.keys(t)) {
                    const r = n[i] || i;
                    r in e && (o[i] = [e[r], t[i]].join(' '));
                }
                return o;
            }
            function i(e, t, n = {}) {
                return Object.assign({}, e, o(e, t, n));
            }
            n.d(t, { weakComposeClasses: () => o, mergeThemes: () => i });
        },
        85533: (e) => {
            e.exports =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>';
        },
        37978: (e) => {
            e.exports =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>';
        },
        70422: (e) => {
            e.exports =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M11.85 11.93A5.48 5.48 0 0 0 8 2.5a5.5 5.5 0 1 0 3.85 9.43zm0 0L16 16"/></svg>';
        },
        2796: (e) => {
            e.exports =
                '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path stroke="currentColor" d="M12.4 12.5a7 7 0 1 0-4.9 2 7 7 0 0 0 4.9-2zm0 0l5.101 5"/></svg>';
        }
    }
]);
