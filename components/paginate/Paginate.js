import React from "react";
import Pagination from "react-js-pagination";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const Paginate = ({ data, getProduct }) => {
  return (
    <div>
      <Pagination
        activePage={data?.current_page}
        itemsCountPerPage={data?.per_page}
        totalItemsCount={data?.total}
        onChange={(pageNumber) => getProduct(pageNumber)}
        firstPageText="First"
        prevPageText={<ChevronLeftIcon fontSize="small" />}
        nextPageText={<ChevronRightIcon fontSize="small"/>}
        lastPageText="Last"
      />
    </div>
  );
};
export default Paginate;
