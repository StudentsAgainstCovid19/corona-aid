
var detail_bar = 0; // value that indicates what detailed bar shows:
// 0: nothing
// 1: clustered_list
// 2: details


var map;
var detailedXML;
var prioList;
var piechart_cache = {};

var config_hash_table = {};

var xslt_files = {}; // hash table to prevent reloading of xsl-files