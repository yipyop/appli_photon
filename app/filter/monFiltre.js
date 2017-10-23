app.filter("monFiltre", function(){
    return function(x){
        x = x.toUpperCase();
        return x;
    }
})