function initNovu(user) {
    (function (n, o, t, i, f) {
        n[i] = {}, m = ['init']; n[i]._c = []; m.forEach(me => n[i][me] = function () { n[i]._c.push([me, arguments]) });
        var elt = o.createElement(f); elt.type = "text/javascript"; elt.async = true; elt.src = t;
        var before = o.getElementsByTagName(f)[0]; before.parentNode.insertBefore(elt, before);
    })(window, document, 'https://embed.novu.co/embed.umd.min.js', 'novu', 'script');

    novu.init('q6MiQjPp0NkA', {
        unseenBadgeSelector: '#unseen-badge',
        bellSelector: '#notification-bell',
    }, {
        subscriberId: user.$id
    })
}