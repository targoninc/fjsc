function U(C){return new K(C)}function P(C){return new j(C)}function A(){return U("div").styles("display","none").build()}function $(C,p,x=!1){let G=()=>{if(p.constructor===Function)return p();return p};if(C&&C.constructor===j){let I=P(C.value?x?A():G():x?G():A());return C.subscribe((_)=>{if(_)I.value=x?A():G();else I.value=x?G():A()}),I}else return C?x?A():G():x?G():A()}function Z(C,p,x,G=!1){if(C.constructor!==j)throw new Error("Invalid argument type for signalMap. Must be a Signal.");let I=(_)=>{if(!_)return;let B=[];for(let h=0;h<_.length;h++)B.push(x(_[h],h));p.overwriteChildren(...B)};return C.subscribe(I),I(C.value),p.build()}function R(C,p){let x=P(p(C.value));return C.subscribe((G)=>{try{x.value=p(G)}catch(I){x.value=null}}),x}function Y(C,p={}){console.warn(C,{debugInfo:p},new Error().stack)}class f{static assertString(C,p="value"){let x=C.constructor===String;if(!x)console.log("TypeHelper.isString: value is not a string for "+p+": ",C);return x}static assertFunction(C,p="value"){let x=C.constructor===Function;if(!x)console.log("TypeHelper.isFunction: value is not a function for "+p+": ",C);return x}}class L{static keyName="__fjs_store__";static get(C){return window[this.keyName][C]}static set(C,p){window[this.keyName][C]=p}static clear(){window[this.keyName]={}}static remove(C){delete window[this.keyName][C]}static getAll(){return window[this.keyName]}static keys(){return Object.keys(window[this.keyName])}static values(){return Object.values(window[this.keyName])}static getSignalValue(C){return this.get(C).value}static setSignalValue(C,p){this.get(C).value=p}}function H(C=null,p=null){if(!window[L.keyName])window[L.keyName]={};if(arguments.length===1)return L.get(arguments[0]);else if(arguments.length===2)return L.set(arguments[0],arguments[1]);throw new Error("Passing more than 2 arguments to store() is not supported.")}class j{_callbacks=[];_value;_values={};constructor(C,p=()=>{},x=null){if(this._value=C,this._values={},this._callbacks.push(p),x)H().set(x,this)}boolValues(C={}){for(let p in C)this._values[p]=P(this._value?C[p].onTrue:C[p].onFalse);return this.subscribe((p)=>{for(let x in C)this._values[x].value=p?C[x].onTrue:C[x].onFalse}),this._values}unsubscribeAll(){this._callbacks=[]}subscribe(C){this._callbacks.push(C)}unsubscribe(C){let p=this._callbacks.indexOf(C);if(p>=0)this._callbacks.splice(p,1)}get onUpdate(){return this._callbacks}set onUpdate(C){this._callbacks.push(C)}get value(){return this._value}set value(C){let p=this._value!==C;this._value=C,this._callbacks.forEach((x)=>x(C,p))}}function z(C){return[HTMLElement,SVGElement].some((x)=>C instanceof x)}class K{_node;svgTags=["svg","g","circle","ellipse","line","path","polygon","polyline","rect","text","textPath","tspan"];constructor(C){if(this.svgTags.includes(C))this._node=document.createElementNS("http://www.w3.org/2000/svg",C);else this._node=document.createElement(C)}applyGenericConfig(C){return this.classes("fjsc",...C.classes??[]).attributes(...C.attributes??[]).styles(...C.styles??[]).id(C.id).title(C.title).role(C.role)}build(){if(!z(this._node))throw new Error("Invalid node type. Must be an HTMLElement or a subclass.");return this._node}wrapProperty(C,p){if(p&&p.subscribe)this._node[C]=p.value,p.subscribe((x)=>{this._node[C]=x});else this._node[C]=p}class(C){return this.classes(C)}classes(...C){for(let p of C)if(p&&p.constructor===j){let x=p.value;this._node.classList.add(x),p.onUpdate=(G)=>{this._node.classList.remove(x),this._node.classList.add(G),x=G}}else this._node.classList.add(p);return this}attribute(C,p){return this.attributes(C,p)}attributes(...C){if(arguments.length%2===0)for(let p=0;p<arguments.length;p+=2){let x=arguments[p],G=arguments[p+1];if(f.assertString(x,"attributes/key"),G&&G.constructor===j)this._node.setAttribute(x,G.value),G.onUpdate=(I)=>{this._node.setAttribute(x,I)};else this._node.setAttribute(x,G)}else throw new Error("Invalid number of arguments for attributes. Must be even. (key, value, key, value, ...)");return this}id(C){return this.wrapProperty("id",C),this}text(C){return this.wrapProperty("innerText",C),this}title(C){return this.wrapProperty("title",C),this}html(C){return this.wrapProperty("innerHTML",C),this}children(...C){for(let p of arguments)if(z(p))this._node.appendChild(p);else if(p instanceof K)this._node.appendChild(p.build());else if(p&&p.constructor===j){let x=p.value;if(!z(x))x=A();this._node.appendChild(x),p.onUpdate=(G)=>{if(z(G))this._node.replaceChild(G,x),x=G;else if(G.constructor===K)this._node.replaceChild(G.build(),x),x=G.build();else Y("Unexpected value for child. Must be an HTMLElement or a subclass.",G)}}else if(p&&p.constructor===Array)for(let x of p)this.children(x);else if(p)Y("Invalid node type. Must be an HTMLElement or a subclass.",p);return this}overwriteChildren(){return this._node.innerHTML="",this.children(...arguments)}child(){return this.children(...arguments)}role(C){return this.wrapProperty("role",C),this}prefixedAttribute(C,p,x){return this.attributes(`${C}-${p}`,x)}aria(C,p){return this.prefixedAttribute("aria",C,p)}data(C,p){return this.prefixedAttribute("data",C,p)}onclick(C){return this._node.onclick=C,this}onauxclick(C){return this._node.onauxclick=C,this}ondblclick(C){return this._node.ondblclick=C,this}onchange(C){return this._node.onchange=C,this}oninput(C){return this._node.oninput=C,this}onkeydown(C){return this._node.onkeydown=C,this}onkeyup(C){return this._node.onkeyup=C,this}onmousedown(C){return this._node.onmousedown=C,this}onmouseup(C){return this._node.onmouseup=C,this}onmouseover(C){return this._node.onmouseover=C,this}onmouseout(C){return this._node.onmouseout=C,this}onmousemove(C){return this._node.onmousemove=C,this}onmouseenter(C){return this._node.onmouseenter=C,this}onmouseleave(C){return this._node.onmouseleave=C,this}oncontextmenu(C){return this._node.oncontextmenu=C,this}onwheel(C){return this._node.onwheel=C,this}ondrag(C){return this._node.ondrag=C,this}ondragend(C){return this._node.ondragend=C,this}ondragenter(C){return this._node.ondragenter=C,this}ondragstart(C){return this._node.ondragstart=C,this}ondragleave(C){return this._node.ondragleave=C,this}ondragover(C){return this._node.ondragover=C,this}ondrop(C){return this._node.ondrop=C,this}onscroll(C){return this._node.onscroll=C,this}onfocus(C){return this._node.onfocus=C,this}onblur(C){return this._node.onblur=C,this}onresize(C){return this._node.onresize=C,this}onselect(C){return this._node.onselect=C,this}onsubmit(C){return this._node.onsubmit=C,this}onreset(C){return this._node.onreset=C,this}onabort(C){return this._node.onabort=C,this}onerror(C){return this._node.onerror=C,this}oncanplay(C){return this._node.oncanplay=C,this}oncanplaythrough(C){return this._node.oncanplaythrough=C,this}ondurationchange(C){return this._node.ondurationchange=C,this}onemptied(C){return this._node.onemptied=C,this}onended(C){return this._node.onended=C,this}onloadeddata(C){return this._node.onloadeddata=C,this}onloadedmetadata(C){return this._node.onloadedmetadata=C,this}onloadstart(C){return this._node.onloadstart=C,this}onpause(C){return this._node.onpause=C,this}onplay(C){return this._node.onplay=C,this}onplaying(C){return this._node.onplaying=C,this}onprogress(C){return this._node.onprogress=C,this}onratechange(C){return this._node.onratechange=C,this}onseeked(C){return this._node.onseeked=C,this}onseeking(C){return this._node.onseeking=C,this}onstalled(C){return this._node.onstalled=C,this}onsuspend(C){return this._node.onsuspend=C,this}ontimeupdate(C){return this._node.ontimeupdate=C,this}onvolumechange(C){return this._node.onvolumechange=C,this}onwaiting(C){return this._node.onwaiting=C,this}oncopy(C){return this._node.oncopy=C,this}oncut(C){return this._node.oncut=C,this}onpaste(C){return this._node.onpaste=C,this}onanimationstart(C){return this._node.onanimationstart=C,this}onanimationend(C){return this._node.onanimationend=C,this}onanimationiteration(C){return this._node.onanimationiteration=C,this}ontransitionend(C){return this._node.ontransitionend=C,this}on(C,p){return this._node.addEventListener(C,p),this}open(C){return this.wrapProperty("open",C),this}src(C){return this.wrapProperty("src",C),this}alt(C){return this.wrapProperty("alt",C),this}css(C){return this._node.style.cssText=C,this}style(C,p){return this.styles(C,p)}styles(...C){if(arguments.length%2===0)for(let p=0;p<arguments.length;p+=2){let x=arguments[p],G=arguments[p+1];if(x.constructor!==String)throw new Error("Invalid key type for styles. Must be a string.");if(G&&G.constructor===j)this._node.style[x]=G.value,G.onUpdate=(I)=>{this._node.style[x]=I};else this._node.style[x]=G}else throw new Error("Invalid number of arguments for styles. Must be even. (key, value, key, value, ...)");return this}width(C){return this.wrapProperty("width",C),this}height(C){return this.wrapProperty("height",C),this}type(C){return this.wrapProperty("type",C),this}name(C){return this.wrapProperty("name",C),this}value(C){return this.wrapProperty("value",C),this}placeholder(C){return this.wrapProperty("placeholder",C),this}for(C){return this.wrapProperty("for",C),this}checked(C){return this.wrapProperty("checked",C),this}disabled(C){return this.wrapProperty("disabled",C),this}selected(C){return this.wrapProperty("selected",C),this}href(C){return this.wrapProperty("href",C),this}target(C){return this.wrapProperty("target",C),this}rel(C){return this.wrapProperty("rel",C),this}required(C){return this.wrapProperty("required",C),this}multiple(C){return this.wrapProperty("multiple",C),this}accept(C){return this.wrapProperty("accept",C),this}acceptCharset(C){return this.wrapProperty("acceptCharset",C),this}action(C){return this.wrapProperty("action",C),this}autocomplete(C){return this.wrapProperty("autocomplete",C),this}enctype(C){return this.wrapProperty("enctype",C),this}method(C){return this.wrapProperty("method",C),this}novalidate(C){return this.wrapProperty("novalidate",C),this}}class T{static button(C){return C.classes??=[],U("button").applyGenericConfig(C).onclick(C.onclick).children($(C.icon,()=>T.icon(C.icon)),$(C.text,()=>T.text({text:C.text}))).build()}static input(C){return U("input").applyGenericConfig(C).type(C.type).value(C.value).accept(C.accept).placeholder(C.placeholder).onchange((p)=>{if(C.onchange)C.onchange(p.target.value)}).name(C.name).build()}static area(C){return C.classes??=[],C.children??=[],U(C.tag??"div").applyGenericConfig(C).classes("fjsc-area").children(...C.children).build()}static container(C){return C.classes??=[],C.children??=[],U(C.tag??"div").applyGenericConfig(C).classes("fjsc-container").children(...C.children).build()}static text(C){return U(C.tag??"span").applyGenericConfig(C).text(C.text).build()}static heading(C){return U(`h${C.level??1}`).applyGenericConfig(C).text(C.text).build()}static icon(C){let p=C.icon,x=!C.isUrl,G=C.adaptive?"adaptive-icon":"static-icon";if(x)return U("i").applyGenericConfig(C).classes(G,"material-symbols-outlined","no-pointer").text(p).build();return U("img").applyGenericConfig(C).classes(G,"no-pointer").attributes("src",p).build()}static searchableSelect(C){let p=C.options??P([]),x=C.value??P(null),G=P(p.value.find((O)=>O.id===x.value)?.name??""),I=P(!1),_=P(p.value),B=P(0),h=()=>{_.value=p.value.filter((O)=>O.name.toLowerCase().includes(G.value.toLowerCase()))};p.subscribe(h),G.subscribe(h),h();let W=P(p.value[0]?.id??null),Q=()=>{W.value=_.value[B.value]?.id};B.subscribe(Q),_.subscribe(Q),Q();let D=R(I,(O)=>O?"arrow_drop_up":"arrow_drop_down");return U("div").applyGenericConfig(C).classes("fjsc-search-select","flex-v","relative").children(U("div").classes("flex","fjsc-search-select-visible").children(U("input").classes("fjsc","fjsc-search-select-input").value(G).onfocus(()=>{I.value=!0}).onkeydown((O)=>{switch(O.key){case"Enter":O.preventDefault(),O.stopPropagation();let X=_.value[B.value];x.value=X?.id??x.value,G.value=X?.name??G.value,I.value=!1;break;case"ArrowDown":O.preventDefault(),O.stopPropagation(),B.value=(B.value+1)%_.value.length;break;case"ArrowUp":O.preventDefault(),O.stopPropagation(),B.value=(B.value-1+_.value.length)%_.value.length;break;case"Escape":case"Tab":I.value=!1;break;default:if(O.keyCode>32&&O.keyCode<126||O.key==="Backspace")setTimeout(()=>{G.value=O.target.value,B.value=0});break}}).build(),U("div").classes("fjsc-search-select-dropdown").onclick(()=>{I.value=!I.value}).children(T.icon({icon:D,adaptive:!0,isUrl:!1})).build()).build(),$(I,Z(_,U("div").classes("fjsc-search-select-options","flex-v"),(O)=>T.searchSelectOption({option:O,value:x,search:G,optionsVisible:I,selectedId:W})))).build()}static searchSelectOption(C){let p,x=R(C.selectedId,(G)=>{return p?.scrollIntoView({behavior:"smooth",block:"nearest"}),G===C.option.id?"selected":"_"});return p=U("div").classes("fjsc-search-select-option","flex","gap","padded",x).onclick(()=>{C.value.value=C.option.id,C.search.value=C.option.name,C.optionsVisible.value=!1}).children($(C.option.image,T.icon({icon:C.option.image,isUrl:C.option.imageIsUrl,adaptive:!0})),U("span").text(C.option.name).build()).build(),p}}export{T as FJSC};

//# debugId=4F71D8C5FA6921E664756E2164756E21
//# sourceMappingURL=FJSC.js.map
