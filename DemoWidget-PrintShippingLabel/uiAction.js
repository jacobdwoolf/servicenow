/**
 * UI Action options:
 *  Show insert: false
 *  Show update: true
 *  Client: true
 *  Form button: true
 *  List choice: true
 *  onClick: openNav()
 */

function openNav() {
    var navUrl = '$sp.do?id=sandbox&table=';

    if (typeof g_list != "undefined") {
        navUrl += g_list.getTableName();
        navUrl += '&query=sys_idIN' + g_list.getChecked();
    }
    else {
        navUrl += g_form.getTableName();
        navUrl += '&sys_id=' + g_form.getUniqueValue();
    }

    window.open(navUrl, '_blank');
}