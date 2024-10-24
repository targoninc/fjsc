function i(s){return new L(s)}function u(s){return new G(s)}function I(){return i("div").styles("display","none").build()}function T(s,r,d=!1){function t(){if(r.constructor===Function)return r();return r}if(s&&s.constructor===G){let v=u(s.value?d?I():t():d?t():I());return s.subscribe((h)=>{if(h)v.value=d?I():t();else v.value=d?t():I()}),v}else return s?d?I():t():d?t():I()}function U(s,r,d,t=!1){if(s.constructor!==G)throw new Error("Invalid argument type for signalMap. Must be a Signal.");let v=(h)=>{if(!h)return;let p=[];if(t){r.overwriteChildren();for(let x=0;x<h.length;x++)r.children(d(h[x],x))}else{for(let x=0;x<h.length;x++)p.push(d(h[x],x));r.overwriteChildren(...p)}};return s.subscribe(v),v(s.value),r.build()}function j(s,r){let d=u(r(s.value));return s.subscribe((t)=>{try{d.value=r(t)}catch(v){d.value=null}}),d}function A(s,r={}){console.warn(s,{debugInfo:r},new Error().stack)}class H{static assertString(s,r="value"){let d=s.constructor===String;if(!d)console.log("TypeHelper.isString: value is not a string for "+r+": ",s);return d}static assertFunction(s,r="value"){let d=s.constructor===Function;if(!d)console.log("TypeHelper.isFunction: value is not a function for "+r+": ",s);return d}}class O{static keyName="__fjs_store__";static get(s){return window[this.keyName][s]}static set(s,r){window[this.keyName][s]=r}static clear(){window[this.keyName]={}}static remove(s){delete window[this.keyName][s]}static getAll(){return window[this.keyName]}static keys(){return Object.keys(window[this.keyName])}static values(){return Object.values(window[this.keyName])}static getSignalValue(s){return this.get(s).value}static setSignalValue(s,r){this.get(s).value=r}}function z(s=null,r=null){if(!window[O.keyName])window[O.keyName]={};if(arguments.length===1)return O.get(arguments[0]);else if(arguments.length===2)return O.set(arguments[0],arguments[1]);throw new Error("Passing more than 2 arguments to store() is not supported.")}class G{_callbacks=[];_value;_values={};constructor(s,r=()=>{},d=null){if(this._value=s,this._values={},this._callbacks.push(r),d)z().set(d,this)}boolValues(s={}){for(let r in s)this._values[r]=u(this._value?s[r].onTrue:s[r].onFalse);return this.subscribe((r)=>{for(let d in s)this._values[d].value=r?s[d].onTrue:s[d].onFalse}),this._values}unsubscribeAll(){this._callbacks=[]}subscribe(s){this._callbacks.push(s)}unsubscribe(s){let r=this._callbacks.indexOf(s);if(r>=0)this._callbacks.splice(r,1)}get onUpdate(){return this._callbacks}set onUpdate(s){this._callbacks.push(s)}get value(){return this._value}set value(s){let r=this._value!==s;this._value=s,this._callbacks.forEach((d)=>d(s,r))}}function q(s){return[HTMLElement,SVGElement].some((d)=>s instanceof d)}class L{_node;svgTags=["svg","g","circle","ellipse","line","path","polygon","polyline","rect","text","textPath","tspan"];constructor(s){if(this.svgTags.includes(s))this._node=document.createElementNS("http://www.w3.org/2000/svg",s);else this._node=document.createElement(s)}applyGenericConfig(s){return this.classes("fjsc",...s.classes??[]).attributes(...s.attributes??[]).styles(...s.styles??[]).id(s.id).title(s.title).role(s.role)}build(){if(!q(this._node))throw new Error("Invalid node type. Must be an HTMLElement or a subclass.");return this._node}wrapProperty(s,r){if(r&&r.subscribe)this._node[s]=r.value,r.subscribe((d)=>{this._node[s]=d});else this._node[s]=r}class(s){return this.classes(s)}classes(...s){for(let r of s)if(r&&r.constructor===G){let d=r.value;this._node.classList.add(d),r.onUpdate=(t)=>{this._node.classList.remove(d),this._node.classList.add(t),d=t}}else this._node.classList.add(r);return this}attribute(s,r){return this.attributes(s,r)}attributes(...s){if(arguments.length%2===0)for(let r=0;r<arguments.length;r+=2){let d=arguments[r],t=arguments[r+1];if(H.assertString(d,"attributes/key"),t&&t.constructor===G)this._node.setAttribute(d,t.value),t.onUpdate=(v)=>{this._node.setAttribute(d,v)};else this._node.setAttribute(d,t)}else throw new Error("Invalid number of arguments for attributes. Must be even. (key, value, key, value, ...)");return this}id(s){return this.wrapProperty("id",s),this}text(s){return this.wrapProperty("innerText",s),this}title(s){return this.wrapProperty("title",s),this}html(s){return this.wrapProperty("innerHTML",s),this}children(...s){for(let r of arguments)if(q(r))this._node.appendChild(r);else if(r instanceof L)this._node.appendChild(r.build());else if(r&&r.constructor===G){let d=r.value;if(!q(d))d=I();this._node.appendChild(d),r.onUpdate=(t)=>{if(q(t))this._node.replaceChild(t,d),d=t;else if(t.constructor===L)this._node.replaceChild(t.build(),d),d=t.build();else A("Unexpected value for child. Must be an HTMLElement or a subclass.",t)}}else if(r&&r.constructor===Array)for(let d of r)this.children(d);else if(r)A("Invalid node type. Must be an HTMLElement or a subclass.",r);return this}overwriteChildren(){return this._node.innerHTML="",this.children(...arguments)}child(){return this.children(...arguments)}role(s){return this.wrapProperty("role",s),this}prefixedAttribute(s,r,d){return this.attributes(`${s}-${r}`,d)}aria(s,r){return this.prefixedAttribute("aria",s,r)}data(s,r){return this.prefixedAttribute("data",s,r)}onclick(s){return this._node.onclick=s,this}onauxclick(s){return this._node.onauxclick=s,this}ondblclick(s){return this._node.ondblclick=s,this}onchange(s){return this._node.onchange=s,this}oninput(s){return this._node.oninput=s,this}onkeydown(s){return this._node.onkeydown=s,this}onkeyup(s){return this._node.onkeyup=s,this}onmousedown(s){return this._node.onmousedown=s,this}onmouseup(s){return this._node.onmouseup=s,this}onmouseover(s){return this._node.onmouseover=s,this}onmouseout(s){return this._node.onmouseout=s,this}onmousemove(s){return this._node.onmousemove=s,this}onmouseenter(s){return this._node.onmouseenter=s,this}onmouseleave(s){return this._node.onmouseleave=s,this}oncontextmenu(s){return this._node.oncontextmenu=s,this}onwheel(s){return this._node.onwheel=s,this}ondrag(s){return this._node.ondrag=s,this}ondragend(s){return this._node.ondragend=s,this}ondragenter(s){return this._node.ondragenter=s,this}ondragstart(s){return this._node.ondragstart=s,this}ondragleave(s){return this._node.ondragleave=s,this}ondragover(s){return this._node.ondragover=s,this}ondrop(s){return this._node.ondrop=s,this}onscroll(s){return this._node.onscroll=s,this}onfocus(s){return this._node.onfocus=s,this}onblur(s){return this._node.onblur=s,this}onresize(s){return this._node.onresize=s,this}onselect(s){return this._node.onselect=s,this}onsubmit(s){return this._node.onsubmit=s,this}onreset(s){return this._node.onreset=s,this}onabort(s){return this._node.onabort=s,this}onerror(s){return this._node.onerror=s,this}oncanplay(s){return this._node.oncanplay=s,this}oncanplaythrough(s){return this._node.oncanplaythrough=s,this}ondurationchange(s){return this._node.ondurationchange=s,this}onemptied(s){return this._node.onemptied=s,this}onended(s){return this._node.onended=s,this}onloadeddata(s){return this._node.onloadeddata=s,this}onloadedmetadata(s){return this._node.onloadedmetadata=s,this}onloadstart(s){return this._node.onloadstart=s,this}onpause(s){return this._node.onpause=s,this}onplay(s){return this._node.onplay=s,this}onplaying(s){return this._node.onplaying=s,this}onprogress(s){return this._node.onprogress=s,this}onratechange(s){return this._node.onratechange=s,this}onseeked(s){return this._node.onseeked=s,this}onseeking(s){return this._node.onseeking=s,this}onstalled(s){return this._node.onstalled=s,this}onsuspend(s){return this._node.onsuspend=s,this}ontimeupdate(s){return this._node.ontimeupdate=s,this}onvolumechange(s){return this._node.onvolumechange=s,this}onwaiting(s){return this._node.onwaiting=s,this}oncopy(s){return this._node.oncopy=s,this}oncut(s){return this._node.oncut=s,this}onpaste(s){return this._node.onpaste=s,this}onanimationstart(s){return this._node.onanimationstart=s,this}onanimationend(s){return this._node.onanimationend=s,this}onanimationiteration(s){return this._node.onanimationiteration=s,this}ontransitionend(s){return this._node.ontransitionend=s,this}on(s,r){return this._node.addEventListener(s,r),this}open(s){return this.wrapProperty("open",s),this}src(s){return this.wrapProperty("src",s),this}alt(s){return this.wrapProperty("alt",s),this}css(s){return this._node.style.cssText=s,this}style(s,r){return this.styles(s,r)}styles(...s){if(arguments.length%2===0)for(let r=0;r<arguments.length;r+=2){let d=arguments[r],t=arguments[r+1];if(d.constructor!==String)throw new Error("Invalid key type for styles. Must be a string.");if(t&&t.constructor===G)this._node.style[d]=t.value,t.onUpdate=(v)=>{this._node.style[d]=v};else this._node.style[d]=t}else throw new Error("Invalid number of arguments for styles. Must be even. (key, value, key, value, ...)");return this}width(s){return this.wrapProperty("width",s),this}height(s){return this.wrapProperty("height",s),this}type(s){return this.wrapProperty("type",s),this}name(s){return this.wrapProperty("name",s),this}value(s){return this.wrapProperty("value",s),this}placeholder(s){return this.wrapProperty("placeholder",s),this}for(s){return this.wrapProperty("for",s),this}checked(s){return this.wrapProperty("checked",s),this}disabled(s){return this.wrapProperty("disabled",s),this}selected(s){return this.wrapProperty("selected",s),this}href(s){return this.wrapProperty("href",s),this}target(s){return this.wrapProperty("target",s),this}rel(s){return this.wrapProperty("rel",s),this}required(s){return this.wrapProperty("required",s),this}multiple(s){return this.wrapProperty("multiple",s),this}accept(s){return this.wrapProperty("accept",s),this}acceptCharset(s){return this.wrapProperty("acceptCharset",s),this}action(s){return this.wrapProperty("action",s),this}autocomplete(s){return this.wrapProperty("autocomplete",s),this}enctype(s){return this.wrapProperty("enctype",s),this}method(s){return this.wrapProperty("method",s),this}novalidate(s){return this.wrapProperty("novalidate",s),this}}class f{static button(s){return s.classes??=[],i("button").applyGenericConfig(s).onclick(s.onclick).children(T(s.icon,()=>f.icon(s.icon)),T(s.text,()=>f.text({text:s.text}))).build()}static input(s){let r=u([]),d=j(r,(h)=>h.length>0),t=j(d,(h)=>h?"invalid":"valid");function v(h){if(r.value=[],s.validators?.forEach(async(p)=>{let x=await p(h);if(x)r.value=r.value.concat(x)}),s.required&&(h===null||h===void 0||h===""))r.value=r.value.concat(["This field is required."])}if(s.value?.subscribe)s.value.subscribe(v),v(s.value.value);else v(s.value);return i("div").classes("flex-v").children(i("label").classes("flex-v").text(s.label??"").for(s.name).children(i("input").classes(t).applyGenericConfig(s).type(s.type).value(s.value).accept(s.accept??"").required(s.required??!1).placeholder(s.placeholder??"").attributes("autofocus",s.autofocus??"").onchange((h)=>{if(!s.value?.subscribe)v(h.target.value);if(s.onchange)s.onchange(h.target.value)}).name(s.name).build()).build(),T(d,f.errorList(r))).build()}static errorList(s){return U(s,i("div").classes("flex-v","fjsc-error-list"),(r)=>f.error(r))}static error(s){return i("span").classes("fjsc-error").text(s).build()}static area(s){return s.classes??=[],s.children??=[],i(s.tag??"div").applyGenericConfig(s).classes("fjsc-area").children(...s.children).build()}static container(s){return s.classes??=[],s.children??=[],i(s.tag??"div").applyGenericConfig(s).classes("fjsc-container").children(...s.children).build()}static text(s){return i(s.tag??"span").applyGenericConfig(s).text(s.text).build()}static heading(s){return i(`h${s.level??1}`).applyGenericConfig(s).text(s.text).build()}static icon(s){let r=s.icon,d=!s.isUrl,t=s.adaptive?"adaptive-icon":"static-icon";if(d)return i("i").applyGenericConfig(s).classes(t,"material-symbols-outlined","no-pointer").text(r).build();return i("img").applyGenericConfig(s).classes(t,"no-pointer").attributes("src",r).build()}static searchableSelect(s){let r=s.options??u([]),d=s.value??u(null),t=u(r.value.find((C)=>C.id===d.value)?.name??""),v=u(!1),h=u(r.value),p=u(0),x=()=>{h.value=r.value.filter((C)=>C.name.toLowerCase().includes(t.value.toLowerCase()))};r.subscribe(x),t.subscribe(x),x();let _=u(r.value[0]?.id??null),B=()=>{_.value=h.value[p.value]?.id};p.subscribe(B),h.subscribe(B),B();let $=j(v,(C)=>C?"arrow_drop_up":"arrow_drop_down");return i("div").applyGenericConfig(s).classes("fjsc-search-select","flex-v","relative").children(i("div").classes("flex","fjsc-search-select-visible").children(i("input").classes("fjsc","fjsc-search-select-input").value(t).onfocus(()=>{v.value=!0}).onkeydown((C)=>{switch(C.key){case"Enter":C.preventDefault(),C.stopPropagation();let P=h.value[p.value];d.value=P?.id??d.value,t.value=P?.name??t.value,v.value=!1;break;case"ArrowDown":C.preventDefault(),C.stopPropagation(),p.value=(p.value+1)%h.value.length;break;case"ArrowUp":C.preventDefault(),C.stopPropagation(),p.value=(p.value-1+h.value.length)%h.value.length;break;case"Escape":case"Tab":v.value=!1;break;default:if(C.keyCode>32&&C.keyCode<126||C.key==="Backspace")setTimeout(()=>{t.value=C.target.value,p.value=0});break}}).build(),i("div").classes("fjsc-search-select-dropdown").onclick(()=>{v.value=!v.value}).children(f.icon({icon:$,adaptive:!0,isUrl:!1})).build()).build(),T(v,U(h,i("div").classes("fjsc-search-select-options","flex-v"),(C)=>f.searchSelectOption({option:C,value:d,search:t,optionsVisible:v,selectedId:_})))).build()}static searchSelectOption(s){let r,d=j(s.selectedId,(t)=>{return r?.scrollIntoView({behavior:"smooth",block:"nearest"}),t===s.option.id?"selected":"_"});return r=i("div").classes("fjsc-search-select-option","flex","gap","padded",d).onclick(()=>{s.value.value=s.option.id,s.search.value=s.option.name,s.optionsVisible.value=!1}).children(T(s.option.image,f.icon({icon:s.option.image,isUrl:s.option.imageIsUrl,adaptive:!0})),i("span").text(s.option.name).build()).build(),r}static checkbox(s){let r=u([]),d=j(r,(h)=>h.length>0),t=j(d,(h)=>h?"invalid":"valid");function v(h){if(r.value=[],s.validators?.forEach(async(p)=>{let x=await p(h);if(x)r.value=r.value.concat(x)}),s.required&&(h===null||h===void 0||h===!1))r.value=r.value.concat(["This field is required."])}if(s.checked.subscribe)s.checked.subscribe(v),v(s.checked.value);else v(s.checked);return i("div").classes("flex-v").children(i("label").applyGenericConfig(s).classes("fjsc-checkbox-container",t).text(s.text).children(i("input").type("checkbox").name(s.name??"").id(s.name??"").required(s.required??!1).checked(s.checked).onclick((h)=>{let p=h.target.checked;if(!s.checked.subscribe)v(p);s.onchange&&s.onchange(p)}).build(),i("span").classes("fjsc-checkmark").children(i("span").classes("fjsc-checkmark-icon").text("\u2713").build()).build()).build(),T(d,f.errorList(r))).build()}static toggle(s){let r=u([]),d=j(r,(h)=>h.length>0),t=j(d,(h)=>h?"invalid":"valid");function v(h){if(r.value=[],s.validators?.forEach(async(p)=>{let x=await p(h);if(x)r.value=r.value.concat(x)}),s.required&&(h===null||h===void 0||h===!1))r.value=r.value.concat(["This field is required."])}if(s.checked.subscribe)s.checked.subscribe(v),v(s.checked.value);else v(s.checked);return i("div").classes("flex-v").children(i("label").applyGenericConfig(s).classes("flex","gap","align-children",t).for(s.name??"").children(i("input").type("checkbox").classes("hidden","fjsc-slider").id(s.name??"").required(s.required??!1).checked(s.checked).onclick((h)=>{let p=h.target.checked;if(!s.checked.subscribe)v(p);s.onchange&&s.onchange(p)}).build(),i("div").classes("fjsc-toggle-container").children(i("span").classes("fjsc-toggle-slider").build()).build(),i("span").classes("fjsc-toggle-text").text(s.text??"").build()).build(),T(d,f.errorList(r))).build()}}export{f as FJSC};

//# debugId=2327CC09A7A9CD0864756E2164756E21
//# sourceMappingURL=FJSC.js.map
