$(function(){
   $("#sample3").linkDraw({
     "configPath": "configs/sample3_config.json", 
     "positionPath": "positions/sample3_position.json", 
     "positionWriter": "write.cgi",
     "positionSave": false,
     //"zoom": false,
     //"drag": false,
     "width": 200,
     "height": 200,
     "interval":0 
   });
});
