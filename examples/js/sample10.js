$(function(){
   $("#sample10").linkDraw({
     "configPath": "configs/sample10_config.json", 
     "positionPath": "positions/sample10_position.json", 
     "positionWriter": "write.cgi",
     "positionSave": false,
     //"zoom": false,
     //"drag": false,
     "width": 400,
     "height": 250,
     "interval":0 
   });
});
