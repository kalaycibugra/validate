var casper = require("casper").create({
    }),
    utils = require('utils'),
    http = require('http');
var page = require('webpage').create();
var fs = require('fs');
var json = require('id.json');
var json1=require('url.json');
var keywords= ["magazin","haber","kadin","finans","global","fesmekan","havadurumu","seyahat","trend","yemek","otomobil","sinema","spor","yurthaber","yasam","teknoloji","dunya","politika"];
var req_array = [];
var asds = casper.cli.get("url");
var elementCount=0;
casper.userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36");
var x = require('casper').selectXPath;
var urlFlag=false;
var array =[];
var failed =[];
var i = 0;
count1=0;
var pUrl="http://www.mynet.com";
var successCount = 0;
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var timeName = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
var dir=date+' '+timeName;
var dateTime = date+' '+time;
function writeDate(pUrl){
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dir=date+' '+timeName;
  var dateTime = date+' '+time;
  fs.write(dir+".txt","Test time for URL:"+pUrl+" "+dateTime+"\n","a");
}
casper.on('resource.requested', function(requestData, request) {

    req_array.push(requestData);
});
casper.start();

casper.then(function(){
  function operation(pUrl){
  //  casper.start(pUrl);
    console.log(pUrl);
    writeDate(pUrl);
    casper.page.open(pUrl, function (status) {
      casper.wait(1000,function(){
      for(var p=0;p<keywords.length;p++){
        if(pUrl.indexOf(keywords[p])>0){
            y=keywords[p];
          urlFlag=true;
      }
    }
      if(!urlFlag&&pUrl == "http://www.mynet.com"){
        y="global";

      }
      console.log("service: Mynet "+y);
      casper.capture("screenshots/"+count1+".png");
      for(var x=0;x<req_array.length;x++){
        var flag=false;
        if((req_array[x].url).indexOf(json.gap[y])>0||(req_array[x].url).indexOf(json.metrika[y])>0||(req_array[x].url).indexOf(json.gemius[y])>0||(req_array[x].url).indexOf(json.comscore.c2)>0)
          flag=true;
        if(flag){
          array.push(req_array[x].url);

        }
      }
    function OpenPage(){
        casper.wait(200,function() {
            casper.thenOpen(array[i], function(response) {
              console.log("URL: " + array[i]);
              console.log("Status: " + response.status);
                  if (response.status <400) {
                      successCount++;
                      fs.write(dir+".txt",array[i]+": SUCCESS"+"\n","a");
                  }
                  else{
                    fs.write(dir+".txt",array[i]+": FAIL"+"\n","a");
                    failed.push(array[i]);
                  }
                  i++;
                  if((i <= (array.length - 1))){
                      OpenPage();
                  }else{
                    elementCount=i;
                     console.log("Total number of successed urls: "+successCount+"\n");
                     console.log("Total number of failed urls: "+failed.length+"\n");
                     count1++;
                     fs.write(dir+".txt","Total number of successed urls: "+successCount+"\n"+"Total number of failed urls: "+failed.length+"\n","a");

                     if(count1<3){
                       req_array.length=0;
                       successCount=0;
                       if(count1<2)
                        operation(pUrl=json1[asds].main);
                       else
                        operation(pUrl=json1[asds].detail);
                     }
                     }
            });
      });
    }

    OpenPage();
    });
    });
  }
operation(pUrl);
});

casper.then(function(){
  casper.exit();

});
casper.run();
