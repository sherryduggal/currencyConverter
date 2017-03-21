var express=require('express');
var parallelfx=require('parallelfx');
var bodyParser=require('body-parser');
var countries = require('countries-list');
var port=process.env.PORT||1080;


var app=express();



app.use(bodyParser.urlencoded({
  extended:true
}));



app.use(bodyParser.json());

app.get('/getCountries',function(req,res){
    var obj = [];
    var keys= Object.keys(countries['countries']);
    keys.forEach(function(key){
       
       
         obj.push({
            name:countries['countries'][key]['name']+[" {"]+countries['countries'][key]['currency']['0']+countries['countries'][key]['currency']['1']+countries['countries'][key]['currency']['2']+["}"],
            currency:countries['countries'][key]['currency']['0']+countries['countries'][key]['currency']['1']+countries['countries'][key]['currency']['2']
        })
          
    })
  
    res.send(obj);
});


app.post('/',function(req,res){
    var reqValue = req.body.value;
    var convertFrom = req.body.from;
    var convertTo = req.body.to;
    if(reqValue!=null && convertFrom!=null && convertTo!=null){
   parallelfx.convert({value:parseInt(reqValue), from:convertFrom, to:convertTo}).then(
    function(resp){
        var obj = [];
     
         obj.push({
            result:resp.value,
            rate:resp.rate
        })
    
    res.send(obj);
         res.status('200').send(resp);
    },
    function(err){
      //  console.log(err)
        res.status('500').send(err);
    }
);

    }else{
        res.status('400').send({message:'some perameters are missing'});
    }
  //  console.log(req.body);
 
})


app.listen(port,function(){
  console.log('server is now connected on '+port);
});
