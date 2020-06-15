var detail_bar = 0; // value that indicates what detailed bar shows:
// 0: nothing
// 1: clustered_list
// 2: details


var map;
var detailedXML; // contains the XML-Document of the current detailed view
var prioList; // contains the XML-Document that is calculated in xslt_calculate_prio.xsl

var config_hash_table = {}; // configs fetched from db at start up

var xslt_files = {}; // hash table to prevent reloading of xsl-files

var symptomsXML; // XML-file for all available symptoms

var symptomsList = []; // indices of all symptoms in detailed view
var editSymptomsList = []; // indices of all symptoms in the edit symptoms popup.
                           // when popup is submitted, symptoms are loaded to symptomsList.

var confirmConfig = [null, null, null]; // list for generic confirm popup.
                                        // first value is onSubmitCallback, second value is
                                        // onCancelCallback and third value are parameters for
                                        // those callbacks


var apiUrl = "https://api-dev.sac19.jatsqi.com/";