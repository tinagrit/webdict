const tlib = (...tinagritlib) => {
    if (isIE()) {
        _tlib.throw("TLIB doesn't support Internet Explorer, please change your browser");
        return;
    }
    const s = tinagritlib;
    if (typeof s[0] === 'function') {
        document.addEventListener('DOMContentLoaded', s[0])
    } else if (typeof s[0] === 'string') {

        let e;

        if (s[0] == 'window') {
            e = window;
            e.isObj = false;
        } else {
            // QUERY
            if (document.querySelectorAll(s[0])[1]) {
                if (s[1]) {
                    e = document.querySelectorAll(s[0])[s[1]];
                    if (e) {
                        e.isObj = false;
                    } else {
                        return false;
                    }
                } else {
                    e = document.querySelectorAll(s[0]);
                    if (e) {
                        e.isObj = true;
                    } else {
                        return false;
                    }
                }
            } else {
                e = document.querySelector(s[0]);
                if (e) {
                    e.isObj = false;
                } else {
                    return false;
                }
            }

        }


        _tlib.imp(e);

        return e;
    } else if (s[0] instanceof HTMLElement) {
        const e = [s[0]];
        e.isObj = true;
        _tlib.imp(e);
        return e;
    } else {
        _tlib.throw("TLIB function can't have any arguments apart from function, string, and HTML element")
    }
}

tlib.json = (u, c) => {
    var request = new XMLHttpRequest();
    request.open('GET', u, true);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.response);
            c(data);
        } else {
            _tlib.throw('The server returned an error')
        }
    };

    request.onerror = function () {
        _tlib.throw("Can't reach the server")
    };

    request.send();
}

tlib.post = (u, d, c) => {
    var request = new XMLHttpRequest();
    request.open('POST', u, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(d);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            c(this.response);
        } else {
            _tlib.throw('The server returned an error')
        }
    }
}

tlib.ajax = (m, u, d, c) => {
    var request = new XMLHttpRequest();
    request.open(m, u, true);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            c(this.response);
        } else {
            _tlib.throw('The server returned an error')
        }
    };

    request.onerror = function () {
        _tlib.throw("Can't reach the server")
    };

    if (m === 'GET') {
        request.send();
    } else {
        request.send(d);
    }
}

tlib.now = (t) => {
    let d;
    if (!t) {
        d = new Date();
    } else {
        d = new Date(t);
    }
    return d;
}

tlib.parse = (f, c) => {
    switch (f) {
        case 'html':
            var tmp = document.implementation.createHTMLDocument();
            tmp.body.innerHTML = c;
            return tmp.body.children;
            break;
        case 'json':
            return JSON.parse(c);
            break;
        default:
            _tlib.throw("Can't parse anything apart from HTML and JSON")
    }
}

tlib.isArray = (arr) => {
    return Array.isArray(arr);
}

const _tlib = {
    imp(e) {
        // CSS
        e.css = (...cssProps) => {
            if (typeof cssProps[0] === 'string') {
                if (!cssProps[1]) {
                    if (e.isObj) {
                        _tlib.throw("Can't get CSS value of an object")
                    } else {
                        return getComputedStyle(e)[cssProps[0]];
                    }
                } else if (cssProps[2]) {
                    _tlib.throw("Provided more than 1 CSS value")
                } else {
                    const [prop, val] = cssProps;
                    if (e.isObj) {
                        e.forEach(element => {
                            element.style[prop] = val
                        });
                    } else if (!e.isObj) {
                        e.style[prop] = val
                    }
                }
            } else if (typeof cssProps[0] === 'object') {
                if (!cssProps[1]) {
                    Object.entries(cssProps[0]).forEach(([prop, val]) => {
                        if (e.isObj) {
                            e.forEach(element => {
                                element.style[prop] = val
                            });
                        } else if (!e.isObj) {
                            e.style[prop] = val
                        }
                    });
                }
            }
        }


        // ON
        e.on = (event, handler) => {
            if (e.isObj) {
                e.forEach(element => {
                    element.addEventListener(event, handler);
                })
            } else {
                e.addEventListener(event, handler);
            }
        }

        // OFF
        e.off = (event, handler) => {
            if (e.isObj) {
                e.forEach(element => {
                    element.removeEventListener(event, handler);
                })
            } else {
                e.removeEventListener(event, handler);
            }
        }

        // EACH
        e.each = (f) => {
            e.forEach((element, n) => {
                const binded = f.bind(element);
                binded(n, element)
            })
        }

        // ATB
        e.attr = (a, v) => {
            if (!e.isObj) {
                if (!v) {
                    return e.getAttribute(a);
                } else {
                    e.setAttribute(a, v);
                }
            } else {
                _tlib.throw("Can't get or set attribute of an object")
            }
        }

        // CLASS
        e.class = () => {
            if (!e.isObj) {
                return e.className
            } else {
                _tlib.throw("Can't show classes with many elements")
            }
        }

        e.class.add = (c) => {
            if (e.isObj) {
                e.forEach(element => {
                    element.classList.add(c);
                })
            } else {
                e.classList.add(c);
            }
        }

        e.class.has = (c) => {
            if (!e.isObj) {
                return e.classList.contains(c)
            } else {
                _tlib.throw("Can't HASCLASS with many elements")
            }
        }

        e.class.remove = (c) => {
            if (e.isObj) {
                e.forEach(element => {
                    element.classList.remove(c);
                })
            } else {
                e.classList.remove(c);
            }
        }

        e.class.toggle = (c) => {
            if (e.isObj) {
                e.forEach(element => {
                    element.classList.toggle(c);
                })
            } else {
                e.classList.toggle(c);
            }
        }

        // EMPTY
        e.empty = () => {
            while (e.firstChild) {
                e.removeChild(e.firstChild);
            }
        }

        // REMOVE
        e.remove = () => {
            if (e.isObj) {
                e.forEach(element => {
                    element.parentNode.removeChild(element);
                })
            } else {
                e.parentNode.removeChild(e);
            }
        }
    },
    throw (err) {
        console.error('TLIB ERROR: ' + err);
    },
    css: ""
}

Number.prototype.zeroPad = function() {
    return ('0'+this).slice(-2);
 };

function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

const _ = tlib;