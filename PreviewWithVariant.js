$(function () {
    $('#wpPreview').each(function () {
        var $this = $(this);
        var $listVariant = this.$listVariant = $('select')
            .attr("name", ("listVariant_" + $this.attr("name")) ||
                ("listVariant_" + $this.attr("id")))
            .attr("id", ("listVariant_" + $this.attr("id")) ||
                ("listVariant_" + $this.attr("name")));
        (function addVarOpt(text, variant) {
            $('option').text(text).each(function () {
                this.selected = this.defaultSelected = (mw.config.get('wgUserVariant') == (this.value = variant));
            })
                .appendTo($listVariant);
            return addVarOpt;
        })
            (wgULS('不转换', '不轉換'), 'zh')
            ('大陆简体', 'zh-cn')
            ('台灣正體', 'zh-tw')
        var $insertBlock = $this.parent('span');
        $('span')
            .css({
                "border": "1px dashed gray",
                "whitespace": "nowrap",
                "padding": "10px"
            })
            .text("以")
            .append($listVariant)
            .insertAfter($insertBlock)
            .append($insertBlock);
        $this.click(function () {
            var listVariantValue = this.$listVariant.find("option:selected").get(0).value;
            mw.config.set('wpUserLanguage', listVariantValue);
            var $form = $this.parents("form");
            $form.attr("action", $form.attr("action")
                .replace(/\&variant\=[^\&\?\#]*($|\&)/g, "$1")
                .replace(/\?variant\=[^\&\?\#]*(?:$|\&)/, "?")
                .replace(/\?/, "?variant=" + listVariantValue + "&")
                .replace(/\&/, "")
            );
        });
    });
});

function wgULS(hans, hant) {
    var ret = {
        'zh': hans || hant,
        'zh-cn': hans,
        'zh-tw': hant
    }
    return ret[mw.config.get('wpUserLanguage')] || hans || hant;
}