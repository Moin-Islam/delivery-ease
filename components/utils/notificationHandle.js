
import cogoToast from 'cogo-toast';

 const allErrorHandle=(error)=>{
  if(error?.code){
    switch (error.code) {
        case 500:
            cogoToast.error(`${error.message}`,{position: 'top-right', bar:{size: '10px'}}); 
            break;
       case 400:
            cogoToast.error(`${Object.values(error.message)}`,{position: 'top-right', bar:{size: '10px'}}); 
            break;
       case 409:
           cogoToast.error(`${Object.values(error.message)}`,{position: 'top-right', bar:{size: '10px'}}); 
           break

       case 404:
           cogoToast.error(`${error.message}`,{position: 'top-right', bar:{size: '10px'}}); 
           break;
        default:
           cogoToast.error('Something went wrong',{position: 'top-right', bar:{size: '10px'}}); 
            break;
    }

  }else{
    cogoToast.error('Something went wrong',{position: 'top-right', bar:{size: '10px'}}); 
  }


}
export default allErrorHandle;
