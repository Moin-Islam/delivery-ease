import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
// import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import FunctionsIcon from '@material-ui/icons/Functions';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import HouseIcon from '@material-ui/icons/House';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import StoreIcon from '@material-ui/icons/Store';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import SettingsIcon from '@material-ui/icons/Settings';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CategoryIcon from '@material-ui/icons/Category';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
// import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
// import MoneyIcon from '@material-ui/icons/Money';



const dashboardRoutes = [
  {
    id: 1,
    collapse: false,
    path: '/dashboard/list',
    childPath: '/list',
    name: 'Dashboard',
    permission: 'dashboard',
    icon: Dashboard,
    childs: [],
  },
  {
    id: 3,
    collapse: false,
    path: '/product_sale/list',
    childPath: '/list',
    name: 'Sale',
    // permission: 'product_pos_sale',
    icon: MonetizationOnIcon,
    childs: [],
  },

  {
    id: 2,
    collapse: false,
    path: '/warehouse/list',
    childPath: '/list',
    name: 'Warehouse',
    permission: 'warehouse',
    icon: HouseIcon,
    childs: [],
  },
  {
    id: 3,
    collapse: false,
    path: '/store/list',
    childPath: '/list',
    name: 'Route',
    permission: 'store',
    icon: TransferWithinAStationIcon,
    childs: [],
  },

  {
    id: 55,
    collapse: false,
    path: '/van/list',
    childPath: '/list',
    name: 'Van',
    permission: 'van',
    icon: AirportShuttleIcon,
    childs: [],
  },
  // {
  //   id: 22,
  //   collapse: false,
  //   path: '/product_search/list',
  //   childPath: '/list',
  //   name: 'Search',
  //   permission: 'product_search_list',
  //   icon: SearchIcon,
  //   childs: [],
  // },
  {
    id: 5,
    collapse: false,
    path: '/user/list',
    childPath: '/list',
    name: 'User',
    permission: 'user',
    icon: Person,
    childs: [],
  },
  {
    id: 14,
    collapse: false,
    path: '/supplier/list',
    childPath: '/list',
    name: 'Supplier',
    permission: 'party',
    icon: PeopleOutlineIcon,
    childs: [],
  },
  {
    id: 18,
    collapse: false,
    path: '/pos_sale_customer/list',
    childPath: '/list',
    name: 'Customer',
    permission: 'pos_sale_customer_list',
    icon: PeopleOutlineIcon,
    childs: [],
  },
  {
    id: 7,
    collapse: true,
    path: '/product',
    childPath: '/list',
    name: 'Product',
    icon: LocalMallIcon,
    childs: [

      {
        id: 1,
        collapse: false,
        path: '/product_category',
        childPath: '/list',
        name: 'Product Category',
        permission: 'product_unit',
        icon: CategoryIcon,
      },
      {
        id: 2,
        collapse: false,
        path: '/product_unit',
        childPath: '/list',
        name: 'Product Unit',
        permission: 'product_unit',
        icon: FunctionsIcon,
      },
      {
        id: 3,
        collapse: false,
        path: '/product_management',
        childPath: '/list',
        name: 'Product Management',
        permission: 'product_management',
        icon: LocalMallIcon,
      },
    ],
  },


    {
    id: 8,
    collapse: false,
    path: '/product_purchase/list',
    // childPath: '/list',
    name: 'Purchase',
    icon: AddShoppingCartIcon,
    childs: [],
  },

  {
    id: 111,
    collapse: false,
    path: '/assign_van/list',
    childPath: '/list',
    name: 'Route Van User',
    permission: 'store',
    icon: AssignmentIndIcon,
    childs: [],
  },

  {
    id: 11,
    collapse: true,
    path: '/stock_management',
    childPath: '/list',
    name: 'Stock Manage',
    icon: HouseIcon,
    childs: [
     
      {
        id: 111,
        collapse: false,
        path: '/stock_transfer_main',
        childPath: '/list',
        name: 'Stock Transfer',
        permission: 'warehouse_stock',
        icon: StoreIcon,
      },
      {
        id: 4,
        collapse: false,
        path: '/warehouse_stock',
        childPath: '/list',
        name: 'Warehouse Stock',
        permission: 'warehouse_stock',
        icon: StoreIcon,
        childs: [],
      },
      {
        id: 4,
        collapse: false,
        path: '/store_stock',
        childPath: '/list',
        name: 'Store Stock',
        permission: 'store_stock',
        icon: StoreIcon,
        childs: [],
      },

    ],
  },

  {
    id: 133,
    collapse: true,
    path: '/purchase',
    name: 'Purchase Return',
    icon: KeyboardReturnIcon,
    childs: [
      {
        id: 1,
        collapse: false,
        path: '/purchase',
        childPath: '/purchase_list',
        permission: 'Role',
        name: 'Purchase List',
        icon: KeyboardReturnIcon,
      },
      {
        id: 2,
        collapse: false,
        path: '/purchase',
        childPath: '/return_list',
        permission: 'Role',
        name: 'Purchase Inv',
        icon: AssignmentIndIcon,
      },

    ],
    
  },


  {
    id: 133,
    collapse: true,
    path: '/sale_return',
    name: 'Sale Return',
    icon: KeyboardReturnIcon,
    childs: [
      {
        id: 1,
        collapse: false,
        path: '/sale_return',
        childPath: '/customer_to_van_route',
        permission: 'Role',
        name: 'Customer To Van',
        icon: KeyboardReturnIcon,
      },
      {
        id: 2,
        collapse: false,
        path: '/sale_return',
        childPath: '/customer_return_list',
        permission: 'Role',
        name: 'Customer Return List',
        icon: AssignmentIndIcon,
      },
      {
        id: 3,
        collapse: false,
        path: '/sale_return',
        childPath: '/van_route_to_warehouse',
        permission: 'Role',
        name: 'Van To Warehouse',
        icon: KeyboardReturnIcon,
      },
      {
        id: 3,
        collapse: false,
        path: '/sale_return',
        childPath: '/van_return_list',
        permission: 'Role',
        name: 'Van Return List',
        icon: AssignmentIndIcon,
      },


    ],
    
  },

  {
    id: 13,
    collapse: true,
    path: '/pos_settings',
    name: 'POS Setting',
    icon: SettingsIcon,
    childs: [
      {
        id: 1,
        collapse: false,
        path: '/role',
        childPath: '/list',
        permission: 'role',
        name: 'Role',
        icon: AssignmentIndIcon,
      },
       {
        id: 2,
        collapse: false,
        path: '/business_setting',
        childPath: '/list',
        name: 'Business Setting',
        permission: 'role',
        icon: AssignmentIndIcon,
      },
  


    ],
    
  },
  {
    id: 1151,
    collapse: false,
    path: '/export/report_export',
    childPath: '/report_export',
    name: 'Export',
    permission: 'store',
    icon: AssignmentIndIcon,
    childs: [],
  },
  

];

export default dashboardRoutes;
