ace.define("ace/theme/lowlight_customized",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-lowlight-customized";
exports.cssText = "\
.ace-lowlight-customized .ace_gutter {\
background-color: #142226;\
color: #D8D8D8;\
}\
.ace-lowlight-customized .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-lowlight-customized .ace_scroller {\
background-color: #142226;\
}\
.ace-lowlight-customized .ace_text-layer {\
color: #D8D8D8;\
}\
.ace-lowlight-customized .ace_cursor {\
border-left: 2px solid #7E7E7E;\
}\
.ace-lowlight-customized .ace_overwrite-cursors .ace_cursor {\
border-left: 0px;\
border-bottom: 1px solid #7E7E7E;\
}\
.ace-lowlight-customized .ace_marker-layer .ace_selection {\
background: rgba(174, 204, 255, 0.40);\
}\
.ace-lowlight-customized.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #142226;\
border-radius: 2px;\
}\
.ace-lowlight-customized .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174);\
}\
.ace-lowlight-customized .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(120, 119, 44, 0.40);\
}\
.ace-lowlight-customized .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.20);\
}\
.ace-lowlight-customized .ace_gutter-active-line {\
background-color: rgba(0, 0, 0, 0.20);\
}\
.ace-lowlight-customized .ace_marker-layer .ace_selected-word {\
border: 1px solid rgba(174, 204, 255, 0.40);\
}\
.ace-lowlight-customized .ace_fold {\
background-color: #8F8D17;\
border-color: #D8D8D8;\
}\
.ace-lowlight-customized .ace_keyword{color:#8F8D17;}.ace-lowlight-customized .ace_keyword.ace_operator{color:#7AFF79;}.ace-lowlight-customized .ace_constant{color:#E66C29;}.ace-lowlight-customized .ace_support{color:#2F8996;}.ace-lowlight-customized .ace_support.ace_function{color:#EDD34D;}.ace-lowlight-customized .ace_support.ace_constant{color:#959630;}.ace-lowlight-customized .ace_storage{color:#7A925F;}.ace-lowlight-customized .ace_invalid.ace_illegal{text-decoration:underline;\
color:#A2A2A2;\
background-color:#351D18;}.ace-lowlight-customized .ace_invalid.ace_deprecated{text-decoration:underline;\
color:#D24346;}.ace-lowlight-customized .ace_string{color:#A57C5C;}.ace-lowlight-customized .ace_string.ace_regexp{color:#E3965E;}.ace-lowlight-customized .ace_comment{color:#5D8754;\
background-color:rgba(34, 89, 20, 0.10);}.ace-lowlight-customized .ace_variable{color:#77ACB0;}.ace-lowlight-customized .ace_meta.ace_tag{color:#495573;}.ace-lowlight-customized .ace_entity.ace_other.ace_attribute-name{color:#B06520;}.ace-lowlight-customized .ace_entity.ace_name.ace_tag{color:#BAA827;}.ace-lowlight-customized .ace_markup.ace_heading{color:#CF6A4C;}.ace-lowlight-customized .ace_markup.ace_list{color:#F9EB77;}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
