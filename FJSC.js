function O(s){return new r(s)}function p(s){return new P(s)}function A(){return O("div").styles("display","none").build()}function K(s,C,f=!1){if(s&&s.constructor===P){let j=p(s.value?f?A():C:f?C:A());return s.subscribe((I)=>{if(I)j.value=f?A():C;else j.value=f?C:A()}),j}else return s?f?A():C:f?C:A()}function Y(s,C,f,j=!1){if(s.constructor!==P)throw new Error("Invalid argument type for signalMap. Must be a Signal.");let I=(U)=>{if(!U)return;let _=[];for(let B=0;B<U.length;B++)_.push(f(U[B],B));C.overwriteChildren(..._)};return s.subscribe(I),I(s.value),C.build()}function Q(s,C){let f=p(C(s.value));return s.subscribe((j)=>{try{f.value=C(j)}catch(I){f.value=null}}),f}function X(s,C={}){console.warn(s,{debugInfo:C},new Error().stack)}class Z{static assertString(s,C="value"){let f=s.constructor===String;if(!f)console.log("TypeHelper.isString: value is not a string for "+C+": ",s);return f}static assertFunction(s,C="value"){let f=s.constructor===Function;if(!f)console.log("TypeHelper.isFunction: value is not a function for "+C+": ",s);return f}}class T{static keyName="__fjs_store__";static get(s){return window[this.keyName][s]}static set(s,C){window[this.keyName][s]=C}static clear(){window[this.keyName]={}}static remove(s){delete window[this.keyName][s]}static getAll(){return window[this.keyName]}static keys(){return Object.keys(window[this.keyName])}static values(){return Object.values(window[this.keyName])}static getSignalValue(s){return this.get(s).value}static setSignalValue(s,C){this.get(s).value=C}}function h(s=null,C=null){if(!window[T.keyName])window[T.keyName]={};if(arguments.length===1)return T.get(arguments[0]);else if(arguments.length===2)return T.set(arguments[0],arguments[1]);throw new Error("Passing more than 2 arguments to store() is not supported.")}class P{_callbacks=[];_value;_values={};constructor(s,C=()=>{},f=null){if(this._value=s,this._values={},this._callbacks.push(C),f)h().set(f,this)}boolValues(s={}){for(let C in s)this._values[C]=p(this._value?s[C].onTrue:s[C].onFalse);return this.subscribe((C)=>{for(let f in s)this._values[f].value=C?s[f].onTrue:s[f].onFalse}),this._values}unsubscribeAll(){this._callbacks=[]}subscribe(s){this._callbacks.push(s)}unsubscribe(s){let C=this._callbacks.indexOf(s);if(C>=0)this._callbacks.splice(C,1)}get onUpdate(){return this._callbacks}set onUpdate(s){this._callbacks.push(s)}get value(){return this._value}set value(s){let C=this._value!==s;this._value=s,this._callbacks.forEach((f)=>f(s,C))}}function L(s){return[HTMLElement,SVGElement].some((f)=>s instanceof f)}class r{_node;svgTags=["svg","g","circle","ellipse","line","path","polygon","polyline","rect","text","textPath","tspan"];constructor(s){if(this.svgTags.includes(s))this._node=document.createElementNS("http://www.w3.org/2000/svg",s);else this._node=document.createElement(s)}build(){if(!L(this._node))throw new Error("Invalid node type. Must be an HTMLElement or a subclass.");return this._node}wrapProperty(s,C){if(C&&C.subscribe)this._node[s]=C.value,C.subscribe((f)=>{this._node[s]=f});else this._node[s]=C}class(s){return this.classes(s)}classes(...s){for(let C of s)if(C&&C.constructor===P){let f=C.value;this._node.classList.add(f),C.onUpdate=(j)=>{this._node.classList.remove(f),this._node.classList.add(j),f=j}}else this._node.classList.add(C);return this}attribute(s,C){return this.attributes(s,C)}attributes(...s){if(arguments.length%2===0)for(let C=0;C<arguments.length;C+=2){let f=arguments[C],j=arguments[C+1];if(Z.assertString(f,"attributes/key"),j&&j.constructor===P)this._node.setAttribute(f,j.value),j.onUpdate=(I)=>{this._node.setAttribute(f,I)};else this._node.setAttribute(f,j)}else throw new Error("Invalid number of arguments for attributes. Must be even. (key, value, key, value, ...)");return this}id(s){return this.wrapProperty("id",s),this}text(s){return this.wrapProperty("innerText",s),this}title(s){return this.wrapProperty("title",s),this}html(s){return this.wrapProperty("innerHTML",s),this}children(...s){for(let C of arguments)if(L(C))this._node.appendChild(C);else if(C instanceof r)this._node.appendChild(C.build());else if(C&&C.constructor===P){let f=C.value;if(!L(f))f=A();this._node.appendChild(f),C.onUpdate=(j)=>{if(L(j))this._node.replaceChild(j,f),f=j;else if(j.constructor===r)this._node.replaceChild(j.build(),f),f=j.build();else X("Unexpected value for child. Must be an HTMLElement or a subclass.",j)}}else if(C&&C.constructor===Array)for(let f of C)this.children(f);else if(C)X("Invalid node type. Must be an HTMLElement or a subclass.",C);return this}overwriteChildren(){return this._node.innerHTML="",this.children(...arguments)}child(){return this.children(...arguments)}role(s){return this.wrapProperty("role",s),this}prefixedAttribute(s,C,f){return this.attributes(`${s}-${C}`,f)}aria(s,C){return this.prefixedAttribute("aria",s,C)}data(s,C){return this.prefixedAttribute("data",s,C)}onclick(s){return this._node.onclick=s,this}onauxclick(s){return this._node.onauxclick=s,this}ondblclick(s){return this._node.ondblclick=s,this}onchange(s){return this._node.onchange=s,this}oninput(s){return this._node.oninput=s,this}onkeydown(s){return this._node.onkeydown=s,this}onkeyup(s){return this._node.onkeyup=s,this}onmousedown(s){return this._node.onmousedown=s,this}onmouseup(s){return this._node.onmouseup=s,this}onmouseover(s){return this._node.onmouseover=s,this}onmouseout(s){return this._node.onmouseout=s,this}onmousemove(s){return this._node.onmousemove=s,this}onmouseenter(s){return this._node.onmouseenter=s,this}onmouseleave(s){return this._node.onmouseleave=s,this}oncontextmenu(s){return this._node.oncontextmenu=s,this}onwheel(s){return this._node.onwheel=s,this}ondrag(s){return this._node.ondrag=s,this}ondragend(s){return this._node.ondragend=s,this}ondragenter(s){return this._node.ondragenter=s,this}ondragstart(s){return this._node.ondragstart=s,this}ondragleave(s){return this._node.ondragleave=s,this}ondragover(s){return this._node.ondragover=s,this}ondrop(s){return this._node.ondrop=s,this}onscroll(s){return this._node.onscroll=s,this}onfocus(s){return this._node.onfocus=s,this}onblur(s){return this._node.onblur=s,this}onresize(s){return this._node.onresize=s,this}onselect(s){return this._node.onselect=s,this}onsubmit(s){return this._node.onsubmit=s,this}onreset(s){return this._node.onreset=s,this}onabort(s){return this._node.onabort=s,this}onerror(s){return this._node.onerror=s,this}oncanplay(s){return this._node.oncanplay=s,this}oncanplaythrough(s){return this._node.oncanplaythrough=s,this}ondurationchange(s){return this._node.ondurationchange=s,this}onemptied(s){return this._node.onemptied=s,this}onended(s){return this._node.onended=s,this}onloadeddata(s){return this._node.onloadeddata=s,this}onloadedmetadata(s){return this._node.onloadedmetadata=s,this}onloadstart(s){return this._node.onloadstart=s,this}onpause(s){return this._node.onpause=s,this}onplay(s){return this._node.onplay=s,this}onplaying(s){return this._node.onplaying=s,this}onprogress(s){return this._node.onprogress=s,this}onratechange(s){return this._node.onratechange=s,this}onseeked(s){return this._node.onseeked=s,this}onseeking(s){return this._node.onseeking=s,this}onstalled(s){return this._node.onstalled=s,this}onsuspend(s){return this._node.onsuspend=s,this}ontimeupdate(s){return this._node.ontimeupdate=s,this}onvolumechange(s){return this._node.onvolumechange=s,this}onwaiting(s){return this._node.onwaiting=s,this}oncopy(s){return this._node.oncopy=s,this}oncut(s){return this._node.oncut=s,this}onpaste(s){return this._node.onpaste=s,this}onanimationstart(s){return this._node.onanimationstart=s,this}onanimationend(s){return this._node.onanimationend=s,this}onanimationiteration(s){return this._node.onanimationiteration=s,this}ontransitionend(s){return this._node.ontransitionend=s,this}on(s,C){return this._node.addEventListener(s,C),this}open(s){return this.wrapProperty("open",s),this}src(s){return this.wrapProperty("src",s),this}alt(s){return this.wrapProperty("alt",s),this}css(s){return this._node.style.cssText=s,this}style(s,C){return this.styles(s,C)}styles(...s){if(arguments.length%2===0)for(let C=0;C<arguments.length;C+=2){let f=arguments[C],j=arguments[C+1];if(f.constructor!==String)throw new Error("Invalid key type for styles. Must be a string.");if(j&&j.constructor===P)this._node.style[f]=j.value,j.onUpdate=(I)=>{this._node.style[f]=I};else this._node.style[f]=j}else throw new Error("Invalid number of arguments for styles. Must be even. (key, value, key, value, ...)");return this}width(s){return this.wrapProperty("width",s),this}height(s){return this.wrapProperty("height",s),this}type(s){return this.wrapProperty("type",s),this}name(s){return this.wrapProperty("name",s),this}value(s){return this.wrapProperty("value",s),this}placeholder(s){return this.wrapProperty("placeholder",s),this}for(s){return this.wrapProperty("for",s),this}checked(s){return this.wrapProperty("checked",s),this}disabled(s){return this.wrapProperty("disabled",s),this}selected(s){return this.wrapProperty("selected",s),this}href(s){return this.wrapProperty("href",s),this}target(s){return this.wrapProperty("target",s),this}rel(s){return this.wrapProperty("rel",s),this}required(s){return this.wrapProperty("required",s),this}multiple(s){return this.wrapProperty("multiple",s),this}accept(s){return this.wrapProperty("accept",s),this}acceptCharset(s){return this.wrapProperty("acceptCharset",s),this}action(s){return this.wrapProperty("action",s),this}autocomplete(s){return this.wrapProperty("autocomplete",s),this}enctype(s){return this.wrapProperty("enctype",s),this}method(s){return this.wrapProperty("method",s),this}novalidate(s){return this.wrapProperty("novalidate",s),this}}class z{static button(s){return s.classes??=[],O("button").classes("fjsc",...s.classes).text(s.text).onclick(s.onclick).build()}static input(s){return O("input").classes("fjsc").type(s.type).value(s.value).accept(s.accept).placeholder(s.placeholder).onchange((C)=>{if(s.onchange)s.onchange(C.target.value)}).name(s.name).build()}static area(s){return s.classes??=[],s.children??=[],O(s.tag??"div").classes("fjsc","fjsc-area",...s.classes).children(...s.children).build()}static container(s){return s.classes??=[],s.children??=[],O(s.tag??"div").classes("fjsc","fjsc-container",...s.classes).children(...s.children).build()}static text(s){return O(s.tag??"span").classes("fjsc").text(s.text).build()}static icon(s){let C=s.icon,f=!s.isUrl,j=s.adaptive?"adaptive-icon":"static-icon";if(f)return O("i").classes(j,"fjsc","material-symbols-outlined","no-pointer").text(C).build();return O("img").classes(j,"fjsc","no-pointer").attributes("src",C).build()}static searchableSelect(s){let C=s.options??p([]),f=s.value??p(null),j=p(C.value.find((x)=>x.id===f.value)?.name??""),I=p(!1),U=p(C.value),_=p(0),B=()=>{U.value=C.value.filter((x)=>x.name.toLowerCase().includes(j.value.toLowerCase()))};C.subscribe(B),j.subscribe(B),B();let R=p(C.value[0].id),G=()=>{R.value=U.value[_.value]?.id};_.subscribe(G),U.subscribe(G),G();let $=Q(I,(x)=>x?"arrow_drop_up":"arrow_drop_down");return O("div").classes("fjsc-search-select","flex-v","relative").children(O("div").classes("flex","fjsc-search-select-visible").children(O("input").classes("fjsc","fjsc-search-select-input").value(j).onfocus(()=>{I.value=!0}).onkeydown((x)=>{switch(x.key){case"Enter":x.preventDefault(),x.stopPropagation();let W=U.value[_.value];f.value=W?.id??f.value,j.value=W?.name??j.value,I.value=!1;break;case"ArrowDown":x.preventDefault(),x.stopPropagation(),_.value=(_.value+1)%U.value.length;break;case"ArrowUp":x.preventDefault(),x.stopPropagation(),_.value=(_.value-1+U.value.length)%U.value.length;break;case"Escape":case"Tab":I.value=!1;break;default:if(x.keyCode>32&&x.keyCode<126||x.key==="Backspace")setTimeout(()=>{j.value=x.target.value,_.value=0});break}}).build(),O("div").classes("fjsc-search-select-dropdown").onclick(()=>{I.value=!I.value}).children(z.icon({icon:$,adaptive:!0,isUrl:!1})).build()).build(),K(I,Y(U,O("div").classes("fjsc-search-select-options","flex-v"),(x)=>z.searchSelectOption({option:x,value:f,search:j,optionsVisible:I,selectedId:R})))).build()}static searchSelectOption(s){let C,f=Q(s.selectedId,(j)=>{return C?.scrollIntoView({behavior:"smooth",block:"nearest"}),j===s.option.id?"selected":"_"});return C=O("div").classes("fjsc-search-select-option","flex","gap","padded",f).onclick(()=>{s.value.value=s.option.id,s.search.value=s.option.name,s.optionsVisible.value=!1}).children(K(s.option.image,z.icon({icon:s.option.image,isUrl:s.option.imageIsUrl,adaptive:!0})),O("span").text(s.option.name).build()).build(),C}}export{z as FJSC};

//# debugId=578026D7CC0ED09764756E2164756E21
//# sourceMappingURL=FJSC.js.map
