$(function(){
   $("#sample2").linkDraw({
     "configPath": "configs/sample2_config.json", 
     "positionPath": "positions/sample2_position.json", 
     "positionWriter": "write.cgi",
     "positionSave": false,
     //"zoom": false,
     //"drag": false,
     "width": 200,
     "height": 200,
     "interval":0 
   });
});
