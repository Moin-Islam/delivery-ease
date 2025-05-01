import { types, flow } from 'mobx-state-tree';
import { Permissions } from './permissions';
import { baseUrl } from '../const/api';
// import fetchDetailsOk from '../components/utils/fetch-details-ok';
// import { auth } from '../firebase/firebase';

const StoreVanUser = types.model('StoreVanUser', {
  assign_store_id: types.maybeNull(types.number),
  assign_store_name: types.maybeNull(types.string),
  assign_van_id: types.maybeNull(types.number),
  assign_van_name: types.maybeNull(types.string),
  defautProfile: types.maybeNull(types.string),
  assign_van_number: types.maybeNull(types.string),
});

const UserInfo = types.model('UserInfo', {
  id: types.number,
  name: types.string,
  phone: types.string,
  email: types.maybeNull(types.string),
  status: types.number,
  created_at: types.string,
  updated_at: types.string,
  role: types.string,
  token: types.string,
  warehouse_id: types.maybeNull(types.number),
  store_id: types.maybeNull(types.number),
  store_name: types.maybeNull(types.string),
  permissions: types.array(Permissions),
  store_van_user: types.maybeNull(StoreVanUser)
});

export const User = types
  .model('User', {
    details: types.maybe(UserInfo),
  })
  .actions((self) => ({
          // firebaseCall: flow(function* firebaseFun(headers) {
          //   if (auth.currentUser) {
          //     return console.log(
          //       'user already signed in to firebase. UID: ',
          //       auth.currentUser.uid,
          //     );
          //   }
          //   const { firebase_token } = yield fetchDetailsOk(
          //     `${baseUrl}/get_firebase_token`,
          //     undefined,
          //     'GET',
          //     200,
          //     headers,
          //   );
          //   console.log(firebase_token)
          //   const fireUser = yield auth.signInWithCustomToken(
          //     firebase_token,
          //   );
          //   console.log('signed in to firebase. UID: ', fireUser?.user?.uid);
          //   return 0;
          // }),
    logIn(user) {
      self.details = UserInfo.create({
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email || null,  // Handle nullable fields properly
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at,
        role: user.role,
        token: user.token,
        warehouse_id: user.warehouse_id || null,
        store_id: user.store_id || null,
        store_name: user.store_name || null,
        permissions: user.permissions || [],
        store_van_user: user.store_van_user || null
      });
      const authToken = {
        Authorization: `Bearer ${user.token}`,
      }
      // self.firebaseCall(authToken)
    },
    logOut() {
      // self.details.store_van_user = undefined;
      self.details = undefined;
     
    },
    has_list_permission(subject) {
      const action = `${subject}_list`;
      const dummyPermissions = [
        { name: 'dashboard_list' },     // Dashboard Permission
        { name: 'product_pos_sale_list' },      // Sale Permission
        { name: 'warehouse_list' },   // Warehouse Permission 
        { name: 'store_list' },  // Store Permission
        { name: 'van_list' }, // Van Permission
        { name: 'user_list' },  // User Permission
        { name: 'party_list' }, // Party Permission
        { name: 'pos_sale_customer_list' },   // Customer Permission
        { name: 'product_category_list' },    // Product Category Permission
        { name: 'product_unit_list' },  // Product Unit Permission
        { name: 'product_list' }, // Product Management Permission
        { name: 'product_whole_purchase_list' }, // Purchase Permission
        { name: 'store_van_user_list' }, // Store Van User Permission
        { name: 'stock_transfer_invoice_list' }, // Stock Transfer Invoice Permission
        { name: 'warehouse_stock_list' }, // Stock Transfer Permission
        { name: 'store_stock_list' }, // Store Stock Permission
        { name: 'product_purchase_return_list' }, // Purchase Return Permission
        { name:"sale_return_customer_van_route_list"}, //Customer to Van Route Permission
        { name:'sale_return_van_route_warehouse_list'}, //Van to Warehouse Permission
        { name: 'role_list' }, //Role Permission
        { name: 'purchase_list' }, 
        { name: 'supplier_list' },
        { name: 'customer_list' },
        { name: 'pos_setting_list' },
        { name: 'stock_manage_list' },
        { name: 'purchase_return_list' },
        { name: 'sale_return_list' },
    
      ];

      const foundPermission = dummyPermissions.find(permission => {
        console.log("permisson",permission)
        console.log(action);
        return permission.name === action;
      });
      console.log("foundPermission :", foundPermission);
     

      return !!foundPermission; // Return true if permission exists, otherwise false
    },
    can(act, subject) {
      const action = `${subject}_${act}`;
      //console.log("checked crud gurd-" + action);
      var __FOUND = self.details.permissions.find(function (permission, index) {
        if (permission.name == action) return true;
      });
      if (__FOUND == undefined) {
        return false;
      } else {
        return true;
      }
    },
  
  }))
  .views((self) => ({
    get isLoggedIn() {
      // return !!self.details;
      return true;
    },
    get type() {
      if (!self.details) {
        return undefined;
      }
      return self.details.role;
    },
    get auth_token() {
      if (!self.details) {
        return undefined;
      }
      return self.details.token;
    },
    get name() {
      if (!self.details) {
        return undefined;
      }
      return self.details.name;
    },
    get store() {
      if (!self.details) {
        return undefined;
      }
      const store_details={id:self.details.store_id,name:self.details.store_name}
      return store_details;
    },
  }));
