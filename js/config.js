function configData(){

    /*
    
    view size

    */

    viewSize = { "width" : 1000 , "height" : 600 };

    /*
    
    update time

    */

    updateTime = "2013/02/14 00:00:00";

    /*
    
    line color chart

    syntax: key, { "descr" : "color descr",  "code" : "#123456" }

    */

    lineColorItem = {
      "LV0" : { "descr" : "DOWN",    "code" : "#AAAAAA" },
      "LV1" : { "descr" : "20-0%",   "code" : "#4F94CD" },
      "LV2" : { "descr" : "40-20%",  "code" : "#00688B" },
      "LV3" : { "descr" : "60-40%",  "code" : "#548B54" },
      "LV4" : { "descr" : "80-60%",  "code" : "#FF8C00" },
      "LV5" : { "descr" : "100-80%", "code" : "#A52A2A" }
    };

    /*

    node configuration

    */

    nodeItem = [
        [ "TRANSIT-A",  12,  12,  "#CD5C5C", "" ],
        [ "TRANSIT-B",  12,  12,  "#CD5C5C", "" ],
        [ "TRANSIT-C",  12,  12,  "#CD5C5C", "" ],

        [ "PEER-A",  12,  12,  "#2E8B57", "" ],
        [ "PEER-B",  12,  12,  "#2E8B57", "" ],
        [ "PEER-C",  12,  12,  "#2E8B57", "" ],
        [ "PEER-D",  12,  12,  "#2E8B57", "" ],

        [ "RouterA",  16,  16,  "#00688B", "" ],
        [ "RouterB",  16,  16,  "#00688B", "" ],
        [ "RouterC",  16,  16,  "#00688B", "" ],
        [ "RouterD",  16,  16,  "#00688B", "" ],

        [ "SW-A",      8,   8,  "#4F94CD", "" ],
        [ "SW-B",      8,   8,  "#4F94CD", "" ],

        [ "WEB-A",    12,  12,  "#104E8B", "" ],
        [ "WEB-B",    12,  12,  "#104E8B", "" ],

        [ "MAIL-A",   12,  12,  "#104E8B", "" ],
        [ "MAIL-B",   12,  12,  "#104E8B", "" ],

        [ "DNS-A",    12,  12,  "#104E8B", "" ],
        [ "DNS-B",    12,  12,  "#104E8B", "" ],

        [ "CACHE-A",  12,  12,  "#FF8C00", "" ],
        [ "CACHE-B",  12,  12,  "#FF8C00", "" ],
        [ "CACHE-C",  12,  12,  "#FF8C00", "" ],
        [ "CACHE-D",  12,  12,  "#FF8C00", "" ],
        [ "CACHE-E",  12,  12,  "#FF8C00", "" ],
        [ "CACHE-F",  12,  12,  "#FF8C00", "" ],
    ];

    /*

    line configuration

    syntax: node A, node B, line color(key), line width, line descr, line link

    */

    lineItem = [
        [ "TRANSIT-A", "RouterA", "LV4", 1, "10G", "" ],
        [ "TRANSIT-B", "RouterA", "LV1", 1, "10G", "" ],
        [ "TRANSIT-C", "RouterB", "LV1", 1, "10G", "" ],

        [ "PEER-A", "RouterA", "LV5", 1, "1G", "" ],
        [ "PEER-B", "RouterA", "LV3", 1, "1G", "" ],
        [ "PEER-C", "RouterB", "LV1", 1, "1G", "" ],
        [ "PEER-C", "RouterA", "LV3", 1, "1G", "" ],
        [ "PEER-D", "RouterB", "LV1", 1, "1G", "" ],

        [ "RouterA", "RouterB", "LV3", 2.5, "10G", "" ],
        [ "RouterA", "RouterC", "LV4", 2.5, "10G", "" ],
        [ "RouterB", "RouterD", "LV1", 2.5, "10G", "" ],
        [ "RouterC", "RouterD", "LV1", 2.5, "10G", "" ],

        [ "RouterE", "RouterC", "LV4", 1, "1G", "" ],
        [ "RouterE", "RouterD", "LV1", 1, "1G", "" ],

        [ "RouterF", "RouterC", "LV1", 1, "1G", "" ],
        [ "RouterF", "RouterD", "LV1", 1, "1G", "" ],

        [ "SW-A", "RouterE", "LV4", 1, "1G", "" ],
        [ "SW-A", "RouterF", "LV1", 1, "1G", "" ],
        [ "SW-B", "RouterE", "LV3", 1, "1G", "" ],
        [ "SW-B", "RouterF", "LV1", 1, "1G", "" ],

        [ "WEB-A", "SW-A",  "LV4", 1, "1G", "" ],
        [ "WEB-B", "SW-B",  "LV3", 1, "1G", "" ],

        [ "MAIL-A", "SW-A", "LV1", 1, "1G", "" ],
        [ "MAIL-B", "SW-B", "LV1", 1, "1G", "" ],

        [ "DNS-A", "SW-A",  "LV1", 1, "1G", "" ],
        [ "DNS-B", "SW-B",  "LV1", 1, "1G", "" ],

        [ "RouterX", "RouterC", "LV5", 1.5, "2G", "" ],
        [ "RouterX", "RouterD", "LV1", 1.5, "2G", "" ],

        [ "RouterY", "RouterC", "LV3", 1.5, "2G", "" ],
        [ "RouterY", "RouterD", "LV1", 1.5, "2G", "" ],

        [ "CACHE-A", "RouterX", "LV4", 1, "1G", "" ],
        [ "CACHE-B", "RouterX", "LV4", 1, "1G", "" ],
        [ "CACHE-C", "RouterX", "LV3", 1, "1G", "" ],

        [ "CACHE-D", "RouterY", "LV2", 1, "1G", "" ],
        [ "CACHE-E", "RouterY", "LV3", 1, "1G", "" ],
        [ "CACHE-F", "RouterY", "LV0", 1, "1G [Down]", "" ],

    ];
}
