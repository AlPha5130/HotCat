$(function (page) {
    if (mw.config.get('wgPageName') !== 'Minecraft Wiki:Java版版本列表') return;
    $('.list-version-form').show();
    $('.list-version-disabled').hide();
    page.getJSON('https://launchermeta.mojang.com/mc/game/version_manifest.json').done(function (data) {
        $('.list-version-loading').hide();
        $('.list-version-list').append(
            $('div').addClass('list-version-header').append(
                $('div').addClass('list-version-desc').append(
                    $('div').addClass('list-version-id').html('版本'),
                    $('div').addClass('list-version-type').html('类型'),
                    $('div').addClass('list-version-time').html('最后更新时间'),
                    $('div').addClass('list-version-releasetime').html('发布时间'),
                    $('div').addClass('list-version-url').html('URL'),
                    $('div').addClass('list-version-loadinfo').html('信息')
                )
            )
        )
    });
});