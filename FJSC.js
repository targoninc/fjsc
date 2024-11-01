function h(s){return new B(s)}function x(s){return new f(s)}function o(){return h("div").styles("display","none").build()}function T(s,r,t=!1){function e(){if(r.constructor===Function)return r();return r}if(s&&s.constructor===f){let u=x(s.value?t?o():e():t?e():o());return s.subscribe((d)=>{if(d)u.value=t?o():e();else u.value=t?e():o()}),u}else return s?t?o():e():t?e():o()}function U(s,r,t,e=!1){if(s.constructor!==f)throw new Error("Invalid argument type for signalMap. Must be a Signal.");let u=(d)=>{if(!d)return;let i=[];if(e){r.overwriteChildren();for(let v=0;v<d.length;v++)r.children(t(d[v],v))}else{for(let v=0;v<d.length;v++)i.push(t(d[v],v));r.overwriteChildren(...i)}};return s.subscribe(u),u(s.value),r.build()}function C(s,r){let t=x(r(s.value));return s.subscribe((e)=>{try{t.value=r(e)}catch(u){t.value=null}}),t}function P(s,r={}){console.warn(s,{debugInfo:r},new Error().stack)}class z{static assertString(s,r="value"){let t=s.constructor===String;if(!t)console.log("TypeHelper.isString: value is not a string for "+r+": ",s);return t}static assertFunction(s,r="value"){let t=s.constructor===Function;if(!t)console.log("TypeHelper.isFunction: value is not a function for "+r+": ",s);return t}}class O{static keyName="__fjs_store__";static get(s){return window[this.keyName][s]}static set(s,r){window[this.keyName][s]=r}static clear(){window[this.keyName]={}}static remove(s){delete window[this.keyName][s]}static getAll(){return window[this.keyName]}static keys(){return Object.keys(window[this.keyName])}static values(){return Object.values(window[this.keyName])}static getSignalValue(s){return this.get(s).value}static setSignalValue(s,r){this.get(s).value=r}}function D(s=null,r=null){if(!window[O.keyName])window[O.keyName]={};if(arguments.length===1)return O.get(arguments[0]);else if(arguments.length===2)return O.set(arguments[0],arguments[1]);throw new Error("Passing more than 2 arguments to store() is not supported.")}class f{_callbacks=[];_value;_values={};constructor(s,r=()=>{},t=null){if(this._value=s,this._values={},this._callbacks.push(r),t)D().set(t,this)}boolValues(s={}){for(let r in s)this._values[r]=x(this._value?s[r].onTrue:s[r].onFalse);return this.subscribe((r)=>{for(let t in s)this._values[t].value=r?s[t].onTrue:s[t].onFalse}),this._values}unsubscribeAll(){this._callbacks=[]}subscribe(s){this._callbacks.push(s)}unsubscribe(s){let r=this._callbacks.indexOf(s);if(r>=0)this._callbacks.splice(r,1)}get onUpdate(){return this._callbacks}set onUpdate(s){this._callbacks.push(s)}get value(){return this._value}set value(s){let r=this._value!==s;this._value=s,this._callbacks.forEach((t)=>t(s,r))}}function L(s){return[HTMLElement,SVGElement].some((t)=>s instanceof t)}class B{_node;svgTags=["svg","g","circle","ellipse","line","path","polygon","polyline","rect","text","textPath","tspan"];constructor(s){if(this.svgTags.includes(s))this._node=document.createElementNS("http://www.w3.org/2000/svg",s);else this._node=document.createElement(s)}applyGenericConfig(s){return this.classes("fjsc",...s.classes??[]).attributes(...s.attributes??[]).styles(...s.styles??[]).id(s.id).title(s.title).role(s.role)}build(){if(!L(this._node))throw new Error("Invalid node type. Must be an HTMLElement or a subclass.");return this._node}wrapProperty(s,r){if(r&&r.subscribe)this._node[s]=r.value,r.subscribe((t)=>{this._node[s]=t});else this._node[s]=r}class(s){return this.classes(s)}classes(...s){for(let r of s)if(r&&r.constructor===f){let t=r.value;this._node.classList.add(t),r.onUpdate=(e)=>{this._node.classList.remove(t),this._node.classList.add(e),t=e}}else this._node.classList.add(r);return this}attribute(s,r){return this.attributes(s,r)}attributes(...s){if(arguments.length%2===0)for(let r=0;r<arguments.length;r+=2){let t=arguments[r],e=arguments[r+1];if(z.assertString(t,"attributes/key"),e&&e.constructor===f)this._node.setAttribute(t,e.value),e.onUpdate=(u)=>{this._node.setAttribute(t,u)};else this._node.setAttribute(t,e)}else throw new Error("Invalid number of arguments for attributes. Must be even. (key, value, key, value, ...)");return this}id(s){return this.wrapProperty("id",s),this}text(s){return this.wrapProperty("innerText",s),this}title(s){return this.wrapProperty("title",s),this}html(s){return this.wrapProperty("innerHTML",s),this}children(...s){for(let r of arguments)if(L(r))this._node.appendChild(r);else if(r instanceof B)this._node.appendChild(r.build());else if(r&&r.constructor===f){let t=r.value;if(!L(t))t=o();this._node.appendChild(t),r.onUpdate=(e)=>{if(L(e))this._node.replaceChild(e,t),t=e;else if(e.constructor===B)this._node.replaceChild(e.build(),t),t=e.build();else P("Unexpected value for child. Must be an HTMLElement or a subclass.",e)}}else if(r&&r.constructor===Array)for(let t of r)this.children(t);else if(r)P("Invalid node type. Must be an HTMLElement or a subclass.",r);return this}overwriteChildren(){return this._node.innerHTML="",this.children(...arguments)}child(){return this.children(...arguments)}role(s){return this.wrapProperty("role",s),this}prefixedAttribute(s,r,t){return this.attributes(`${s}-${r}`,t)}aria(s,r){return this.prefixedAttribute("aria",s,r)}data(s,r){return this.prefixedAttribute("data",s,r)}onclick(s){return this._node.onclick=s,this}onauxclick(s){return this._node.onauxclick=s,this}ondblclick(s){return this._node.ondblclick=s,this}onchange(s){return this._node.onchange=s,this}oninput(s){return this._node.oninput=s,this}onkeydown(s){return this._node.onkeydown=s,this}onkeyup(s){return this._node.onkeyup=s,this}onmousedown(s){return this._node.onmousedown=s,this}onmouseup(s){return this._node.onmouseup=s,this}onmouseover(s){return this._node.onmouseover=s,this}onmouseout(s){return this._node.onmouseout=s,this}onmousemove(s){return this._node.onmousemove=s,this}onmouseenter(s){return this._node.onmouseenter=s,this}onmouseleave(s){return this._node.onmouseleave=s,this}oncontextmenu(s){return this._node.oncontextmenu=s,this}onwheel(s){return this._node.onwheel=s,this}ondrag(s){return this._node.ondrag=s,this}ondragend(s){return this._node.ondragend=s,this}ondragenter(s){return this._node.ondragenter=s,this}ondragstart(s){return this._node.ondragstart=s,this}ondragleave(s){return this._node.ondragleave=s,this}ondragover(s){return this._node.ondragover=s,this}ondrop(s){return this._node.ondrop=s,this}onscroll(s){return this._node.onscroll=s,this}onfocus(s){return this._node.onfocus=s,this}onblur(s){return this._node.onblur=s,this}onresize(s){return this._node.onresize=s,this}onselect(s){return this._node.onselect=s,this}onsubmit(s){return this._node.onsubmit=s,this}onreset(s){return this._node.onreset=s,this}onabort(s){return this._node.onabort=s,this}onerror(s){return this._node.onerror=s,this}oncanplay(s){return this._node.oncanplay=s,this}oncanplaythrough(s){return this._node.oncanplaythrough=s,this}ondurationchange(s){return this._node.ondurationchange=s,this}onemptied(s){return this._node.onemptied=s,this}onended(s){return this._node.onended=s,this}onloadeddata(s){return this._node.onloadeddata=s,this}onloadedmetadata(s){return this._node.onloadedmetadata=s,this}onloadstart(s){return this._node.onloadstart=s,this}onpause(s){return this._node.onpause=s,this}onplay(s){return this._node.onplay=s,this}onplaying(s){return this._node.onplaying=s,this}onprogress(s){return this._node.onprogress=s,this}onratechange(s){return this._node.onratechange=s,this}onseeked(s){return this._node.onseeked=s,this}onseeking(s){return this._node.onseeking=s,this}onstalled(s){return this._node.onstalled=s,this}onsuspend(s){return this._node.onsuspend=s,this}ontimeupdate(s){return this._node.ontimeupdate=s,this}onvolumechange(s){return this._node.onvolumechange=s,this}onwaiting(s){return this._node.onwaiting=s,this}oncopy(s){return this._node.oncopy=s,this}oncut(s){return this._node.oncut=s,this}onpaste(s){return this._node.onpaste=s,this}onanimationstart(s){return this._node.onanimationstart=s,this}onanimationend(s){return this._node.onanimationend=s,this}onanimationiteration(s){return this._node.onanimationiteration=s,this}ontransitionend(s){return this._node.ontransitionend=s,this}on(s,r){return this._node.addEventListener(s,r),this}open(s){return this.wrapProperty("open",s),this}src(s){return this.wrapProperty("src",s),this}alt(s){return this.wrapProperty("alt",s),this}css(s){return this._node.style.cssText=s,this}style(s,r){return this.styles(s,r)}styles(...s){if(arguments.length%2===0)for(let r=0;r<arguments.length;r+=2){let t=arguments[r],e=arguments[r+1];if(t.constructor!==String)throw new Error("Invalid key type for styles. Must be a string.");if(e&&e.constructor===f)this._node.style[t]=e.value,e.onUpdate=(u)=>{this._node.style[t]=u};else this._node.style[t]=e}else throw new Error("Invalid number of arguments for styles. Must be even. (key, value, key, value, ...)");return this}width(s){return this.wrapProperty("width",s),this}height(s){return this.wrapProperty("height",s),this}type(s){return this.wrapProperty("type",s),this}name(s){return this.wrapProperty("name",s),this}value(s){return this.wrapProperty("value",s),this}placeholder(s){return this.wrapProperty("placeholder",s),this}for(s){return this.wrapProperty("for",s),this}checked(s){return this.wrapProperty("checked",s),this}disabled(s){return this.wrapProperty("disabled",s),this}selected(s){return this.wrapProperty("selected",s),this}href(s){return this.wrapProperty("href",s),this}target(s){return this.wrapProperty("target",s),this}rel(s){return this.wrapProperty("rel",s),this}required(s){return this.wrapProperty("required",s),this}multiple(s){return this.wrapProperty("multiple",s),this}accept(s){return this.wrapProperty("accept",s),this}acceptCharset(s){return this.wrapProperty("acceptCharset",s),this}action(s){return this.wrapProperty("action",s),this}autocomplete(s){return this.wrapProperty("autocomplete",s),this}enctype(s){return this.wrapProperty("enctype",s),this}method(s){return this.wrapProperty("method",s),this}novalidate(s){return this.wrapProperty("novalidate",s),this}}function q(s){let r;if(s.disabled?.subscribe)r=C(s.disabled,(t)=>t?"disabled":"enabled");else r=s.disabled?"disabled":"enabled";return r}class j{static button(s){return s.classes??=[],h("button").classes(q(s)).applyGenericConfig(s).onclick(s.onclick).children(T(s.icon,()=>j.icon(s.icon)),T(s.text,()=>j.text({text:s.text}))).build()}static input(s){let r=x([]),t=C(r,(v)=>v.length>0),e=C(t,(v)=>v?"invalid":"valid"),u=x(!1),d=0;function i(v){if(r.value=[],s.debounce){if(Date.now()-d<s.debounce)return}if(s.validators?.forEach(async(I)=>{let G=await I(v);if(G)r.value=r.value.concat(G)}),s.required&&(v===null||v===void 0||v==="")&&u.value)r.value=r.value.concat(["This field is required."])}if(s.value?.subscribe)s.value.subscribe(i),i(s.value.value);else i(s.value);return h("div").classes("flex-v","fjsc").children(h("label").classes("flex-v","fjsc",q(s)).text(s.label??"").for(s.name).children(h("input").classes(e).applyGenericConfig(s).type(s.type).value(s.value).accept(s.accept??"").required(s.required??!1).placeholder(s.placeholder??"").attributes("autofocus",s.autofocus??"").oninput((v)=>{if(u.value=!0,d=Date.now(),!s.value?.subscribe)i(v.target.value);if(s.onchange)s.onchange(v.target.value)}).onchange((v)=>{if(u.value=!0,d=Date.now(),!s.value?.subscribe)i(v.target.value);if(s.onchange)s.onchange(v.target.value)}).onkeydown(s.onkeydown??(()=>{})).name(s.name).build()).build(),T(t,j.errorList(r))).build()}static textarea(s){let r=x([]),t=C(r,(d)=>d.length>0),e=C(t,(d)=>d?"invalid":"valid");function u(d){if(r.value=[],s.validators?.forEach(async(i)=>{let v=await i(d);if(v)r.value=r.value.concat(v)}),s.required&&(d===null||d===void 0||d===""))r.value=r.value.concat(["This field is required."])}if(s.value?.subscribe)s.value.subscribe(u),u(s.value.value);else u(s.value);return h("div").classes("flex-v","fjsc").children(h("label").classes("flex-v","fjsc",q(s)).text(s.label??"").for(s.name).children(h("textarea").classes(e).applyGenericConfig(s).styles("resize",s.resize??"vertical").value(s.value).required(s.required??!1).placeholder(s.placeholder??"").attributes("autofocus",s.autofocus??"").oninput((d)=>{if(!s.value?.subscribe)u(d.target.value);if(s.onchange)s.onchange(d.target.value)}).onchange((d)=>{if(!s.value?.subscribe)u(d.target.value);if(s.onchange)s.onchange(d.target.value)}).name(s.name).build()).build(),T(t,j.errorList(r))).build()}static errorList(s){return U(s,h("div").classes("flex-v","fjsc","fjsc-error-list"),(r)=>j.error(r))}static error(s){return h("span").classes("fjsc-error").text(s).build()}static area(s){return s.classes??=[],s.children??=[],h(s.tag??"div").applyGenericConfig(s).classes("fjsc-area").children(...s.children).build()}static container(s){return s.classes??=[],s.children??=[],h(s.tag??"div").applyGenericConfig(s).classes("fjsc-container").children(...s.children).build()}static text(s){return h(s.tag??"span").applyGenericConfig(s).text(s.text).build()}static heading(s){return h(`h${s.level??1}`).applyGenericConfig(s).text(s.text).build()}static icon(s){let r=s.icon,t=!s.isUrl,e=s.adaptive?"adaptive-icon":"static-icon";if(t)return h("i").applyGenericConfig(s).classes(e,"material-symbols-outlined","no-pointer").text(r).build();return h("img").applyGenericConfig(s).classes(e,"no-pointer").attributes("src",r).build()}static searchableSelect(s){let r=s.options??x([]),t=s.value??x(null),e=x(r.value.find((p)=>p.id===t.value)?.name??""),u=x(!1),d=x(r.value),i=x(0),v=()=>{d.value=r.value.filter((p)=>p.name.toLowerCase().includes(e.value.toLowerCase()))};r.subscribe(v),e.subscribe(v),v();let I=x(r.value[0]?.id??null),G=()=>{I.value=d.value[i.value]?.id};i.subscribe(G),d.subscribe(G),G();let A=C(u,(p)=>p?"arrow_drop_up":"arrow_drop_down");return h("div").applyGenericConfig(s).classes("fjsc-search-select","flex-v","relative").children(h("div").classes("flex","fjsc-search-select-visible","fjsc").children(h("input").classes("fjsc","fjsc-search-select-input",q(s)).value(e).onfocus(()=>{u.value=!0}).onkeydown((p)=>{switch(p.key){case"Enter":p.preventDefault(),p.stopPropagation();let _=d.value[i.value];t.value=_?.id??t.value,e.value=_?.name??e.value,u.value=!1;break;case"ArrowDown":p.preventDefault(),p.stopPropagation(),i.value=(i.value+1)%d.value.length;break;case"ArrowUp":p.preventDefault(),p.stopPropagation(),i.value=(i.value-1+d.value.length)%d.value.length;break;case"Escape":case"Tab":u.value=!1;break;default:if(p.keyCode>32&&p.keyCode<126||p.key==="Backspace")setTimeout(()=>{e.value=p.target.value,i.value=0});break}}).build(),h("div").classes("fjsc-search-select-dropdown",q(s)).onclick(()=>{u.value=!u.value}).children(j.icon({icon:A,adaptive:!0,isUrl:!1})).build()).build(),T(u,U(d,h("div").classes("fjsc-search-select-options","flex-v"),(p)=>j.searchSelectOption({option:p,value:t,search:e,optionsVisible:u,selectedId:I})))).build()}static searchSelectOption(s){let r,t=C(s.selectedId,(e)=>{return r?.scrollIntoView({behavior:"smooth",block:"nearest"}),e===s.option.id?"selected":"_"});return r=h("div").classes("fjsc-search-select-option","flex","gap","padded",t).onclick(()=>{s.value.value=s.option.id,s.search.value=s.option.name,s.optionsVisible.value=!1}).children(T(s.option.image,j.icon({icon:s.option.image,isUrl:s.option.imageIsUrl,adaptive:!0})),h("span").text(s.option.name).build()).build(),r}static checkbox(s){let r=x([]),t=C(r,(d)=>d.length>0),e=C(t,(d)=>d?"invalid":"valid");function u(d){if(r.value=[],s.validators?.forEach(async(i)=>{let v=await i(d);if(v)r.value=r.value.concat(v)}),s.required&&(d===null||d===void 0||d===!1))r.value=r.value.concat(["This field is required."])}if(s.checked.subscribe)s.checked.subscribe(u),u(s.checked.value);else u(s.checked);return h("div").classes("flex-v","fjsc").children(h("label").applyGenericConfig(s).classes("fjsc-checkbox-container",e,q(s)).text(s.text).children(h("input").type("checkbox").name(s.name??"").id(s.name??"").required(s.required??!1).checked(s.checked).onclick((d)=>{let i=d.target.checked;if(!s.checked.subscribe)u(i);s.onchange&&s.onchange(i)}).build(),h("span").classes("fjsc-checkmark").children(h("span").classes("fjsc-checkmark-icon").text("\u2713").build()).build()).build(),T(t,j.errorList(r))).build()}static toggle(s){let r=x([]),t=C(r,(d)=>d.length>0),e=C(t,(d)=>d?"invalid":"valid");function u(d){if(r.value=[],s.validators?.forEach(async(i)=>{let v=await i(d);if(v)r.value=r.value.concat(v)}),s.required&&(d===null||d===void 0||d===!1))r.value=r.value.concat(["This field is required."])}if(s.checked.subscribe)s.checked.subscribe(u),u(s.checked.value);else u(s.checked);return h("div").classes("flex-v","fjsc").children(h("label").applyGenericConfig(s).classes("flex","gap","align-children",e,q(s)).for(s.name??"").children(h("input").type("checkbox").classes("hidden","fjsc-slider").id(s.name??"").required(s.required??!1).checked(s.checked).onclick((d)=>{let i=d.target.checked;if(!s.checked.subscribe)u(i);s.onchange&&s.onchange(i)}).build(),h("div").classes("fjsc-toggle-container").children(h("span").classes("fjsc-toggle-slider").build()).build(),h("span").classes("fjsc-toggle-text").text(s.text??"").build()).build(),T(t,j.errorList(r))).build()}}export{j as FJSC};

//# debugId=7BB91FB4E305660A64756E2164756E21
//# sourceMappingURL=FJSC.js.map
