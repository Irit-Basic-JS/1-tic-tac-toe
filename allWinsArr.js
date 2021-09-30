"use strict";

function f(size) {
    let e = [];
    for (let i = 0; i < size; i++) {
        let s = [], h = [];
        for (let e = 0; e < size; e++) {
            s.push([i, e]);
            h.push([e, i]);
        }
        e.push(s);
        e.push(h);
    }
    // console.log(e[0].toString() == [[ 0, 0 ], [ 0, 1 ], [ 0, 2 ]].toString());
    e.forEach(item => { 
        console.log(item);
    });
}
f(3);