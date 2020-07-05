var detail_bar = 0; // value that indicates what detailed bar shows:
// 0: nothing
// 1: clustered_list
// 2: details
var currentInfectedId;


var map;
var clusteredLayer;
var districtLayer;
var districtsXML;
var detailedXML; // contains the XML-Document of the current detailed view
var prioList; // contains the XML-Document that is calculated in xslt_calculate_prio.xsl

var config_hash_table = {}; // configs fetched from db at start up

var xslt_files = new Map(); // hash table to prevent reloading of xsl-files

var symptomsXML; // XML-file for all available symptoms

var symptomsList = []; // indices of all symptoms in detailed view
var editSymptomsList = []; // indices of all symptoms in the edit symptoms popup.
                           // when popup is submitted, symptoms are loaded to symptomsList.

var confirmConfig = [null, null, null]; // list for generic confirm popup.
                                        // first value is onSubmitCallback, second value is
                                        // onCancelCallback and third value are parameters for
                                        // those callbacks


var realtimeWebSocket;

var apiUrl = "https://dev.api.corona-aid-ka.de/";

var updateXMLStr = "";
var suppressUpdates = false;
var initialSymptoms = null;
var updatePromise = null;
var autoWarningLocking = null;
var autoUnlockTimeout = null;


var foundIndices;
var currentlySearched = false;
var currentFoundIndex;
var currentCallBoxes = [];
var calledLast = false;
var calledNext = false;
var onEnter = false;
