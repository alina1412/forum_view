var USE_RTE=0;var Debug={write:function(text){if(jsDebug&&!Object.isUndefined(window.console)){console.log(text);}},dir:function(values){if(jsDebug&&!Object.isUndefined(window.console)&&!Prototype.Browser.IE&&!Prototype.Browser.Opera){console.dir(values);}},error:function(text){if(jsDebug&&!Object.isUndefined(window.console)){console.error(text);}},warn:function(text){if(jsDebug&&!Object.isUndefined(window.console)){console.warn(text);}},info:function(text){if(jsDebug&&!Object.isUndefined(window.console)){console.info(text);}}};Prototype.Browser.IE6=Prototype.Browser.IE&&parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==6;Prototype.Browser.IE7=Prototype.Browser.IE&&parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==7;Prototype.Browser.IE8=Prototype.Browser.IE&&parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==8;Prototype.Browser.IE9=Prototype.Browser.IE&&parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==9;Prototype.Browser.Chrome=Prototype.Browser.WebKit&&(navigator.userAgent.indexOf('Chrome/')>-1);if(!String.prototype.trim)
{String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,'');};}
function isBody(element){return element.nodeName.toUpperCase()==='BODY';}
function isHtml(element){return element.nodeName.toUpperCase()==='HTML';}
function isDocument(element){return element.nodeType===Node.DOCUMENT_NODE;}
function isDetached(element){return element!==document.body&&!Element.descendantOf(element,document.body);}
Element.Methods.getOffsetParent=function(element){element=$(element);if(isDocument(element)||isDetached(element)||isBody(element)||isHtml(element))
return $(document.body);if(Prototype.Browser.IE){if(element.offsetParent&&element.offsetParent!=document.body&&Element.getStyle(element.offsetParent,'position')!='static')return $(element.offsetParent);if(element==document.body)return $(element);}else{var isInline=(Element.getStyle(element,'display')==='inline');if(!isInline&&element.offsetParent&&Element.getStyle(element.offsetParent,'position')!='static')return $(element.offsetParent);}
while((element=element.parentNode)&&element!==document.body){if(Element.getStyle(element,'position')!=='static'){return isHtml(element)?$(document.body):$(element);}}
return $(document.body);}
window.IPBoard=Class.create({namePops:[],topicPops:[],vars:[],lang:[],templates:[],editors:$A(),initDone:false,initialize:function()
{Debug.write("IPB js is loading...");document.observe("dom:loaded",function(){this.Cookie.init();Ajax.Responders.register({onLoading:function(handler){if(!Object.isUndefined(handler['options']['hideLoader'])&&handler['options']['hideLoader']!=false){return;}
if(!$('ajax_loading')){if(!ipb.templates['ajax_loading']){return;}
$('ipboard_body').insert(ipb.templates['ajax_loading']);}
var effect=new Effect.Appear($('ajax_loading'),{duration:0.2});},onComplete:function(){if(!$('ajax_loading')||!$('ajax_loading').visible()){return;}
var effect=new Effect.Fade($('ajax_loading'),{duration:0.2});if(!Object.isUndefined(ipb.hoverCard)){ipb.hoverCardRegister.postAjaxInit();}
$$("[data-clicklaunch]").invoke('clickLaunch');ipb.global.parseQuoteBoxes();ipb.global.removeLinkedLightbox();},onSuccess:function(){if(!Object.isUndefined(ipb.hoverCard)){ipb.hoverCardRegister.postAjaxInit();}},onFailure:function(t)
{if(!$('ajax_loading')||!$('ajax_loading').visible()){return;}
var effect=new Effect.Fade($('ajax_loading'),{duration:0.2});if(!Object.isUndefined(ipb.global))
{ipb.global.showInlineNotification(ipb.lang['ajax_failure']);}},onException:function(t,exception)
{if(!$('ajax_loading')||!$('ajax_loading').visible()){return;}
var effect=new Effect.Fade($('ajax_loading'),{duration:0.2});Debug.error(exception);if(!Object.isUndefined(ipb.global))
{}}});ipb.delegate.initialize();ipb.initDone=true;}.bind(this));},positionCenter:function(elem,dir)
{if(!$(elem)){return;}
elem_s=$(elem).getDimensions();window_s=document.viewport.getDimensions();window_offsets=document.viewport.getScrollOffsets();center={left:((window_s['width']-elem_s['width'])/2),top:((window_s['height']-elem_s['height'])/2)};if(typeof(dir)=='undefined'||(dir!='h'&&dir!='v'))
{$(elem).setStyle('top: '+center['top']+'px; left: '+center['left']+'px');}
else if(dir=='h')
{$(elem).setStyle('left: '+center['left']+'px');}
else if(dir=='v')
{$(elem).setStyle('top: '+center['top']+'px');}
$(elem).setStyle('position: fixed');},showModal:function()
{if(!$('ipb_modal'))
{this.createModal();}
this.modal.show();},hideModal:function()
{if(!$('ipb_modal')){return;}
this.modal.hide();},createModal:function()
{this.modal=new Element('div',{id:'ipb_modal'}).hide().addClassName('modal');this.modal.setStyle("width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; overflow: hidden; z-index: 1000; opacity: 0.2");$('ipboard_body').insert({bottom:this.modal});},editorInsert:function(content,editorid)
{if(!editorid){var editor=ipb.textEditor.getEditor();}else{var editor=ipb.textEditor.getEditor(editorid);}
if(Object.isUndefined(editor))
{var editor=ipb.textEditor.getEditor();}
editor.insert(content);}});IPBoard.prototype.delegate={store:$A(),initialize:function()
{document.observe('click',function(e){if(Event.isLeftClick(e)||Prototype.Browser.IE||ipb.vars['is_touch'])
{var elem=null;var handler=null;var target=ipb.delegate.store.find(function(item){elem=e.findElement(item['selector']);if(elem){handler=item;return true;}else{return false;}});if(!Object.isUndefined(target))
{if(handler)
{Debug.write("Firing callback for selector "+handler['selector']);handler['callback'](e,elem,handler['params']);}}}});},register:function(selector,callback,params)
{ipb.delegate.store.push({selector:selector,callback:callback,params:params});}};IPBoard.prototype.Cookie={store:[],initDone:false,set:function(name,value,sticky)
{var expires='';var path='/';var domain='';if(!name)
{return;}
if(sticky)
{if(sticky==1)
{expires="; expires=Wed, 1 Jan 2020 00:00:00 GMT";}
else if(sticky==-1)
{expires="; expires=Thu, 01-Jan-1970 00:00:01 GMT";}
else if(sticky.length>10)
{expires="; expires="+sticky;}}
if(ipb.vars['cookie_domain'])
{domain="; domain="+ipb.vars['cookie_domain'];}
if(ipb.vars['cookie_path'])
{path=ipb.vars['cookie_path'];}
document.cookie=ipb.vars['cookie_id']+name+"="+escape(value)+"; path="+path+expires+domain+';';ipb.Cookie.store[name]=value;Debug.write("Set cookie: "+ipb.vars['cookie_id']+name+"="+value+"; path="+path+expires+domain+';');},get:function(name)
{if(ipb.Cookie.initDone!==true)
{ipb.Cookie.init();}
if(ipb.Cookie.store[name])
{return ipb.Cookie.store[name];}
return'';},doDelete:function(name)
{Debug.write("Deleting cookie "+name);ipb.Cookie.set(name,'',-1);},init:function()
{if(ipb.Cookie.initDone)
{return true;}
skip=['session_id','ipb_admin_session_id','member_id','pass_hash'];cookies=$H(document.cookie.replace(" ",'').toQueryParams(";"));if(cookies)
{cookies.each(function(cookie){cookie[0]=cookie[0].strip();if(ipb.vars['cookie_id']!='')
{if(!cookie[0].startsWith(ipb.vars['cookie_id']))
{return;}
else
{cookie[0]=cookie[0].replace(ipb.vars['cookie_id'],'');}}
if(skip[cookie[0]])
{return;}
else
{ipb.Cookie.store[cookie[0]]=unescape(cookie[1]||'');Debug.write("Loaded cookie: "+cookie[0]+" = "+cookie[1]);}});}
ipb.Cookie.initDone=true;}};IPBoard.prototype.validate={isFilled:function(elem)
{if(!$(elem)){return null;}
return!$F(elem).blank();},isNumeric:function(elem)
{if(!$(elem)){return null;}
return $F(elem).match(/^[\d]+?$/);},isMatching:function(elem1,elem2)
{if(!$(elem1)||!$(elem2)){return null;}
return $F(elem1)==$F(elem2);},email:function(elem)
{if(!$(elem)){return null;}
if($F(elem).match(/^.+@.+\..{2,4}$/)){return true;}else{return false;}}};IPBoard.prototype.Autocomplete=Class.create({initialize:function(id,options)
{this.id=$(id).id;this.timer=null;this.last_string='';this.internal_cache=$H();this.pointer=0;this.items=$A();this.observing=true;this.objHasFocus=null;this.options=Object.extend({min_chars:3,multibox:false,global_cache:false,goToUrl:false,classname:'ipb_autocomplete',templates:{wrap:new Template("<ul id='#{id}'></ul>"),item:new Template("<li id='#{id}' data-url='#{url}'>#{itemvalue}</li>")}},arguments[1]||{});if(!$(this.id)){Debug.error("Invalid textbox ID");return false;}
this.obj=$(this.id);if(!this.options.url)
{Debug.error("No URL specified for autocomplete");return false;}
$(this.obj).writeAttribute('autocomplete','off');this.buildList();$(this.obj).observe('focus',this.timerEventFocus.bindAsEventListener(this));$(this.obj).observe('blur',this.timerEventBlur.bindAsEventListener(this));$(this.obj).observe('keydown',this.eventKeypress.bindAsEventListener(this));},eventKeypress:function(e)
{if(![Event.KEY_TAB,Event.KEY_UP,Event.KEY_DOWN,Event.KEY_LEFT,Event.KEY_RIGHT,Event.KEY_RETURN].include(e.keyCode)){return;}
console.log(e.shiftKey);if(e.shiftKey===true){return;}
if($(this.list).visible())
{switch(e.keyCode)
{case Event.KEY_TAB:case Event.KEY_RETURN:this.selectCurrentItem(e);break;case Event.KEY_UP:case Event.KEY_LEFT:this.selectPreviousItem(e);break;case Event.KEY_DOWN:case Event.KEY_RIGHT:this.selectNextItem(e);break;}
Event.stop(e);}},selectCurrentItem:function(e)
{var current=$(this.list).down('.active');this.unselectAll();if(!Object.isUndefined(current))
{var itemid=$(current).id.replace(this.id+'_ac_item_','');if(!itemid){return;}
if(this.options.goToUrl&&$(current).readAttribute('data-url'))
{window.location=$(current).readAttribute('data-url');return false;}
var value=this.items[itemid].replace('&amp;','&').replace(/&#39;/g,"'").replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&#33;/g,'!');if(this.options.multibox)
{if($F(this.obj).indexOf(',')!==-1)
{var pieces=$F(this.obj).split(',');pieces[pieces.length-1]='';$(this.obj).value=pieces.join(',')+' ';}
else
{$(this.obj).value='';$(this.obj).focus();}
$(this.obj).value=$F(this.obj)+value+', ';}
else
{$(this.obj).value=value;var effect=new Effect.Fade($(this.list),{duration:0.3});}}
$(this.obj).focus();if(Prototype.Browser.IE)
{if($(this.obj).createTextRange)
{var r=$(this.obj).createTextRange();r.moveStart("character",$(this.obj).value.length);r.select();}}},selectThisItem:function(e)
{this.unselectAll();var items=$(this.list).immediateDescendants();var elem=Event.element(e);while(!items.include(elem))
{elem=elem.up();}
$(elem).addClassName('active');},selectPreviousItem:function(e)
{var current=$(this.list).down('.active');this.unselectAll();if(Object.isUndefined(current))
{this.selectFirstItem();}
else
{var prev=$(current).previous();if(prev){$(prev).addClassName('active');}
else
{this.selectLastItem();}}},selectNextItem:function(e)
{var current=$(this.list).down('.active');this.unselectAll();if(Object.isUndefined(current)){this.selectFirstItem();}
else
{var next=$(current).next();if(next){$(next).addClassName('active');}
else
{this.selectFirstItem();}}},selectFirstItem:function()
{if(!$(this.list).visible()){return;}
this.unselectAll();$(this.list).firstDescendant().addClassName('active');},selectLastItem:function()
{if(!$(this.list).visible()){return;}
this.unselectAll();var d=$(this.list).immediateDescendants();var l=d[d.length-1];if(l)
{$(l).addClassName('active');}},unselectAll:function()
{$(this.list).childElements().invoke('removeClassName','active');},timerEventBlur:function(e)
{window.clearTimeout(this.timer);this.eventBlur.bind(this).delay(0.6,e);},timerEventFocus:function(e)
{this.timer=this.eventFocus.bind(this).delay(0.4,e);},eventBlur:function(e)
{this.objHasFocus=false;if($(this.list).visible())
{var effect=new Effect.Fade($(this.list),{duration:0.3});}},eventFocus:function(e)
{if(!this.observing){Debug.write("Not observing keypress");return;}
this.objHasFocus=true;this.timer=this.eventFocus.bind(this).delay(0.6,e);var curValue=this.getCurrentName();if(curValue==this.last_string){return;}
if(curValue.length<this.options.min_chars){if($(this.list).visible())
{var effect=new Effect.Fade($(this.list),{duration:0.3,afterFinish:function(){$(this.list).update();}.bind(this)});}
return;}
this.last_string=curValue;json=this.cacheRead(curValue);if(json==false){var request=new Ajax.Request(this.options.url+encodeURIComponent(curValue),{method:'get',evalJSON:'force',onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON))
{Debug.error("Invalid response returned from the server");return;}
if(t.responseJSON['error'])
{switch(t.responseJSON['error'])
{case'requestTooShort':Debug.warn("Server said request was too short, skipping...");break;default:Debug.error("Server returned an error: "+t.responseJSON['error']);break;}
return false;}
if(t.responseText!="[]")
{this.cacheWrite(curValue,t.responseJSON);this.updateAndShow(t.responseJSON);}}.bind(this)});}
else
{this.updateAndShow(json);}},updateAndShow:function(json)
{if(!json){return;}
this.updateList(json);if(!$(this.list).visible()&&this.objHasFocus)
{Debug.write("Showing");var effect=new Effect.Appear($(this.list),{duration:0.3,afterFinish:function(){this.selectFirstItem();}.bind(this)});}},cacheRead:function(value)
{if(this.options.global_cache!=false)
{if(!Object.isUndefined(this.options.global_cache.get(value))){Debug.write("Read from global cache");return this.options.global_cache.get(value);}}
else
{if(!Object.isUndefined(this.internal_cache.get(value))){Debug.write("Read from internal cache");return this.internal_cache.get(value);}}
return false;},cacheWrite:function(key,value)
{if(this.options.global_cache!==false){this.options.global_cache.set(key,value);}else{this.internal_cache.set(key,value);}
return true;},getCurrentName:function()
{if(this.options.multibox)
{if($F(this.obj).indexOf(',')===-1){return $F(this.obj).strip();}
else
{var pieces=$F(this.obj).split(',');var lastPiece=pieces[pieces.length-1];return lastPiece.strip();}}
else
{return $F(this.obj).strip();}},buildList:function()
{if($(this.id+'_ac'))
{return;}
var finalPos={};var sourcePos=$(this.id).viewportOffset();var sourceDim=$(this.id).getDimensions();var delta=[0,0];var parent=null;var screenScroll=document.viewport.getScrollOffsets();var ul=this.options.templates.wrap.evaluate({id:this.id+'_ac'});var test=$(this.id).up('.popupWrapper');if(!Object.isUndefined(test)&&test.getStyle('position')=='fixed')
{$(this.id).up().insert({bottom:ul});parent=$(this.id).getOffsetParent();delta=[parseInt(parent.getStyle('left')/2),parseInt(parent.getStyle('top')/2)];finalPos['left']=delta[0];finalPos['top']=delta[1]+screenScroll.top;$(this.id+'_ac').setStyle({'zIndex':10002});}
else
{$$('body')[0].insert({bottom:ul});if(Element.getStyle($(this.id),'position')=='absolute')
{parent=$(this.id).getOffsetParent();delta=[parseInt(parent.getStyle('left')),parseInt(parent.getStyle('top'))];}
finalPos['left']=sourcePos[0]-delta[0];finalPos['top']=sourcePos[1]-delta[1]+screenScroll.top;}
finalPos['top']=finalPos['top']+sourceDim.height;$(this.id+'_ac').setStyle('position: absolute; top: '+finalPos['top']+'px; left: '+finalPos['left']+'px;').hide();this.list=$(this.id+'_ac');},updateList:function(json)
{if(!json||!$(this.list)){return;}
var newitems='';this.items=$A();json=$H(json);json.each(function(item)
{var li=this.options.templates.item.evaluate({id:this.id+'_ac_item_'+item.key,itemid:item.key,itemvalue:item.value['showas']||item.value['name'],img:item.value['img']||'',img_w:item.value['img_w']||'',img_h:item.value['img_h']||'',url:item.value['url']||''});this.items[item.key]=item.value['name'];newitems=newitems+li;}.bind(this));$(this.list).update(newitems);$(this.list).immediateDescendants().each(function(elem){$(elem).observe('mouseover',this.selectThisItem.bindAsEventListener(this));$(elem).observe('click',this.selectCurrentItem.bindAsEventListener(this));$(elem).setStyle('cursor: pointer');}.bind(this));if($(this.list).visible())
{this.selectFirstItem();}}});getQueryStringParamByName=function(name)
{name=name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var regexS="[\\?&]"+name+"=([^&#]*)";var regex=new RegExp(regexS);var results=regex.exec(window.location.search);if(results==null)
{return"";}
else
{return decodeURIComponent(results[1].replace(/\+/g," "));}};Object.extend(RegExp,{escape:function(text)
{if(!arguments.callee.sRE)
{var specials=['/','.','*','+','?','|','(',')','[',']','{','}','\\','$'];arguments.callee.sRE=new RegExp('(\\'+specials.join('|\\')+')','g');}
return text.replace(arguments.callee.sRE,'\\$1');}});String.prototype.regExpEscape=function()
{var text=this;return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");};String.prototype.escapeHtml=function()
{return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");};String.prototype.unEscapeHtml=function()
{var _t=this.replace(/&amp;/g,"&");return _t.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&#39;/g,"'");};String.prototype.encodeUrl=function()
{var text=this;var regcheck=text.match(/[\x90-\xFF]/g);if(regcheck)
{for(var i=0;i<regcheck.length;i++)
{text=text.replace(regcheck[i],'%u00'+(regcheck[i].charCodeAt(0)&0xFF).toString(16).toUpperCase());}}
return escape(text).replace(/\+/g,"%2B").replace(/%20/g,'+').replace(/\*/g,'%2A').replace(/\//g,'%2F').replace(/@/g,'%40');};String.prototype.encodeParam=function()
{var text=this;var regcheck=text.match(/[\x90-\xFF]/g);if(regcheck)
{for(var i=0;i<regcheck.length;i++)
{text=text.replace(regcheck[i],'%u00'+(regcheck[i].charCodeAt(0)&0xFF).toString(16).toUpperCase());}}
return escape(text).replace(/\+/g,"%2B");};Date.prototype.getDateAndTime=function(unix)
{var a=new Date(parseInt(unix)*1000);var months=ipb.lang['gbl_months'].split(',');var year=a.getFullYear();var month=months[a.getMonth()];var date=a.getDate();var hour=a.getHours();var min=a.getMinutes();var sec=a.getSeconds();return{year:year,monthName:month,month:('0'+a.getMonth()+1).slice(-2),date:('0'+date).slice(-2),hour:('0'+hour).slice(-2),min:('0'+min).slice(-2),sec:('0'+sec).slice(-2),dst:a.getTimezoneOffset()};};Date.prototype.getDST=function()
{var beginning=new Date("January 1, 2008");var middle=new Date("July 1, 2008");var difference=middle.getTimezoneOffset()-beginning.getTimezoneOffset();var offset=this.getTimezoneOffset()-beginning.getTimezoneOffset();if(difference!=0)
{if(difference<0)
{return(difference==offset)?1:0;}
else
{return(difference!=offset)?1:0;}}
else
{return 0;}};var Loader={require:function(name)
{document.write("<script type='text/javascript' src='"+name+".js'></script>");},boot:function()
{$A(document.getElementsByTagName("script")).findAll(function(s)
{return(s.src&&s.src.match(/ipb\.js(\?.*)?$/));}).each(function(s){var path=s.src.replace(/ipb\.js(\?.*)?$/,'');var includes=s.src.match(/\?.*load=([a-zA-Z0-9_,\.]*)/);if(!Object.isUndefined(includes)&&includes!=null&&includes[1])
{includes[1].split(',').each(function(include)
{if(include)
{Loader.require(path+"ips."+include);}});}});}};var callback={afterOpen:function(popup){try{$('pj_'+$(elem).identify()+'_input').activate();}
catch(err){}}};Element.addMethods({getInnerText:function(element)
{element=$(element);return element.innerText&&!window.opera?element.innerText:element.innerHTML.stripScripts().unescapeHTML().replace(/[\n\r\s]+/g,' ');},defaultize:function(element,lang)
{if(ipb.global._supportsPlaceholder==null){ipb.global._supportsPlaceholder=(function(){var i=document.createElement('input');return'placeholder'in i;})();}
if(ipb.global._supportsPlaceholder){if($F(element)==lang||$F(element).empty()){$(element).removeClassName('inactive').writeAttribute('placeholder',lang).value='';}}else{if($F(element)==lang||$F(element).empty()){$(element).addClassName('inactive').value=lang;}
$(element).observe('focus',function(e){if($(element).hasClassName('inactive')&&($F(element)==''||$F(element)==lang)){$(element).removeClassName('inactive').value='';}else{$(element).removeClassName('inactive');}}).observe('blur',function(e){if($F(element).empty()){$(element).addClassName('inactive').value=lang;}});var form=$(element).up('form');if(!Object.isUndefined(form)){$(form).observe('submit',function(e){if($(element).hasClassName('inactive')){$(element).value='';}});}}},clickLaunch:function(element)
{var _callback=$(element).readAttribute("data-clicklaunch");var _scope='global';try{var _try=$(element).readAttribute("data-scope");_scope=(_try)?_try.replace("ipb.",''):_scope;}catch(e){};if($(element).retrieve('clickevent')){try{$(element).retrieve('clickevent').stop();}catch(err){};}
var click=$(element).on('click',function(e){Event.stop(e);ipb[_scope][_callback](element,e);});$(element).store('clickevent',click);},confirmAction:function(element,callback)
{var _text=$(element).readAttribute("data-confirmaction");var _ok='';if(callback)
{_ok=callback;}
else if(element.tagName=='FORM')
{_ok="$('"+element.id+"').submit()";}
else
{_ok='window.location=\''+element.readAttribute('href')+'\'';}
if(!_text||_text=='true')
{_text=ipb.lang['gbl_confirm_desc'];}
var _options={type:'pane',modal:true,initial:'<div><h3>'+ipb.lang['gbl_confirm_text']+'</h3><div class="ipsPad ipsForm_center"><p>'+_text+'</p><br /><span onclick="ipb.global.popups[\'conact\'].hide();" class="clickable ipsButton_secondary important">'+ipb.lang['gbl_confirm_cancel']+'</span> &nbsp; <span onclick="'+_ok+'" class="clickable ipsButton_secondary">'+ipb.lang['gbl_confirm_ok']+'</span></div>',hideAtStart:false,w:'300px',h:150};if(element.tagName=='FORM'||callback)
{if(!Object.isUndefined(ipb.global.popups['conact']))
{ipb.global.popups['conact'].kill();}
ipb.global.popups['conact']=new ipb.Popup('confirm',_options);}
else
{$(element).on('click',function(e)
{Event.stop(e);if(!Object.isUndefined(ipb.global.popups['conact']))
{ipb.global.popups['conact'].kill();}
ipb.global.popups['conact']=new ipb.Popup('confirm',_options);});}},tooltip:function(element,options){options=Object.extend({template:new Template("<div class='ipsTooltip' id='#{id}' style='display: none'><div class='ipsTooltip_inner'>#{content}</div></div>"),position:'auto',content:$(element).readAttribute("data-tooltip").stripTags().escapeHTML(),animate:true,overrideBrowser:true,delay:0.4},options);var show=function(e){if(options.delay&&!options._still_going){return;}
if(!options.content){return;}
var id=$(element).identify();if(!$(id+'_tooltip')){$(document.body).insert({'bottom':options.template.evaluate({'id':id+'_tooltip','content':options.content})});}
if(options.overrideBrowser&&$(element).hasAttribute('title')){$(element).writeAttribute("data-title",$(element).readAttribute('title').stripTags().escapeHTML()).writeAttribute("title",false);}
var tooltip=$(id+'_tooltip').setStyle({position:'absolute'});var layout=$(element).getLayout();var position=$(element).cumulativeOffset();var dims=$(id+'_tooltip').getDimensions();var docDim=$(document.body).getLayout();if(options.position=='auto'){if(position.left+(layout.get('padding-box-width')/2)-(dims.width/2)<0){options.position='right';}else if(position.left+(dims.width/2)>docDim.get('width')){options.position='left';}else{options.position='top';}}
Debug.write(dims);switch(options.position){case'top':$(tooltip).setStyle({top:(position.top-dims.height-1)+'px',left:(position.left+(layout.get('padding-box-width')/2)-(dims.width/2))+'px'}).addClassName('top');break;case'bottom':$(tooltip).setStyle({top:(position.top+layout.get('padding-box-height')+1)+'px',left:(position.left+(layout.get('padding-box-width')/2)-(dims.width/2))+'px'}).addClassName('bottom');break;case'left':$(tooltip).setStyle({top:(position.top-(layout.get('padding-box-height')/2))+'px',left:(position.left-dims.width-3)+'px'}).addClassName('left');break;case'right':$(tooltip).setStyle({top:(position.top-(layout.get('padding-box-height')/2))+'px',left:(position.left+layout.get('padding-box-width')-3)+'px'}).addClassName('right');break;}
if(options.animate){new Effect.Appear($(tooltip),{duration:0.3,queue:'end'});}else{$(tooltip).show();}},hide=function(e){var id=$(element).identify();if(!$(id+'_tooltip')){return;}
if(options.animate){new Effect.Fade($(id+'_tooltip'),{duration:0.2,queue:'end'});}else{$(id+'_tooltip').hide();}};$(element).observe("mouseenter",function(e){if(options.delay){options._still_going=true;show.delay(options.delay,e);}else{show(e);}}).observe("click",function(e){options._still_going=false;hide();}).observe("mouseleave",function(e)
{options._still_going=false;hide();});}});var _global=window.IPBoard;_global.prototype.global={searchTimer:[],searchLastQuery:'',rssItems:[],reputation:{},popups:{},ac_cache:$H(),pageJumps:$H(),pageJumpMenus:$H(),boardMarkers:$H(),searchResults:$H(),tidPopOpen:0,activeTab:'forums',userCards:null,inlineNotification:{timers:[]},_supportsPlaceholder:null,init:function()
{Debug.write("Initializing ips.global.js");document.observe("dom:loaded",function(){ipb.global.initEvents();});},initEvents:function()
{ipb.delegate.register(".warn_link",ipb.global.displayWarnLogs);ipb.delegate.register(".mini_friend_toggle",ipb.global.toggleFriend);ipb.delegate.register(".__topic_preview",ipb.global.topicPreview);ipb.delegate.register('.bbc_spoiler_show',ipb.global.toggleSpoiler);ipb.delegate.register('a[rel~="external"]',ipb.global.openNewWindow,'force');ipb.delegate.register('._repLikeMore',ipb.global.repLikeMore);ipb.delegate.register('a[rel~="quickNavigation"]',ipb.global.openQuickNavigation);if($('sign_in')&&!$('sign_in').hasClassName('no_ajax')){$('sign_in').on('click',ipb.global.inlineSignin);}
if($('rss_feed')){ipb.global.buildRSSmenu();}
if(!Object.isUndefined(ipb.vars['notificationData']))
{new ipb.Popup('navigation_popup',{type:'modal',initial:ipb.templates['notificationTemplate'].evaluate(ipb.vars['notificationData']),hideAtStart:false,w:'600px',h:250});}
if($('backtotop')){$('backtotop').observe("click",function(e){Event.stop(e);window.scroll(0,0);});}
ipb.global.buildPageJumps();ipb.global.initUserCards();if(!Object.isUndefined(ipb.templates['inlineMsg'])&&ipb.templates['inlineMsg']!=''){ipb.global.showInlineNotification(ipb.templates['inlineMsg']);}
if($('search-box')){ipb.global.contextualSearch();}
if($('user_link')){new ipb.Menu($('user_link'),$('user_link_menucontent'));}
if($('new_skin')){new ipb.Menu($('new_skin'),$('new_skin_menucontent'));}
if($('new_language')){new ipb.Menu($('new_language'),$('new_language_menucontent'));}
if($('mark_all_read')){new ipb.Menu($('mark_all_read'),$('mark_all_read_menucontent'));}
$$("[data-tooltip]").invoke('tooltip');$$("[data-clicklaunch]").invoke('clickLaunch');$$("[data-confirmaction]").invoke('confirmAction');if($('statusUpdateGlobal')){$('statusUpdateGlobal').defaultize(ipb.lang['global_status_update']);$('statusSubmitGlobal').observe('click',ipb.global.statusUpdated);}
ipb.global.parseQuoteBoxes();ipb.global.removeLinkedLightbox();$$('a.resized_img').each(function(elem)
{if($(elem).previous('a.bbc_url'))
{var test=$(elem).previous('a.bbc_url');if(!test.innerHTML.length)
{$(elem).writeAttribute('href',test.href);$(elem).writeAttribute('rel',test.rel);test.remove();}}});if(!Object.isUndefined(ipb.hoverCard)&&ipb.vars['is_touch']===false)
{var ajaxUrl=ipb.vars['base_url']+"app=core&module=ajax&section=tags&do=getTagsAsPopUp&md5check="+ipb.vars['secure_hash'];ipb.hoverCardRegister.initialize('tagsPopUp',{'w':'500px','delay':750,'position':'auto','ajaxUrl':ajaxUrl,'getId':true,'setIdParam':'key'});}},parseQuoteBoxes:function()
{$$('blockquote.ipsBlockquote').each(function(el)
{if(!$(el).hasClassName('built'))
{var author='';var cid='';var time=0;var date='';var collapsed=0;var _extra='';var _a=new Element('span');try{author=$(el).getAttribute('data-author')?$(el).getAttribute('data-author').escapeHtml():'';cid=$(el).getAttribute('data-cid')?$(el).getAttribute('data-cid').escapeHtml():'';time=$(el).getAttribute('data-time')?$(el).getAttribute('data-time').escapeHtml():0;date=$(el).getAttribute('data-date')?$(el).getAttribute('data-date').escapeHtml():'';collapsed=$(el).getAttribute('data-collapsed')?$(el).getAttribute('data-collapsed').escapeHtml():0;}catch(aCold){}
if(time)
{if(time==parseInt(time)&&time.length==10)
{if(parseInt(ipb.vars['time_adjust'])==ipb.vars['time_adjust'])
time=parseInt(time)+parseInt(ipb.vars['time_adjust'])*60;var _tz=new Date().getTimezoneOffset()*60;var _date=new Date().getDateAndTime(parseInt(time));if(_date['dst']*60!=_tz)
{_tz=_tz-_date['dst']*60;_date=new Date().getDateAndTime(parseInt(time)-parseInt(_tz));}
var _ampm='';if(ipb.vars['hour_format']=="12")
{if(_date['hour']>12)
{_date['hour']-=12;_ampm=' '+ipb.lang['date_pm'];}
else if(_date['hour']==12)
{_ampm=' '+ipb.lang['date_pm'];}
else if(_date['hour']==0)
{_date['hour']=12;_ampm=' '+ipb.lang['date_am'];}
else
{_ampm=' '+ipb.lang['date_am'];}}
date=_date['date']+' '+_date['monthName']+' '+_date['year']+' - '+_date['hour']+':'+_date['min']+_ampm;}}
if(author&&date)
{_extra=ipb.lang['quote__date_author'].replace(/#name#/,author).replace(/#date#/,date);}
else if(author)
{_extra=ipb.lang['quote__author'].replace(/#name#/,author);}
else if(date)
{_extra=ipb.lang['quote_title']+' ('+date+')';}
if(_extra.length==0)
{_extra=ipb.lang['quote_title'];}
if(cid&&parseInt(cid)==cid)
{_a=new Element('a',{'class':'snapback right',rel:'citation',href:ipb.vars['board_url']+'/index.php?app=forums&module=forums&section=findpost&pid='+cid});_a.update(new Element('img',{src:ipb.vars['img_url']+'/snapback.png'}));}
el.insert({before:new Element('p',{'class':'citation'}).update(_extra).insert(_a)});try
{el.down('cite').hide();}
catch(err){}
el.addClassName('built');if(collapsed)
{el.hide();var bq=new Element('blockquote',{'class':'ipsBlockquote built clickable'}).update(ipb.lang['quote_expand']);bq.on('click',function(e,elem)
{el.show();bq.remove();});el.insert({before:bq});}}});},removeLinkedLightbox:function()
{$$('a.bbc_url').each(function(el)
{if(_thislightbox=$(el).down('span[rel~=lightbox]'))
{var contents=$(el).innerHTML.replace('<span rel="lightbox">','');contents=contents.replace('</span>','');$(el).innerHTML=contents;}});},lightBoxIsOff:function()
{$$('span[rel*="lightbox"]').each(function(elem)
{if(!$(elem).down('a'))
{$(elem).down('img').on('click',function(e,el){window.open(el.src);});}});},saveSocialShareDefaults:function(elem,e)
{var services={};$$('._share_x_').each(function(elem){services[elem.id.replace(/share_x_/,'')]=(elem.checked)?1:0;});new Ajax.Request(ipb.vars['base_url']+"app=core&section=sharelinks&module=ajax&do=savePostPrefs&md5check="+ipb.vars['secure_hash'],{method:'post',evalJSON:'force',parameters:services,onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON))
{alert(ipb.lang['action_failed']);return;}
if(!Object.isUndefined(t.responseJSON['error']))
{alert(t.responseJSON['error']);}
else
{}}});},
/*!! statusUpdated */
statusUpdated:function(e)
{Event.stop(e);if($('statusUpdateGlobal').value.length<2||$('statusUpdateGlobal').value==ipb.lang['prof_update_default'])
{return false;}
var su_Twitter=$('su_TwitterGlobal')&&$('su_TwitterGlobal').checked?1:0;var su_Facebook=$('su_FacebookGlobal')&&$('su_FacebookGlobal').checked?1:0;var skin_group=($('statusHook'))?'boards':'profile';new Ajax.Request(ipb.vars['base_url']+"app=members&section=status&module=ajax&do=new&md5check="+ipb.vars['secure_hash']+"&skin_group="+skin_group+"&return=json&smallSpace=1",{method:'post',evalJSON:'force',parameters:{content:$('statusUpdateGlobal').value.encodeParam(),su_Twitter:su_Twitter,su_Facebook:su_Facebook},onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON))
{alert(ipb.lang['action_failed']);return;}
if(t.responseJSON['error'])
{alert(t.responseJSON['error']);}
else
{try{if($('status_wrapper'))
{var memberId=0;try
{memberId=$('status_wrapper').readAttribute('data-member');}
catch(err){}
if(!memberId||(memberId==ipb.vars['member_id']))
{$('status_wrapper').innerHTML=t.responseJSON['html']+$('status_wrapper').innerHTML;if(ipb.status.myLatest)
{if($('statusWrap-'+ipb.status.myLatest))
{$('statusWrap-'+ipb.status.myLatest).hide();}}}}
ipb.menus.closeAll(e,true);ipb.global.showInlineNotification(ipb.lang['status_updated']);$('statusUpdateGlobal').value='';$('statusUpdateGlobal').defaultize(ipb.lang['global_status_update']);}
catch(err)
{Debug.error('Logging error: '+err);}}}});},changeSkin:function(element,e)
{Debug.dir(element);var skinId=$(element).readAttribute('data-skinid');var url=ipb.vars['base_url']+'app=core&module=ajax&section=skin&do=change&skinId='+skinId+'&secure_key='+ipb.vars['secure_hash'];Debug.write(url);new Ajax.Request(url,{method:'get',onSuccess:function(t)
{if(t.responseJSON['status']=='ok')
{window.location=window.location;window.location.reload(true);}
else
{ipb.global.errorDialogue(ipb.lang['ajax_failure']);}}});Event.stop(e);return false;},getInboxList:function(element,e)
{if(Object.isUndefined(ipb.global.popups['inbox']))
{ipb.global.popups['inbox']=true;ipb.menus.closeAll(e);$(element).identify();$(element).addClassName('ipbmenu');$('ipboard_body').insert(ipb.templates['header_menu'].evaluate({id:'user_inbox_link_menucontent'}));$('user_inbox_link_menucontent').setStyle('width: 300px').update("<div class='ipsPad ipsForm_center'><img src='"+ipb.vars['loading_img']+"' /></div>");var _newMenu=new ipb.Menu($(element),$("user_inbox_link_menucontent"));_newMenu.doOpen();var url=ipb.vars['base_url']+'app=members&module=ajax&section=messenger&do=getInboxDropDown';Debug.write(url);new Ajax.Request(url,{method:'post',evalJSON:'force',hideLoader:true,parameters:{secure_key:ipb.vars['secure_hash']},onSuccess:function(t)
{if(t.responseJSON['error'])
{if(t.responseJSON['__board_offline__'])
{ipb.global.errorDialogue(ipb.lang['board_offline']);ipb.menus.closeAll(e);}}
else
{$('user_inbox_link_menucontent').update(t.responseJSON['html']);try
{$(element).down('.ipsHasNotifications').fade({afterFinish:function(){$(element).down('.ipsHasNotifications').show().addClassName('ipsHasNotifications_blank');}});}catch(acold){}}}});}
Event.stop(e);return false;},getNotificationsList:function(element,e)
{Event.stop(e);if(Object.isUndefined(ipb.global.popups['notification']))
{ipb.global.popups['notification']=true;ipb.menus.closeAll(e);$(element).identify();$(element).addClassName('ipbmenu');$('ipboard_body').insert(ipb.templates['header_menu'].evaluate({id:'user_notifications_link_menucontent'}));$('user_notifications_link_menucontent').setStyle('width: 300px').update("<div class='ipsPad ipsForm_center'><img src='"+ipb.vars['loading_img']+"' /></div>");var _newMenu=new ipb.Menu($(element),$("user_notifications_link_menucontent"));_newMenu.doOpen();var url=ipb.vars['base_url']+'app=core&module=ajax&section=notifications&do=getlatest';Debug.write(url);new Ajax.Request(url,{method:'post',evalJSON:'force',hideLoader:true,parameters:{secure_key:ipb.vars['secure_hash']},onSuccess:function(t)
{if(t.responseJSON['error'])
{if(t.responseJSON['__board_offline__'])
{ipb.global.errorDialogue(ipb.lang['board_offline']);ipb.menus.closeAll(e);}}
else
{$('user_notifications_link_menucontent').update(t.responseJSON['html']);try
{$(element).down('.ipsHasNotifications').fade({afterFinish:function(){$(element).down('.ipsHasNotifications').show().addClassName('ipsHasNotifications_blank');}});}catch(acold){}}}});}
return false;},openQuickNavigation:function(e)
{Event.stop(e);if(ipb.global.popups['quickNav']){ipb.global.popups['quickNav'].show();}else{var url=ipb.vars['base_url']+"app=core&module=ajax&section=navigation&secure_key="+ipb.vars['secure_hash']+"&inapp="+ipb.vars['active_app'];ipb.global.popups['quickNav']=new ipb.Popup('navigation_popup',{type:'modal',ajaxURL:url,hideAtStart:false,w:'600px',h:460});ipb.delegate.register('a[rel~="ipsQuickNav"]',ipb.global.quickNavTabClick);}
return false;},launchPhotoEditor:function(elem,e)
{Event.stop(e);if(!Object.isUndefined(ipb.global.popups['photoEditor']))
{ipb.global.popups['photoEditor'].kill();}
var url=ipb.vars['base_url']+"&app=members&module=ajax&section=photo&do=show&secure_key="+ipb.vars['secure_hash'];ipb.global.popups['photoEditor']=new ipb.Popup('photo_popup',{type:'pane',modal:true,ajaxURL:url,hideAtStart:false,evalJs:'force',w:'750px',h:500});return false;},quickNavTabClick:function(e,elem)
{Event.stop(e);app=elem.readAttribute('data-app');var url=ipb.vars['base_url']+"app=core&module=ajax&section=navigation&secure_key="+ipb.vars['secure_hash']+"&do=panel&inapp="+app;new Ajax.Request(url.replace(/&amp;/g,'&'),{method:'get',evalJSON:'force',hideLoader:true,onSuccess:function(t)
{$('ipsNav_content').update(t.responseText);$$('a[rel~="ipsQuickNav"]').each(function(link)
{link.up('li').removeClassName('active');var _app=link.readAttribute('data-app');if(_app==app)
{link.up('li').addClassName('active');}});}});return false;},ajaxPagination:function(element,url)
{new Ajax.Request(url.replace(/&amp;/g,'&'),{method:'get',evalJSON:'force',hideLoader:true,onSuccess:function(t)
{$(element).update(t.responseText);}});return false;},inlineSignin:function(e)
{if(ipb.vars['is_touch']){return;}
if(!$('inline_login_form'))
{return;}
Event.stop(e);if(ipb.global.loginRedirect)
{window.location=ipb.global.loginRedirect;return;}
new ipb.Popup('sign_in_popup',{type:'pane',initial:$('inline_login_form').show(),hideAtStart:false,hideClose:false,defer:false,modal:true,w:'600px'},{afterShow:function(pop){try{$('ips_username').focus();}catch(err){}}});},forumMarkRead:function(elem,e)
{Event.stop(e);var id=$(elem).readAttribute("data-fid");if(!id){return;}
var url=ipb.vars['base_url']+'&app=forums&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=markasread&forumid='+id;new Ajax.Request(url,{method:'get',evalJSON:'force',onSuccess:function(t)
{if(t.responseText=='no_forum'||t.responseText=='no_permission'){alert(ipb.lang['mark_read_forum']);return;}
$$('.__topic').each(function(topic)
{if($(topic).hasClassName('unread'))
{var tid=$(topic).readAttribute("data-tid");if(tid)
{ipb.global.topicRemoveUnreadElements(tid);}}});}});},topicMarkRead:function(elem,e)
{Event.stop(e);var id=$(elem).readAttribute("data-tid");if(!id){return;}
var row=$('trow_'+id);var url=ipb.vars['base_url']+'&app=forums&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=topics&do=markRead&tid='+id;new Ajax.Request(url,{method:'get',evalJSON:'force',onSuccess:function(t)
{if(t.responseText=='no_topic'||t.responseText=='no_permission'){alert(ipb.lang['mark_read_topic']);return;}
$(elem).remove();ipb.global.topicPreview(e,row.down('.__topic_preview'));ipb.global.topicRemoveUnreadElements(id);}});},topicRemoveUnreadElements:function(tid)
{$('trow_'+tid).removeClassName('unread').down('.col_f_icon').select('a img').invoke('remove');},topicPreview:function(e,elem)
{Event.stop(e);var toggle=$(elem).down(".expander");var row=$(elem).up(".__topic");var id=$(row).readAttribute("data-tid");if(!id){return;}
if($(row).readAttribute('loadingPreview')=='yes'){return;}
$(row).writeAttribute('loadingPreview','yes');if($("topic_preview_"+id))
{if($("topic_preview_wrap_"+id).visible())
{new Effect.BlindUp($("topic_preview_wrap_"+id),{duration:0.3,afterFinish:function(){$('topic_preview_'+id).hide();}});row.removeClassName('highlighted');$(toggle).addClassName('closed').removeClassName('loading').removeClassName('open').writeAttribute('title',ipb.lang['open_tpreview']);}
else
{$('topic_preview_'+id).show();new Effect.BlindDown($("topic_preview_wrap_"+id),{duration:0.3});row.addClassName('highlighted');$(toggle).addClassName('open').removeClassName('loading').removeClassName('closed').writeAttribute('title',ipb.lang['close_tpreview']);}
$(row).writeAttribute('loadingPreview','no');}
else
{var url=ipb.vars['base_url']+'&app=forums&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=topics&do=preview&tid='+id;if(ipb.global.searchResults[id]){url+='&pid='+ipb.global.searchResults[id]['pid']+'&searchTerm='+ipb.global.searchResults[id]['searchterm'];}
$(toggle).addClassName('loading').removeClassName('closed').removeClassName('open');new Ajax.Request(url,{method:'get',evalJSON:'force',onSuccess:function(t)
{if(t.responseText=='no_topic'||t.responseText=='no_permission'){alert(ipb.lang['no_permission_preview']);$(toggle).addClassName('open').removeClassName('loading').removeClassName('closed').writeAttribute('title',ipb.lang['close_tpreview']);$(row).writeAttribute('loadingPreview','no');return;}
if(row.tagName=="TR")
{var count=row.childElements().size();var newrow=new Element('tr',{'class':'preview','id':'topic_preview_'+id});var newcell=new Element('td',{'colspan':count});var wrap=new Element('div',{'id':'topic_preview_wrap_'+id}).hide().update(new Element('div'));row.insert({after:newrow.insert(newcell.insert(wrap))});}
else
{var wrap=new Element('div',{'id':'topic_preview_wrap_'+id}).hide().update(new Element('div'));row.insert({after:wrap});}
wrap.update(t.responseText).relativize();new Effect.BlindDown(wrap,{duration:0.3});row.addClassName('highlighted');$(toggle).addClassName('open').removeClassName('loading').removeClassName('closed').writeAttribute('title',ipb.lang['close_tpreview']);$(row).writeAttribute('loadingPreview','no');}});}},activateMainMenu:function()
{if($("nav_other_apps")&&$("community_app_menu")){var start=totalW=$("nav_other_apps").getWidth()+32;var menuWidth=$("community_app_menu").getWidth();$("community_app_menu").select("li.skip_moremenu").each(function(elem){totalW+=$(elem).measure('margin-box-width');});$("community_app_menu").select("li:not(#nav_other_apps,.submenu_li)").each(function(elem){if($(elem).hasClassName('skip_moremenu'))
{return;}
totalW+=$(elem).measure('margin-box-width');if(totalW>=menuWidth)
{if(!$("more_apps_menucontent")){$$("body")[0].insert("<div id='more_apps_menucontent' class='submenu_container clearfix boxShadow'><div class='left'><ul class='submenu_links' id='more_apps_menucontentul'></ul></div></div>");}
$(elem).addClassName('submenu_li').removeClassName('left');$("more_apps_menucontentul").insert(elem);}});if($("more_apps_menucontent"))
{$("nav_other_apps").show();new ipb.Menu($('more_apps'),$('more_apps_menucontent'));}
Debug.write(menuWidth);}},initUserCards:function()
{if(!Object.isUndefined(ipb.hoverCard)&&ipb.vars['is_touch']===false&&ipb.vars['member_group']['g_mem_info']==1)
{var ajaxUrl=ipb.vars['base_url']+'&app=members&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=card';if(ipb.topic!==undefined&&ipb.topic.forum_id!==undefined)
{ajaxUrl+="&f="+ipb.topic.forum_id;}
ipb.hoverCardRegister.initialize('member',{'w':'500px','delay':750,'position':'auto','ajaxUrl':ajaxUrl,'getId':true,'setIdParam':'mid'});}},showInlineNotification:function(content,options)
{options=(Object.isUndefined(options))?{}:options;options.showClose=(Object.isUndefined(options.manualClose))?false:options.showClose;options.neverClose=(Object.isUndefined(options.neverClose))?false:options.neverClose;options.displayForSeconds=(Object.isUndefined(options.displayForSeconds))?5:options.displayForSeconds;if($('ipsGlobalNotification'))
{ipb.global.closeInlineNotification(function(){ipb.global.showInlineNotification(content,options);});return;}
else
{if($('ipbwrapper'))
{$('ipbwrapper').insert(new Element('div',{id:'ipsGlobalNotification'}).update(ipb.templates['global_notify'].evaluate({'message':content})));}
else
{$('ipboard_body').insert(new Element('div',{id:'ipsGlobalNotification'}).update(ipb.templates['global_notify'].evaluate({'message':content,'close':ipb.templates['global_notify_close']})));}
new Effect.Appear('ipsGlobalNotification',{duration:1.5});if(options.showClose)
{$('ipsGlobalNotification').insert(new Element('div',{id:'ipsGlobalNotification_close'}));$('ipsGlobalNotification_close').observe('click',ipb.global.closeInlineNotification);}
else if($('ipsGlobalNotification_close'))
{$('ipsGlobalNotification_close').observe('click',ipb.global.closeInlineNotification);}}
$('ipsGlobalNotification').on('click','span a',ipb.global.closeInlineNotification);if(options.neverClose!==true)
{try{clearTimeout(ipb.global.inlineNotification['timers']['close']);}
catch(e){}
ipb.global.inlineNotification['timers']['close']=setTimeout(ipb.global.closeInlineNotification,options.displayForSeconds*1000);}},closeInlineNotification:function(callback)
{callback=callback||Prototype.emptyFunction;if($('ipsGlobalNotification_close')){$('ipsGlobalNotification_close').stopObserving('click');}
try{clearTimeout(ipb.global.inlineNotification['timers']['close']);}
catch(e){}
new Effect.Fade('ipsGlobalNotification',{duration:1.0,afterFinish:function(){$('ipsGlobalNotification').remove();callback();}});},errorDialogue:function(text)
{errContent="<h3>"+ipb.lang['error_occured']+"</h3><div class='row2 ipsPad ipsForm_center'><p>"+text+"</p></div>";new ipb.Popup('generic__errorDialogue',{type:'pane',initial:errContent,stem:true,hideAtStart:false,hideClose:false,defer:false,warning:false,w:400});},okDialogue:function(text)
{okContent="<h3>"+ipb.lang['success']+"</h3><div class='row2 ipsPad ipsForm_center'><p>"+text+"</p></div>";new ipb.Popup('generic__okDialogue',{type:'pane',initial:okContent,stem:true,hideAtStart:false,hideClose:false,defer:false,w:400});},contextualSearch:function()
{if(!$('search_options')&&!$('search_options_menucontent')){return;}
if(!$('main_search'))
{return;}
$('main_search').defaultize(ipb.lang['search_default_value']);$('search').select('.submit_input').find(function(elem){$(elem).value='';});var update=function(noSelect)
{var checked=$('search_options_menucontent').select('input').find(function(elem){return $(elem).checked;});if(Object.isUndefined(checked)){checked=$('search_options_menucontent').select('input:first')[0];if(!checked){return;}
checked.checked=true;}
$('search_options').show().update($(checked).up('label').readAttribute('title')||'');if(noSelect!=true){$('main_search').focus();}
return true;};update(true);$('search_options_menucontent').select('input').invoke('observe','click',update);},fetchTid:function(e)
{var elem=Event.element(e);elem.identify();if(!elem.hasClassName('__topic'))
{elem=elem.up('.__topic');}
var id=elem.id;if(!id||!$(id))
{return 0;}
var m=$(id).className.match('__tid([0-9]+)');var tid=m[1];return tid;},displayWarnLogs:function(e,elem)
{mid=elem.id.match('warn_link_([0-9a-z]+)_([0-9]+)')[2];if(Object.isUndefined(mid)){return;}
if(parseInt(mid)==0){return false;}
Event.stop(e);var _url=ipb.vars['base_url']+'&app=core&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=warn&do=view&mid='+mid;warnLogs=new ipb.Popup('warnLogs',{type:'pane',modal:false,w:'500px',h:500,ajaxURL:_url,hideAtStart:false,close:'.cancel'});},toggleFriend:function(e,elem)
{Event.stop(e);var id=$(elem).id.match('friend_(.*)_([0-9]+)');if(Object.isUndefined(id[2])){return;}
var isFriend=($(elem).hasClassName('is_friend'))?1:0;var urlBit=(isFriend)?'remove':'add';var url=ipb.vars['base_url']+"app=members&section=friends&module=ajax&do="+urlBit+"&member_id="+id[2]+"&md5check="+ipb.vars['secure_hash'];new Ajax.Request(url,{method:'get',onSuccess:function(t)
{switch(t.responseText)
{case'pp_friend_timeflood':alert(ipb.lang['cannot_readd_friend']);Event.stop(e);break;case"pp_friend_already":alert(ipb.lang['friend_already']);Event.stop(e);break;case"error":return true;break;default:var newIcon=(isFriend)?ipb.templates['m_add_friend'].evaluate({id:id[2]}):ipb.templates['m_rem_friend'].evaluate({id:id[2]});var friends=$$('.mini_friend_toggle').each(function(fr){if($(fr).id.endsWith('_'+id[2]))
{if(isFriend){$(fr).removeClassName('is_friend').addClassName('is_not_friend').update(newIcon);}else{$(fr).removeClassName('is_not_friend').addClassName('is_friend').update(newIcon);}}});new Effect.Highlight($(elem),{startcolor:ipb.vars['highlight_color']});document.fire('ipb:friendRemoved',{friendID:id[2]});Event.stop(e);break;}}});},toggleFlagSpammer:function(memberId,flagStatus)
{if(flagStatus==true)
{if(confirm(ipb.lang['set_as_spammer']))
{var tid=0;var fid=0;var sid=0;if(typeof(ipb.topic)!='undefined')
{tid=ipb.topic.topic_id;fid=ipb.topic.forum_id;sid=ipb.topic.start_id;}
window.location=ipb.vars['base_url']+'app=core&module=modcp&do=setAsSpammer&member_id='+memberId+'&t='+tid+'&f='+fid+'&st='+sid+'&auth_key='+ipb.vars['secure_hash'];return false;}
else
{return false;}}
else
{alert(ipb.lang['is_spammer']);return false;}},toggleSpoiler:function(e,button)
{Event.stop(e);var returnvalue=$(button).up('.bbc_spoiler').down('.bbc_spoiler_wrapper').down('.bbc_spoiler_content').toggle();if(returnvalue.visible()){$(button).value=ipb.lang['spoiler_hide'];}else{$(button).value=ipb.lang['spoiler_show'];}},buildRSSmenu:function()
{$$('link').each(function(link)
{if(link.readAttribute('type')=="application/rss+xml")
{ipb.global.rssItems.push(ipb.templates['rss_item'].evaluate({url:link.readAttribute('href'),title:link.readAttribute('title').escapeHtml()}));}});if(ipb.global.rssItems.length>0)
{rssmenu=ipb.templates['rss_shell'].evaluate({items:ipb.global.rssItems.join("\n")});$('rss_feed').insert({after:rssmenu});new ipb.Menu($('rss_feed'),$('rss_menu'));}
else
{$('rss_feed').hide();}},repPopUp:function(e,repId,repApp,repType)
{if(ipb.global.popups['rep_'+repId]){ipb.global.popups['rep_'+repId].kill();}
var _url=ipb.vars['base_url']+'&app=core&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=reputation&do=view&repApp='+repApp+'&repType='+repType+'&repId='+repId;ipb.global.popups['rep_'+repId]=new ipb.Popup('rep_'+repId,{type:'balloon',stem:true,attach:{target:e,position:'auto'},hideAtStart:false,ajaxURL:_url,w:'300px',h:400});},closePMpopup:function(e)
{if($('pm_notification'))
{new Effect.Parallel([new Effect.Fade($('pm_notification')),new Effect.BlindUp($('pm_notification'))],{duration:0.5});}
Event.stop(e);},markReadPMpopup:function(e)
{if($('pm_notification'))
{var elem=Event.findElement(e,'a');var href=elem.href.replace(/&amp;/g,'&')+'&ajax=1';new Ajax.Request(href+"&md5check="+ipb.vars['secure_hash'],{method:'get',evalJSON:'force',onSuccess:function(t){}});new Effect.Parallel([new Effect.Fade($('pm_notification')),new Effect.BlindUp($('pm_notification'))],{duration:0.5});}
Event.stop(e);return false;},initGD:function()
{$('gd-antispam').observe('click',ipb.global.generateNewImage);if($('gd-image-link'))
{$('gd-image-link').observe('click',ipb.global.generateNewImage);}},generateImageExternally:function(elem)
{if(!$(elem)){return;}
$(elem).observe('click',ipb.global.generateNewImage);},generateNewImage:function(e)
{img=$('gd-antispam');Event.stop(e);oldSrc=img.src.toQueryParams();oldSrc=$H(oldSrc).toObject();if(!oldSrc['captcha_unique_id']){Debug.error("No captcha ID found");}
new Ajax.Request(ipb.vars['base_url']+"app=core&module=global&section=captcha&do=refresh&captcha_unique_id="+oldSrc['captcha_unique_id']+'&secure_key='+ipb.vars['secure_hash'],{method:'get',onSuccess:function(t)
{oldSrc['captcha_unique_id']=t.responseText;img.writeAttribute({src:ipb.vars['base_url']+$H(oldSrc).toQueryString()});$('regid').value=t.responseText;}});},registerReputation:function(id,url,rating)
{if(!$(id)){return;}
var rep_up=$(id).down('.rep_up');var rep_down=$(id).down('.rep_down');var domLikeStripId=($(url.domLikeStripId))?$(url.domLikeStripId):false;var sendUrl=ipb.vars['base_url']+'&app=core&module=ajax&section=reputation&do=add_rating&app_rate='+url.app+'&type='+url.type+'&type_id='+url.typeid+'&secure_key='+ipb.vars['secure_hash'];if($(rep_up)){$(rep_up).observe('click',ipb.global.repRate.bindAsEventListener(this,1,id));}
if($(rep_down)){$(rep_down).observe('click',ipb.global.repRate.bindAsEventListener(this,-1,id));}
ipb.global.reputation[id]={obj:$(id),domLikeStripId:domLikeStripId,url:url,sendUrl:sendUrl,currentRating:rating||0};Debug.write("Registered reputation");},repRate:function(e)
{Event.stop(e);var type=$A(arguments)[1];var id=$A(arguments)[2];var value=(type==1)?1:-1;if(!ipb.global.reputation[id]){return;}else{var rep=ipb.global.reputation[id];}
Debug.write(rep.sendUrl+'&rating='+value);new Ajax.Request(rep.sendUrl+'&rating='+value,{method:'get',onSuccess:function(t)
{if(t.responseJSON['status']=='ok')
{try{rep.obj.down('.rep_up').up('li').hide();rep.obj.down('.rep_down').up('li').hide();if(t.responseJSON['canRepUp']===true)
{rep.obj.down('.rep_up').up('li').show();}
if(t.responseJSON['canRepDown']===true)
{rep.obj.down('.rep_down').up('li').show();}}catch(err){Debug.error(err);}
var rep_display=rep.obj.down('.rep_show');if(rep_display)
{['positive','negative','zero'].each(function(c){rep_display.removeClassName(c);});var newValue=parseInt(t.responseJSON['rating']);if(newValue>0)
{rep_display.addClassName('positive');}
else if(newValue<0)
{rep_display.addClassName('negative');}
else
{rep_display.addClassName('zero');}
rep_display.update(newValue);}
if($(rep.domLikeStripId.id))
{if(t.responseJSON['likeData'].formatted!==false)
{$(rep.domLikeStripId.id).update(t.responseJSON['likeData'].formatted).show();}
else
{$(rep.domLikeStripId.id).update('').hide();}}}
else
{if(t.responseJSON['error']=='nopermission'||t.responseJSON['error']=='no_permission')
{ipb.global.errorDialogue(ipb.lang['no_permission']);}
else
{ipb.global.errorDialogue(t.responseJSON['error']);}}}});},repLikeMore:function(e,elem)
{Event.stop(e);try
{var id=elem.readAttribute('data-id');var app=elem.readAttribute('data-app');var type=elem.readAttribute('data-type');}
catch(e)
{Debug.error(e);}
if(!Object.isUndefined(ipb.global.popups['likeMore']))
{ipb.global.popups['likeMore'].kill();}
var popid='setfave_'+id;var _url=ipb.vars['base_url']+'&app=core&module=ajax&section=reputation&do=more&secure_key='+ipb.vars['secure_hash']+'&f_app='+app+'&f_type='+type+'&f_id='+id;Debug.write(_url);ipb.global.popups['likeMore']=new ipb.Popup(popid,{type:'pane',ajaxURL:_url,stem:false,hideAtStart:false,h:500,w:'450px'});},convertSize:function(size)
{var kb=1024;var mb=1024*1024;var gb=1024*1024*1024;if(size<kb){return size+" B";}
if(size<mb){return(size/kb).toFixed(2)+" KB";}
if(size<gb){return(size/mb).toFixed(2)+" MB";}
return(size/gb).toFixed(2)+" GB";},registerPageJump:function(source,options)
{if(!source||!options){return;}
ipb.global.pageJumps[source]=options;},buildPageJumps:function()
{$$('.pagejump').each(function(elem){var classes=$(elem).className.match(/pj([0-9]+)/);if(Object.isUndefined(classes)||!classes||!classes[1]){return;}
$(elem).identify();var temp=ipb.templates['page_jump'].evaluate({id:'pj_'+$(elem).identify()});$$('body')[0].insert(temp);$('pj_'+$(elem).identify()+'_submit').observe('click',ipb.global.pageJump.bindAsEventListener(this,$(elem).identify()));$('pj_'+$(elem).identify()+'_input').observe('keypress',function(e){if(e.which==Event.KEY_RETURN)
{ipb.global.pageJump(e,$(elem).identify());}});var wrap=$('pj_'+$(elem).identify()+'_wrap').addClassName('pj'+classes[1]).writeAttribute('jumpid',classes[1]);var callback={afterOpen:function(popup){try{$('pj_'+$(elem).identify()+'_input').activate();}
catch(err){}}};ipb.global.pageJumpMenus[classes[1]]=new ipb.Menu($(elem),$(wrap),{stopClose:true},callback);});},pageJump:function(e,elem)
{if(!$(elem)||!$('pj_'+$(elem).id+'_input')){return;}
var value=$F('pj_'+$(elem).id+'_input');var jumpid=$('pj_'+$(elem).id+'_wrap').readAttribute('jumpid');if(value.blank()){try{ipb.global.pageJumpMenus[source].doClose();}catch(err){}}
else
{value=parseInt(value);}
var options=ipb.global.pageJumps[jumpid];if(!options){Debug.dir(ipb.global.pageJumps);Debug.write(jumpid);return;}
var pageNum=((value-1)*options.perPage);Debug.write(pageNum);if(pageNum<1){pageNum=0;}
var separator=options.url.indexOf('&')!==-1?'&':'?';var url=options.url+separator+options.stKey+'='+pageNum;if(options.anchor)
{url=url+options.anchor;}
url=url.replace(/&amp;/g,'&');url=url.replace(/(http:|https:)?\/\//g,function($0,$1){return $1?$0:'/';});document.location=url;return;},openNewWindow:function(e,link,force)
{var ourHost=document.location.host;var newHost=link.host;if(Prototype.Browser.IE)
{newHost=newHost.replace(/^(.+?):(\d+)$/,'$1');}
if(ourHost!=newHost||force)
{window.open(link.href);Event.stop(e);return false;}
else
{return true;}},registerMarker:function(id,key,url)
{if(!$(id)||key.blank()||url.blank()){return;}
Debug.write("Marker INIT: "+id);$(id).observe('click',ipb.global.sendMarker.bindAsEventListener(this,id,key,url));},sendMarker:function(e,id,key,url)
{Event.stop(e);new Ajax.Request(url+"&secure_key="+ipb.vars['secure_hash'],{method:'get',evalJSON:'force',onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON))
{Debug.error("Invalid server response");return false;}
if(t.responseJSON['error'])
{Debug.error(t.responseJSON['error']);return false;}
if($(id+'_tooltip')){$(id+'_tooltip').hide();}
$(id).up('tr').removeClassName('unread');$(id).replace(unreadIcon);var _intId=id.replace(/forum_img_/,'');if($("subforums_"+_intId))
{$$("#subforums_"+_intId+" li").each(function(elem){$(elem).removeClassName('unread');});}}});},registerCheckAll:function(id,classname)
{if(!$(id)){return;}
$(id).observe('click',ipb.global.checkAll.bindAsEventListener(this,classname));$$('.'+classname).each(function(elem){$(elem).observe('click',ipb.global.checkOne.bindAsEventListener(this,id));});},checkAll:function(e,classname)
{Debug.write('checkAll');var elem=Event.element(e);var checkboxes=$$('.'+classname);if(elem.checked){checkboxes.each(function(check){check.checked=true;});}else{checkboxes.each(function(check){check.checked=false;});}},checkOne:function(e,id)
{var elem=Event.element(e);if($(id).checked&&elem.checked==false)
{$(id).checked=false;}},updateReportStatus:function(e,reportID,noauto,noimg)
{Event.stop(e);var url=ipb.vars['base_url']+"app=core&amp;module=ajax&amp;section=reports&amp;do=change_status&secure_key="+ipb.vars['secure_hash']+"&amp;status=3&amp;id="+parseInt(reportID)+"&amp;noimg="+parseInt(noimg)+"&amp;noauto="+parseInt(noauto);new Ajax.Request(url.replace(/&amp;/g,'&'),{method:'post',evalJSON:'force',onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON))
{alert(ipb.lang['action_failed']);return;}
try{$('rstat-'+reportID).update(t.responseJSON['img']);ipb.menus.closeAll(e);}catch(err){Debug.error(err);}}});},getTotalOffset:function(elem,top,left)
{if($(elem).getOffsetParent()!=document.body)
{Debug.write("Checking "+$(elem).id);var extra=$(elem).positionedOffset();top+=extra['top'];left+=extra['left'];return ipb.global.getTotalOffset($(elem).getOffsetParent(),top,left);}
else
{Debug.write("OK Finished!");return{top:top,left:left};}},checkPermission:function(text)
{if(text=="nopermission"||text=='no_permission')
{alert(ipb.lang['no_permission']);return false;}
return true;},checkForEnter:function(e,callback)
{if(![Event.KEY_RETURN].include(e.keyCode)){return;}
if(callback)
{switch(e.keyCode)
{case Event.KEY_RETURN:callback(e);break;}
Event.stop(e);}},checkDST:function()
{var memberHasDst=ipb.vars['dst_in_use'];var dstInEffect=new Date().getDST();if(memberHasDst-dstInEffect!=0)
{var url=ipb.vars['base_url']+'app=members&module=ajax&section=dst&md5check='+ipb.vars['secure_hash'];new Ajax.Request(url,{method:'get',onSuccess:function(t)
{return true;}});}}};var _menu=window.IPBoard;_menu.prototype.menus={registered:$H(),closeCallBack:false,init:function()
{Debug.write("Initializing ips.menu.js");document.observe("dom:loaded",function(){ipb.menus.initEvents();});},initEvents:function()
{Event.observe(document,'click',ipb.menus.docCloseAll);$$('.ipbmenu').each(function(menu){id=menu.identify();if($(id+"_menucontent"))
{new ipb.Menu(menu,$(id+"_menucontent"));}});},register:function(source,obj)
{ipb.menus.registered.set(source,obj);},registerCloseCallBack:function(callBack)
{ipb.menus.closeCallBack=callBack;},docCloseAll:function(e)
{ipb.menus.closeAll(e);},
/*!! Close all menus (forceClose ignores clicked in menu area check) */
closeAll:function(except,forceClose)
{ipb.menus.registered.each(function(menu,force){if(typeof(except)=='undefined'||(except&&menu.key!=except))
{try{if(forceClose||(!(except.target&&$(except.target).descendantOf(menu.value.target))&&except!=menu.key)){menu.value.doClose();}}catch(err){}}});if(Object.isFunction(ipb.menus.closeCallBack))
{ipb.menus.closeCallBack();}}};_menu.prototype.Menu=Class.create({initialize:function(source,target,options,callbacks){if(!$(source)||!$(target)){return;}
if(!$(source).id){$(source).identify();}
this.id=$(source).id+'_menu';this.source=$(source);this.target=$(target);this.callbacks=callbacks||{};this.options=Object.extend({eventType:'click',closeOnMouseout:false,stopClose:true,offsetX:0,offsetY:0},arguments[2]||{});$(source).observe('click',this.eventClick.bindAsEventListener(this));$(source).observe('mouseover',this.eventOver.bindAsEventListener(this));$(target).observe('click',this.targetClick.bindAsEventListener(this));if(this.options['closeOnMouseout']!==false)
{$(this.options['closeOnMouseout']).observe('mouseleave',this.mouseOutClose.bindAsEventListener(this));}
if($($(source).id+'_alt'))
{$($(source).id+'_alt').observe('click',this.eventClick.bindAsEventListener(this,$($(source).id+'_alt')));$($(source).id+'_alt').observe('mouseover',this.eventOver.bindAsEventListener(this));}
$(this.target).setStyle('position: absolute;').hide().setStyle({zIndex:9999});$(this.target).descendants().each(function(elem){$(elem).setStyle({zIndex:10000});});ipb.menus.register($(source).id,this);if(Object.isFunction(this.callbacks['afterInit']))
{this.callbacks['afterInit'](this);}},doOpen:function(elem)
{Debug.write("Menu open");var pos={};var _source=(this.options.positionSource)?this.options.positionSource:this.source;if(!Object.isUndefined(elem))
{var _source=elem;}
var sourcePos=$(_source).positionedOffset();var _sourcePos=$(_source).cumulativeOffset();var _offset=$(_source).cumulativeScrollOffset();var realSourcePos={top:_sourcePos.top-_offset.top,left:_sourcePos.left-_offset.left};var sourceDim=$(_source).getDimensions();var screenDim=document.viewport.getDimensions();var menuDim={width:$(this.target).measure('border-box-width'),height:$(this.target).measure('border-box-height')};var isFixed=$(_source).ancestors().find(function(el){return el.getStyle('position')=='fixed';});if(isRTL)
{if(sourcePos.top<0)
{sourcePos.top=realSourcePos.top;}
if($(_source).id=='user_link')
{sourcePos.left=sourcePos.left-(parseInt($(_source).getStyle('padding-left').replace(/px/,''))+parseInt($(_source).getStyle('margin-left').replace(/px/,'')));}}
Debug.write("realSourcePos: "+realSourcePos.top+" x "+realSourcePos.left);Debug.write("sourcePos: "+sourcePos.top+" x "+sourcePos.left);Debug.write("scrollOffset: "+_offset.top+" x "+_offset.left);Debug.write("_sourcePos: "+_sourcePos.top+" x "+_sourcePos.left);Debug.write("sourceDim: "+sourceDim.width+" x "+sourceDim.height);Debug.write("menuDim: "+menuDim.height);Debug.write("screenDim: "+screenDim.height);Debug.write("manual ofset: "+this.options.offsetX+" x "+this.options.offsetY);_a=_source.getOffsetParent();_b=this.target.getOffsetParent();Debug.write("_a is "+_a);Debug.write("_b is "+_b);if(isFixed)
{$(this.target).setStyle('position: fixed');if((_sourcePos.left+menuDim.width)>screenDim.width){diff=menuDim.width-sourceDim.width;pos.left=_sourcePos.left-diff+this.options.offsetX;}else{pos.left=(_sourcePos.left)+this.options.offsetX;}
if((_sourcePos.top+menuDim.height)>screenDim.height){pos.top=_sourcePos.top-menuDim.height+this.options.offsetY;}else{pos.top=_sourcePos.top+sourceDim.height+this.options.offsetY;}
$(this.target).setStyle('top: '+(pos.top-1)+'px; left: '+pos.left+'px;');}
else
{if(_a!=_b)
{if((realSourcePos.left+menuDim.width)>screenDim.width){diff=menuDim.width-sourceDim.width;pos.left=_sourcePos.left-diff+this.options.offsetX;}else{if(Prototype.Browser.IE7){pos.left=(_sourcePos.left)+this.options.offsetX;}else{pos.left=(_sourcePos.left)+this.options.offsetX;}}
if((((realSourcePos.top+sourceDim.height)+menuDim.height)>screenDim.height)&&(_sourcePos.top-menuDim.height+this.options.offsetY)>0)
{pos.top=_sourcePos.top-menuDim.height+this.options.offsetY;}else{pos.top=_sourcePos.top+sourceDim.height+this.options.offsetY;}}
else
{Debug.write("MENU: source offset EQUALS target offset");if((realSourcePos.left+menuDim.width)>screenDim.width){diff=menuDim.width-sourceDim.width;pos.left=sourcePos.left-diff+this.options.offsetX;}else{pos.left=sourcePos.left+this.options.offsetX;}
if((((realSourcePos.top+sourceDim.height)+menuDim.height)>screenDim.height)&&(_sourcePos.top-menuDim.height+this.options.offsetY)>0)
{pos.top=sourcePos.top-menuDim.height+this.options.offsetY;}else{pos.top=sourcePos.top+sourceDim.height+this.options.offsetY;}}
$(this.target).setStyle('top: '+(pos.top-1)+'px; left: '+pos.left+'px;');}
$(this.source).addClassName('menu_active');Debug.write("Menu position: "+pos.top+" x "+pos.left);new Effect.Appear($(this.target),{duration:0.2,afterFinish:function(e){if(Object.isFunction(this.callbacks['afterOpen']))
{this.callbacks['afterOpen'](this);}}.bind(this)});Event.observe(document,'keypress',this.checkKeyPress.bindAsEventListener(this));},checkKeyPress:function(e)
{if(e.keyCode==Event.KEY_ESC)
{this.doClose();}},mouseOutClose:function()
{this.doClose();},doClose:function()
{new Effect.Fade($(this.target),{duration:0.3,afterFinish:function(e){if(Object.isFunction(this.callbacks['afterClose']))
{this.callbacks['afterClose'](this);}}.bind(this)});this.source.removeClassName('menu_active');},targetClick:function(e)
{if(!this.options.stopClose){this.doClose();}},eventClick:function(e,elem)
{if(this.options['eventType']=='click')
{Event.stop(e);if($(this.target).visible()){if(Object.isFunction(this.callbacks['beforeClose']))
{this.callbacks['beforeClose'](this);}
this.doClose();}else{ipb.menus.closeAll($(this.source).id);if(Object.isFunction(this.callbacks['beforeOpen']))
{this.callbacks['beforeOpen'](this);}
this.doOpen(elem);}}},eventOver:function()
{if(this.options['eventType']=='mouseover')
{if(!$(this.target).visible()){ipb.menus.closeAll($(this.source).id);if(Object.isFunction(this.callbacks['beforeOpen']))
{this.callbacks['beforeOpen'](this);}
this.doOpen();}}}});_popup=window.IPBoard;_popup.prototype.Popup=Class.create({initialize:function(id,options,callbacks)
{this.id='';this.wrapper=null;this.inner=null;this.stem=null;this.options={};this.timer=[];this.ready=false;this.visible=false;this._startup=null;this.hideAfterSetup=false;this.eventPairs={'mouseover':'mouseout','mousedown':'mouseup'};this._tmpEvent=null;this.id=id;this.options=Object.extend({type:'pane',w:'500px',modal:false,modalOpacity:0.4,hideAtStart:true,delay:{show:0,hide:0},defer:false,hideClose:false,black:false,warning:false,evalJs:true,evalScript:true,closeContents:ipb.templates['close_popup']},arguments[1]||{});this.callbacks=callbacks||{};if(this.options.defer&&$(this.options.attach.target))
{this._defer=this.init.bindAsEventListener(this);$(this.options.attach.target).observe(this.options.attach.event,this._defer);if(this.eventPairs[this.options.attach.event])
{this._startup=function(e){this.hideAfterSetup=true;this.hide();}.bindAsEventListener(this);$(this.options.attach.target).observe(this.eventPairs[this.options.attach.event],this._startup);}}
else
{this.init();}},init:function()
{try{Event.stopObserving($(this.options.attach.target),this.options.attach.event,this._defer);if($(this.options.attach.target))
{var toff=$(this.options.attach.target).positionedOffset();var menu=$(this.options.attach.target).up('.ipbmenu_content');if(toff.top==0&&toff.left==0||$(menu))
{this.options.type='modal';this.options.attach={};}}}catch(err){}
this.wrapper=new Element('div',{'id':this.id+'_popup'}).setStyle('z-index: 10001').hide().addClassName('popupWrapper');this.inner=new Element('div',{'id':this.id+'_inner'}).addClassName('popupInner');if(this.options.black)
{this.inner.addClassName('black_mode');}
if(this.options.warning)
{this.inner.addClassName('warning_mode');}
if(this.options.w){this.inner.setStyle('width: '+this.options.w);}
this.wrapper.insert(this.inner);if(this.options.hideClose!=true)
{this.closeLink=new Element('div',{'id':this.id+'_close'}).addClassName('popupClose').addClassName('clickable');this.closeLink.update(this.options.closeContents);this.closeLink.observe('click',this.hide.bindAsEventListener(this));this.wrapper.insert(this.closeLink);if(this.options.black||this.options.warning)
{this.closeLink.addClassName('light_close_button');}}
$$('body')[0].insert(this.wrapper);if(this.options.classname){this.wrapper.addClassName(this.options.classname);}
if(this.options.initial){this.update(this.options.initial,this.options.evalScript);}
if(Object.isFunction(this.callbacks['beforeAjax']))
{this.callbacks['beforeAjax'](this);}
if(this.options.ajaxURL){this.updateAjax();setTimeout(this.continueInit.bind(this),80);}else{this.ready=true;this.continueInit();}},continueInit:function()
{if(!this.ready)
{setTimeout(this.continueInit.bind(this),80);return;}
if(this.inner.select(".fixed_inner").size())
{Debug.write("Found fixed_inner");this.inner.select(".fixed_inner")[0].setStyle('height: '+this.options.h+'px; max-height: '+this.options.h+'px; overflow: auto');}
else
{var _vph=document.viewport.getDimensions().height-25;this.options.h=(this.options.h&&_vph>this.options.h)?this.options.h:_vph;this.inner.setStyle('max-height: '+this.options.h+'px');}
if(this.options.type=='balloon'){this.setUpBalloon();}else{this.setUpPane();}
try{if(this.options.close){closeElem=$(this.wrapper).select(this.options.close)[0];if(Object.isElement(closeElem))
{$(closeElem).observe('click',this.hide.bindAsEventListener(this));}}}catch(err){Debug.write(err);}
if(Object.isFunction(this.callbacks['afterInit']))
{this.callbacks['afterInit'](this);}
if(!this.options.hideAtStart&&!this.hideAfterSetup)
{this.show();}
if(this.hideAfterSetup&&this._startup)
{Event.stopObserving($(this.options.attach.target),this.eventPairs[this.options.attach.event],this._startup);}},updateAjax:function()
{Debug.write(this.options.ajaxURL);new Ajax.Request(this.options.ajaxURL,{method:'get',evalJS:this.options.evalJs,onSuccess:function(t)
{if(t.responseText!='error')
{try
{if(!Object.isUndefined(t.responseJSON)&&!Object.isUndefined(t.responseJSON['error']))
{if(t.responseJSON['__board_offline__'])
{ipb.global.errorDialogue(ipb.lang['board_offline']);ipb.menus.closeAll(e);}
else
{ipb.global.errorDialogue(t.responseJSON['error']);}
return false;}}catch(e){}
if(t.responseText=='nopermission')
{ipb.global.errorDialogue(ipb.lang['no_permission']);return;}
if(t.responseText.match("__session__expired__log__out__"))
{this.update('');alert(ipb.lang['session_timed_out']);return false;}
Debug.write("AJAX done!");this.update(t.responseText);this.ready=true;if(Object.isFunction(this.callbacks['afterAjax']))
{this.callbacks['afterAjax'](this,t.responseText);}}
else
{Debug.write(t.responseText);return;}}.bind(this)});},show:function(e)
{if(e){Event.stop(e);}
if(this.timer['show']){clearTimeout(this.timer['show']);}
if(this.options.delay.show!=0){this.timer['show']=setTimeout(this._show.bind(this),this.options.delay.show);}else{this._show();}},hide:function(e)
{if(e){Event.stop(e);}
if(this.document_event){Event.stopObserving(document,'click',this.document_event);Event.stopObserving(document,'touchstart',this.document_event);}
if(this.timer['hide']){clearTimeout(this.timer['hide']);}
if(this.options.delay.hide!=0){this.timer['hide']=setTimeout(this._hide.bind(this),this.options.delay.hide);}else{this._hide();}},kill:function()
{if(this.timer['hide']){clearTimeout(this.timer['hide']);}
if(this.timer['show']){clearTimeout(this.timer['show']);}
if($(this.wrapper))
{$(this.wrapper).remove();}},_show:function()
{this.visible=true;try
{if(this.options.warning)
{_wrap=this.inner.down('h3').next('div');if(_wrap)
{if(!_wrap.className.match(/moderated/))
{_wrap.addClassName('moderated');}}}}catch(e){}
if(this.options.modal==false){new Effect.Appear($(this.wrapper),{duration:0.3,afterFinish:function(){if(Object.isFunction(this.callbacks['afterShow']))
{this.callbacks['afterShow'](this);}}.bind(this)});this.document_event=this.handleDocumentClick.bindAsEventListener(this);this.setDocumentEvent();}else{new Effect.Appear($('document_modal'),{duration:0.3,to:this.options.modalOpacity,afterFinish:function(){new Effect.Appear($(this.wrapper),{duration:0.4,afterFinish:function(){if(Object.isFunction(this.callbacks['afterShow']))
{this.callbacks['afterShow'](this);}}.bind(this)});}.bind(this)});}},_hide:function()
{this.visible=false;if(this._tmpEvent!=null)
{Event.stopObserving($(this.wrapper),'mouseout',this._tmpEvent);this._tmpEvent=null;}
if(this.options.modal==false){new Effect.Fade($(this.wrapper),{duration:0.3,afterFinish:function(){if(Object.isFunction(this.callbacks['afterHide']))
{this.callbacks['afterHide'](this);}}.bind(this)});}else{new Effect.Fade($(this.wrapper),{duration:0.3,afterFinish:function(){new Effect.Fade($('document_modal'),{duration:0.2,afterFinish:function(){if(Object.isFunction(this.callbacks['afterHide']))
{this.callbacks['afterHide'](this);}}.bind(this)});}.bind(this)});}},setDocumentEvent:function()
{if(!ipb.vars['is_touch']){Event.observe(document,'click',this.document_event);return;}
Event.observe(document,'touchstart',this.document_event);},handleDocumentClick:function(e)
{Debug.write('document click: '+Event.element(e).id);if(!Event.element(e).descendantOf(this.wrapper)&&(this.options.attach&&(Event.element(e).id!=this.options.attach.target.id)))
{this.hide(e);}},update:function(content,evalScript)
{var scripts=[];if(Object.isElement(content)){this.inner.insert({bottom:content});}else{scripts=content.extractScripts();content=content.stripScripts();this.inner.update(content);}
if((Object.isUndefined(evalScript)||evalScript!=false)&&this.options.evalScript){scripts.map(function(script){eval(script);});}},setUpBalloon:function()
{if(this.options.attach)
{var attach=this.options.attach;if(attach.target&&$(attach.target))
{if(this.options.stem==true)
{this.createStem();}
if(!attach.position){attach.position='auto';}
if(isRTL)
{if(Object.isUndefined(attach.offset)){attach.offset={top:0,right:0};}
if(Object.isUndefined(attach.offset.top)){attach.offset.top=0;}
if(Object.isUndefined(attach.offset.left)){attach.offset.right=0;}else{attach.offset.right=attach.offset.left;}}
else
{if(Object.isUndefined(attach.offset)){attach.offset={top:0,left:0};}
if(Object.isUndefined(attach.offset.top)){attach.offset.top=0;}
if(Object.isUndefined(attach.offset.left)){attach.offset.left=0;}}
if(attach.position=='auto')
{Debug.write("Popup: auto-positioning");var screendims=document.viewport.getDimensions();var screenscroll=document.viewport.getScrollOffsets();var toff=$(attach.target).viewportOffset();var wrapSize=$(this.wrapper).getDimensions();var delta=[0,0];if(Element.getStyle($(attach.target),'position')=='absolute')
{var parent=attach.target.getOffsetParent();delta=parent.viewportOffset();}
if(isRTL)
{toff['right']=screendims.width-(toff[0]-delta[0]);}
else
{toff['left']=toff[0]-delta[0];}
toff['top']=toff[1]-delta[1]+screenscroll.top;var start='top';if(isRTL){var end='right';}else{var end='left';}
if((toff.top-wrapSize.height-attach.offset.top)<(0+screenscroll.top)){var start='bottom';}
if(isRTL)
{if((toff.right+wrapSize.width-attach.offset.right)<(screendims.width-screenscroll.left)){var end='left';}}
else
{if((toff.left+wrapSize.width-attach.offset.left)>(screendims.width-screenscroll.left)){var end='right';}}
finalPos=this.position(start+end,{target:$(attach.target),content:$(this.wrapper),offset:attach.offset});if(this.options.stem==true)
{finalPos=this.positionStem(start+end,finalPos);}}
else
{Debug.write("Popup: manual positioning");finalPos=this.position(attach.position,{target:$(attach.target),content:$(this.wrapper),offset:attach.offset});if(this.options.stem==true)
{finalPos=this.positionStem(attach.position,finalPos);}}
if(!Object.isUndefined(attach.event)){$(attach.target).observe(attach.event,this.show.bindAsEventListener(this));if(attach.event!='click'&&!Object.isUndefined(this.eventPairs[attach.event])){$(attach.target).observe(this.eventPairs[attach.event],this.hide.bindAsEventListener(this));}
$(this.wrapper).observe('mouseover',this.wrapperEvent.bindAsEventListener(this));}}}
if(isRTL)
{Debug.write("Popup: Right: "+finalPos.right+"; Top: "+finalPos.top);$(this.wrapper).setStyle('top: '+finalPos.top+'px; right: '+finalPos.right+'px; position: absolute;');}
else
{Debug.write("Popup: Left: "+finalPos.left+"; Top: "+finalPos.top);$(this.wrapper).setStyle('top: '+finalPos.top+'px; left: '+finalPos.left+'px; position: absolute;');}},wrapperEvent:function(e)
{if(this.timer['hide'])
{clearTimeout(this.timer['hide']);this.timer['hide']=null;if(this.options.attach.event&&this.options.attach.event=='mouseover')
{if(this._tmpEvent==null){this._tmpEvent=this.hide.bindAsEventListener(this);$(this.wrapper).observe('mouseout',this._tmpEvent);}}}},positionStem:function(pos,finalPos)
{var stemSize={height:16,width:31};var wrapStyle={};var stemStyle={};switch(pos.toLowerCase())
{case'topleft':wrapStyle={marginBottom:stemSize.height+'px'};if(isRTL)
{stemStyle={bottom:-(stemSize.height)+'px',right:'5px'};finalPos.right=finalPos.right-15;}
else
{stemStyle={bottom:-(stemSize.height)+'px',left:'5px'};finalPos.left=finalPos.left-15;}
break;case'topright':wrapStyle={marginBottom:stemSize.height+'px'};if(isRTL)
{stemStyle={bottom:-(stemSize.height)+'px',left:'5px'};finalPos.right=finalPos.right+15;}
else
{stemStyle={bottom:-(stemSize.height)+'px',right:'5px'};finalPos.left=finalPos.left+15;}
break;case'bottomleft':wrapStyle={marginTop:stemSize.height+'px'};if(isRTL)
{stemStyle={top:-(stemSize.height)+'px',right:'5px'};finalPos.right=finalPos.right-15;}
else
{stemStyle={top:-(stemSize.height)+'px',left:'5px'};finalPos.left=finalPos.left-15;}
break;case'bottomright':wrapStyle={marginTop:stemSize.height+'px'};if(isRTL)
{stemStyle={top:-(stemSize.height)+'px',left:'5px'};finalPos.right=finalPos.right+15;}
else
{stemStyle={top:-(stemSize.height)+'px',right:'5px'};finalPos.left=finalPos.left+15;}
break;}
$(this.wrapper).setStyle(wrapStyle);$(this.stem).setStyle(stemStyle).setStyle('z-index: 6000').addClassName(pos.toLowerCase());return finalPos;},position:function(pos,v)
{finalPos={};v.target.identify();var toff=$(v.target.id).viewportOffset();var tsize=$(v.target.id).getDimensions();var wrapSize=$(v.content).getDimensions();var screenscroll=document.viewport.getScrollOffsets();var offset=v.offset;var delta=[0,0];if(Element.getStyle($(v.target.id),'position')=='absolute')
{var parent=$(v.target.id).getOffsetParent();delta=parent.viewportOffset();delta=[0,0];}
if(isRTL)
{toff['right']=document.viewport.getDimensions().width-(toff[0]-delta[0]);}
else
{toff['left']=toff[0]-delta[0];}
toff['top']=toff['top']-delta[1]+screenscroll.top;switch(pos.toLowerCase())
{case'topleft':finalPos.top=(toff.top-wrapSize.height-(tsize.height/2))-offset.top;if(isRTL)
{finalPos.right=toff.right+offset.right;}
else
{finalPos.left=toff.left+offset.left;}
break;case'topright':finalPos.top=(toff.top-wrapSize.height-(tsize.height/2))-offset.top;if(isRTL)
{finalPos.right=(toff.right-(wrapSize.width-tsize.width))-offset.right;}
else
{finalPos.left=(toff.left-(wrapSize.width-tsize.width))-offset.left;}
break;case'bottomleft':finalPos.top=(toff.top+tsize.height)+offset.top;if(isRTL)
{finalPos.right=toff.right+offset.right;}
else
{finalPos.left=toff.left+offset.left;}
break;case'bottomright':finalPos.top=(toff.top+tsize.height)+offset.top;if(isRTL)
{finalPos.right=(toff.right-(wrapSize.width-tsize.width))-offset.right;}
else
{finalPos.left=(toff.left-(wrapSize.width-tsize.width))-offset.left;}
break;}
return finalPos;},createStem:function()
{this.stem=new Element('div',{id:this.id+'_stem'}).update('&nbsp;').addClassName('stem');this.wrapper.insert({top:this.stem});},setUpPane:function()
{if(!$('document_modal')){this.createDocumentModal();}
this.positionPane();},positionPane:function()
{var elem_s=$(this.wrapper).getDimensions();var window_s=document.viewport.getDimensions();var window_offsets=document.viewport.getScrollOffsets();if(ipb.vars['is_touch']){window_s={width:window.innerWidth,height:window.innerHeight};}
if(isRTL)
{var center={right:((window_s['width']-elem_s['width'])/2),top:(((window_s['height']-elem_s['height'])/2)/2)};if(center.top<10){center.top=10;}
$(this.wrapper).setStyle('top: '+center['top']+'px; right: '+center['right']+'px; position: fixed;');}
else
{var center={left:((window_s['width']-elem_s['width'])/2),top:(((window_s['height']-elem_s['height'])/2)/2)};if(center.top<10){center.top=10;}
$(this.wrapper).setStyle('top: '+center['top']+'px; left: '+center['left']+'px; position: fixed;');}},createDocumentModal:function()
{var pageLayout=$(document.body).getLayout();var pageSize={width:pageLayout.get('width'),height:pageLayout.get('margin-box-height')};var viewSize=document.viewport.getDimensions();var dims=[];Debug.dir(pageSize);Debug.dir(viewSize);if(viewSize['height']<pageSize['height']){dims['height']=pageSize['height'];}else{dims['height']=viewSize['height'];}
if(viewSize['width']<pageSize['width']){dims['width']=pageSize['width'];}else{dims['width']=viewSize['width'];}
var modal=new Element('div',{'id':'document_modal'}).addClassName('modal').hide();if(isRTL){modal.setStyle('width: '+dims['width']+'px; height: '+dims['height']+'px; position: fixed; top: 0px; right: 0px; z-index: 10000;');}else{modal.setStyle('width: '+dims['width']+'px; height: '+dims['height']+'px; position: fixed; top: 0px; left: 0px; z-index: 10000;');}
$$('body')[0].insert(modal);},getObj:function()
{return $(this.wrapper);}});_ticker=window.IPBoard;_ticker.prototype.Ticker=Class.create({initialize:function(root,options,callbacks)
{if(!$(root)){return;}
this.root=$(root);this.options=Object.extend({duration:4,select:"li"},options||{});this.items=$(root).select(this.options.select);if(!this.items.length){return;}
this.items.invoke('hide').first().show();this.timer=this.nextItem.bind(this).delay(this.options.duration);$(this.root).observe('mouseenter',this.pauseTicker.bindAsEventListener(this));$(this.root).observe('mouseleave',this.unpauseTicker.bindAsEventListener(this));},pauseTicker:function(e)
{clearTimeout(this.timer);},unpauseTicker:function(e)
{this.timer=this.nextItem.bind(this).delay(this.options.duration);},nextItem:function()
{var cur=this.items.find(function(elem){return elem.visible();});var next=$(cur).next(this.options.select);if(Object.isUndefined(next)){next=this.items.first();}
new Effect.Fade($(cur),{duration:0.4,queue:'end',afterFinish:function(){new Effect.Appear($(next),{duration:0.8,queue:'end'});}});this.timer=this.nextItem.bind(this).delay(this.options.duration);}});function warningPopup(elem,id)
{var _url=ipb.vars['base_url']+'&app=members&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=warnings&id='+id;new ipb.Popup('warning'+id,{type:'balloon',stem:true,attach:{target:elem,position:'auto'},hideAtStart:false,ajaxURL:_url,w:'600px',h:800});}
ipb=new IPBoard;ipb.global.init();ipb.menus.init();;var _quickpm=window.IPBoard;_quickpm.prototype.quickpm={popupObj:null,sendingToUser:0,init:function()
{Debug.write("Initializing ips.quickpm.js");document.observe("dom:loaded",function(){ipb.quickpm.initEvents();});},initEvents:function()
{ipb.delegate.register(".pm_button",ipb.quickpm.launchPMform);},launchPMform:function(e,target)
{if(DISABLE_AJAX){return false;}
if(e.ctrlKey==true||e.metaKey==true||e.keyCode==91)
{return false;}
Debug.write("Launching PM form");pmInfo=target.id.match(/pm_([0-9a-z]+)_([0-9]+)/);if(!pmInfo[2]){Debug.error('Could not find member ID in string '+target.id);}
if($('pm_popup_popup'))
{if(pmInfo[2]==ipb.quickpm.sendingToUser)
{try{$('pm_error_'+ipb.quickpm.sendingToUser).hide();}catch(err){}
ipb.quickpm.popupObj.show();Event.stop(e);return;}
else
{ipb.quickpm.popupObj.getObj().remove();ipb.quickpm.sendingToUser=null;ipb.quickpm.sendingToUser=pmInfo[2];}}
else
{ipb.quickpm.sendingToUser=pmInfo[2];}
ipb.quickpm.popupObj=new ipb.Popup('pm_popup',{type:'pane',modal:true,hideAtStart:true,w:'600px'});var popup=ipb.quickpm.popupObj;new Ajax.Request(ipb.vars['base_url']+"&app=members&module=ajax&secure_key="+ipb.vars['secure_hash']+'&section=messenger&do=showQuickForm&toMemberID='+pmInfo[2],{method:'post',evalJSON:'force',onSuccess:function(t)
{if(t.responseJSON&&t.responseJSON['error'])
{switch(t.responseJSON['error'])
{case'noSuchToMember':alert(ipb.lang['member_no_exist']);break;case'cannotUsePMSystem':case'nopermission':alert(ipb.lang['no_permission']);break;default:alert(t.responseJSON['error']);break;}
ipb.quickpm.sendingToUser=0;return;}
else
{popup.update(t.responseText);popup.positionPane();popup.show();if($(popup.getObj()).select('.input_submit')[0]){$(popup.getObj()).select('.input_submit')[0].observe('click',ipb.quickpm.doSend);}
if($(popup.getObj()).select('.use_full')[0]){$(popup.getObj()).select('.use_full')[0].observe('click',ipb.quickpm.useFull);}
if($(popup.getObj()).select('.cancel')[0]){$(popup.getObj()).select('.cancel')[0].observe('click',ipb.quickpm.cancelForm);}}}});Event.stop(e);},cancelForm:function(e)
{$('pm_error_'+ipb.quickpm.sendingToUser).hide();ipb.quickpm.popupObj.hide();Event.stop(e);},useFull:function(e)
{Event.stop(e);var form=new Element('form',{'method':'post','action':ipb.vars['base_url']+'&app=members&module=messaging&section=send&do=form&preview=1&_from=quickPM&fromMemberID='+ipb.quickpm.sendingToUser});var post=new Element('textarea',{'name':'Post'});var subject=new Element('input',{'type':'text','value':$F('pm_subject_'+ipb.quickpm.sendingToUser),'name':'msg_title'});var val=$F('pm_textarea_'+ipb.quickpm.sendingToUser).replace(/<script/ig,'&lt; script').replace(/<\/script/ig,'&lt; /script');val=val.replace(/</g,'&lt;').replace(/>/g,'&gt;');$(form).insert(post).insert(subject).setStyle('position: absolute; left: -500px; top: 0');$(post).update(val);$$('body')[0].insert(form);$(form).submit();},doSend:function(e)
{Debug.write("Sending");if(!ipb.quickpm.sendingToUser){return;}
Event.stop(e);if($F('pm_subject_'+ipb.quickpm.sendingToUser).blank())
{ipb.quickpm.showError(ipb.lang['quickpm_enter_subject']);return;}
if($F('pm_textarea_'+ipb.quickpm.sendingToUser).blank())
{ipb.quickpm.showError(ipb.lang['quickpm_msg_blank']);return;}
var popup=ipb.quickpm.popupObj;if($(popup.getObj()).select('.input_submit')[0]){$(popup.getObj()).select('.input_submit')[0].disabled=true;};new Ajax.Request(ipb.vars['base_url']+'&app=members&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=messenger&do=PMSend&toMemberID='+ipb.quickpm.sendingToUser,{method:'post',parameters:{'Post':$F('pm_textarea_'+ipb.quickpm.sendingToUser).encodeParam(),'std_used':1,'toMemberID':ipb.quickpm.sendingToUser,'subject':$F('pm_subject_'+ipb.quickpm.sendingToUser).encodeParam()},evalJSON:'force',onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON)){alert(ipb.lang['action_failed']);}
if(t.responseJSON['error'])
{popup.hide();ipb.quickpm.sendingToUser=0;Event.stop(e);switch(t.responseJSON['error'])
{case'cannotUsePMSystem':case'nopermission':alert(ipb.lang['no_permission']);break;default:alert(t.responseJSON['error']);break;}}
else if(t.responseJSON['inlineError'])
{ipb.quickpm.showError(t.responseJSON['inlineError']);if($(popup.getObj()).select('.input_submit')[0]){$(popup.getObj()).select('.input_submit')[0].disabled=false;};return;}
else if(t.responseJSON['status'])
{popup.hide();ipb.quickpm.sendingToUser=0;Event.stop(e);ipb.global.showInlineNotification(ipb.lang['message_sent']);return;}
else
{Debug.dir(t.responseJSON);}}});},showError:function(msg)
{if(!ipb.quickpm.sendingToUser||!$('pm_error_'+ipb.quickpm.sendingToUser)){return;}
$('pm_error_'+ipb.quickpm.sendingToUser).select('.message')[0].update(msg);if(!$('pm_error_'+ipb.quickpm.sendingToUser).visible())
{new Effect.BlindDown($('pm_error_'+ipb.quickpm.sendingToUser),{duration:0.3});}
else
{}
return;}};ipb.quickpm.init();;ipb.lang['action_failed']="Действие не выполнено";ipb.lang['ajax_failure']="Извините, но данное действие не прошло!";ipb.lang['album_full']="У вас недостаточно прав, чтобы загрузить еще элементы в этот альбом";ipb.lang['approve']="Показать";ipb.lang['att_select_files']="Выберите файлы";ipb.lang['available']="&#10004; Доступно!";ipb.lang['bbc_date_cite']="{date}:";ipb.lang['bbc_full_cite']="{author} сказал(а) {date}:";ipb.lang['bbc_name_cite']="{author} сказал(а):";ipb.lang['blog_cat_exists']="Категория уже существует";ipb.lang['blog_disable']="Отключить";ipb.lang['blog_enable']="Включить";ipb.lang['blog_pin']="Закрепить";ipb.lang['blog_publish_now']="Опубликовать";ipb.lang['blog_revert_header']="Вы действительно хотите вернуть заголовок к прежнему виду?";ipb.lang['blog_save_draft']="В черновики";ipb.lang['blog_uncategorized']="Без категории";ipb.lang['blog_unpin']="Открепить";ipb.lang['board_offline']="Сообщество в данный момент отключено";ipb.lang['cannot_readd_friend']="В течение пяти минут вы не можете снова добавить только что удаленного пользователя в друзья.";ipb.lang['cant_delete_folder']="Вы не можете удалить защищенную папку.";ipb.lang['ck_auto_saved']="Последнее автосохранение: #{time}";ipb.lang['ck_restore']="Восстановить содержимое";ipb.lang['ck_saved']="Сохраненное содержимое";ipb.lang['ck_saved_desc']="Пока вы набираете, текстовый редактор автоматически сохраняет содержимое, и если вдруг вы перезагрузите эту страницу, то вы сможете восстановить все, что вы написали.";ipb.lang['ck_saved_title']="О сохраненном содержимом";ipb.lang['ck_view_saved']="Просмотр автосохраняемого содержимого (#{updatedDate})";ipb.lang['ckcolor__aliceblue']="Светло-голубой";ipb.lang['ckcolor__antique']="Белый антик";ipb.lang['ckcolor__azure']="Лазурный";ipb.lang['ckcolor__black']="Черный";ipb.lang['ckcolor__blue']="Синий";ipb.lang['ckcolor__brown']="Коричневый";ipb.lang['ckcolor__cyan']="Зеленовато-голубой";ipb.lang['ckcolor__darkgray']="Темно-серый";ipb.lang['ckcolor__darkgreen']="Темно-зеленый";ipb.lang['ckcolor__darkorange']="Темно-оранжевый";ipb.lang['ckcolor__dimgray']="Тускло-серый";ipb.lang['ckcolor__dsgray']="Зеленовато-серый";ipb.lang['ckcolor__firebrick']="Кирпичный";ipb.lang['ckcolor__gold']="Золотой";ipb.lang['ckcolor__goldenrod']="Золотисто-березовый";ipb.lang['ckcolor__gray']="Серый";ipb.lang['ckcolor__green']="Зеленый";ipb.lang['ckcolor__honeydew']="Медовый";ipb.lang['ckcolor__indigo']="Индиго";ipb.lang['ckcolor__lavender']="Голубой с красным отливом";ipb.lang['ckcolor__lightblue']="Светло-синий";ipb.lang['ckcolor__lightgray']="Светло-серый";ipb.lang['ckcolor__lightsalmon']="Светлый сомон";ipb.lang['ckcolor__lightyellow']="Светло-желтый";ipb.lang['ckcolor__lime']="Лимонно-зеленый";ipb.lang['ckcolor__maroon']="Темно-бордовый";ipb.lang['ckcolor__medblue']="Ярко-синий";ipb.lang['ckcolor__navy']="Темно-синий";ipb.lang['ckcolor__orange']="Оранжевый";ipb.lang['ckcolor__paleturq']="Бледно-бирюзовый";ipb.lang['ckcolor__plum']="Темно-фиолетовый";ipb.lang['ckcolor__purple']="Пурпурный";ipb.lang['ckcolor__red']="Красный";ipb.lang['ckcolor__reglavender']="Бледно-лиловый";ipb.lang['ckcolor__sadbrown']="Кожано-коричневый";ipb.lang['ckcolor__teal']="Бирюзовый";ipb.lang['ckcolor__turquoise']="Бледно-бирюзовый";ipb.lang['ckcolor__violet']="Фиолетовый";ipb.lang['ckcolor__white']="Белый";ipb.lang['ckcolor__yellow']="Желтый";ipb.lang['ckeditor__about']="О";ipb.lang['ckeditor__about_ck']="О CKEditor";ipb.lang['ckeditor__aboutscayt']="О проверке орфографии";ipb.lang['ckeditor__accesskey']="Ключ доступа";ipb.lang['ckeditor__add_word']="Добавить слово";ipb.lang['ckeditor__address']="Адрес";ipb.lang['ckeditor__advanced']="Расширенные";ipb.lang['ckeditor__advisorytitle']="Название подсказок";ipb.lang['ckeditor__advisorytype']="Тип контента подсказок";ipb.lang['ckeditor__alignleft']="По левому краю";ipb.lang['ckeditor__alignment']="Выравнивание";ipb.lang['ckeditor__alignright']="По правому краю";ipb.lang['ckeditor__alt_text']="Альтернативный текст";ipb.lang['ckeditor__anchor']="Якорь";ipb.lang['ckeditor__anchorlink']="Ссылка на якорь в тексте";ipb.lang['ckeditor__anchorname']="Имя якоря";ipb.lang['ckeditor__anchorprop']="Свойства якоря";ipb.lang['ckeditor__armeniannumb']="Армянская нумерация";ipb.lang['ckeditor__automatic']="Автоматически";ipb.lang['ckeditor__bbcode']="Специальные BB-коды";ipb.lang['ckeditor__bbcodelabel']="BB-код";ipb.lang['ckeditor__bg_color']="Цвет фона";ipb.lang['ckeditor__bidiltr']="Написание текста слева направо";ipb.lang['ckeditor__bidirtl']="Написание текста справа налево";ipb.lang['ckeditor__block_styles']="Стили блока";ipb.lang['ckeditor__blockquote']="Блок с цитатой";ipb.lang['ckeditor__bold']="Полужирный";ipb.lang['ckeditor__border']="Границы";ipb.lang['ckeditor__border_nan']="Толщина границ должна быть целым числом";ipb.lang['ckeditor__bottom']="Нижний край";ipb.lang['ckeditor__browse_server']="Обзор сервера";ipb.lang['ckeditor__bulletlist']="Свойства маркированного списка";ipb.lang['ckeditor__button']="Кнопка";ipb.lang['ckeditor__buttontoimage']="Вы хотите трансформировать выбранную картинку кнопки в просто картинку";ipb.lang['ckeditor__byanchorname']="По имени якоря";ipb.lang['ckeditor__byelementid']="По id элемента";ipb.lang['ckeditor__byemailaddy']="E-mail";ipb.lang['ckeditor__cancel']="Отмена";ipb.lang['ckeditor__center']="Центр";ipb.lang['ckeditor__checkbox']="Флажок";ipb.lang['ckeditor__circle']="Круг";ipb.lang['ckeditor__clean_word']="Текст, который вы хотите вставить скопирован из Word. Вы хотите подчистить его перед вставкой?";ipb.lang['ckeditor__clear']="Очистить";ipb.lang['ckeditor__close']="Закрыть";ipb.lang['ckeditor__code_css']="CSS";ipb.lang['ckeditor__code_generic']="PHP/Авто";ipb.lang['ckeditor__code_html']="HTML";ipb.lang['ckeditor__code_js']="Javascript";ipb.lang['ckeditor__code_linenum']="Номер первой строки";ipb.lang['ckeditor__code_none']="Нет";ipb.lang['ckeditor__code_sql']="SQL";ipb.lang['ckeditor__code_title']="Код";ipb.lang['ckeditor__code_xml']="XML";ipb.lang['ckeditor__codelabel']="Код";ipb.lang['ckeditor__codetypelabel']="Тип кода";ipb.lang['ckeditor__collapsetools']="Свернуть панель";ipb.lang['ckeditor__color_options']="Опции цветов";ipb.lang['ckeditor__colors']="Цвета";ipb.lang['ckeditor__confirmcancel']="Некоторые опции были изменены, вы действительно хотите закрыть окно?";ipb.lang['ckeditor__confirmreload']="Все несохраненные изменения контента будут утеряны. Вы уверены, что хотите открыть новую страницу?";ipb.lang['ckeditor__contenttemps']="Шаблоны контента";ipb.lang['ckeditor__contextmenopt']="Опции контекстного меню";ipb.lang['ckeditor__copy']="Копия";ipb.lang['ckeditor__copyright']="&copy; $1. Все права защищены.";ipb.lang['ckeditor__create']="Создать";ipb.lang['ckeditor__css_classes']="Классы таблиц стилей";ipb.lang['ckeditor__cut']="Вырезать";ipb.lang['ckeditor__dec_indent']="Уменьшить отступ";ipb.lang['ckeditor__decimal']="Десятичные (1, 2, 3 и т.д.)";ipb.lang['ckeditor__decimal_zero']="Десятичные с нулем (01, 02, 03, и т.д.)";ipb.lang['ckeditor__delete']="Удалить";ipb.lang['ckeditor__dict_cookie']="Изначально, пользовательский словарь хранится в cookies, которые ограничены в размере. Когда словарь пользователя вырастает до размеров, что его невозможно хранить в cookies,  хранение его переносится на наш сервер. Чтобы сохранить ваш словарь на нашем сервере, вам следует указать уникальное название вашего словаря. Если у вас уже был сохраненный словарь, то укажите здесь его название и нажмите кнопку Восстановить.";ipb.lang['ckeditor__dict_name']="Имя словаря не может быть пустым.";ipb.lang['ckeditor__diction_name']="Имя словаря";ipb.lang['ckeditor__dictionaries']="Словари";ipb.lang['ckeditor__disablescayt']="Отключить проверку орфографии";ipb.lang['ckeditor__disc']="Окружность";ipb.lang['ckeditor__divcontainer']="Создать контейнер Div";ipb.lang['ckeditor__dragtoresize']="Перетащите для изменения размера";ipb.lang['ckeditor__edit_div']="Изменить Div";ipb.lang['ckeditor__editanchor']="Изменить якорь";ipb.lang['ckeditor__editlink']="Изменить ссылку";ipb.lang['ckeditor__editor']="Визуальный редактор";ipb.lang['ckeditor__elementspath']="Путь к элементам";ipb.lang['ckeditor__emailbody']="Тело сообщения";ipb.lang['ckeditor__emaillink']="E-mail";ipb.lang['ckeditor__emailsubject']="Тема сообщения";ipb.lang['ckeditor__emoticons']="Смайлики";ipb.lang['ckeditor__enablescayt']="Включить проверку орфографии";ipb.lang['ckeditor__expandtools']="Развернуть панель";ipb.lang['ckeditor__find']="Найти";ipb.lang['ckeditor__find_what']="Что искать:";ipb.lang['ckeditor__findreplace']="Найти и заменить";ipb.lang['ckeditor__flash']="Flash";ipb.lang['ckeditor__flash_prop']="Свойства Flash";ipb.lang['ckeditor__flashanima']="Анимация Flash";ipb.lang['ckeditor__font']="Шрифт";ipb.lang['ckeditor__font_name']="Имя шрифта";ipb.lang['ckeditor__font_size']="Размер шрифта";ipb.lang['ckeditor__form']="Форма";ipb.lang['ckeditor__formaat']="Формат";ipb.lang['ckeditor__format_styles']="Стили форматирования";ipb.lang['ckeditor__formatted']="Форматированный";ipb.lang['ckeditor__framelink']="<frame>";ipb.lang['ckeditor__gencontent']="Контент";ipb.lang['ckeditor__general']="Основное";ipb.lang['ckeditor__genoption']="Опция";ipb.lang['ckeditor__georgiannumb']="Грузинская нумерация (an, ban, gan, и т.д.)";ipb.lang['ckeditor__heading']="Заглавие";ipb.lang['ckeditor__height']="Высота";ipb.lang['ckeditor__height_nan']="Высота должна быть числовой";ipb.lang['ckeditor__hiddenfield']="Скрытое поле";ipb.lang['ckeditor__highlight']="Подсветка";ipb.lang['ckeditor__hr']="Вставить горизонтальную линию";ipb.lang['ckeditor__hspace']="Горизонтальный отступ";ipb.lang['ckeditor__hspace_nan']="Горизонтальный отступ должен быть целым числом";ipb.lang['ckeditor__id']="ID";ipb.lang['ckeditor__iframe']="iFrame";ipb.lang['ckeditor__iframeborder']="Показывать границы фрейма";ipb.lang['ckeditor__iframeprops']="Свойства iFrame ";ipb.lang['ckeditor__iframescroll']="Включить полосы прокрутки";ipb.lang['ckeditor__iframeurl']="Введите URL iFrame";ipb.lang['ckeditor__ignore']="Пропустить";ipb.lang['ckeditor__ignore_all']="Пропустить все";ipb.lang['ckeditor__ignoreallcaps']="Пропустить все слова большими буквами";ipb.lang['ckeditor__ignoredomains']="Пропустить доменные имена";ipb.lang['ckeditor__ignoremixedc']="Пропустить слова с большими и малыми буквами";ipb.lang['ckeditor__ignorewnumber']="Пропустить слова с цифрами";ipb.lang['ckeditor__image']="Картинка";ipb.lang['ckeditor__image_info']="Инфо";ipb.lang['ckeditor__image_prop']="Свойства картинки";ipb.lang['ckeditor__image_url']="Введите URL картинки";ipb.lang['ckeditor__imagebutton']="Кнопка с картинкой";ipb.lang['ckeditor__imagebutton_p']="Свойства кнопки с картинкой";ipb.lang['ckeditor__imagetobutton']="Вы хотите трансформировать выбранную картинку в кнопку с картинкой?";ipb.lang['ckeditor__inc_indent']="Увеличить отступ";ipb.lang['ckeditor__inline_styles']="Внедренный стили";ipb.lang['ckeditor__inlinestyle']="Внедренный стиль";ipb.lang['ckeditor__insdelbullist']="Вставить/Удалить маркированный список";ipb.lang['ckeditor__insdelnumlist']="Вставить/Удалить цифровой список";ipb.lang['ckeditor__insertsmilie']="Вставить смайлик";ipb.lang['ckeditor__insertspecial']="Вставить специальные символы";ipb.lang['ckeditor__italic']="Курсивный";ipb.lang['ckeditor__justify']="По ширине";ipb.lang['ckeditor__langcode']="Код языка";ipb.lang['ckeditor__languagedir']="Направление языка";ipb.lang['ckeditor__languages']="Языки";ipb.lang['ckeditor__left']="Слева";ipb.lang['ckeditor__licvisitsite']="По вопросам лицензирования обращайтесь на наш сайт:";ipb.lang['ckeditor__link']="Ссылка";ipb.lang['ckeditor__link_info']="Инфо";ipb.lang['ckeditor__link_type']="Тип ссылки";ipb.lang['ckeditor__linked_char']="Кодировка сайта, на который ссылка";ipb.lang['ckeditor__linkother']="<other>";ipb.lang['ckeditor__list_nan']="Начальное число списка должно быть целым числом.";ipb.lang['ckeditor__lock_ratio']="Фиксировать пропорции";ipb.lang['ckeditor__longdescurl']="Описание URL";ipb.lang['ckeditor__loweralpha']="Строчные латинские (a, b, c, d, e, и т.д.)";ipb.lang['ckeditor__lowergreek']="Строчные греческие (альфа, бета, гамма, и т.д.)";ipb.lang['ckeditor__lowerroman']="Строчные римские (i, ii, iii, iv, v, и т.д.)";ipb.lang['ckeditor__ltrlang']="Слева направо (LTR)";ipb.lang['ckeditor__match_case']="Учитывать регистр";ipb.lang['ckeditor__match_cyclic']="По всему тексту";ipb.lang['ckeditor__match_word']="Только слово целиком";ipb.lang['ckeditor__maximize']="Развернуть";ipb.lang['ckeditor__middle']="По середине";ipb.lang['ckeditor__minimize']="Свернуть";ipb.lang['ckeditor__missingimgurl']="Ссылка на изображение ошибочна.";ipb.lang['ckeditor__more_colors']="Еще цвета...";ipb.lang['ckeditor__moresuggs']="Еще варианты";ipb.lang['ckeditor__mymedia']="Мои файлы";ipb.lang['ckeditor__name']="Имя";ipb.lang['ckeditor__nan']="Это значение не является числом.";ipb.lang['ckeditor__newpage']="Новая страница";ipb.lang['ckeditor__noanchorsa']="(В документе нет ни одного якоря)";ipb.lang['ckeditor__nocleanword']="Невозможно очистить вставляемые данные из-за внутренней ошибки системы";ipb.lang['ckeditor__none']="Нет";ipb.lang['ckeditor__nooperalol']="Opera не поддерживается";ipb.lang['ckeditor__normal']="Обычный";ipb.lang['ckeditor__normal_div']="Обычный (DIV)";ipb.lang['ckeditor__notemplates']="(Ни одного шаблона не определено)";ipb.lang['ckeditor__notset']="<не указано>";ipb.lang['ckeditor__numberedlist']="Свойства нумерованного списка";ipb.lang['ckeditor__object_styles']="Стили объектов";ipb.lang['ckeditor__ok']="ОК";ipb.lang['ckeditor__options']="Опции";ipb.lang['ckeditor__para_format']="Формат параграфа";ipb.lang['ckeditor__paste']="Вставить";ipb.lang['ckeditor__paste_area']="Зона для вставки";ipb.lang['ckeditor__paste_box']="Пожалуйста, вставьте текст в нижеуказанное поле, используя клавиатуру (<strong>Ctrl/Cmd+V</strong>) и нажмите кнопку OK";ipb.lang['ckeditor__paste_err1']="Настройки безопасности вашего браузера не разрешают редактору выполнять автоматические операции по вырезанию текста. Пожалуйста, используйте для этого клавиатуру (Ctrl/Cmd+X).";ipb.lang['ckeditor__paste_err2']="Настройки безопасности вашего браузера не разрешают редактору выполнять автоматические операции по копированию текста. Пожалуйста, используйте для этого клавиатуру (Ctrl/Cmd+C).";ipb.lang['ckeditor__paste_err3']="Потому что настройки безопасности вашего браузера не разрешают редактору обращаться к буферу обмена. Вы должны вставить текст снова в это окно.";ipb.lang['ckeditor__paste_ptext']="Вставить только текст";ipb.lang['ckeditor__paste_word']="Вставить из Word";ipb.lang['ckeditor__pb']="Вставить перевод строки для печати";ipb.lang['ckeditor__pba']="Перевод строки";ipb.lang['ckeditor__popupdepend']="Зависимое (Netscape)";ipb.lang['ckeditor__popupfeat']="Параметры всплывающего окна";ipb.lang['ckeditor__popupfullscr']="Полноэкранное (IE)";ipb.lang['ckeditor__popupleftpos']="По левому краю";ipb.lang['ckeditor__popuplink']="<всплывающее окно>";ipb.lang['ckeditor__popuplocation']="Панель адреса";ipb.lang['ckeditor__popupmenubar']="Панель меню";ipb.lang['ckeditor__popupresize']="Изменяемый размер";ipb.lang['ckeditor__popupscroll']="Полосы прокрутки";ipb.lang['ckeditor__popupstatusba']="Строка состояния";ipb.lang['ckeditor__popuptoolbar']="Панель инструментов";ipb.lang['ckeditor__popuptoppos']="Отступ сверху";ipb.lang['ckeditor__popupwinname']="Имя всплывающего окна";ipb.lang['ckeditor__preview']="Предпросмотр";ipb.lang['ckeditor__print']="Печать";ipb.lang['ckeditor__properties']="Свойства";ipb.lang['ckeditor__protocol']="Протокол";ipb.lang['ckeditor__pselectbbcode']="Пожалуйста, выберите";ipb.lang['ckeditor__quotelabel']="Цитата";ipb.lang['ckeditor__radiobutton']="Кнопка выбора";ipb.lang['ckeditor__redo']="Назад";ipb.lang['ckeditor__remove_div']="Удалить Div";ipb.lang['ckeditor__removeformat']="Удалить форматирование";ipb.lang['ckeditor__rename']="Переименовать";ipb.lang['ckeditor__repactconts']="Заменить актуальный контент";ipb.lang['ckeditor__replace']="Заменить";ipb.lang['ckeditor__replace_all']="Заменить все";ipb.lang['ckeditor__replace_cnt']="Заменено %s позиций";ipb.lang['ckeditor__replace_with']="Заменить на:";ipb.lang['ckeditor__reset_size']="Вернуть обычные размеры";ipb.lang['ckeditor__restore']="Восстановить";ipb.lang['ckeditor__right']="Направо";ipb.lang['ckeditor__rtllang']="Справа на лево (RTL))";ipb.lang['ckeditor__save']="Сохранить";ipb.lang['ckeditor__scayt']="Проверка орфографии налету при вводе текста";ipb.lang['ckeditor__selectall']="Отметить все";ipb.lang['ckeditor__selectanchor']="Выберите якорь";ipb.lang['ckeditor__selectcolor']="Выберите цвет";ipb.lang['ckeditor__selectedcolor']="Выбранный цвет";ipb.lang['ckeditor__selectfield']="Выберите поле";ipb.lang['ckeditor__selectspecial']="Выберите специальный символ";ipb.lang['ckeditor__server_send']="Отправить на сервер";ipb.lang['ckeditor__show_blocks']="Показать блоки";ipb.lang['ckeditor__size']="Размер";ipb.lang['ckeditor__smiley']="Смайлики";ipb.lang['ckeditor__smileyopts']="Опции смайликов";ipb.lang['ckeditor__speccharopts']="Опции специальных символов";ipb.lang['ckeditor__square']="Квадрат";ipb.lang['ckeditor__start']="Начиная с";ipb.lang['ckeditor__strike']="Зачеркнутый";ipb.lang['ckeditor__style']="Стиль";ipb.lang['ckeditor__styles']="Стили";ipb.lang['ckeditor__subscript']="Индекс";ipb.lang['ckeditor__superscript']="Верхний индекс";ipb.lang['ckeditor__tab_index']="Последовательность перехода";ipb.lang['ckeditor__target']="Цель";ipb.lang['ckeditor__targframename']="Имя цели фрейма";ipb.lang['ckeditor__templateopts']="Опции шаблонов";ipb.lang['ckeditor__templates']="Шаблоны";ipb.lang['ckeditor__text_color']="Цвет текста";ipb.lang['ckeditor__text_notfound']="Указанный текст не найден.";ipb.lang['ckeditor__textarea']="Текстовая область";ipb.lang['ckeditor__textfield']="Текстовое поле";ipb.lang['ckeditor__tnewwindow']="Новое окно (_blank)";ipb.lang['ckeditor__togglelabel']="Переключить вид редактора";ipb.lang['ckeditor__togglescayt']="Переключить проверку орфографии";ipb.lang['ckeditor__toolbar']="Панель инструментов";ipb.lang['ckeditor__top']="По верху";ipb.lang['ckeditor__tparentwindow']="Родительское окно (_parent)";ipb.lang['ckeditor__tsamewindow']="Это же окно (_self)";ipb.lang['ckeditor__ttopwindow']="Главное окно (_top)";ipb.lang['ckeditor__type']="Тип";ipb.lang['ckeditor__type_email']="Пожалуйста, введите e-mail адрес";ipb.lang['ckeditor__type_url']="Пожалуйста, введите URL ссылки";ipb.lang['ckeditor__typeanchor']="Пожалуйста, введите имя якоря";ipb.lang['ckeditor__unavailable']="недоступно";ipb.lang['ckeditor__underline']="Подчеркнутый";ipb.lang['ckeditor__undo']="Отменить";ipb.lang['ckeditor__unknownobj']="Неизвестный объект";ipb.lang['ckeditor__unlink']="Разъединить";ipb.lang['ckeditor__unlock_ratio']="Раскрыть пропорции";ipb.lang['ckeditor__upload']="Загрузить";ipb.lang['ckeditor__upperalpha']="Заглавные латинские (A, B, C, D, E, и т.д.)";ipb.lang['ckeditor__upperroman']="Заглавные римские (I, II, III, IV, V, и т.д.)";ipb.lang['ckeditor__url']="URL";ipb.lang['ckeditor__value']="Значение";ipb.lang['ckeditor__vspace']="Вертикальный отступ";ipb.lang['ckeditor__vspace_nan']="Вертикальный отступ может быть только целым числом.";ipb.lang['ckeditor__whichtempl']="Пожалуйста выберите шаблон для открытия в редакторе";ipb.lang['ckeditor__width']="Ширина";ipb.lang['ckeditor__width_nan']="Ширина может быть только целым числом.";ipb.lang['ckeditor__xelements']="%1 элемент";ipb.lang['clear_markboard']="Вы действительно хотите отметить все прочитанным?";ipb.lang['click_to_attach']="Нажмите, чтобы прикрепить файлы";ipb.lang['close_tpreview']="Закрыть предпросмотр";ipb.lang['comment_requires_approval']="Прежде чем публикуемый комментарий будет показан на форуме, он будет проверен модератором.";ipb.lang['confirm_delete']="Вы действительно хотите удалить эту папку? Будут удалены ВСЕ сообщения, содержащиеся в ней. Данное действие НЕ ОБРАТИМО!";ipb.lang['confirm_empty']="Вы действительно хотите очистить эту папку?";ipb.lang['copy_topic_link']="Прямая ссылка на сообщение";ipb.lang['cpt_approve']="Опубликовать";ipb.lang['cpt_approve_f']="Опубликовать";ipb.lang['cpt_close_f']="Закрыть";ipb.lang['cpt_delete']="Удалить";ipb.lang['cpt_delete_f']="Удалить";ipb.lang['cpt_hide']="Скрыть";ipb.lang['cpt_hide_f']="Скрыть";ipb.lang['cpt_merge']="Объединить";ipb.lang['cpt_merge_f']="Объединить";ipb.lang['cpt_move']="Перенести";ipb.lang['cpt_move_f']="Перенести";ipb.lang['cpt_open_f']="Открыть";ipb.lang['cpt_pin_f']="Закрепить";ipb.lang['cpt_split']="Разделить";ipb.lang['cpt_undelete']="Показать";ipb.lang['cpt_unhide_f']="Показать";ipb.lang['cpt_unpin_f']="Открепить";ipb.lang['date_am']="ДП";ipb.lang['date_pm']="ПП";ipb.lang['delete_confirm']="Вы действительно хотите продолжить?";ipb.lang['delete_pm_confirm']="Вы действительно хотите удалить эту переписку?";ipb.lang['delete_pm_many_confirm']="Вы действительно хотите удалить эти переписки?";ipb.lang['delete_post_confirm']="Вы уверены что хотите удалить это сообщение?";ipb.lang['delete_reply_confirm']="Вы действительно хотите удалить этот ответ?";ipb.lang['delete_topic_confirm']="Вы действительно хотите удалить эту тему?";ipb.lang['editor_enter_list']="Введите пункт списка";ipb.lang['editor_prefs_updated']="Опции сохранены. Изменения вступят в силу при следующей загрузке редактора";ipb.lang['email_banned']="&#10007; E-mail адрес запрещен для использования";ipb.lang['email_doesnt_match']="&#10007; Введенные адреса не совпадают";ipb.lang['email_in_use']="&#10007; E-mail адрес уже используется";ipb.lang['emo_show_all']="Показывать все";ipb.lang['enter_unlimited_names']="Введите имена";ipb.lang['enter_x_names']="Введите до [x] имен пользователей";ipb.lang['error']="Ошибка";ipb.lang['error_occured']="Возникла ошибка";ipb.lang['error_security']="Ошибка защиты";ipb.lang['fail_cblock']="Не удалось сохранить изменения внутри блока";ipb.lang['fail_config']="Не удалось сохранить настройки";ipb.lang['folder_emptied']="Папка успешно очищена";ipb.lang['folder_not_found']="Не удалось найти папку";ipb.lang['folder_protected']="Не удалось совершить действие. Папка защищена.";ipb.lang['follow_action_saved']="Ваши настройки сохранены";ipb.lang['follow_no_action']="Вы не выбрали никаких действий";ipb.lang['friend_already']="Пользователь уже ваш друг";ipb.lang['from']="Из";ipb.lang['gallery_rotate_failed']="Возникла проблема при повороте изображения";ipb.lang['gbl_confirm_cancel']="Отмена";ipb.lang['gbl_confirm_desc']="Пожалуйста, подтвердите это действие";ipb.lang['gbl_confirm_ok']="ОК";ipb.lang['gbl_confirm_text']="Подтверждаю";ipb.lang['gbl_months']="Янв,Фев,Мар,Апр,Май,Июн,Июл,Авг,Сен,Окт,Ноя,Дек";ipb.lang['global_leave_msg']="Оставить сообщение...";ipb.lang['global_status_update']="О чем ты сейчас думаешь?";ipb.lang['go_to_category']="Перейти к категории";ipb.lang['hide']="&times;";ipb.lang['idm_comment_empty']="Комментарий пуст";ipb.lang['idm_invalid_file']="Файл неверный";ipb.lang['idm_msg_email']="Вы не ввели e-mail адрес";ipb.lang['idm_msg_text']="Вы не ввели сообщение";ipb.lang['invalid_chars']="&#10007;  Поле содержит недопустимые символы";ipb.lang['invalid_email']="&#10007; E-mail адрес неправильный";ipb.lang['invalid_folder_name']="Имя директории неверное";ipb.lang['invalid_mime_type']="Вы не можете загружать файлы подобного типа";ipb.lang['is_required']="&#10007; Поле является обязательным";ipb.lang['is_spammer']="Этот пользователь уже отмечен как спамер";ipb.lang['js_rte_erroriespell']="ieSpell не обнаружен. Нажмите OK для перехода на страницу загрузки";ipb.lang['js_rte_errorloadingiespell']="Не удалось загрузить ieSpell. Ошибка: ";ipb.lang['justgo']="Ок";ipb.lang['loading']="Загрузка";ipb.lang['mark_read_forum']="Существует проблема выборка в этом форуме.";ipb.lang['mark_read_topic']="Существует проблема выборки в этой теме.";ipb.lang['max_notes_reached']="Вы исчерпали лимит доступных примечаний для данного изображения.";ipb.lang['member_no_exist']="Пользователь не существует!";ipb.lang['message_sent']="Сообщение отправлено";ipb.lang['messenger_cancel']="Отменить";ipb.lang['messenger_edit']="Изменить";ipb.lang['missing_data']="Неправильные данные";ipb.lang['mq_reply_swap']="Ответить на #{num} цитируемых сообщений";ipb.lang['must_enter_name']="Необходимо ввести имя";ipb.lang['new_lowercase']="новое";ipb.lang['no_more_topics']="Больше тем нет";ipb.lang['no_permission']="К сожалению вы не можете воспользоваться этой возможностью. Если вы еще не вошли на форум, возможно, сделав это вы сможете воспользоваться ей.";ipb.lang['no_permission_preview']="Извините, но вы не имеете доступа к просмотру этой темы.";ipb.lang['not_available']="&#10007; Имя уже занято!";ipb.lang['note_confirm_delete']="Вы хотите удалить примечание?";ipb.lang['note_no_permission_a']="Вы не можете добавлять примечания к этому изображению";ipb.lang['note_no_permission_d']="Вы не можете удалять примечания";ipb.lang['note_no_permission_e']="Вы не можете редактировать примечания";ipb.lang['note_save_empty']="Ваше примечание пусто; удалите его, если оно отправлено по ошибке";ipb.lang['open_tpreview']="Предпросмотр этой темы";ipb.lang['option_is_empty']="Данная настройка тега должна быть заполнена";ipb.lang['out_of_diskspace']="Выделенное дисковое пространство для загрузок исчерпано.";ipb.lang['pass_doesnt_match']="&#10007; Введенные пароли не совпадают";ipb.lang['pass_too_long']="&#10007; Введенный пароль больше 32 символов";ipb.lang['pass_too_short']="&#10007; Введенный пароль менее 3 символов";ipb.lang['pending']="Ожидает";ipb.lang['photo_editor_cropping_still']="Пожалуйста завершите недоделанное, прежде чем нажмете 'Готово'";ipb.lang['photo_editor_enterurl']="Введите url";ipb.lang['poll_no_more_choices']="Вы больше не можете добавлять варианты к вопросу.";ipb.lang['poll_no_more_q']="Вы больше не можете добавлять вопросы к опросу";ipb.lang['poll_not_enough_choices']="Один из вопросов не содержит достаточного количества вариантов выбора, вариантов должно быть не меньше двух!";ipb.lang['poll_questions_missing']="Один или несколько вопросов неверно озаглавлены";ipb.lang['poll_stats']="Вам разрешено добавить еще [q] вопросов с [c] вариантами ответа на вопрос.";ipb.lang['post_empty']="Ваше сообщение пусто";ipb.lang['post_empty_post']="Нельзя отправлять пустое сообщение. Введите какой-либо текст в редакторе.";ipb.lang['post_empty_title']="Вы должны ввести название темы!";ipb.lang['post_empty_username']="Вы должны ввести имя пользователя";ipb.lang['post_hide_reason_default']="Введите причину...";ipb.lang['post_too_short']="Сообщение слишком короткое.";ipb.lang['prof_comment_empty']="Вы должны ввести текст комментария";ipb.lang['prof_comment_mod']="Ваш комментарий был добавлен. Подождите пока владелец профиля, одобрит его, затем он появится в общем списке.";ipb.lang['prof_comment_perm']="У вас не достаточно прав чтобы оставить комментарий в этом профиле";ipb.lang['prof_update_button']="Обновить";ipb.lang['prof_update_default']="О чем ты сейчас думаешь?";ipb.lang['quickpm_enter_subject']="Введите тему";ipb.lang['quickpm_msg_blank']="Введите сообщение";ipb.lang['quote__author']="#name# сказал(а)";ipb.lang['quote__date_author']="#name# сказал(а) #date#:";ipb.lang['quote_expand']="<em>Показать цитату</em>";ipb.lang['quote_on']=" ";ipb.lang['quote_said']="сказал(а)";ipb.lang['quote_title']="Цитата";ipb.lang['reached_max_folders']="Вы достигли лимита на количество папок";ipb.lang['required_data_missing']="Часть необходимых данных отсутствует";ipb.lang['rtg_already']="Вы уже проголосовали за эту запись";ipb.lang['rtg_awesome']="Замечательно!";ipb.lang['rtg_good']="Хорошо";ipb.lang['rtg_nbad']="Неплохо";ipb.lang['rtg_ok']="Средне";ipb.lang['rtg_poor']="Плохо";ipb.lang['rtg_topic_locked']="Тема закрыта";ipb.lang['save_folder']=">";ipb.lang['saving_post']="Сохранение сообщения...";ipb.lang['search_default_value']="Искать...";ipb.lang['set_as_spammer']="Вы уверены что хотите пометить пользователя как спамера?";ipb.lang['signin_nopassword']="Не введен пароль";ipb.lang['signin_nosigninname']="Не введено имя";ipb.lang['silly_server']="Возникла ошибка при загрузке файла";ipb.lang['spoiler_hide']="Скрыть";ipb.lang['spoiler_show']="Показать";ipb.lang['status_updated']="Ваш статус успешно обновлен";ipb.lang['success']="Успешно";ipb.lang['switch_to_advanced']="Воспользуйтесь нашим новым менеджером для загрузки сразу нескольких файлов (требуется современный браузер)";ipb.lang['too_long']="&#10007; Введенное имя слишком длинное";ipb.lang['too_short']="&#10007; Введенное имя слишком короткое";ipb.lang['topic_polling']="Добавлено #{count} новых ответов. <a href='javascript:void(0);' onclick='#{click}'>Показать мне</a>";ipb.lang['trouble_uploading']="Проблемы с загрузкой?";ipb.lang['unapprove']="Скрыть";ipb.lang['unapproved']="Скрыто";ipb.lang['unhide']="...";ipb.lang['upload_done']="Готово (загружено [total])";ipb.lang['upload_failed']="Загрузка не удалась. Пожалуйста сообщите об этом администрации форума.";ipb.lang['upload_limit_hit']="Превышен лимит";ipb.lang['upload_no_file']="Вы не выбрали файл для загрузки";ipb.lang['upload_progress']="Загружено [done] из [total]";ipb.lang['upload_queue']="Вы попытались загрузить слишком много файлов. Допустимо одновременно загружать не более ";ipb.lang['upload_skipped']="Загрузка пропущена";ipb.lang['upload_too_big']="Размер файла превышает допустимый для загрузки размер";ipb.lang['uploading']="Загрузка...";ipb.lang['usercp_photo_upload']="Вы не выбрали файл для загрузки";ipb.lang['vote_success']="Голос сохранен!";ipb.lang['vote_updated']="Голос обновлен!";ipb.lang['with_selected']="С выбранными ({num})";