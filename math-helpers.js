const median = (values) => {
    if(values.length ===0) return 0;//throw new Error("No inputs");
    
    values.sort(function(a,b){
        return a-b;
    });
    
    var half = Math.floor(values.length / 2);
    
    if (values.length % 2)
        return values[half];
    
    return (values[half - 1] + values[half]) / 2.0;
  }

const average = (values) => {
  if(values.length ===0) return 0;//throw new Error("No inputs");
  var average = values.reduce((a,b)=>{return a+b})/values.length;
  average = Math.round(average * 100)/100;
  return average
}

const contains = (string1, string2) => {
  const str1 = string1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().split(" ");
  const str2 = string2.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().split(" ");

  const found = str1.some(r=> str2.includes(r))

  return found;
}

exports.median = median;
exports.average = average;
exports.contains = contains;