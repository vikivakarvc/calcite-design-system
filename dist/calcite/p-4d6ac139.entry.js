import{r as t,c as e,h as i,H as s,g as r}from"./p-c1f86727.js";import{g as o,a}from"./p-9c90d370.js";import{g as c}from"./p-569a5c63.js";const l=class{constructor(i){t(this,i),this.calciteStepperItemChange=e(this,"calciteStepperItemChange",7),this.scale="m",this.numbered=!1,this.icon=!1,this.layout="horizontal",this.items=[],this.sortedItems=[]}contentWatcher(){this.updateContent(this.requestedContent)}connectedCallback(){["horizontal","vertical"].includes(this.layout)||(this.layout="horizontal"),["s","m","l"].includes(this.scale)||(this.scale="m"),[!0,!1].includes(this.numbered)||(this.numbered=!1),[!0,!1].includes(this.icon)||(this.icon=!1)}componentDidLoad(){this.currentPosition||this.calciteStepperItemChange.emit({position:0})}render(){const t=o(this.el);return i(s,{dir:t},i("slot",null),"horizontal"===this.layout?i("div",{class:"stepper-content",ref:t=>this.stepperContentContainer=t}):null)}calciteStepperItemKeyEvent(t){let e=t.detail.item,i=t.target,s=0===this.itemIndex(i),r=this.itemIndex(i)===this.sortedItems.length-1;switch(c(e.key)){case"ArrowDown":case"ArrowRight":r?this.focusFirstItem():this.focusNextItem(i);break;case"ArrowUp":case"ArrowLeft":s?this.focusLastItem():this.focusPrevItem(i);break;case"Home":this.focusFirstItem();break;case"End":this.focusLastItem()}}registerItem(t){const e={item:t.target,position:t.detail.position,content:t.detail.content};null!==e.content&&e.item.active&&(this.requestedContent=[e.content]),this.items.includes(e)||this.items.push(e),this.sortedItems=this.sortItems()}updateItem(t){t.detail.content&&(this.requestedContent=t.detail.content.length>0?t.detail.content:[t.detail.content]),this.currentPosition=t.detail.position,this.calciteStepperItemChange.emit({position:this.currentPosition})}async nextStep(){this.currentPosition=this.currentPosition+1<this.items.length?this.currentPosition+1:this.currentPosition,this.emitChangedItem()}async prevStep(){this.currentPosition=this.currentPosition-1>=0?this.currentPosition-1:this.currentPosition,this.emitChangedItem()}async goToStep(t){this.currentPosition=t-1,this.emitChangedItem()}async startStep(){this.currentPosition=0,this.emitChangedItem()}async endStep(){this.currentPosition=this.items.length-1,this.emitChangedItem()}emitChangedItem(){this.calciteStepperItemChange.emit({position:this.currentPosition})}focusFirstItem(){this.focusElement(this.sortedItems[0])}focusLastItem(){this.focusElement(this.sortedItems[this.sortedItems.length-1])}focusNextItem(t){const e=this.itemIndex(t);this.focusElement(this.sortedItems[e+1]||this.sortedItems[0])}focusPrevItem(t){const e=this.itemIndex(t);this.focusElement(this.sortedItems[e-1]||this.sortedItems[this.sortedItems.length-1])}itemIndex(t){return this.sortedItems.indexOf(t)}focusElement(t){t.focus()}sortItems(){let t=Array.from(this.items).filter(t=>!t.item.disabled).sort((t,e)=>t.position-e.position).map(t=>t.item);return[...Array.from(new Set(t))]}updateContent(t){this.stepperContentContainer&&(this.stepperContentContainer.innerHTML="",this.stepperContentContainer.append(...t))}get el(){return r(this)}static get watchers(){return{requestedContent:["contentWatcher"]}}};l.style=":host([hidden]){display:none}:host{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:wrap;flex-wrap:wrap;position:relative;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:stretch;align-items:stretch;width:100%;min-width:100%}:host([layout=vertical]){-ms-flex-direction:column;flex-direction:column;-ms-flex:1 auto auto;flex:1 auto auto}:host .stepper-content{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-wrap:wrap;flex-wrap:wrap;width:100%;min-width:100%}";const n=class{constructor(i){t(this,i),this.calciteStepperItemKeyEvent=e(this,"calciteStepperItemKeyEvent",7),this.calciteStepperItemSelect=e(this,"calciteStepperItemSelect",7),this.calciteStepperItemRegister=e(this,"calciteStepperItemRegister",7),this.active=!1,this.complete=!1,this.error=!1,this.disabled=!1,this.icon=!1,this.numbered=!1,this.scale="m"}disabledWatcher(){this.registerStepperItem()}componentWillLoad(){this.icon=a(this.el,"icon",!1),this.numbered=a(this.el,"numbered",!1),this.layout=a(this.el,"layout",!1),this.scale=a(this.el,"scale","m")}componentDidLoad(){this.itemPosition=this.getItemPosition(),this.itemContent=this.getItemContent(),this.registerStepperItem(),this.active&&this.emitRequestedItem()}componentDidUpdate(){this.active&&this.emitRequestedItem()}render(){const t=o(this.el);return i(s,{dir:t,tabindex:this.disabled?null:0,"aria-expanded":this.active.toString(),onClick:()=>this.emitRequestedItem()},i("div",{class:"stepper-item-header"},this.icon?this.setIcon():null,this.numbered?i("div",{class:"stepper-item-number"},this.getItemPosition()+1,"."):null,i("div",{class:"stepper-item-header-text"},i("span",{class:"stepper-item-title"},this.itemTitle),i("span",{class:"stepper-item-subtitle"},this.itemSubtitle))),i("div",{class:"stepper-item-content"},i("slot",null)))}keyDownHandler(t){if(!this.disabled&&t.target===this.el)switch(c(t.key)){case" ":case"Enter":this.emitRequestedItem(),t.preventDefault();break;case"ArrowUp":case"ArrowDown":case"ArrowLeft":case"ArrowRight":case"Home":case"End":this.calciteStepperItemKeyEvent.emit({item:t}),t.preventDefault()}}updateActiveItemOnChange(t){this.activePosition=t.detail.position,this.determineActiveItem()}setIcon(){return i("calcite-icon",{icon:this.active?"circleF":this.error?"exclamationMarkCircleF":this.complete?"checkCircleF":"circle",scale:"s",class:"stepper-item-icon"})}determineActiveItem(){this.active=!this.disabled&&this.itemPosition===this.activePosition}registerStepperItem(){this.calciteStepperItemRegister.emit({position:this.itemPosition,content:this.itemContent})}emitRequestedItem(){this.disabled||this.calciteStepperItemSelect.emit({position:this.itemPosition,content:this.itemContent})}getItemContent(){var t;return(null===(t=this.el.shadowRoot)||void 0===t?void 0:t.querySelector("slot"))?this.el.shadowRoot.querySelector("slot").assignedNodes({flatten:!0}):this.el.querySelector(".stepper-item-content")?this.el.querySelector(".stepper-item-content"):null}getItemPosition(){return Array.prototype.indexOf.call(this.el.parentElement.querySelectorAll("calcite-stepper-item"),this.el)}get el(){return r(this)}static get watchers(){return{disabled:["disabledWatcher"]}}};n.style=":host([hidden]){display:none}:host([scale=s]){--calcite-stepper-item-spacing-unit-s:0.1875rem;--calcite-stepper-item-spacing-unit-m:0.375rem;--calcite-stepper-item-spacing-unit-l:0.75rem;font-size:0.875rem;line-height:1.5}:host([scale=m]){--calcite-stepper-item-spacing-unit-s:0.25rem;--calcite-stepper-item-spacing-unit-m:0.5rem;--calcite-stepper-item-spacing-unit-l:1rem;font-size:0.9375rem;line-height:1.5}:host([scale=l]){--calcite-stepper-item-spacing-unit-s:0.375rem;--calcite-stepper-item-spacing-unit-m:0.75rem;--calcite-stepper-item-spacing-unit-l:1.5rem;font-size:1rem;line-height:1.5}:host-context([theme=dark]){--calcite-ui-blue-1:#00A0FF;--calcite-ui-blue-2:#0087D7;--calcite-ui-blue-3:#47BBFF;--calcite-ui-green-1:#36DA43;--calcite-ui-green-2:#11AD1D;--calcite-ui-green-3:#44ED51;--calcite-ui-yellow-1:#FFC900;--calcite-ui-yellow-2:#F4B000;--calcite-ui-yellow-3:#FFE24D;--calcite-ui-red-1:#FE583E;--calcite-ui-red-2:#F3381B;--calcite-ui-red-3:#FF7465;--calcite-ui-background:#202020;--calcite-ui-foreground-1:#2b2b2b;--calcite-ui-foreground-2:#353535;--calcite-ui-foreground-3:#404040;--calcite-ui-text-1:#ffffff;--calcite-ui-text-2:#bfbfbf;--calcite-ui-text-3:#9f9f9f;--calcite-ui-border-1:#4a4a4a;--calcite-ui-border-2:#404040;--calcite-ui-border-3:#353535;--calcite-ui-border-4:#757575;--calcite-ui-border-5:#9f9f9f}:host{display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;color:var(--calcite-ui-text-3);-webkit-transition:150ms ease-in-out;transition:150ms ease-in-out;text-decoration:none;outline:none;position:relative;border-top:3px solid var(--calcite-ui-border-3);cursor:pointer;margin-right:var(--calcite-stepper-item-spacing-unit-l)}:host([dir=rtl]){margin-left:var(--calcite-stepper-item-spacing-unit-l);margin-right:0}:host{outline-offset:0;outline-color:transparent;-webkit-transition:outline-offset 100ms ease-in-out, outline-color 100ms ease-in-out;transition:outline-offset 100ms ease-in-out, outline-color 100ms ease-in-out}:host(:focus){outline:2px solid var(--calcite-ui-blue-1);outline-offset:2px}:host .stepper-item-header{display:-ms-flexbox;display:flex;-ms-flex-direction:var(--calcite-stepper-item-flex-direction);flex-direction:var(--calcite-stepper-item-flex-direction);-ms-flex-align:start;align-items:flex-start;cursor:pointer}:host .stepper-item-content,:host .stepper-item-header{padding:var(--calcite-stepper-item-spacing-unit-l) var(--calcite-stepper-item-spacing-unit-m);padding-left:0;-webkit-transition:150ms ease-in-out;transition:150ms ease-in-out;text-align:left}:host([dir=rtl]) .stepper-item-content,:host([dir=rtl]) .stepper-item-header{padding-left:initial;padding-right:0;text-align:right}:host .stepper-item-header *{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-webkit-transition:150ms ease-in-out;transition:150ms ease-in-out}:host .stepper-item-content{-ms-flex-direction:column;flex-direction:column;width:100%;display:none}:host .stepper-item-icon{margin-right:var(--calcite-stepper-item-spacing-unit-l);margin-top:var(--calcite-stepper-item-spacing-unit-s);color:var(--calcite-ui-text-3);opacity:0.5;height:12px;display:-ms-inline-flexbox;display:inline-flex;-ms-flex-negative:0;flex-shrink:0;-ms-flex-item-align:start;align-self:flex-start;-webkit-transition:150ms ease-in-out;transition:150ms ease-in-out}:host([dir=rtl]) .stepper-item-icon{margin-left:var(--calcite-stepper-item-spacing-unit-l);margin-right:0}:host .stepper-item-header-text{margin-right:auto;-ms-flex-direction:column;flex-direction:column;text-align:initial}:host([dir=rtl]) .stepper-item-header-text{margin-left:auto;margin-right:0}:host .stepper-item-title,:host .stepper-item-subtitle{display:-ms-flexbox;display:flex;width:100%}:host .stepper-item-title{color:var(--calcite-ui-text-2);font-weight:500}:host .stepper-item-subtitle{color:var(--calcite-ui-text-3)}:host([dir=rtl]) .stepper-item-title{margin-right:0;margin-left:auto}:host .stepper-item-number{font-weight:bold;color:var(--calcite-ui-text-3);margin-right:var(--calcite-stepper-item-spacing-unit-l);-webkit-transition:150ms ease-in-out;transition:150ms ease-in-out}:host([dir=rtl]) .stepper-item-number{margin-left:var(--calcite-stepper-item-spacing-unit-l);margin-right:initial}:host([disabled]){opacity:0.4}:host([disabled]),:host([disabled]) *{cursor:not-allowed;pointer-events:none}:host([complete]){border-top-color:rgba(0, 122, 194, 0.5)}:host([complete]) .stepper-item-icon{color:var(--calcite-ui-blue-1)}:host([error]){border-top-color:var(--calcite-ui-red-1)}:host([error]) .stepper-item-number{color:var(--calcite-ui-red-1)}:host([error]) .stepper-item-icon{color:var(--calcite-ui-red-1);opacity:1}:host(:hover:not([disabled]):not([active])),:host(:focus:not([disabled]):not([active])){border-top-color:rgba(0, 122, 194, 0.75)}:host(:hover:not([disabled]):not([active])) .stepper-item-title,:host(:focus:not([disabled]):not([active])) .stepper-item-title{color:var(--calcite-ui-text-1)}:host(:hover:not([disabled]):not([active])) .stepper-item-subtitle,:host(:focus:not([disabled]):not([active])) .stepper-item-subtitle{color:var(--calcite-ui-text-2)}:host([error]:hover:not([disabled]):not([active])),:host([error]:focus:not([disabled]):not([active])){border-top-color:rgba(216, 48, 32, 0.75)}:host([active]){border-top-color:var(--calcite-ui-blue-1)}:host([active]) .stepper-item-title{color:var(--calcite-ui-text-1)}:host([active]) .stepper-item-subtitle{color:var(--calcite-ui-text-2)}:host([active]) .stepper-item-number{color:var(--calcite-ui-blue-1)}:host([active]) .stepper-item-icon{color:var(--calcite-ui-blue-1);opacity:1}:host([layout=vertical]){-ms-flex:1 1 auto;flex:1 1 auto;border-top:0;border-left:3px solid var(--calcite-ui-border-3);padding:0 0 0 var(--calcite-stepper-item-spacing-unit-l);margin:0 0 var(--calcite-stepper-item-spacing-unit-m) 0}:host([layout=vertical]) .stepper-item-icon{margin:var(--calcite-stepper-item-spacing-unit-m) 0 0 auto;padding-left:var(--calcite-stepper-item-spacing-unit-l);-ms-flex-order:3;order:3}:host([layout=vertical]) .stepper-item-header{padding-right:0}:host([layout=vertical]) .stepper-item-content{padding:0}:host([layout=vertical][active]) .stepper-item-content{display:-ms-flexbox;display:flex}:host([layout=vertical][active]) .stepper-item-content ::slotted(:last-child){margin-bottom:var(--calcite-stepper-item-spacing-unit-l)}:host([layout=vertical][dir=rtl]){border-left:0;border-right:3px solid var(--calcite-ui-border-3);padding:0 var(--calcite-stepper-item-spacing-unit-l) 0 0}:host([layout=vertical][dir=rtl]) .stepper-item-icon{margin:var(--calcite-stepper-item-spacing-unit-m) auto 0 0;padding-left:0;padding-right:var(--calcite-stepper-item-spacing-unit-l)}:host([layout=vertical][dir=rtl]) .stepper-item-header{padding-left:0;padding-right:intial}:host([layout=vertical][complete]){border-color:rgba(0, 122, 194, 0.5)}:host([layout=vertical][error]){border-color:var(--calcite-ui-red-1)}:host([layout=vertical][active]){border-color:var(--calcite-ui-blue-1)}:host([layout=vertical]:hover:not([disabled]):not([active])),:host([layout=vertical]:focus:not([disabled]):not([active])){border-color:rgba(0, 122, 194, 0.75)}:host([layout=vertical][error]:hover:not([disabled]):not([active])),:host([layout=vertical][error]:focus:not([disabled]):not([active])){border-color:rgba(216, 48, 32, 0.75)}";export{l as calcite_stepper,n as calcite_stepper_item}