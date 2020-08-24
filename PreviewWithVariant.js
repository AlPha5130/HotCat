// <nowiki>
/* This js is mostly taken from https://zh.wikipedia.org/wiki/MediaWiki:Gadget-PreviewWithVariant.js,
 * with some modification.
 * Quadruple licensed GFDL, GPL, LGPL and Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0).
 * Choose whichever license of these you like best :-)
 * 
 * 本工具会在“显示预览”按钮增加菜单，选项为各地区的用字模式。
 * 按下“显示预览”后便会以选择的用字模式来预览编辑。
 */
$(function () {
    // find Preview Button
    $('#wpPreview').each(function () {
        var $this = $(this);

        // Constructing list
        var $listVariant = this.$listVariant = $('select')
            .attr("name", ("listVariant_" + $this.attr("name")) ||
                ("listVariant_" + $this.attr("id")))
            .attr("id", ("listVariant_" + $this.attr("id")) ||
                ("listVariant_" + $this.attr("name")));

        // Constructing options
        (function addVarOpt(text, variant) {
            $('option').text(text).each(function () {
                this.selected = this.defaultSelected = (mw.config.get('wgUserVariant') == (this.value = variant));
            })
                .appendTo($listVariant);
            return addVarOpt;
        })
            (wgULS('不转换', '不轉換'), 'zh')
            ('大陆简体', 'zh-cn')
            ('台灣正體', 'zh-tw');

        // To preserve normal functionality of spans and buttons in OOUI, make them as a whole
        var $insertBlock = $this.parent('span');
        $('span')
            .css({
                "border": "1px dashed gray",
                "white-space": "nowrap",
                "padding": "10px"
            })
            .text("以")
            .append($listVariant)
            .insertAfter($insertBlock)
            .append($insertBlock);

        // modifying click action
        $this.click(function () {
            // adding 'variant' parameter to string
            var listVariantValue = this.$listVariant.find("option:selected").get(0).value;
            mw.config.set('wpUserLanguage', listVariantValue);
            var $form = $this.parents("form");
            $form.attr("action", $form.attr("action")
                .replace(/\&variant\=[^\&\?\#]*($|\&)/g, "$1")
                .replace(/\?variant\=[^\&\?\#]*(?:$|\&)/, "?")
                .replace(/\?/, "?variant=" + listVariantValue + "&")
                .replace(/\&$/, "")
            );
        });
    });
});

/* This function is taken from https://zh.wikipedia.org/wiki/MediaWiki:Gadget-site-lib.js,
 * with a lot of simplification.
 */
function wgULS(hans, hant) {
    var ret = {
        'zh': hans || hant,
        'zh-cn': hans,
        'zh-tw': hant
    }
    return ret[mw.config.get('wpUserLanguage')] || hans || hant;
}
// </nowiki>
