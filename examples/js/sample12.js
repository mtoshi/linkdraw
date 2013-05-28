$(function(){
   $("#sample12").linkDraw({
     "configPath": "configs/sample12_config.json", 
     "positionPath": "positions/sample12_position.json", 
     "positionWriter": "write.cgi",
     "positionSave": false,
     //"zoom": false,
     //"drag": false,
     "width": 800,
     "height": 600,
     "interval":0 
   });
});
