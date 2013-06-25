$(function(){
   $("#sample1").linkDraw({
     "configPath": "configs/sample1_config.json", 
     "positionPath": "positions/sample1_position.json", 
     "positionWriter": "write.cgi",
     "positionSave": false,
     //"zoom": false,
     //"drag": false,
     "width": 200,
     "height": 200,
     "interval":0
   });
});
