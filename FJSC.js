function i(s){return new L(s)}function x(s){return new j(s)}function G(){return i("div").styles("display","none").build()}function O(s,r,d=!1){function h(){if(r.constructor===Function)return r();return r}if(s&&s.constructor===j){let t=x(s.value?d?G():h():d?h():G());return s.subscribe((p)=>{if(p)t.value=d?G():h();else t.value=d?h():G()}),t}else return s?d?G():h():d?h():G()}function U(s,r,d,h=!1){if(s.constructor!==j)throw new Error("Invalid argument type for signalMap. Must be a Signal.");let t=(p)=>{if(!p)return;let v=[];if(h){r.overwriteChildren();for(let f=0;f<p.length;f++)r.children(d(p[f],f))}else{for(let f=0;f<p.length;f++)v.push(d(p[f],f));r.overwriteChildren(...v)}};return s.subscribe(t),t(s.value),r.build()}function I(s,r){let d=x(r(s.value));return s.subscribe((h)=>{try{d.value=r(h)}catch(t){d.value=null}}),d}function A(s,r={}){console.warn(s,{debugInfo:r},new Error().stack)}class H{static assertString(s,r="value"){let d=s.constructor===String;if(!d)console.log("TypeHelper.isString: value is not a string for "+r+": ",s);return d}static assertFunction(s,r="value"){let d=s.constructor===Function;if(!d)console.log("TypeHelper.isFunction: value is not a function for "+r+": ",s);return d}}class T{static keyName="__fjs_store__";static get(s){return window[this.keyName][s]}static set(s,r){window[this.keyName][s]=r}static clear(){window[this.keyName]={}}static remove(s){delete window[this.keyName][s]}static getAll(){return window[this.keyName]}static keys(){return Object.keys(window[this.keyName])}static values(){return Object.values(window[this.keyName])}static getSignalValue(s){return this.get(s).value}static setSignalValue(s,r){this.get(s).value=r}}function z(s=null,r=null){if(!window[T.keyName])window[T.keyName]={};if(arguments.length===1)return T.get(arguments[0]);else if(arguments.length===2)return T.set(arguments[0],arguments[1]);throw new Error("Passing more than 2 arguments to store() is not supported.")}class j{_callbacks=[];_value;_values={};constructor(s,r=()=>{},d=null){if(this._value=s,this._values={},this._callbacks.push(r),d)z().set(d,this)}boolValues(s={}){for(let r in s)this._values[r]=x(this._value?s[r].onTrue:s[r].onFalse);return this.subscribe((r)=>{for(let d in s)this._values[d].value=r?s[d].onTrue:s[d].onFalse}),this._values}unsubscribeAll(){this._callbacks=[]}subscribe(s){this._callbacks.push(s)}unsubscribe(s){let r=this._callbacks.indexOf(s);if(r>=0)this._callbacks.splice(r,1)}get onUpdate(){return this._callbacks}set onUpdate(s){this._callbacks.push(s)}get value(){return this._value}set value(s){let r=this._value!==s;this._value=s,this._callbacks.forEach((d)=>d(s,r))}}function q(s){return[HTMLElement,SVGElement].some((d)=>s instanceof d)}class L{_node;svgTags=["svg","g","circle","ellipse","line","path","polygon","polyline","rect","text","textPath","tspan"];constructor(s){if(this.svgTags.includes(s))this._node=document.createElementNS("http://www.w3.org/2000/svg",s);else this._node=document.createElement(s)}applyGenericConfig(s){return this.classes("fjsc",...s.classes??[]).attributes(...s.attributes??[]).styles(...s.styles??[]).id(s.id).title(s.title).role(s.role)}build(){if(!q(this._node))throw new Error("Invalid node type. Must be an HTMLElement or a subclass.");return this._node}wrapProperty(s,r){if(r&&r.subscribe)this._node[s]=r.value,r.subscribe((d)=>{this._node[s]=d});else this._node[s]=r}class(s){return this.classes(s)}classes(...s){for(let r of s)if(r&&r.constructor===j){let d=r.value;this._node.classList.add(d),r.onUpdate=(h)=>{this._node.classList.remove(d),this._node.classList.add(h),d=h}}else this._node.classList.add(r);return this}attribute(s,r){return this.attributes(s,r)}attributes(...s){if(arguments.length%2===0)for(let r=0;r<arguments.length;r+=2){let d=arguments[r],h=arguments[r+1];if(H.assertString(d,"attributes/key"),h&&h.constructor===j)this._node.setAttribute(d,h.value),h.onUpdate=(t)=>{this._node.setAttribute(d,t)};else this._node.setAttribute(d,h)}else throw new Error("Invalid number of arguments for attributes. Must be even. (key, value, key, value, ...)");return this}id(s){return this.wrapProperty("id",s),this}text(s){return this.wrapProperty("innerText",s),this}title(s){return this.wrapProperty("title",s),this}html(s){return this.wrapProperty("innerHTML",s),this}children(...s){for(let r of arguments)if(q(r))this._node.appendChild(r);else if(r instanceof L)this._node.appendChild(r.build());else if(r&&r.constructor===j){let d=r.value;if(!q(d))d=G();this._node.appendChild(d),r.onUpdate=(h)=>{if(q(h))this._node.replaceChild(h,d),d=h;else if(h.constructor===L)this._node.replaceChild(h.build(),d),d=h.build();else A("Unexpected value for child. Must be an HTMLElement or a subclass.",h)}}else if(r&&r.constructor===Array)for(let d of r)this.children(d);else if(r)A("Invalid node type. Must be an HTMLElement or a subclass.",r);return this}overwriteChildren(){return this._node.innerHTML="",this.children(...arguments)}child(){return this.children(...arguments)}role(s){return this.wrapProperty("role",s),this}prefixedAttribute(s,r,d){return this.attributes(`${s}-${r}`,d)}aria(s,r){return this.prefixedAttribute("aria",s,r)}data(s,r){return this.prefixedAttribute("data",s,r)}onclick(s){return this._node.onclick=s,this}onauxclick(s){return this._node.onauxclick=s,this}ondblclick(s){return this._node.ondblclick=s,this}onchange(s){return this._node.onchange=s,this}oninput(s){return this._node.oninput=s,this}onkeydown(s){return this._node.onkeydown=s,this}onkeyup(s){return this._node.onkeyup=s,this}onmousedown(s){return this._node.onmousedown=s,this}onmouseup(s){return this._node.onmouseup=s,this}onmouseover(s){return this._node.onmouseover=s,this}onmouseout(s){return this._node.onmouseout=s,this}onmousemove(s){return this._node.onmousemove=s,this}onmouseenter(s){return this._node.onmouseenter=s,this}onmouseleave(s){return this._node.onmouseleave=s,this}oncontextmenu(s){return this._node.oncontextmenu=s,this}onwheel(s){return this._node.onwheel=s,this}ondrag(s){return this._node.ondrag=s,this}ondragend(s){return this._node.ondragend=s,this}ondragenter(s){return this._node.ondragenter=s,this}ondragstart(s){return this._node.ondragstart=s,this}ondragleave(s){return this._node.ondragleave=s,this}ondragover(s){return this._node.ondragover=s,this}ondrop(s){return this._node.ondrop=s,this}onscroll(s){return this._node.onscroll=s,this}onfocus(s){return this._node.onfocus=s,this}onblur(s){return this._node.onblur=s,this}onresize(s){return this._node.onresize=s,this}onselect(s){return this._node.onselect=s,this}onsubmit(s){return this._node.onsubmit=s,this}onreset(s){return this._node.onreset=s,this}onabort(s){return this._node.onabort=s,this}onerror(s){return this._node.onerror=s,this}oncanplay(s){return this._node.oncanplay=s,this}oncanplaythrough(s){return this._node.oncanplaythrough=s,this}ondurationchange(s){return this._node.ondurationchange=s,this}onemptied(s){return this._node.onemptied=s,this}onended(s){return this._node.onended=s,this}onloadeddata(s){return this._node.onloadeddata=s,this}onloadedmetadata(s){return this._node.onloadedmetadata=s,this}onloadstart(s){return this._node.onloadstart=s,this}onpause(s){return this._node.onpause=s,this}onplay(s){return this._node.onplay=s,this}onplaying(s){return this._node.onplaying=s,this}onprogress(s){return this._node.onprogress=s,this}onratechange(s){return this._node.onratechange=s,this}onseeked(s){return this._node.onseeked=s,this}onseeking(s){return this._node.onseeking=s,this}onstalled(s){return this._node.onstalled=s,this}onsuspend(s){return this._node.onsuspend=s,this}ontimeupdate(s){return this._node.ontimeupdate=s,this}onvolumechange(s){return this._node.onvolumechange=s,this}onwaiting(s){return this._node.onwaiting=s,this}oncopy(s){return this._node.oncopy=s,this}oncut(s){return this._node.oncut=s,this}onpaste(s){return this._node.onpaste=s,this}onanimationstart(s){return this._node.onanimationstart=s,this}onanimationend(s){return this._node.onanimationend=s,this}onanimationiteration(s){return this._node.onanimationiteration=s,this}ontransitionend(s){return this._node.ontransitionend=s,this}on(s,r){return this._node.addEventListener(s,r),this}open(s){return this.wrapProperty("open",s),this}src(s){return this.wrapProperty("src",s),this}alt(s){return this.wrapProperty("alt",s),this}css(s){return this._node.style.cssText=s,this}style(s,r){return this.styles(s,r)}styles(...s){if(arguments.length%2===0)for(let r=0;r<arguments.length;r+=2){let d=arguments[r],h=arguments[r+1];if(d.constructor!==String)throw new Error("Invalid key type for styles. Must be a string.");if(h&&h.constructor===j)this._node.style[d]=h.value,h.onUpdate=(t)=>{this._node.style[d]=t};else this._node.style[d]=h}else throw new Error("Invalid number of arguments for styles. Must be even. (key, value, key, value, ...)");return this}width(s){return this.wrapProperty("width",s),this}height(s){return this.wrapProperty("height",s),this}type(s){return this.wrapProperty("type",s),this}name(s){return this.wrapProperty("name",s),this}value(s){return this.wrapProperty("value",s),this}placeholder(s){return this.wrapProperty("placeholder",s),this}for(s){return this.wrapProperty("for",s),this}checked(s){return this.wrapProperty("checked",s),this}disabled(s){return this.wrapProperty("disabled",s),this}selected(s){return this.wrapProperty("selected",s),this}href(s){return this.wrapProperty("href",s),this}target(s){return this.wrapProperty("target",s),this}rel(s){return this.wrapProperty("rel",s),this}required(s){return this.wrapProperty("required",s),this}multiple(s){return this.wrapProperty("multiple",s),this}accept(s){return this.wrapProperty("accept",s),this}acceptCharset(s){return this.wrapProperty("acceptCharset",s),this}action(s){return this.wrapProperty("action",s),this}autocomplete(s){return this.wrapProperty("autocomplete",s),this}enctype(s){return this.wrapProperty("enctype",s),this}method(s){return this.wrapProperty("method",s),this}novalidate(s){return this.wrapProperty("novalidate",s),this}}class u{static button(s){return s.classes??=[],i("button").applyGenericConfig(s).onclick(s.onclick).children(O(s.icon,()=>u.icon(s.icon)),O(s.text,()=>u.text({text:s.text}))).build()}static input(s){let r=x([]),d=I(r,(t)=>t.length>0?"invalid":"valid");function h(t){if(r.value=[],s.validators?.forEach(async(p)=>{let v=await p(t);if(v)r.value=r.value.concat(v)}),s.required&&(t===null||t===void 0||t===""))r.value.push("This field is required.")}if(s.value?.subscribe)s.value.subscribe(h);return i("div").classes("flex-v").children(i("input").classes(d).applyGenericConfig(s).type(s.type).value(s.value).accept(s.accept).required(s.required??!1).placeholder(s.placeholder).onchange((t)=>{if(!s.value?.subscribe)h(t.target.value);if(s.onchange)s.onchange(t.target.value)}).name(s.name).build(),u.errorList(r)).build()}static errorList(s){return U(s,i("div").classes("flex-v","fjsc-error-list"),(r)=>u.error(r))}static error(s){return i("span").classes("fjsc-error").text(s).build()}static area(s){return s.classes??=[],s.children??=[],i(s.tag??"div").applyGenericConfig(s).classes("fjsc-area").children(...s.children).build()}static container(s){return s.classes??=[],s.children??=[],i(s.tag??"div").applyGenericConfig(s).classes("fjsc-container").children(...s.children).build()}static text(s){return i(s.tag??"span").applyGenericConfig(s).text(s.text).build()}static heading(s){return i(`h${s.level??1}`).applyGenericConfig(s).text(s.text).build()}static icon(s){let r=s.icon,d=!s.isUrl,h=s.adaptive?"adaptive-icon":"static-icon";if(d)return i("i").applyGenericConfig(s).classes(h,"material-symbols-outlined","no-pointer").text(r).build();return i("img").applyGenericConfig(s).classes(h,"no-pointer").attributes("src",r).build()}static searchableSelect(s){let r=s.options??x([]),d=s.value??x(null),h=x(r.value.find((C)=>C.id===d.value)?.name??""),t=x(!1),p=x(r.value),v=x(0),f=()=>{p.value=r.value.filter((C)=>C.name.toLowerCase().includes(h.value.toLowerCase()))};r.subscribe(f),h.subscribe(f),f();let _=x(r.value[0]?.id??null),B=()=>{_.value=p.value[v.value]?.id};v.subscribe(B),p.subscribe(B),B();let $=I(t,(C)=>C?"arrow_drop_up":"arrow_drop_down");return i("div").applyGenericConfig(s).classes("fjsc-search-select","flex-v","relative").children(i("div").classes("flex","fjsc-search-select-visible").children(i("input").classes("fjsc","fjsc-search-select-input").value(h).onfocus(()=>{t.value=!0}).onkeydown((C)=>{switch(C.key){case"Enter":C.preventDefault(),C.stopPropagation();let P=p.value[v.value];d.value=P?.id??d.value,h.value=P?.name??h.value,t.value=!1;break;case"ArrowDown":C.preventDefault(),C.stopPropagation(),v.value=(v.value+1)%p.value.length;break;case"ArrowUp":C.preventDefault(),C.stopPropagation(),v.value=(v.value-1+p.value.length)%p.value.length;break;case"Escape":case"Tab":t.value=!1;break;default:if(C.keyCode>32&&C.keyCode<126||C.key==="Backspace")setTimeout(()=>{h.value=C.target.value,v.value=0});break}}).build(),i("div").classes("fjsc-search-select-dropdown").onclick(()=>{t.value=!t.value}).children(u.icon({icon:$,adaptive:!0,isUrl:!1})).build()).build(),O(t,U(p,i("div").classes("fjsc-search-select-options","flex-v"),(C)=>u.searchSelectOption({option:C,value:d,search:h,optionsVisible:t,selectedId:_})))).build()}static searchSelectOption(s){let r,d=I(s.selectedId,(h)=>{return r?.scrollIntoView({behavior:"smooth",block:"nearest"}),h===s.option.id?"selected":"_"});return r=i("div").classes("fjsc-search-select-option","flex","gap","padded",d).onclick(()=>{s.value.value=s.option.id,s.search.value=s.option.name,s.optionsVisible.value=!1}).children(O(s.option.image,u.icon({icon:s.option.image,isUrl:s.option.imageIsUrl,adaptive:!0})),i("span").text(s.option.name).build()).build(),r}static checkbox(s){let r=x([]);function d(t){if(r.value=[],s.validators?.forEach(async(p)=>{let v=await p(t);if(v)r.value=r.value.concat(v)}),s.required&&(t===null||t===void 0||t===!1))r.value=r.value.concat(["This field is required."])}let h=I(r,(t)=>t.length>0?"invalid":"valid");if(s.checked.subscribe)s.checked.subscribe(d),d(s.checked.value);else d(s.checked);return i("div").classes("flex-v").children(i("label").applyGenericConfig(s).classes("fjsc-checkbox-container",h).text(s.text).children(i("input").type("checkbox").name(s.name??"").id(s.name??"").required(s.required??!1).checked(s.checked).onclick((t)=>{let p=t.target.checked;if(!s.checked.subscribe)d(p);s.onchange&&s.onchange(p)}).build(),i("span").classes("fjsc-checkmark").children(i("span").classes("fjsc-checkmark-icon").text("\u2713").build()).build()).build(),u.errorList(r)).build()}static toggle(s){let r=x([]);function d(t){if(r.value=[],s.validators?.forEach(async(p)=>{let v=await p(t);if(v)r.value=r.value.concat(v)}),s.required&&(t===null||t===void 0||t===!1))r.value=r.value.concat(["This field is required."])}let h=I(r,(t)=>t.length>0?"invalid":"valid");if(s.checked.subscribe)s.checked.subscribe(d),d(s.checked.value);else d(s.checked);return i("div").classes("flex-v").children(i("label").applyGenericConfig(s).classes("flex","gap","align-children",h).for(s.name??"").children(i("input").type("checkbox").classes("hidden","fjsc-slider").id(s.name??"").required(s.required??!1).checked(s.checked).onclick((t)=>{let p=t.target.checked;if(!s.checked.subscribe)d(p);s.onchange&&s.onchange(p)}).build(),i("div").classes("fjsc-toggle-container").children(i("span").classes("fjsc-toggle-slider").build()).build(),i("span").classes("fjsc-toggle-text").text(s.text??"").build()).build(),u.errorList(r)).build()}}export{u as FJSC};

//# debugId=CF97F38F48C5AB1864756E2164756E21
//# sourceMappingURL=FJSC.js.map
