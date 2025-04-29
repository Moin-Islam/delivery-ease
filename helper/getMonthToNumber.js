export const getMonthText = (monthCode, year) => {
    switch (monthCode) {
      case 1:
        return `January ${year}`;
      case 2:
        return `February ${year}`;
      case 3:
        return `March ${year}`;
      case 4:
        return `April ${year}`;
      case 5:
        return `May ${year}`;
      case 6:
        return `June ${year}`;
      case 7:
        return `July ${year}`;
      case 8:
        return `August ${year}`;
      case 9:
          return `September ${year}`;
      case 10:
          return `October ${year}`;
      case 11:
          return `November ${year}`;
      case 12:
          return `December ${year}`;
      default:
        return `Invalid month ${year}`;
    }
  };
 

  export const convertFristCharcapital = (str) => {
    const format = str?.slice(1)
    const first = str[0]?.toUpperCase()+format
   return first
  };

  export const dateFormatIssueDate= (d) =>{
    if(d){
    const arrayD =  d.split('-')
    return `${arrayD[2]}-${arrayD[1]}-${arrayD[0]}`
    }else{
      return null
    }
  }