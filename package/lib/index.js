import*as e from"vue";var r={d:(e,n)=>{for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},o:(e,r)=>Object.prototype.hasOwnProperty.call(e,r)},n={};r.d(n,{Z:()=>u});const t=(o={ref:()=>e.ref,watch:()=>e.watch},a={},r.d(a,o),a);var o,a,i=function(){return i=Object.assign||function(e){for(var r,n=1,t=arguments.length;n<t;n++)for(var o in r=arguments[n])Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o]);return e},i.apply(this,arguments)};function c(e,r){void 0===r&&(r={ignoreWhiteSpace:!0});var n={},o=e,a={},c={defaultEncode:function(e){var r,n=e.key,t=e.value;return(r={})[n]=t,r},defaultDecode:function(e){var r=e.key;return e.query[r]}},u=function(e,n,t){var o;!0===(null==r?void 0:r.ignoreWhiteSpace)&&(null==(o=t)||""===o||"string"==typeof o&&""===o.trim())||e.append(n,encodeURI(t))},l=function(e){void 0===e&&(e={});var r=window.history.state,t=window.location.href;n=i(i({},n),e);var o,a,c=t.split("?")[0]+(o=n,a=new URLSearchParams,Object.entries(o).forEach((function(e){var r=function(e,r){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var t,o,a=n.call(e),i=[];try{for(;(void 0===r||r-- >0)&&!(t=a.next()).done;)i.push(t.value)}catch(e){o={error:e}}finally{try{t&&!t.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return i}(e,2),n=r[0],t=r[1];Array.isArray(t)?t.forEach((function(e){u(a,n,e)})):u(a,n,t)})),"?".concat(a.toString()));window.history.replaceState(r,"",c)},f=e.map((function(e){return r=i({},e),o=r.key,u=r.value,f=r.encode,v=void 0===f?c.defaultEncode:f,y=(0,t.ref)(u),a[o]=y,n=i(i({},n),v({query:n,value:u,key:o})),(0,t.watch)((function(){return y.value}),(function(e,r){e!==r&&(n=i(i({},n),v({query:n,value:e,key:o})),l())})),y;var r,o,u,f,v,y}));return function(){var e,r,t={},u=window.location,l=u.search,f=u.hash,v=(l||f).replace(/^#\//,"").replace(/\?/,""),y=new URLSearchParams(v);try{for(var d=function(e){var r="function"==typeof Symbol&&Symbol.iterator,n=r&&e[r],t=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&t>=e.length&&(e=void 0),{value:e&&e[t++],done:!e}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")}(y.keys()),h=d.next();!h.done;h=d.next()){var p=h.value,s=y.getAll(p).map((function(e){return decodeURI(e)}));t[p]=1===(null==s?void 0:s.length)?s[0]:s}}catch(r){e={error:r}}finally{try{h&&!h.done&&(r=d.return)&&r.call(d)}finally{if(e)throw e.error}}var w=i(i({},n),t);o.forEach((function(e){var r=e.key,n=e.value,t=e.decode,o=(void 0===t?c.defaultDecode:t)({query:w,key:r,value:n});a[r].value=o}))}(),l(),f}const u=function(e,r){return new c(e,r)};var l=n.Z;export{l as default};
//# sourceMappingURL=index.js.map