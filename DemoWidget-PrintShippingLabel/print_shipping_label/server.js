(function () {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */

    // read the parameters from the URL, using 'false' as the default value if a particular paremeter doesn't exist
    var params = {
        'table': $sp.getParameter('table') || false,
        'sysId': $sp.getParameter('sys_id') || false,
        'query': $sp.getParameter('query') || false
    }

    data.pageHeader = options.page_header;
    options.highlight_vip = (options.highlight_vip == 'true') ? true : false;

    var gr = getGlideRecord(params.table, params.sysId, params.query);
    if (!gr)
        data.recordData = false;
    else
        data.recordData = buildRecordData(gr);

    function buildRecordData(gr) {
        var grData = [];

        if (gr.getRowCount() == 1 && gr.isValidRecord()) {
            grData.push(parseTaskGr(gr));
        }

        if (gr.getRowCount() > 1) {
            while (gr.next()) {
                grData.push(parseTaskGr(gr));
            }
        }

        return grData;
    }

    function parseTaskGr(singleRecord) {
        var parsedData = {
            'number': singleRecord.getValue('number'),
            'shortDesc': singleRecord.getValue('short_description'),
            'reqFor': getUserData(singleRecord.getValue('requested_for'))
        };

        var watchlist = singleRecord.getValue('watch_list');

        if (watchlist && watchlist.length > 0)
            parsedData.watchlist = watchlist.split(',').map(getUserData);

        return parsedData;
    }

    function getUserData(userSysId) {
        var userGr = new GlideRecord('sys_user');
        userGr.get(userSysId);

        if (!userGr.isValidRecord())
            return false;

        return {
            'name': userGr.getValue('name'),
            'email': userGr.getValue('email'),
            'phone': userGr.getValue('phone'),
            'vip': (options.highlight_vip && userGr.getValue('vip') == true) ? true : false
        }
    }

    function getGlideRecord(table, sysId, query) {
        if (!table)
            return false;

        var gr = new GlideRecord(table);
        if (!gr.isValid())
            return false;

        if (sysId) {
            gr.get(sysId);
            if (gr.isValidRecord())
                return gr;
            return false;
        }

        if (query) {
            if (!gr.isEncodedQueryValid(query))
                return false;

            gr.addEncodedQuery(query);
            gr.query();
            if (gr.getRowCount() > 0)
                return gr;
            return false;
        }

        return false;
    }
})();