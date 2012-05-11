//Call speck Init to convert all text areas with "iEdit" to speck edit windows.
//Alternatively:
//var editor = new speckEditor();
//editor.init(textareaelement, optional callback on loaded)
function speckInit(callback) {    
    var tas = document.getElementsByTagName("textarea");
    var found = false;
    for(i=0;i<tas.length;i++) {
		var ta = tas[i];
		if (ta.className == "iEdit") {
		    var editor = new speckEditor();
		    editor.init(ta, callback);
		    found = true;
		}
    }   
    if (!found) {
        if (callback)
            callback.call();
    }
	return true;
};

//Be sure to call speckClose if you are hiding or removing a speck edit 
//from the screen and plan to open another before refreshing the page. 
function speckClose() {
    for(var i in iEdit)
    {
        iEdit[i].iframe.contentWindow.document.designMode = "off";
    }
};

//Collection of all text windows: accessible by:
//iEdit[TextAreaId].html();
var iEdit = [];

//One instance of a speck edit window
function speckEditor() {};
speckEditor.prototype = {
    //Edit this path to point to the location of the stylesheet you would like applied to the edit window.
    editStylePath: window.location.protocol + "//" + window.location.host + "/_library/2008/10/editstyle.css", 
    
    //Remove or add features from this list. a=action, t=hover information text
    features: [ 
        "html", "Toggle HTML View",
        "bold", "Bold",
        "italic", "Italic",
        "underline", "Underline",
        "justifyleft", "Align Left",
        "justifycenter", "Align Center",
        "justifyright", "Align Right",
        "insertorderedlist", "Insert Ordered List",
        "insertunorderedlist", "Insert Unordered List",
        "link", "Create Link",
        "unlink", "Remove Link",
        "formatblock", "Choose Format",
        "fontname", "Choose Font Style",
        "fontsize", "Choose Font Size",
        "forecolor", "Choose Font Color",
        "removeformat", "Remove Formatting"
    ],
    
    //Colors available in the color bar
    colors: [ "006600", "666600", "ccff66", "669933", "ffffff", "eeeeee", "999999", "333333", "000000", "666699", "000033", "000066", "ccffff", "ffff33", "ffcc00", "ffff99", "990000", "330033", "cc3399", "ffcccc", "ffffcc", "996633", "663300", "330000"],    
    
    //Block Options for formatblock
    blockOptions: [
        "<h1>", "Heading 1",
        "<h2>", "Heading 2",
        "<h3>", "Heading 3",
        "<h4>", "Heading 4",
        "<h5>", "Heading 5",
        "<h6>", "Heading 6",
        "<p>", "Normal",
        "<blockquote>", "Block Quote"
    ],
    
    //Font options for fontname
    fontOptions: [
        "Verdana", "Verdana",
        "Arial", "Arial",
        "Georgia", "Georgia",
        "Trebuchet", "Trebuchet",
        "Courier New", "Courier",
        "Times New Roman", "Times"
    ],
    
    //Font size options for fontsize
    fontSizes: [
        "1", "Small",
        "3", "Medium",
        "5", "Large",
        "7", "Largest"
    ],
    
    //Initialize the edit window
    init: function(ta, callback) {

	    this.ta = ta;
        this.id = ta.id;        
        iEdit[this.id] = this;
    	
	    if (callback)
	        this.loaded = callback;
    	
    	//Get the current width
    	this.width = this.ta.offsetWidth; 
    	if (this.width == 0)
        	this.width = parseInt(this.ta.style.width);
        	
        //Get the current height
        this.height = this.ta.offsetHeight;
    	if (this.height == 0)
        	this.height = parseInt(this.ta.style.height);
        	
        this.ta.style.display = "none";
        
	    this.container = this.$new("div");
    	
	    this.tb = this.$new("div");
	    this.tb.className = "speckToolbar";
        this.tb.style.width = this.width + "px";
        this.container.appendChild(this.tb);
    	
    	//Add the features 
	    for(var i=0;i<this.features.length;i+=2) {
	        this.addFeature(this.features[i], this.features[i+1]);
	    }	
        
        this.ta.style.height = (this.height-32) + "px";    
        this.ta.parentNode.replaceChild(this.container, this.ta);
	    this.container.appendChild(this.ta);    
        
        this.initEdit();

    },
    initEdit: function(content) {    
        if (this.iframe)
            this.container.removeChild(this.iframe);

        //Create the iframe
        this.iframe = this.$new("iframe");
        this.iframe.className = "speckFrame";
        this.iframe.frameBorder = "0";
        this.iframe.style.width = (this.width-2) + "px";
        this.iframe.style.height = (this.height-32) + "px";
        this.container.appendChild(this.iframe);
        
        //Save style properties with property called savestyle
        content = this.ta.value.replace(/(style|STYLE|Style)=('|").+?('|")/g, function(match){ return match + " save" + match; });                           
        
        //Write out current content to the iframe window, include edit mode stylesheet
	    this.iframe.contentWindow.document.open();
	    this.iframe.contentWindow.document.write("<html><head><link id='ThemeStyle' href='" + this.editStylePath + "' type='text/css' rel='stylesheet' /></head><body style='background:#fff url();color:#000;'>" + content + "</body></html>");
	    this.iframe.contentWindow.document.close();
        
        this.enterDesignMode();

	    return true;
    },
    enterDesignMode: function() {
        
        //Firefox needs a little time for this.
        if (!this.iframe.contentWindow.document.body) { 
            var self = this;
	        setTimeout(function() { self.enterDesignMode(); }, 1);
	        return;
	    }
	    
	    //Turn on design mode
	    this.iframe.contentWindow.document.designMode = "on";
        
	    this.wysiwyg = true;

        //call loaded event
        if (this.loaded)
            this.loaded.call();
    },
    addFeature: function(action, text) {
        switch (action) {
            case "formatblock": 
	            this.hBar = this.$new("div");
	            this.hBar.id = this.id + "Hbar";       
                this.addBar(this.hBar, "formatblock", this.blockOptions, text);
                this.container.appendChild(this.hBar);
                break;
            case "fontname": 
	            this.fBar = this.$new("div");
	            this.fBar.id = this.id + "Fbar";        
                this.addBar(this.fBar, "fontname", this.fontOptions, text);
                this.container.appendChild(this.fBar);
                break;
            case "fontsize": 
	            this.sBar = this.$new("div");
	            this.sBar.id = this.id + "Sbar";        
                this.addBar(this.sBar, "fontsize", this.fontSizes, text);
                this.container.appendChild(this.sBar);
                break;
            case "forecolor": 
                this.addColor("forecolor", this.colors, text);
                this.container.appendChild(this.cBar);                     
                break;            
            case "link":
                this.addLinkBar("link", text);  
                this.container.appendChild(this.lBar);                     
                break;
            default:
                this.tb.appendChild(this.getButton(action, text));      
                break;
        }
    },
    getButton: function(action, text) {
        var self = this;
        
        var button = this.$new("input");
        button.type = "button";
        button.id = action + "Button";
        button.title = text;
        button.className = "speckButton";
        button.action = action;
        button.onclick = function() { self.execCommand(this); }; 
        return button;
    },
    addColor: function(action, options, text) {
        
	    var button = this.getButton(action, text); // this.$new("input");
        var self = this;
        button.onclick = function() { self.showSelect(this); };
        
	    var bar = this.$new("div");
	    bar.id = action + "Select";
	    bar.className = "speckColorBar";
        bar.style.width = (this.width - 2) + "px"; //2 is border width
        bar.style.display = "none"; 	
	    for (var i=0;i<options.length;i++)
	    {
		    var option = this.$new("input");
		    option.val = options[i];
		    option.type = "button";
		    option.style.backgroundColor = "#" + option.val;
		    option.action = action;
		    option.className = "speckColor";
    	    option.onclick = function() { self.execCommand(this); };
    		
		    bar.appendChild(option);
	    }
	    this.cBar = bar;
        button.selectMenuId = bar.id;
        this.tb.appendChild(button);
	    return true;
    },
    addLinkBar: function(action, text) {
	    var button = this.getButton(action, text); //this.$new("input");
        
        var self = this;
        button.onclick = function() { self.showSelect(this); };
        
	    var bar = this.$new("div");
	    bar.id = action + "linkbar";
	    bar.className = "speckLinkbar";
        bar.style.width = (this.width-2) + "px"; //2 is border width
        bar.style.display = "none"; 	

	    this.linkUrl = this.$new("input");
	    this.linkUrl.id = this.id + "link";
        this.linkUrl.style.width = (this.width - 60) + "px";
        this.linkUrl.value = "http://";
            
        var link = this.$new("input");
        link.type = "button";
        link.id = "linkingButton";
        link.value = "link";    
        link.className = "linkbarButton";
        link.action = "createlink";
        link.onclick = function() { self.execCommand(this) };
        bar.appendChild(this.linkUrl);
        bar.appendChild(link);

	    this.lBar = bar;
        button.selectMenuId = bar.id;
        this.tb.appendChild(button);
	    return true;
    },
    addBar: function(bar, action, options, text) {
	    var button = this.getButton(action, text); //this.$new("input");
        var self = this;
        button.onclick = function() { self.showSelect(this); };
        
	    bar.className = "speckBar";
        bar.style.width = (this.width-2) + "px";
        bar.style.display = "none"; 
        
  	    for (var i=0;i<options.length;i+=2)
	    {
		    var option = this.$new("input");
		    option.val = options[i];
		    option.value = options[i + 1];
		    option.type = "button";
		    option.action = action;
		    option.editor = this.id;
		    option.className = "speckOption";
    	    option.onclick = function() { self.execCommand(this) };
    		
		    bar.appendChild(option);
	    }
        button.selectMenuId = bar.id;
        this.tb.appendChild(button);
	    return true;
    },
    hideSelects: function() {
        var buttons = this.tb.childNodes;
        for(var i=0;i<buttons.length;i++) {
            var button = buttons[i];
            if (button.selectMenuId) {
                var selectMenu = document.getElementById(button.selectMenuId);
                selectMenu.style.display = "none";
            }
        }
        this.lBar.style.display = "none";
        this.iframe.style.height = (this.height-32) + "px";
        this.ta.style.height = (this.height-32) + "px";
    },
    addLinkbar: function() {
	    this.lBar = this.$new("div");
	    this.lBar.id = this.id + "linkbar";
	    this.lBar.className = "speckLinkbar";
        this.lBar.style.width = this.width-10 + "px";
        this.lBar.style.display = "none"; 
    	
	    this.linkUrl = this.$new("input");
	    this.linkUrl.id = this.id + "link";
        this.linkUrl.style.width = (this.width - 60) + "px";
        this.linkUrl.value = "http://";
            
        var link = this.$new("input");
        link.type = "button";
        link.value = "link";    
        link.className = "linkbarButton";
        link.action = "createlink";
        var self = this;
        link.onclick = function() { self.execCommand(); };
        this.lBar.appendChild(this.linkUrl);
        this.lBar.appendChild(link);
    },
    toggleLinkbar: function() {
        if (this.lBar.style.display == "none") {
            this.lBar.style.display = "block";
            this.iframe.style.height = (this.height-(64)) + "px";
        } else {
            this.lBar.style.display = "none";
            this.iframe.style.height = (this.height-32) + "px";        
        }
    },
    setFocus: function() {
	    if (this.wysiwyg == true)
		    this.iframe.contentWindow.focus();
	    else
		    this.ta.focus();
    },
    toggleMode: function() {
        this.hideSelects();
        if (this.wysiwyg) {
            this.html(); //update html
            this.ta.style.display = "block";
            this.iframe.style.display = "none";
            this.wysiwyg = false;
        }
        else {
            this.ta.style.display = "none";
    	    this.initEdit(this.ta.value);
            this.wysiwyg = true;
        }
    },
    html: function() {
        this.ta.value = this.innerXML(this.iframe.contentWindow.document.body.cloneNode(true));
        return this.ta.value;
    },
    showSelect: function(selector) {
           
        var selectMenu = document.getElementById(selector.selectMenuId);
             
        //if select bar is already open, close it.       
        if (selectMenu.style.display == "block") {
            this.hideSelects();
            return;
        }
        
        this.hideSelects();    
        this.iframe.style.height = (this.height-64) + "px";
        this.ta.style.height = (this.height-64) + "px";
        selectMenu.style.display = "block";
    },
    execCommand: function(button) {
        
        var doc = this.iframe.contentWindow.document;
        
	    switch (button.action) {
		    case "createlink":
		        if (this.linkUrl.value != "") { 
                    doc.execCommand(button.action, false, this.linkUrl.value);
                    this.toggleLinkbar();                
                }
                break;
		    case "formatblock":
		    case "fontsize":
		    case "forecolor":
		    case "fontname":
		        doc.execCommand(button.action, false, button.val);	
                break;
            case "link":
                this.toggleLinkbar();
                break;
            case "html":
                this.toggleMode();
                break;            
		    default:
		        doc.execCommand(button.action, false, null);
                break;
        }
        
        if (button.parentNode.className == "speckSelect") {
            button.parentNode.style.display = "none";
            return false;
        }    
        this.setFocus();    
    },
    innerXML: function(oNode) {
        //Returns the innerXML of an HTML DOM node
        var s = "";
        
        var nodes = oNode.childNodes;
        for(var i=0; i < nodes.length; i++)
        {
            var node = nodes[i];
            var nodeType = node.nodeType;
            if (nodeType == 1 || nodeType == 9 || nodeType == 11) //Element Node, Document Node, Document Fragment Node
                s += this.xml(node, "");
            else
                s += node.data; 
        }
        return s;
    }, 
    xml: function(oNode, indent) {
        //Returns outerXML of the node.

        var s = "";
        var nodes = oNode.childNodes;
        var tag = oNode.nodeName.toLowerCase();
        
        if (nodes.length == 0 && (tag == "input" || tag == "img" || tag == "hr" || tag == "br" || tag == "feature" ))
        {
            if (!oNode.getAttribute("_moz_editor_bogus_node")) {
                s += indent + "<" + tag + this.getAttributes(oNode) + " />\n";
            }
        }
        else
        {  
            if (this.isEmptyNode(oNode))
                return s;
                
            s += indent + "<" + tag + this.getAttributes(oNode) + ">";
            for(var i=0; i < nodes.length; i++)
            {
                var node = nodes[i];
                var nodeType = node.nodeType;
                
                if (nodeType == 1 || nodeType == 9 || nodeType == 11) //Element Node, Document Node, Document Fragment Node
                    s += this.xml(node, indent + "");
                else
                    s += indent + node.data; 
            }
            s += indent + "</" + tag + ">";
        }
        return s;
    },     
    getAttributes: function(oNode) {
        var s = "";
        var atts = oNode.attributes;
        var style = "";
        for(var i=0; i < atts.length; i++) {
            var att = atts[i];

            var name = att.nodeName.toLowerCase();
            var val = att.nodeValue;

            if (this.validAttribute(att, oNode.nodeName)) {
                if (name == "savestyle" || name == "style") {
                    if (style.indexOf(val)<0) //not already there
                        style += val;
                } else {
                    s += " " + name + "=\"" + val.replace("about:/", "/") + "\" ";                
                }
            }
        }
        if (style.length>0)
            s += " style=\"" + style + "\" ";
            
        return s;
    },
    validAttribute: function(att, tag) {
        //eliminate unwanted or unsupported attributes
        var name = att.nodeName.toLowerCase();
        var val = att.nodeValue;
        
        if (name == "start") 
            return false;    

        if (val == null || val == "" || val == "inherit" || val == "_moz")
            return false;
            
        if (name == "colspan" || name == "rowspan")
            if (val == "1") { return false; }
            
        if (tag == "INPUT")
            if (name == "height" || name == "maxlength" || name == "loop")
                return false;

        if (tag == "IMG")
            if (name == "start" || name == "loop")
                return false;

        return true;
    },
    isEmptyNode: function(oNode) {
        var nodes = oNode.childNodes;
        for(var i=0; i < nodes.length; i++) {
            var node = nodes[i];
            var nodeType = node.nodeType;
            
            if (nodeType == 1 || nodeType == 9 || nodeType == 11) {
                return false;
            } else {      
                if  (node.data.replace(/^\s+|\s+$/g,"").replace(/^\n+|\n+$/g,"") != "")
                    return false;
            }
        }
        return true;
    },
    $new: function(tag) {
        return document.createElement(tag);
    }           
}
