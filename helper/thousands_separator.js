const numberWithCommas = (x)=>{
    if(x){
        const y  = x.toFixed(2)
        return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }else{
        return 0
    }
 
}
export default numberWithCommas;